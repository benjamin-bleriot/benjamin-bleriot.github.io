/**
 * Lecture et analyse de fichiers GPX, sans dépendance : utilisé à la compilation
 * (page /rides/) et dans le navigateur (GPX déposé sur la carte).
 */

export type RideType = 'gravel' | 'route' | 'vtt' | 'velo';

export interface GpxPoint {
  lat: number;
  lon: number;
  ele: number | null;
  /** Horodatage en millisecondes. */
  time: number | null;
}

export interface ParsedGpx {
  name: string | null;
  type: string | null;
  points: GpxPoint[];
}

export interface RideStats {
  /** Mètres. */
  distance: number;
  gain: number;
  loss: number;
  eleMin: number | null;
  eleMax: number | null;
  /** Pente maximale sur 100 m, en %. */
  maxGrade: number | null;
  /** Date de départ (ISO). */
  start: string | null;
  /** Secondes. */
  duration: number | null;
  moving: number | null;
  /** km/h, sur le temps en mouvement. */
  speed: number | null;
}

/** Trace détaillée, en colonnes pour rester compacte en JSON. */
export interface RideTrack {
  lat: number[];
  lon: number[];
  /** Distance cumulée (m). */
  d: number[];
  /** Altitude lissée (m) — vide si le GPX n'en contient pas. */
  ele: number[];
  /** Pente (%) — vide sans altitude. */
  grade: number[];
  /** Secondes depuis le départ — vide sans horodatage. */
  t: number[];
}

export interface RideAnalysis {
  stats: RideStats;
  track: RideTrack;
  /** Trace allégée pour la vue d'ensemble : [lat, lon, lat, lon…]. */
  overview: number[];
  /** Profil échantillonné pour les miniatures. */
  spark: number[];
  /** [[sud, ouest], [nord, est]]. */
  bounds: [[number, number], [number, number]];
}

/* ------------------------------------------------------------------ Lecture */

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decode(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, entity: string) => {
      if (entity[0] === '#') {
        const code = entity[1]?.toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return ENTITIES[entity] ?? match;
    })
    .trim();
}

function tag(xml: string, name: string): string | null {
  const match = xml.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`));
  const value = match?.[1] ? decode(match[1]) : '';
  return value || null;
}

function attr(attrs: string, name: string): number {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`));
  return match?.[1] ? Number(match[1]) : NaN;
}

function readPoints(xml: string, kind: 'trkpt' | 'rtept'): GpxPoint[] {
  const points: GpxPoint[] = [];
  const pattern = new RegExp(`<${kind}\\b([^>]*?)(?:/>|>([\\s\\S]*?)</${kind}>)`, 'g');
  for (const match of xml.matchAll(pattern)) {
    const attrs = match[1] ?? '';
    const body = match[2] ?? '';
    const lat = attr(attrs, 'lat');
    const lon = attr(attrs, 'lon');
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const ele = Number(tag(body, 'ele') ?? NaN);
    const time = Date.parse(tag(body, 'time') ?? '');
    points.push({ lat, lon, ele: Number.isFinite(ele) ? ele : null, time: Number.isFinite(time) ? time : null });
  }
  return points;
}

export function parseGpx(xml: string): ParsedGpx {
  const trkHead = xml.match(/<trk\b[\s\S]*?(?=<trkseg|<\/trk>)/)?.[0] ?? '';
  const metadata = xml.match(/<metadata\b[\s\S]*?<\/metadata>/)?.[0] ?? '';
  let points = readPoints(xml, 'trkpt');
  if (points.length === 0) points = readPoints(xml, 'rtept');
  return {
    name: tag(trkHead, 'name') ?? tag(metadata, 'name') ?? tag(xml.match(/<rte\b[\s\S]*?(?=<rtept)/)?.[0] ?? '', 'name'),
    type: tag(trkHead, 'type'),
    points,
  };
}

/** Types Komoot, Strava, Garmin… → catégorie de la page. */
export function guessType(type: string | null): RideType {
  const value = (type ?? '').toLowerCase();
  if (/gravel|mtb_easy/.test(value)) return 'gravel';
  if (/mtb|mountain|vtt|enduro/.test(value)) return 'vtt';
  if (/race|road|route/.test(value)) return 'route';
  if (/touring|bike|bicycle|cycl|velo|ride|\b1\b/.test(value)) return 'velo';
  return 'gravel';
}

export function slugify(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
      .replace(/-+$/, '') || 'sortie'
  );
}

/* ------------------------------------------------------------------ Analyse */

const R = 6371008.8;
const rad = Math.PI / 180;

export function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Douglas-Peucker itératif, en mètres (projection locale). Renvoie les indices conservés. */
function simplify(x: number[], y: number[], tolerance: number): number[] {
  const n = x.length;
  if (n <= 2) return x.map((_, i) => i);
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack: [number, number][] = [[0, n - 1]];
  const tol2 = tolerance * tolerance;
  while (stack.length) {
    const [first, last] = stack.pop()!;
    const ax = x[first]!, ay = y[first]!;
    const dx = x[last]! - ax, dy = y[last]! - ay;
    const len2 = dx * dx + dy * dy;
    let max = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      let px = x[i]! - ax, py = y[i]! - ay;
      if (len2 > 0) {
        const t = Math.max(0, Math.min(1, (px * dx + py * dy) / len2));
        px -= t * dx;
        py -= t * dy;
      }
      const dist = px * px + py * py;
      if (dist > max) {
        max = dist;
        index = i;
      }
    }
    if (index !== -1 && max > tol2) {
      keep[index] = 1;
      stack.push([first, index], [index, last]);
    }
  }
  const result: number[] = [];
  keep.forEach((k, i) => k && result.push(i));
  return result;
}

const round = (value: number, digits = 0) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

export function analyzeGpx(parsed: ParsedGpx): RideAnalysis | null {
  const pts = parsed.points;
  const n = pts.length;
  if (n < 2) return null;

  // Distance cumulée.
  const d = new Float64Array(n);
  for (let i = 1; i < n; i++) d[i] = d[i - 1]! + haversine(pts[i - 1]!, pts[i]!);
  const distance = d[n - 1]!;

  // Altitude : trous comblés par interpolation, puis lissage sur ±20 m.
  const raw = pts.map((p) => p.ele);
  const hasEle = raw.filter((e) => e !== null).length >= n / 2;
  const ele = new Float64Array(n);
  if (hasEle) {
    let prev = -1;
    for (let i = 0; i < n; i++) {
      const e = raw[i];
      if (e === null || e === undefined) continue;
      if (prev === -1) for (let j = 0; j < i; j++) ele[j] = e;
      else for (let j = prev + 1; j < i; j++) ele[j] = raw[prev]! + ((e - raw[prev]!) * (d[j]! - d[prev]!)) / (d[i]! - d[prev]! || 1);
      ele[i] = e;
      prev = i;
    }
    for (let j = prev + 1; j < n; j++) ele[j] = raw[prev]!;
  }
  const smooth = new Float64Array(n);
  if (hasEle) {
    let lo = 0, hi = 0, sum = 0;
    for (let i = 0; i < n; i++) {
      while (hi < n && d[hi]! <= d[i]! + 20) sum += ele[hi++]!;
      while (d[lo]! < d[i]! - 20) sum -= ele[lo++]!;
      smooth[i] = sum / (hi - lo);
    }
  }

  // Dénivelés, avec un seuil pour ignorer le bruit.
  let gain = 0, loss = 0, eleMin = Infinity, eleMax = -Infinity;
  if (hasEle) {
    let ref = smooth[0]!;
    for (let i = 0; i < n; i++) {
      const e = smooth[i]!;
      eleMin = Math.min(eleMin, e);
      eleMax = Math.max(eleMax, e);
      if (e - ref >= 1) (gain += e - ref), (ref = e);
      else if (ref - e >= 1) (loss += ref - e), (ref = e);
    }
  }

  // Profil rééchantillonné tous les 10 m : pentes et miniature.
  const step = 10;
  const samples = Math.max(2, Math.ceil(distance / step) + 1);
  const profile = new Float64Array(samples);
  if (hasEle) {
    let j = 0;
    for (let k = 0; k < samples; k++) {
      const x = Math.min(distance, k * step);
      while (j < n - 2 && d[j + 1]! < x) j++;
      const span = d[j + 1]! - d[j]!;
      const t = span > 0 ? (x - d[j]!) / span : 0;
      profile[k] = smooth[j]! + (smooth[j + 1]! - smooth[j]!) * Math.max(0, Math.min(1, t));
    }
  }
  const gradeAt = (x: number) => {
    const a = Math.max(0, Math.round((x - 50) / step));
    const b = Math.min(samples - 1, Math.round((x + 50) / step));
    return b > a ? ((profile[b]! - profile[a]!) / ((b - a) * step)) * 100 : 0;
  };
  let maxGrade = -Infinity;
  if (hasEle && distance >= 100) for (let x = 50; x <= distance - 50; x += step) maxGrade = Math.max(maxGrade, gradeAt(x));

  // Temps.
  const times = pts.map((p) => p.time);
  const hasTime = times.filter((t) => t !== null).length >= n / 2;
  let start: string | null = null, duration: number | null = null, moving: number | null = null;
  if (hasTime) {
    const valid = times.filter((t): t is number => t !== null);
    start = new Date(valid[0]!).toISOString();
    duration = Math.round((valid[valid.length - 1]! - valid[0]!) / 1000);
    let m = 0;
    for (let i = 1; i < n; i++) {
      const a = times[i - 1], b = times[i];
      if (a == null || b == null) continue;
      const dt = (b - a) / 1000;
      if (dt > 0 && dt <= 120 && (d[i]! - d[i - 1]!) / dt >= 1) m += dt;
    }
    moving = Math.round(m) || null;
  }

  // Projection locale pour simplifier en mètres.
  const lat0 = pts.reduce((s, p) => s + p.lat, 0) / n;
  const kx = Math.cos(lat0 * rad) * R * rad;
  const ky = R * rad;
  const x = pts.map((p) => p.lon * kx);
  const y = pts.map((p) => p.lat * ky);

  const t0 = times.find((t) => t !== null) ?? 0;
  const detail = simplify(x, y, 4);
  const track: RideTrack = {
    lat: detail.map((i) => round(pts[i]!.lat, 5)),
    lon: detail.map((i) => round(pts[i]!.lon, 5)),
    d: detail.map((i) => Math.round(d[i]!)),
    ele: hasEle ? detail.map((i) => round(smooth[i]!, 1)) : [],
    grade: hasEle ? detail.map((i) => round(gradeAt(d[i]!), 1)) : [],
    t: hasTime ? detail.map((i) => (times[i] == null ? -1 : Math.round((times[i]! - t0) / 1000))) : [],
  };

  const overview = simplify(x, y, 30).flatMap((i) => [round(pts[i]!.lat, 5), round(pts[i]!.lon, 5)]);
  const spark = hasEle ? Array.from({ length: 48 }, (_, k) => round(profile[Math.round((k / 47) * (samples - 1))]!)) : [];

  let south = Infinity, west = Infinity, north = -Infinity, east = -Infinity;
  for (const p of pts) {
    south = Math.min(south, p.lat);
    north = Math.max(north, p.lat);
    west = Math.min(west, p.lon);
    east = Math.max(east, p.lon);
  }

  return {
    stats: {
      distance: Math.round(distance),
      gain: Math.round(gain),
      loss: Math.round(loss),
      eleMin: hasEle ? Math.round(eleMin) : null,
      eleMax: hasEle ? Math.round(eleMax) : null,
      maxGrade: Number.isFinite(maxGrade) ? round(maxGrade, 1) : null,
      start,
      duration,
      moving,
      speed: moving ? round((distance / moving) * 3.6, 1) : null,
    },
    track,
    overview,
    spark,
    bounds: [
      [round(south, 5), round(west, 5)],
      [round(north, 5), round(east, 5)],
    ],
  };
}
