/**
 * Page /trip/ : zoom et déplacement sur le planisphère, épingles regroupées quand elles se
 * chevauchent, liste des pays synchronisée avec la carte.
 */
import { select } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity, type ZoomTransform } from 'd3-zoom';
import type { Bounds, TripData } from '../lib/world';

/* ------------------------------------------------------------------ Outils */

const $ = <T extends Element = HTMLElement>(id: string) => document.getElementById(id) as unknown as T;

/** Zoom maximal : une unité du planisphère (≈ 40 km) occupe 40 px. */
const MAX_K = 40;
/** Zoom sur une ville : ses environs, sur quelques centaines de kilomètres. */
const CITY_K = 18;
/** Distance (px) en deçà de laquelle des épingles se regroupent. */
const CLUSTER = 26;
/** Écart entre une épingle et son étiquette, et demi-taille de l'épingle (px). */
const PIN = { gap: 15, r: 10 };
const BUBBLE = { gap: 19, r: 13 };

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => matchMedia('(max-width: 760px)').matches;

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const flagOf = (code: string) => String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));
const cities = (n: number) => `${n} ville${n > 1 ? 's' : ''}`;

/* ------------------------------------------------------------------ Données */

const data: TripData = JSON.parse($('trip-data').textContent || '{}');
const counts = new Map<string, number>();
for (const place of data.places) counts.set(place.country, (counts.get(place.country) ?? 0) + 1);

const mapEl = $('map');
const viewport = $<SVGGElement>('viewport');
const glow = $<SVGFEGaussianBlurElement>('glow-blur');
const pinsEl = $('pins');
const tip = $('tip');

const state = {
  place: null as number | null,
  country: null as string | null,
  hover: null as number | null,
};

let width = 0;
let height = 0;
let free: Bounds = [[0, 0], [0, 0]];
let worldK = 1;
let current = zoomIdentity;

/* ------------------------------------------------------------------ Cadrage */

/** Partie de la carte que le panneau ne recouvre pas : à sa droite sur ordinateur, au-dessus sur mobile. */
function freeArea(): Bounds {
  const map = mapEl.getBoundingClientRect();
  const panel = $('panel').getBoundingClientRect();
  if (isMobile()) return [[0, 0], [width, Math.min(height, Math.max(height / 2, panel.top - map.top))]];
  return [[Math.min(Math.max(0, panel.right - map.left), width / 2), 0], [width, height]];
}

const padding = () => (isMobile() ? 12 : 40);

/** Transformation qui cadre une zone du planisphère dans la partie libre de la carte. */
function fit([[x0, y0], [x1, y1]]: Bounds, pad: number, maxK = MAX_K) {
  const [[fx0, fy0], [fx1, fy1]] = free;
  const k = Math.min(maxK, (fx1 - fx0 - 2 * pad) / Math.max(x1 - x0, 1e-3), (fy1 - fy0 - 2 * pad) / Math.max(y1 - y0, 1e-3));
  return centerOn([(x0 + x1) / 2, (y0 + y1) / 2], Math.max(k, 0.01));
}

function centerOn([x, y]: [number, number], k: number) {
  const [[fx0, fy0], [fx1, fy1]] = free;
  return zoomIdentity.translate((fx0 + fx1) / 2, (fy0 + fy1) / 2).scale(k).translate(-x, -y);
}

const worldView = () => fit([[0, 0], [data.width, data.height]], padding());

/* ------------------------------------------------------------------ Zoom */

/** Gestes pris en charge : ceux de d3-zoom par défaut, sauf le double-clic sur une épingle (il la sélectionne déjà). */
const gesture = (event: MouseEvent) =>
  (!event.ctrlKey || event.type === 'wheel') &&
  !event.button &&
  !(event.type === 'dblclick' && (event.target as Element).closest('.pin, .cluster'));

const zoomer = zoom<HTMLElement, unknown>()
  .extent(() => free)
  .clickDistance(4)
  .filter(gesture)
  // Le monde reste centré tant qu'il est plus petit que la carte, et ne la quitte jamais ensuite.
  .constrain((t, [[ex0, ey0], [ex1, ey1]]) => {
    const pad = padding();
    const shift = (a0: number, a1: number, e0: number, e1: number) => {
      if (a1 - a0 <= e1 - e0 - 2 * pad + 1) return (e0 + e1 - a0 - a1) / 2;
      if (a0 > e0 + pad) return e0 + pad - a0;
      if (a1 < e1 - pad) return e1 - pad - a1;
      return 0;
    };
    const dx = shift(t.applyX(0), t.applyX(data.width), ex0, ex1);
    const dy = shift(t.applyY(0), t.applyY(data.height), ey0, ey1);
    return dx || dy ? t.translate(dx / t.k, dy / t.k) : t;
  })
  .on('start', hideTip)
  .on('zoom', ({ transform }: { transform: ZoomTransform }) => render(transform));

const view = select(mapEl).call(zoomer);

function render(t: ZoomTransform) {
  current = t;
  viewport.setAttribute('transform', `translate(${t.x},${t.y}) scale(${t.k})`);
  // Pays visités bien colorés et auréolés vus de loin, simplement teintés de près.
  const depth = Math.log(t.k / worldK) / Math.log(MAX_K / worldK) || 0;
  mapEl.style.setProperty('--tint', `${Math.round(50 - 26 * Math.min(1, Math.max(0, depth)))}%`);
  const far = t.k < worldK * 4;
  mapEl.classList.toggle('far', far);
  if (far) glow.setAttribute('stdDeviation', (3.5 / t.k).toFixed(3));
  layoutPins();
}

function flyTo(t: ZoomTransform, duration = 1100) {
  if (reduceMotion) view.call(zoomer.transform, t);
  else view.transition().duration(duration).call(zoomer.transform, t);
}

function resize() {
  // Carte masquée (onglet en arrière-plan, mise en page pas encore faite) : rien à cadrer.
  if (!mapEl.clientWidth || !mapEl.clientHeight) return;
  const atWorld = width === 0 || current.k <= worldK * 1.001;
  width = mapEl.clientWidth;
  height = mapEl.clientHeight;
  free = freeArea();
  const world = worldView();
  worldK = world.k;
  zoomer.scaleExtent([worldK, Math.max(MAX_K, worldK)]);
  view.call(zoomer.transform, atWorld ? world : current);
}

function zoomBy(factor: number) {
  if (reduceMotion) view.call(zoomer.scaleBy, factor);
  else view.transition().duration(350).call(zoomer.scaleBy, factor);
}

$('zoom-in').addEventListener('click', () => zoomBy(2));
$('zoom-out').addEventListener('click', () => zoomBy(0.5));
$('zoom-reset').addEventListener('click', () => reset());

/* ------------------------------------------------------------------ Épingles */

interface Marker {
  el: HTMLButtonElement;
  label: HTMLElement;
  text: string;
  /** Taille de l'étiquette, mesurée à la première apparition. */
  size?: [number, number];
}

interface Cluster extends Marker {
  key: string;
}

function marker(className: string, html: string): Marker {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.innerHTML = html;
  pinsEl.append(el);
  return { el, label: el.querySelector('.label')!, text: '' };
}

const pins: Marker[] = data.places.map((place, i) => {
  const country = data.countries[place.country];
  const pin = marker('pin', `<span class="dot"></span><span class="label">${escape(place.name)}</span>`);
  pin.text = place.name;
  pin.el.dataset.place = String(i);
  pin.el.style.setProperty('--c', country?.color ?? '#fff');
  pin.el.style.setProperty('--i', String(i));
  pin.el.setAttribute('aria-label', country ? `${place.name}, ${country.name}` : place.name);
  return pin;
});

const clusters: Cluster[] = [];

function cluster(index: number, members: number[]) {
  const item = (clusters[index] ??= {
    ...marker('cluster', '<span class="bubble"><span class="count"></span></span><span class="label"></span>'),
    key: '',
  });
  const key = members.join(',');
  if (item.key === key) return item;

  item.key = key;
  item.el.dataset.members = key;
  // Anneau aux couleurs des pays regroupés, en proportion du nombre d'endroits.
  const codes = [...new Set(members.map((i) => data.places[i]!.country))];
  let start = 0;
  const stops = codes.map((code) => {
    const end = start + (members.filter((i) => data.places[i]!.country === code).length / members.length) * 100;
    const stop = `${data.countries[code]?.color ?? '#fff'} ${start}% ${end}%`;
    start = end;
    return stop;
  });
  item.el.style.setProperty('--ring', `conic-gradient(${stops.join(', ')})`);
  item.el.style.setProperty('--c', data.countries[codes[0]!]?.color ?? '#fff');
  item.el.querySelector('.count')!.textContent = String(members.length);
  const names = codes.map((code) => data.countries[code]?.name ?? code);
  item.text = names.length > 2 ? `${names.length} pays` : names.join(' · ');
  item.label.textContent = item.text;
  item.size = undefined;
  item.el.setAttribute('aria-label', members.map((i) => data.places[i]!.name).join(', '));
  return item;
}

interface Placed {
  marker: Marker;
  x: number;
  y: number;
  shape: typeof PIN;
  priority: number;
}

function show(el: HTMLElement, visible: boolean) {
  if (el.hidden === visible) el.hidden = !visible;
}

function layoutPins() {
  const points = data.places.map((p) => [current.applyX(p.x), current.applyY(p.y)] as const);

  // Regroupement ascendant : on fusionne les deux groupes les plus proches tant qu'ils sont à moins
  // de CLUSTER px l'un de l'autre ; un groupe est placé au centre de ses endroits.
  const groups = points.map(([x, y], i) => ({ members: [i], x, y }));
  for (;;) {
    let best: [number, number] | null = null;
    let min = CLUSTER;
    for (let a = 0; a < groups.length; a++) {
      for (let b = a + 1; b < groups.length; b++) {
        const d = Math.hypot(groups[a]!.x - groups[b]!.x, groups[a]!.y - groups[b]!.y);
        if (d < min) (min = d), (best = [a, b]);
      }
    }
    if (!best) break;
    const [a, b] = [groups[best[0]]!, groups.splice(best[1], 1)[0]!];
    const n = a.members.length + b.members.length;
    a.x = (a.x * a.members.length + b.x * b.members.length) / n;
    a.y = (a.y * a.members.length + b.y * b.members.length) / n;
    a.members = [...a.members, ...b.members].sort((m, k) => m - k);
  }

  const placed: Placed[] = [];
  let used = 0;
  for (const { members, x, y } of groups) {
    const rank = members.includes(state.place ?? -1) ? 3 : members.includes(state.hover ?? -1) ? 2 : 0;
    if (members.length === 1) {
      const i = members[0]!;
      show(pins[i]!.el, true);
      placed.push({ marker: pins[i]!, x: points[i]![0], y: points[i]![1], shape: PIN, priority: rank });
      continue;
    }
    for (const i of members) show(pins[i]!.el, false);
    const item = cluster(used++, members);
    show(item.el, true);
    item.el.classList.toggle('selected', rank === 3);
    item.el.classList.toggle('hover', rank === 2);
    placed.push({ marker: item, x, y, shape: BUBBLE, priority: Math.max(rank, 1) });
  }
  for (const item of clusters.slice(used)) show(item.el, false);

  for (const { marker, x, y } of placed) marker.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  placeLabels(placed);
}

/** Place chaque étiquette à droite, sinon à gauche, sinon dessous, sinon la masque (elle réapparaît au survol). */
function placeLabels(placed: Placed[]) {
  const boxes = placed.map(({ x, y, shape: { r } }) => [x - r, y - r, x + r, y + r]);
  const overlaps = (a: number[], b: number[]) => a[0]! < b[2]! && b[0]! < a[2]! && a[1]! < b[3]! && b[1]! < a[3]!;

  for (const { marker, x, y, shape } of [...placed].sort((a, b) => b.priority - a.priority)) {
    if (!marker.text) continue;
    marker.size ??= [marker.label.offsetWidth, marker.label.offsetHeight];
    const [w, h] = marker.size;
    const sides = {
      right: [x + shape.gap, y - h / 2, x + shape.gap + w, y + h / 2],
      left: [x - shape.gap - w, y - h / 2, x - shape.gap, y + h / 2],
      below: [x - w / 2, y + shape.r + 4, x + w / 2, y + shape.r + 4 + h],
    };
    const side = (Object.keys(sides) as (keyof typeof sides)[]).find((key) => {
      const b = sides[key];
      return b[0]! >= 4 && b[2]! <= width - 4 && !boxes.some((o) => overlaps(o, b));
    });
    marker.el.classList.toggle('left', side === 'left');
    marker.el.classList.toggle('below', side === 'below');
    marker.el.classList.toggle('no-label', !side);
    if (side) boxes.push(sides[side]);
  }
}

// Les étiquettes changent de taille une fois les polices chargées.
document.fonts?.ready.then(() => {
  for (const item of [...pins, ...clusters]) item.size = undefined;
  layoutPins();
});

/* ------------------------------------------------------------------ Sélection */

function selectPlace(i: number, fromList = false) {
  const place = data.places[i];
  if (!place) return;
  state.place = i;
  state.country = place.country;
  sync();
  flyTo(centerOn([place.x, place.y], Math.max(current.k, CITY_K)));
  if (fromList && isMobile()) mapEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

function selectCountry(code: string, fromList = false) {
  const country = data.countries[code];
  if (!country) return;
  state.place = null;
  state.country = code;
  sync();
  flyTo(fit(country.focus, isMobile() ? 28 : 64));
  if (fromList && isMobile()) mapEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}

/** Rapproche juste assez des endroits regroupés pour les séparer. */
function expand(members: number[]) {
  const xs = members.map((i) => data.places[i]!.x);
  const ys = members.map((i) => data.places[i]!.y);
  flyTo(fit([[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]], 120, Math.max(CITY_K, current.k * 2)));
}

function reset() {
  state.place = null;
  state.country = null;
  sync();
  flyTo(worldView());
}

function sync() {
  for (const el of document.querySelectorAll<HTMLElement>('.country')) el.classList.toggle('active', el.dataset.code === state.country);
  for (const el of document.querySelectorAll<HTMLElement>('.city')) el.classList.toggle('active', Number(el.dataset.place) === state.place);
  for (const el of document.querySelectorAll<SVGPathElement>('path.visited')) el.classList.toggle('active', el.dataset.code === state.country);
  pins.forEach((pin, i) => pin.el.classList.toggle('selected', i === state.place));
  layoutPins();
}

function hoverPlace(i: number | null) {
  if (state.hover === i) return;
  state.hover = i;
  pins.forEach((pin, n) => pin.el.classList.toggle('hover', n === i));
  for (const el of document.querySelectorAll<HTMLElement>('.city')) el.classList.toggle('hover', Number(el.dataset.place) === i);
  layoutPins();
}

function hoverCountry(code: string | null) {
  for (const el of document.querySelectorAll<HTMLElement>('.country')) el.classList.toggle('hover', el.dataset.code === code);
  for (const el of document.querySelectorAll<SVGPathElement>('path.visited')) el.classList.toggle('hover', el.dataset.code === code);
}

/* ------------------------------------------------------------------ Carte */

mapEl.addEventListener('click', (event) => {
  const target = event.target as Element;
  const pin = target.closest<HTMLElement>('.pin');
  if (pin) return selectPlace(Number(pin.dataset.place));
  const group = target.closest<HTMLElement>('.cluster');
  if (group) return expand(group.dataset.members!.split(',').map(Number));
  const country = target.closest<SVGPathElement>('path.visited');
  if (country) selectCountry(country.dataset.code!);
});

let tipped: Element | null = null;

function hideTip() {
  if (!tipped) return;
  tipped = null;
  tip.hidden = true;
  hoverCountry(null);
}

mapEl.addEventListener('pointermove', (event) => {
  const target = event.target as Element;
  const path = event.pointerType === 'mouse' && !event.buttons ? target.closest('path[data-name]') : null;
  if (!path) return hideTip();
  if (path !== tipped) {
    tipped = path;
    const code = path.getAttribute('data-code')!;
    const count = counts.get(code);
    tip.innerHTML = `<span>${flagOf(code)}</span>${escape(path.getAttribute('data-name')!)}${count ? `<small>${cities(count)}</small>` : ''}`;
    tip.hidden = false;
    hoverCountry(count ? code : null);
  }
  const rect = mapEl.getBoundingClientRect();
  const x = Math.min(event.clientX - rect.left + 14, width - tip.offsetWidth - 8);
  const y = Math.min(event.clientY - rect.top + 18, height - tip.offsetHeight - 8);
  tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
});
mapEl.addEventListener('pointerleave', hideTip);

// Survol à la souris uniquement : au doigt, il resterait collé après le toucher.
pinsEl.addEventListener('pointerover', (event) => {
  if (event.pointerType !== 'mouse') return;
  const pin = (event.target as Element).closest<HTMLElement>('.pin');
  hoverPlace(pin ? Number(pin.dataset.place) : null);
});
pinsEl.addEventListener('pointerout', () => hoverPlace(null));

/* ------------------------------------------------------------------ Liste */

$('list').addEventListener('click', (event) => {
  const target = event.target as Element;
  const city = target.closest<HTMLElement>('[data-place]');
  if (city) return selectPlace(Number(city.dataset.place), true);
  const country = target.closest<HTMLElement>('[data-country]');
  if (country) selectCountry(country.dataset.country!, true);
});

$('list').addEventListener('pointerover', (event) => {
  if (event.pointerType !== 'mouse') return;
  const target = event.target as Element;
  const city = target.closest<HTMLElement>('[data-place]');
  hoverPlace(city ? Number(city.dataset.place) : null);
  hoverCountry(target.closest<HTMLElement>('.country')?.dataset.code ?? null);
});
$('list').addEventListener('pointerleave', () => {
  hoverPlace(null);
  hoverCountry(null);
});

addEventListener('keydown', (event) => {
  if (event.key === 'Escape') reset();
});

/* ------------------------------------------------------------------ Démarrage */

new ResizeObserver(resize).observe(mapEl);
requestAnimationFrame(() => mapEl.classList.add('ready'));
setTimeout(() => mapEl.classList.remove('intro'), 3000);
