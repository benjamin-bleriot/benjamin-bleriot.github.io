/**
 * Planisphère de la page privée /trip/, calculé à la compilation à partir de src/data/places.ts.
 *
 * Contours Natural Earth au 1:10 M (world-atlas), simplifiés d'autant plus qu'ils sont loin des
 * endroits visités : nets là où l'on zoome, légers ailleurs. Projection Natural Earth, tracé SVG.
 */
import fs from 'node:fs';
import path from 'node:path';
import { countries as countryList, type TCountryCode } from 'countries-list';
import { geoArea, geoDistance, geoGraticule, geoNaturalEarth1, geoPath, type GeoContext, type GeoPermissibleObjects } from 'd3-geo';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import iso from 'i18n-iso-countries';
import { feature, neighbors } from 'topojson-client';
import { filter, filterWeight, presimplify, simplify, sphericalRingArea, sphericalTriangleArea, type RingWeighter } from 'topojson-simplify';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { places } from '../data/places';

export type Bounds = [[number, number], [number, number]];

export interface MapPlace {
  name: string;
  country: string;
  /** Position projetée, dans le repère du planisphère. */
  x: number;
  y: number;
}

export interface VisitedCountry {
  code: string;
  name: string;
  flag: string;
  color: string;
  /** Cadre du zoom sur le pays : son territoire principal et ses endroits visités. */
  focus: Bounds;
  /** Indices dans `places`, dans l'ordre de src/data/places.ts. */
  places: number[];
}

export interface WorldMap {
  width: number;
  height: number;
  sphere: string;
  graticule: string;
  /** Tous les pays, les pays visités en dernier pour que leur contour passe au-dessus. */
  countries: { code: string | null; name: string | null; d: string; color: string | null }[];
  places: MapPlace[];
  /** Pays visités, par ordre alphabétique. */
  visited: VisitedCountry[];
  stats: { countries: number; places: number; continents: number; share: number };
}

/** Données transmises au script de la page. */
export interface TripData {
  width: number;
  height: number;
  places: MapPlace[];
  countries: Record<string, Pick<VisitedCountry, 'name' | 'flag' | 'color' | 'focus'>>;
}

const TOPOLOGY = path.join(process.cwd(), 'node_modules/world-atlas/countries-10m.json');
const WIDTH = 1000;

// Une couleur par pays, dans l'ordre d'apparition dans places.ts ; deux pays proches n'ont jamais la même.
const PALETTE = ['#a78bfa', '#2fd4d4', '#5ea8ff', '#34c77b', '#ff6b9d', '#f2a65a', '#ffd23f', '#ff5a4f', '#8fd14f', '#e07bff'];

// Aire minimale des triangles conservés, en stéradians : ≈ 1 km² près des endroits visités
// (net au zoom maximal), ≈ 120 km² loin d'eux (suffisant pour la vue du monde), et au plus
// ≈ 10 km² sur tout le territoire d'un pays visité (net quand on le cadre en entier).
const DETAIL_NEAR = 2.5e-8;
const DETAIL_FAR = 3e-6;
const DETAIL_VISITED = 2.5e-7;
// Distances (en degrés) entre lesquelles on passe progressivement de l'un à l'autre.
const NEAR = 4;
const FAR = 30;
// Îles de moins de ≈ 80 km² retirées, sauf dans les pays visités.
const MIN_ISLAND = 2e-6;
// Deux pays visités sont proches s'ils ont une frontière commune ou des endroits à moins de 1 000 km
// l'un de l'autre (distance en radians) : on les voit alors ensemble à l'écran.
const CLOSE = 1000 / 6371;
// Pays reconnus dans le monde (membres de l'ONU et observateurs), pour le pourcentage.
const WORLD_COUNTRIES = 195;

type CountryGeometries = GeometryCollection<{ name: string }>;
type CountryFeature = Feature<Polygon | MultiPolygon, { name: string }>;

const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' });
const flagOf = (code: string) => String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));
const round = (n: number) => Math.round(n * 100) / 100;

/** Code ISO alpha-2 d'un pays de world-atlas (repéré par son code numérique). */
function codeOf(id: string | number | undefined, name: string | undefined) {
  if (id !== undefined) return iso.numericToAlpha2(id) ?? null;
  return name === 'Kosovo' ? 'XK' : null;
}

/**
 * Contexte de tracé d3 qui écrit un chemin SVG compact : coordonnées relatives arrondies au
 * centième, sans commande « l » (implicite après « m ») ni séparateur superflu.
 */
class CompactPath implements GeoContext {
  private out = '';
  private last = '';
  private x = 0;
  private y = 0;
  private x0 = 0;
  private y0 = 0;

  beginPath() {}
  arc() {}

  moveTo(x: number, y: number) {
    this.out += 'm';
    this.last = '';
    this.point(x, y, true);
    this.x0 = this.x;
    this.y0 = this.y;
  }

  lineTo(x: number, y: number) {
    this.point(x, y, false);
  }

  closePath() {
    this.out += 'z';
    this.last = '';
    this.x = this.x0;
    this.y = this.y0;
  }

  result() {
    const out = this.out;
    this.out = this.last = '';
    this.x = this.y = this.x0 = this.y0 = 0;
    return out;
  }

  private point(x: number, y: number, move: boolean) {
    // Calcul en centièmes entiers pour que les arrondis ne s'accumulent pas.
    const X = Math.round(x * 100);
    const Y = Math.round(y * 100);
    if (!move && X === this.x && Y === this.y) return;
    this.number(X - this.x);
    this.number(Y - this.y);
    this.x = X;
    this.y = Y;
  }

  private number(hundredths: number) {
    let s = String(hundredths / 100);
    if (s.startsWith('0.')) s = s.slice(1);
    else if (s.startsWith('-0.')) s = '-' + s.slice(2);
    if (this.last && s[0] !== '-' && !(s[0] === '.' && this.last.includes('.'))) this.out += ',';
    this.out += s;
    this.last = s;
  }
}

/** Vecteur unitaire d'un point [longitude, latitude], pour mesurer vite les distances angulaires. */
function unit([lon, lat]: [number, number]) {
  const λ = (lon * Math.PI) / 180;
  const φ = (lat * Math.PI) / 180;
  return [Math.cos(φ) * Math.cos(λ), Math.cos(φ) * Math.sin(λ), Math.sin(φ)] as const;
}

let cache: WorldMap | undefined;

export function loadWorld(): WorldMap {
  if (cache) return cache;

  for (const place of places) {
    if (!(place.country in countryList)) throw new Error(`[trip] « ${place.name} » : code pays inconnu « ${place.country} ».`);
  }

  const topology = JSON.parse(fs.readFileSync(TOPOLOGY, 'utf8')) as Topology<{ countries: CountryGeometries }>;
  const geometries = topology.objects.countries.geometries;
  const codes = geometries.map((g) => codeOf(g.id, (g.properties as { name?: string } | undefined)?.name));

  // Pays visités, dans l'ordre de leur première apparition.
  const order = [...new Set(places.map((p) => p.country))];
  const visited = new Set(order);

  // Arcs des frontières et côtes des pays visités.
  const visitedArcs = new Set<number>();
  const collect = (arcs: unknown): void => {
    for (const a of arcs as (number | unknown[])[]) {
      if (Array.isArray(a)) collect(a);
      else visitedArcs.add(a < 0 ? ~a : a);
    }
  };
  geometries.forEach((g, i) => {
    if (visited.has(codes[i] ?? '') && 'arcs' in g) collect(g.arcs);
  });

  // Simplification de Visvalingam, avec un seuil qui grandit avec la distance aux endroits visités.
  const targets = places.map((p) => unit([p.lon, p.lat]));
  const presimplified = presimplify(topology, sphericalTriangleArea);
  presimplified.arcs.forEach((arc, i) => {
    const visitedArc = visitedArcs.has(i);
    for (const p of arc) {
      const z = p[2]!;
      if (z >= DETAIL_FAR) continue; // conservé partout (dont les extrémités d'arc, de poids infini)
      if (!(z >= DETAIL_NEAR)) {
        p[2] = 0; // trop fin, même près d'un endroit visité
        continue;
      }
      const [x, y, zz] = unit([p[0]!, p[1]!]);
      const dot = Math.max(...targets.map((t) => t[0] * x + t[1] * y + t[2] * zz), -1);
      const degrees = (Math.acos(Math.min(1, dot)) * 180) / Math.PI;
      const t = Math.min(1, Math.max(0, (degrees - NEAR) / (FAR - NEAR)));
      let threshold = DETAIL_NEAR * (DETAIL_FAR / DETAIL_NEAR) ** t;
      if (visitedArc) threshold = Math.min(threshold, DETAIL_VISITED);
      p[2] = (z * DETAIL_FAR) / threshold;
    }
  });
  const simplified = simplify(presimplified, DETAIL_FAR);
  // filterWeight transmet bien `interior` à la fonction de poids, malgré ce que disent ses types.
  const largeEnough = filterWeight(simplified, MIN_ISLAND, sphericalRingArea as RingWeighter);
  const filtered = filter(simplified, (ring, interior) =>
    (ring as unknown as number[]).some((a) => visitedArcs.has(a < 0 ? ~a : a)) || largeEnough(ring, interior),
  ) as unknown as Topology<{ countries: CountryGeometries }>;
  const features = feature(filtered, filtered.objects.countries).features as CountryFeature[];

  // Projection et tracés.
  const sphere: GeoPermissibleObjects = { type: 'Sphere' };
  const projection = geoNaturalEarth1().precision(0.1).fitWidth(WIDTH, sphere);
  const measure = geoPath(projection);
  const context = new CompactPath();
  const draw = geoPath(projection, context);
  const trace = (object: GeoPermissibleObjects) => {
    draw(object);
    return context.result();
  };
  const height = Math.ceil(measure.bounds(sphere)[1][1]);

  // Couleurs : la suivante de la palette, sauf si un pays proche déjà coloré l'utilise.
  const adjacent = new Map<string, Set<string>>();
  neighbors(geometries).forEach((list, i) => {
    const code = codes[i];
    if (!code) return;
    for (const j of list) {
      const other = codes[j];
      if (other && other !== code) adjacent.set(code, (adjacent.get(code) ?? new Set()).add(other));
    }
  });
  const close = (a: string, b: string) =>
    !!adjacent.get(a)?.has(b) ||
    places.some((p) => p.country === a && places.some((q) => q.country === b && geoDistance([p.lon, p.lat], [q.lon, q.lat]) < CLOSE));
  const colors = new Map<string, string>();
  order.forEach((code, i) => {
    const taken = new Set([...colors].filter(([other]) => close(code, other)).map(([, color]) => color));
    let k = i % PALETTE.length;
    for (let tries = 0; tries < PALETTE.length && taken.has(PALETTE[k]!); tries++) k = (k + 1) % PALETTE.length;
    colors.set(code, PALETTE[k]!);
  });

  const countries: WorldMap['countries'] = [];
  // Morceaux de chaque pays visité (certains territoires partagent le code de leur pays, ex. AU).
  const pieces = new Map<string, Polygon['coordinates'][]>();
  for (const f of features) {
    const code = codeOf(f.id, f.properties?.name);
    const d = trace(f);
    if (!d) continue;
    if (code && visited.has(code)) {
      const polygons = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      pieces.set(code, [...(pieces.get(code) ?? []), ...polygons]);
    }
    countries.push({
      code,
      name: code ? (regionNames.of(code) ?? null) : null,
      d,
      color: code ? (colors.get(code) ?? null) : null,
    });
  }
  countries.sort((a, b) => Number(!!a.color) - Number(!!b.color));

  const mapPlaces: MapPlace[] = places.map((p) => {
    const [x, y] = projection([p.lon, p.lat])!;
    return { name: p.name, country: p.country, x: round(x), y: round(y) };
  });

  const visitedCountries: VisitedCountry[] = order.map((code) => {
    const indexes = places.flatMap((p, i) => (p.country === code ? [i] : []));
    // Cadre : le plus grand morceau du pays (sans ses territoires lointains) et ses endroits visités.
    const area = (coordinates: Polygon['coordinates']) => geoArea({ type: 'Polygon', coordinates });
    const main = [...(pieces.get(code) ?? [])].sort((a, b) => area(b) - area(a))[0];
    const [[x0, y0], [x1, y1]] = main ? measure.bounds({ type: 'Polygon', coordinates: main }) : [[Infinity, Infinity], [-Infinity, -Infinity]];
    const xs = [x0, x1, ...indexes.map((i) => mapPlaces[i]!.x)];
    const ys = [y0, y1, ...indexes.map((i) => mapPlaces[i]!.y)];
    return {
      code,
      name: regionNames.of(code) ?? code,
      flag: flagOf(code),
      color: colors.get(code)!,
      focus: [
        [round(Math.min(...xs)), round(Math.min(...ys))],
        [round(Math.max(...xs)), round(Math.max(...ys))],
      ],
      places: indexes,
    };
  });
  visitedCountries.sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  cache = {
    width: WIDTH,
    height,
    sphere: trace(sphere),
    graticule: trace(geoGraticule().step([15, 15])()),
    countries,
    places: mapPlaces,
    visited: visitedCountries,
    stats: {
      countries: order.length,
      places: places.length,
      continents: new Set(order.map((code) => countryList[code as TCountryCode].continent)).size,
      share: Math.round((order.length / WORLD_COUNTRIES) * 100),
    },
  };
  return cache;
}
