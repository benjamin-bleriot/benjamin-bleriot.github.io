/**
 * Page /rides/ : carte, liste, détail, profil altimétrique et GPX déposés.
 */
import L from 'leaflet';
import { analyzeGpx, guessType, parseGpx, slugify, type RideTrack, type RideType } from '../lib/gpx';
import type { RideSummary } from '../lib/rides';

interface Ride extends RideSummary {
  track?: RideTrack;
  /** GPX déposé dans le navigateur, non enregistré sur le site. */
  local?: boolean;
}

interface Edit {
  rating?: number | null;
  note?: string;
}

/* ------------------------------------------------------------------ Outils */

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const TYPES: Record<RideType, { label: string; color: string }> = {
  gravel: { label: 'Gravel', color: '#f2a65a' },
  route: { label: 'Route', color: '#5ea8ff' },
  vtt: { label: 'VTT', color: '#34c77b' },
  velo: { label: 'Vélo', color: '#b48cff' },
};

const GRADES = [
  { max: -3, color: '#5ea8ff', label: '< −3 %' },
  { max: 3, color: '#34c77b', label: '±3' },
  { max: 6, color: '#d9d64a', label: '3–6' },
  { max: 9, color: '#ff9f43', label: '6–9' },
  { max: 12, color: '#ff5a4f', label: '9–12' },
  { max: Infinity, color: '#d64ad6', label: '> 12 %' },
];
const gradeBucket = (g: number) => GRADES.findIndex((b) => g < b.max);

const nf = (digits = 0) => new Intl.NumberFormat('fr-FR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const km = (m: number) => nf(m < 100_000 ? 1 : 0).format(m / 1000);
const int = (n: number) => nf().format(Math.round(n));
const hours = (s: number) => {
  const minutes = Math.round(s / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h} h ${String(m).padStart(2, '0')}` : `${m} min`;
};
const shortDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const longDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';
const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const STAR = 'M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z';

const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* stockage indisponible : les modifications restent en mémoire */
    }
  },
};

const isMobile = () => matchMedia('(max-width: 760px)').matches;

/* ------------------------------------------------------------------ Données */

const rides: Ride[] = JSON.parse($('rides-data').textContent || '[]');
const base = new Map(rides.map((r) => [r.slug, { rating: r.rating, note: r.note }]));

// Notes modifiées sur cet appareil, en attente d'export vers src/data/rides.json.
const edits: Record<string, Edit> = store.get('rides:edits', {});
for (const ride of rides) {
  const edit = edits[ride.slug];
  if (!edit) continue;
  if (edit.rating !== undefined) ride.rating = edit.rating;
  if (edit.note !== undefined) ride.note = edit.note;
}

const state = {
  type: 'all' as RideType | 'all',
  sort: 'date',
  query: '',
  selected: null as Ride | null,
};

/* ------------------------------------------------------------------ Carte */

const BASES = {
  dark: {
    label: 'Sombre',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      className: 'tiles-dark',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  cyclosm: {
    label: 'Vélo',
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    options: {
      subdomains: 'abc',
      maxZoom: 20,
      attribution: '<a href="https://www.cyclosm.org">CyclOSM</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  topo: {
    label: 'Topo',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    options: {
      subdomains: 'abc',
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://opentopomap.org">OpenTopoMap</a>',
    },
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 19, attribution: 'Imagerie &copy; Esri' },
  },
} satisfies Record<string, { label: string; url: string; options: L.TileLayerOptions }>;
type BaseKey = keyof typeof BASES;

const map = L.map('map', { zoomControl: false, attributionControl: true }).setView([46.6, 2.4], 6);
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.scale({ position: 'bottomright', imperial: false }).addTo(map);
map.attributionControl.setPrefix(false);

let baseLayer: L.TileLayer | undefined;
function setBase(key: BaseKey) {
  baseLayer?.remove();
  baseLayer = L.tileLayer(BASES[key].url, BASES[key].options).addTo(map);
  store.set('rides:base', key);
  for (const button of $('layers').querySelectorAll('button')) button.setAttribute('aria-checked', String(button.dataset.key === key));
}
$('layers').innerHTML = (Object.keys(BASES) as BaseKey[])
  .map((key) => `<button role="radio" data-key="${key}" aria-checked="false">${BASES[key].label}</button>`)
  .join('');
$('layers').addEventListener('click', (event) => {
  const key = (event.target as HTMLElement).closest('button')?.dataset.key as BaseKey | undefined;
  if (key) setBase(key);
});
const savedBase = store.get<string>('rides:base', 'dark');
setBase(savedBase in BASES ? (savedBase as BaseKey) : 'dark');

function fitPadding(): L.FitBoundsOptions {
  if (isMobile()) return { padding: [24, 24] };
  const profileOpen = !$('profile').hidden;
  return { paddingTopLeft: [420, 70], paddingBottomRight: [70, profileOpen ? 240 : 40] };
}

/* ------------------------------------------------------- Vue d'ensemble */

const overview = new Map<string, L.Polyline>();
const overviewGroup = L.featureGroup().addTo(map);

function addOverview(ride: Ride) {
  const coords: L.LatLngTuple[] = [];
  for (let i = 0; i < ride.overview.length; i += 2) coords.push([ride.overview[i]!, ride.overview[i + 1]!]);
  const line = L.polyline(coords, { color: TYPES[ride.type].color, weight: 3, opacity: 0.9, lineJoin: 'round' });
  line.bindTooltip(escape(ride.name), { sticky: true, className: 'ride-tip', direction: 'top', offset: [0, -8] });
  line.on('mouseover', () => highlight(ride.slug, true));
  line.on('mouseout', () => highlight(ride.slug, false));
  line.on('click', () => select(ride));
  overview.set(ride.slug, line);
  overviewGroup.addLayer(line);
}

function styleOverview() {
  for (const ride of rides) {
    const line = overview.get(ride.slug);
    if (!line) continue;
    const visible = state.selected ? ride !== state.selected : matches(ride);
    if (visible && !overviewGroup.hasLayer(line)) overviewGroup.addLayer(line);
    if (!visible && overviewGroup.hasLayer(line)) overviewGroup.removeLayer(line);
    line.setStyle({ opacity: state.selected ? 0.3 : 0.9, weight: 3 });
  }
}

function highlight(slug: string, on: boolean) {
  const line = overview.get(slug);
  if (line && !state.selected) {
    line.setStyle({ weight: on ? 6 : 3 });
    if (on) line.bringToFront();
  }
  document.querySelector(`.ride[data-slug="${CSS.escape(slug)}"]`)?.classList.toggle('hover', on);
}

function fitAll() {
  const bounds = L.latLngBounds([]);
  for (const ride of rides.filter(matches)) bounds.extend(ride.bounds);
  if (bounds.isValid()) map.fitBounds(bounds, { ...fitPadding(), maxZoom: 14 });
}

/* ------------------------------------------------------------------ Liste */

function matches(ride: Ride) {
  if (state.type !== 'all' && ride.type !== state.type) return false;
  return !state.query || ride.name.toLowerCase().includes(state.query.toLowerCase());
}

function sorted(list: Ride[]) {
  const by: Record<string, (a: Ride, b: Ride) => number> = {
    date: (a, b) => (b.stats.start ?? '').localeCompare(a.stats.start ?? ''),
    rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
    distance: (a, b) => b.stats.distance - a.stats.distance,
    gain: (a, b) => b.stats.gain - a.stats.gain,
  };
  return [...list].sort((a, b) => Number(!!b.local) - Number(!!a.local) || by[state.sort]!(a, b));
}

function sparkline(values: number[], color: string) {
  if (values.length < 2) return '';
  const min = Math.min(...values);
  const span = Math.max(30, Math.max(...values) - min);
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * 100).toFixed(1)},${(26 - ((v - min) / span) * 24).toFixed(1)}`);
  return `<svg class="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0,28 L${pts.join(' L')} L100,28 Z" style="fill:${color};fill-opacity:.18;stroke:none"/>
    <path d="M${pts.join(' L')}" style="stroke:${color};stroke-width:1.5;fill:none" vector-effect="non-scaling-stroke"/>
  </svg>`;
}

const miniStars = (rating: number | null) =>
  rating ? `<span class="mini-stars" aria-label="${rating} sur 5">${'★'.repeat(rating)}</span>` : '';

function renderFilters() {
  const present = (Object.keys(TYPES) as RideType[]).filter((type) => rides.some((r) => r.type === type));
  const chip = (value: string, label: string, color?: string) =>
    `<button data-type="${value}" aria-pressed="${state.type === value}">${color ? `<span class="dot" style="--c:${color}"></span>` : ''}${label}</button>`;
  $('type-filters').innerHTML =
    present.length > 1 ? chip('all', 'Toutes') + present.map((t) => chip(t, TYPES[t].label, TYPES[t].color)).join('') : '';
}

function renderList() {
  const list = sorted(rides.filter(matches));
  $('list').innerHTML = list
    .map((ride) => {
      const color = TYPES[ride.type].color;
      return `<li><button class="ride" data-slug="${escape(ride.slug)}" style="--c:${color}">
        <span class="bar"></span>
        <span>
          <span class="top"><strong>${escape(ride.name)}</strong><span class="date">${ride.local ? 'Aperçu' : shortDate(ride.stats.start)}</span></span>
          <span class="figures">
            <span>${km(ride.stats.distance)} km</span>
            ${ride.stats.gain ? `<span>↗ ${int(ride.stats.gain)} m</span>` : ''}
            ${ride.stats.moving ? `<span>${hours(ride.stats.moving)}</span>` : ''}
            ${miniStars(ride.rating)}
          </span>
          ${sparkline(ride.spark, color)}
        </span>
      </button></li>`;
    })
    .join('');
  $('empty').hidden = rides.length > 0;

  const total = list.reduce(
    (sum, r) => ({ d: sum.d + r.stats.distance, g: sum.g + r.stats.gain, t: sum.t + (r.stats.moving ?? 0) }),
    { d: 0, g: 0, t: 0 },
  );
  $('totals').innerHTML = [
    [int(list.length), '', list.length > 1 ? 'sorties' : 'sortie'],
    [int(total.d / 1000), 'km', 'distance'],
    [total.g >= 10_000 ? nf(1).format(total.g / 1000) : int(total.g), total.g >= 10_000 ? 'km' : 'm', 'dénivelé'],
    [int(total.t / 3600), 'h', 'en selle'],
  ]
    .map(([value, unit, label]) => `<div><dd>${value}${unit ? `<small>${unit}</small>` : ''}</dd><dt>${label}</dt></div>`)
    .join('');
  $('totals').hidden = rides.length === 0;
  styleOverview();
}

$('type-filters').addEventListener('click', (event) => {
  const type = (event.target as HTMLElement).closest('button')?.dataset.type;
  if (!type) return;
  state.type = type as RideType | 'all';
  renderFilters();
  renderList();
  fitAll();
});
$('search').addEventListener('input', (event) => {
  state.query = (event.target as HTMLInputElement).value.trim();
  renderList();
});
$('sort').addEventListener('change', (event) => {
  state.sort = (event.target as HTMLSelectElement).value;
  renderList();
});
$('list').addEventListener('click', (event) => {
  const slug = (event.target as HTMLElement).closest<HTMLElement>('.ride')?.dataset.slug;
  const ride = rides.find((r) => r.slug === slug);
  if (ride) select(ride);
});
$('list').addEventListener('mouseover', (event) => {
  const slug = (event.target as HTMLElement).closest<HTMLElement>('.ride')?.dataset.slug;
  if (slug) highlight(slug, true);
});
$('list').addEventListener('mouseout', (event) => {
  const slug = (event.target as HTMLElement).closest<HTMLElement>('.ride')?.dataset.slug;
  if (slug) highlight(slug, false);
});

/* ------------------------------------------------------------ Notes et export */

function saveEdit(ride: Ride, edit: Edit) {
  Object.assign(ride, edit);
  const original = base.get(ride.slug);
  const current = { rating: ride.rating, note: ride.note };
  if (original && original.rating === current.rating && original.note === current.note) delete edits[ride.slug];
  else edits[ride.slug] = current;
  store.set('rides:edits', edits);
  renderExportBar();
}

function renderExportBar() {
  const count = Object.keys(edits).filter((slug) => base.has(slug)).length;
  $('export-bar').hidden = count === 0;
  $('export-count').textContent = `${count} modification${count > 1 ? 's' : ''} sur cet appareil`;
}

$('export').addEventListener('click', () => {
  const output: Record<string, Record<string, unknown>> = {};
  for (const ride of [...rides].filter((r) => !r.local).sort((a, b) => a.slug.localeCompare(b.slug))) {
    output[ride.slug] = {
      name: ride.name,
      type: ride.type,
      ...(ride.rating ? { rating: ride.rating } : {}),
      ...(ride.note ? { note: ride.note } : {}),
    };
  }
  const blob = new Blob([JSON.stringify(output, null, 2) + '\n'], { type: 'application/json' });
  const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'rides.json' });
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
});

/* ------------------------------------------------------------------ Détail */

const detailLayer = L.layerGroup().addTo(map);
const cursor = L.circleMarker([0, 0], { radius: 7, color: '#050507', weight: 3, fillColor: '#fff', fillOpacity: 1, interactive: false });
cursor.bindTooltip('', { permanent: true, direction: 'top', offset: [0, -10], className: 'ride-tip' });

async function loadTrack(ride: Ride): Promise<RideTrack> {
  if (!ride.track) ride.track = (await fetch(`/rides/${encodeURIComponent(ride.slug)}.json`).then((r) => r.json())) as RideTrack;
  return ride.track;
}

let selectToken = 0;

async function select(ride: Ride | null, { fit = true, updateHash = true } = {}) {
  const token = ++selectToken;
  state.selected = ride;
  if (updateHash) history.replaceState(null, '', ride && !ride.local ? `#${ride.slug}` : location.pathname);
  detailLayer.clearLayers();
  cursor.remove();
  $('list-view').hidden = !!ride;
  $('detail-view').hidden = !ride;
  styleOverview();

  if (!ride) {
    $('profile').hidden = true;
    renderList();
    if (fit) fitAll();
    return;
  }

  renderDetail(ride);
  const track = await loadTrack(ride);
  if (token !== selectToken) return;
  drawTrack(ride, track);
  $('profile').hidden = track.ele.length === 0;
  renderProfile(track);
  if (fit) map.fitBounds(ride.bounds, fitPadding());
  $('detail-view').scrollTop = 0;
  if (isMobile()) $('map').scrollIntoView({ behavior: 'smooth' });
}

function drawTrack(ride: Ride, track: RideTrack) {
  const coords = track.lat.map((lat, i) => L.latLng(lat, track.lon[i]!));
  L.polyline(coords, { color: '#050507', weight: 8, opacity: 0.55, interactive: false }).addTo(detailLayer);

  if (track.grade.length) {
    // Une polyligne par portion de même pente, pour limiter le nombre de calques.
    let start = 0;
    for (let i = 1; i <= coords.length; i++) {
      const bucket = gradeBucket(track.grade[start]!);
      if (i < coords.length && gradeBucket(track.grade[i]!) === bucket) continue;
      L.polyline(coords.slice(start, i + 1), { color: GRADES[bucket]!.color, weight: 4.5, opacity: 1, interactive: false, lineCap: 'round' }).addTo(detailLayer);
      start = i;
    }
  } else {
    L.polyline(coords, { color: TYPES[ride.type].color, weight: 4.5, interactive: false }).addTo(detailLayer);
  }

  const hit = L.polyline(coords, { weight: 26, opacity: 0, color: '#000' }).addTo(detailLayer);
  hit.on('mousemove', (event: L.LeafletMouseEvent) => scheduleCursor(nearest(track, event.latlng)));
  hit.on('mouseout', clearCursor);

  const pin = (kind: string) => L.divIcon({ className: '', html: `<span class="pin ${kind}"></span>`, iconSize: [22, 22], iconAnchor: [11, 11] });
  L.marker(coords[coords.length - 1]!, { icon: pin('end'), interactive: false }).addTo(detailLayer);
  L.marker(coords[0]!, { icon: pin('start'), interactive: false }).addTo(detailLayer);
}

function nearest(track: RideTrack, latlng: L.LatLng) {
  const k = Math.cos((latlng.lat * Math.PI) / 180);
  let best = 0;
  let min = Infinity;
  for (let i = 0; i < track.lat.length; i++) {
    const dy = track.lat[i]! - latlng.lat;
    const dx = (track.lon[i]! - latlng.lng) * k;
    const dist = dx * dx + dy * dy;
    if (dist < min) (min = dist), (best = i);
  }
  return best;
}

function renderDetail(ride: Ride) {
  const type = TYPES[ride.type];
  const s = ride.stats;
  $('d-meta').innerHTML = `<span class="badge" style="--c:${type.color}">${type.label}</span>${ride.local ? 'Aperçu local' : longDate(s.start)}`;
  $('d-name').textContent = ride.name;

  $('d-rating').innerHTML = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<button role="radio" aria-checked="${ride.rating === n}" aria-label="${n} étoile${n > 1 ? 's' : ''}" data-n="${n}" class="${(ride.rating ?? 0) >= n ? 'on' : ''}" ${ride.local ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>
        </button>`,
    )
    .join('');

  const stat = (label: string, value: string | null, unit = '') =>
    `<div><dd>${value ?? '—'}${value && unit ? `<small>${unit}</small>` : ''}</dd><dt>${label}</dt></div>`;
  $('d-stats').innerHTML = [
    stat('Distance', km(s.distance), 'km'),
    stat('Dénivelé +', s.eleMax !== null ? int(s.gain) : null, 'm'),
    stat('Dénivelé −', s.eleMax !== null ? int(s.loss) : null, 'm'),
    stat('En mouvement', s.moving ? hours(s.moving) : null),
    stat('Moyenne', s.speed ? nf(1).format(s.speed) : null, 'km/h'),
    stat('Pente max', s.maxGrade !== null ? nf(1).format(s.maxGrade) : null, '%'),
    stat('Alt. min', s.eleMin !== null ? int(s.eleMin) : null, 'm'),
    stat('Alt. max', s.eleMax !== null ? int(s.eleMax) : null, 'm'),
    stat('Durée totale', s.duration ? hours(s.duration) : null),
  ].join('');

  const note = $<HTMLTextAreaElement>('d-note');
  note.value = ride.note;
  note.disabled = !!ride.local;
  $('d-local').hidden = !ride.local;

  const download = $<HTMLAnchorElement>('d-download');
  download.href = ride.gpx;
  download.download = `${ride.slug}.gpx`;
}

$('d-rating').addEventListener('click', (event) => {
  const n = Number((event.target as HTMLElement).closest<HTMLElement>('button')?.dataset.n);
  const ride = state.selected;
  if (!n || !ride) return;
  saveEdit(ride, { rating: ride.rating === n ? null : n });
  renderDetail(ride);
});
let noteTimer: ReturnType<typeof setTimeout> | undefined;
$('d-note').addEventListener('input', (event) => {
  const ride = state.selected;
  const value = (event.target as HTMLTextAreaElement).value;
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => ride && saveEdit(ride, { note: value }), 300);
});
$('back').addEventListener('click', () => select(null));
$('d-fit').addEventListener('click', () => state.selected && map.fitBounds(state.selected.bounds, fitPadding()));

/* ------------------------------------------------------- Profil altimétrique */

const PAD = { left: 38, right: 8, top: 8, bottom: 20 };
let chart: { track: RideTrack; width: number; height: number; x: (d: number) => number; y: (e: number) => number } | null = null;

$('legend').innerHTML = GRADES.map((g) => `<li><span class="dot" style="--c:${g.color}"></span>${g.label}</li>`).join('');

function niceStep(range: number, target: number) {
  const raw = range / target;
  const pow = 10 ** Math.floor(Math.log10(raw));
  return ([1, 2, 5, 10].find((m) => m * pow >= raw) ?? 10) * pow;
}

function renderProfile(track: RideTrack) {
  const el = $('chart');
  if (!track.ele.length || $('profile').hidden) return;
  const width = el.clientWidth;
  const height = el.clientHeight;
  const total = track.d[track.d.length - 1]!;
  let min = Math.min(...track.ele);
  let max = Math.max(...track.ele);
  const yStep = niceStep(Math.max(max - min, 40), 3);
  min = Math.floor(min / yStep) * yStep;
  max = Math.max(min + yStep, Math.ceil(max / yStep) * yStep);

  const x = (d: number) => PAD.left + (d / total) * (width - PAD.left - PAD.right);
  const y = (e: number) => PAD.top + (1 - (e - min) / (max - min)) * (height - PAD.top - PAD.bottom);
  chart = { track, width, height, x, y };

  const line = track.d.map((d, i) => `${x(d).toFixed(1)},${y(track.ele[i]!).toFixed(1)}`).join(' L');
  const bottom = height - PAD.bottom;

  // Dégradé horizontal : une couleur franche par portion de pente.
  const stops: string[] = [];
  let previous = -1;
  track.grade.forEach((g, i) => {
    const bucket = gradeBucket(g);
    if (bucket === previous) return;
    const offset = ((track.d[i]! / total) * 100).toFixed(3);
    if (previous !== -1) stops.push(`<stop offset="${offset}%" stop-color="${GRADES[previous]!.color}"/>`);
    stops.push(`<stop offset="${offset}%" stop-color="${GRADES[bucket]!.color}"/>`);
    previous = bucket;
  });

  const grid: string[] = [];
  for (let e = min; e <= max + 0.1; e += yStep) {
    grid.push(`<line x1="${PAD.left}" x2="${width - PAD.right}" y1="${y(e)}" y2="${y(e)}" stroke="rgb(255 255 255 / .07)"/>`);
    grid.push(`<text x="${PAD.left - 6}" y="${y(e) + 3.5}" text-anchor="end">${int(e)}</text>`);
  }
  const xStep = niceStep(total / 1000, Math.max(3, Math.floor(width / 90))) * 1000;
  for (let d = 0; d <= total; d += xStep) {
    grid.push(`<text x="${x(d)}" y="${height - 4}" text-anchor="${d === 0 ? 'start' : 'middle'}">${int(d / 1000)}${d === 0 ? ' km' : ''}</text>`);
  }

  el.innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true">
    <defs>
      <linearGradient id="grade" gradientUnits="userSpaceOnUse" x1="${x(0)}" x2="${x(total)}" y1="0" y2="0">${stops.join('')}</linearGradient>
      <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>
      <mask id="fade-mask"><rect x="0" y="0" width="${width}" height="${height}" fill="url(#fade)"/></mask>
    </defs>
    ${grid.join('')}
    <path d="M${x(0)},${bottom} L${line} L${x(total)},${bottom} Z" fill="url(#grade)" mask="url(#fade-mask)"/>
    <path d="M${line}" style="stroke:url(#grade);stroke-width:2;fill:none"/>
    <g id="chart-cursor" visibility="hidden">
      <line y1="${PAD.top}" y2="${bottom}" stroke="rgb(255 255 255 / .6)" stroke-dasharray="3 3"/>
      <circle r="5" fill="#fff" stroke="#050507" stroke-width="2.5"/>
    </g>
  </svg>`;
  setReadout(null);
}

new ResizeObserver(() => chart && renderProfile(chart.track)).observe($('chart'));

function indexAtDistance(track: RideTrack, d: number) {
  let lo = 0;
  let hi = track.d.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (track.d[mid]! < d) lo = mid;
    else hi = mid;
  }
  return d - track.d[lo]! < track.d[hi]! - d ? lo : hi;
}

function chartPointer(event: PointerEvent) {
  if (!chart) return;
  const rect = $('chart').getBoundingClientRect();
  const px = event.clientX - rect.left;
  const total = chart.track.d[chart.track.d.length - 1]!;
  const d = ((px - PAD.left) / (chart.width - PAD.left - PAD.right)) * total;
  scheduleCursor(indexAtDistance(chart.track, Math.max(0, Math.min(total, d))), true);
}
$('chart').addEventListener('pointermove', chartPointer);
$('chart').addEventListener('pointerdown', chartPointer);
$('chart').addEventListener('pointerleave', clearCursor);

let frame = 0;
function scheduleCursor(index: number, fromChart = false) {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => showCursor(index, fromChart));
}

function showCursor(i: number, fromChart: boolean) {
  const track = state.selected?.track;
  if (!track) return;
  const latlng = L.latLng(track.lat[i]!, track.lon[i]!);
  cursor.setLatLng(latlng).addTo(map);
  const grade = track.grade[i];
  cursor.setTooltipContent(
    `${km(track.d[i]!)} km${track.ele.length ? ` · ${int(track.ele[i]!)} m` : ''}${grade !== undefined ? ` · ${grade > 0 ? '+' : ''}${nf(1).format(grade)} %` : ''}`,
  );
  if (fromChart && !map.getBounds().pad(-0.1).contains(latlng)) map.panTo(latlng, { animate: true });

  if (chart && chart.track === track && track.ele.length) {
    const g = document.getElementById('chart-cursor');
    g?.setAttribute('visibility', 'visible');
    g?.querySelector('line')?.setAttribute('transform', `translate(${chart.x(track.d[i]!)},0)`);
    g?.querySelector('circle')?.setAttribute('cx', String(chart.x(track.d[i]!)));
    g?.querySelector('circle')?.setAttribute('cy', String(chart.y(track.ele[i]!)));
  }
  setReadout(i);
}

function clearCursor() {
  cancelAnimationFrame(frame);
  cursor.remove();
  document.getElementById('chart-cursor')?.setAttribute('visibility', 'hidden');
  setReadout(null);
}

function setReadout(i: number | null) {
  const track = state.selected?.track;
  if (!track) return;
  if (i === null) {
    $('readout').innerHTML = 'Survolez la trace ou le profil';
    return;
  }
  const parts = [`<b>${km(track.d[i]!)} km</b>`, `${int(track.ele[i]!)} m`];
  const grade = track.grade[i]!;
  parts.push(`<span style="color:${GRADES[gradeBucket(grade)]!.color}">${grade >= 0 ? '↗' : '↘'} ${nf(1).format(Math.abs(grade))} %</span>`);
  // Dénivelé positif cumulé jusqu'à ce point.
  let gain = 0;
  for (let k = 1; k <= i; k++) gain += Math.max(0, track.ele[k]! - track.ele[k - 1]!);
  parts.push(`D+ ${int(gain)} m`);
  const t = track.t[i];
  if (t !== undefined && t >= 0) parts.push(hours(t));
  $('readout').innerHTML = parts.join(' · ');
}

/* ------------------------------------------------------- GPX déposé ou ouvert */

async function openFiles(files: FileList | File[]) {
  let last: Ride | null = null;
  for (const file of Array.from(files)) {
    if (!/\.gpx$/i.test(file.name)) continue;
    const parsed = parseGpx(await file.text());
    const analysis = analyzeGpx(parsed);
    if (!analysis) {
      alert(`${file.name} : aucune trace lisible.`);
      continue;
    }
    const name = parsed.name ?? file.name.replace(/\.gpx$/i, '');
    const ride: Ride = {
      slug: `local-${slugify(name)}-${rides.length}`,
      name,
      type: guessType(parsed.type),
      rating: null,
      note: '',
      gpx: URL.createObjectURL(file),
      stats: analysis.stats,
      overview: analysis.overview,
      spark: analysis.spark,
      bounds: analysis.bounds,
      track: analysis.track,
      local: true,
    };
    rides.push(ride);
    addOverview(ride);
    last = ride;
  }
  if (!last) return;
  renderFilters();
  renderList();
  select(last);
}

$<HTMLInputElement>('file-input').addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) openFiles(input.files);
  input.value = '';
});

let dragDepth = 0;
const hasFiles = (event: DragEvent) => event.dataTransfer?.types.includes('Files');
addEventListener('dragenter', (event) => {
  if (!hasFiles(event)) return;
  event.preventDefault();
  dragDepth++;
  $('drop').hidden = false;
});
addEventListener('dragleave', () => {
  if (--dragDepth <= 0) (dragDepth = 0), ($('drop').hidden = true);
});
addEventListener('dragover', (event) => hasFiles(event) && event.preventDefault());
addEventListener('drop', (event) => {
  event.preventDefault();
  dragDepth = 0;
  $('drop').hidden = true;
  if (event.dataTransfer?.files.length) openFiles(event.dataTransfer.files);
});

/* ------------------------------------------------------------------ Démarrage */

for (const ride of rides) addOverview(ride);
renderFilters();
renderList();
renderExportBar();

function fromHash({ fit = true } = {}) {
  const slug = decodeURIComponent(location.hash.slice(1));
  const ride = rides.find((r) => r.slug === slug) ?? null;
  if (ride !== state.selected) select(ride, { fit, updateHash: false });
  else if (!ride && fit) fitAll();
}
addEventListener('hashchange', () => fromHash());
fromHash();
addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.selected && !(event.target instanceof HTMLTextAreaElement)) select(null);
});
