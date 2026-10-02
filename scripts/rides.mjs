#!/usr/bin/env node
/**
 * Ajoute une sortie à la page privée /rides/.
 *
 *   npm run rides:add -- ~/Downloads/sortie.gpx [--name "Nom"] [--type gravel|route|vtt|velo] [--trim 400]
 *
 * Le fichier est copié dans public/rides/gpx/ et référencé dans src/data/rides.json.
 * Le site et son dépôt étant publics, les premiers et derniers mètres de la trace
 * (400 m par défaut) sont retirés pour ne pas révéler le point de départ — souvent
 * le domicile. --trim 0 conserve la trace entière.
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gpxDir = join(root, 'public/rides/gpx');
const metaFile = join(root, 'src/data/rides.json');
const TYPES = ['gravel', 'route', 'vtt', 'velo'];

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    type: { type: 'string' },
    trim: { type: 'string', default: '400' },
  },
});

if (positionals.length === 0) {
  console.error('Usage : npm run rides:add -- fichier.gpx [--name "Nom"] [--type gravel|route|vtt|velo] [--trim 400]');
  process.exit(1);
}
if (values.type && !TYPES.includes(values.type)) {
  console.error(`Type inconnu : ${values.type} (attendu : ${TYPES.join(', ')})`);
  process.exit(1);
}
const trim = Number(values.trim);

const rad = Math.PI / 180;
function distance(a, b) {
  const dLat = (b.lat - a.lat) * rad;
  const dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371008.8 * Math.asin(Math.min(1, Math.sqrt(h)));
}

function slugify(text) {
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

const decode = (text) =>
  text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();

/** Retire les points situés à moins de `meters` du début et de la fin, sans toucher au reste du fichier. */
function trimTrack(xml, meters) {
  const kind = /<trkpt\b/.test(xml) ? 'trkpt' : 'rtept';
  const pattern = new RegExp(`[ \\t]*<${kind}\\b([^>]*?)(?:/>|>[\\s\\S]*?</${kind}>)\\s*?\\n?`, 'g');
  const points = [...xml.matchAll(pattern)].map((m) => ({
    lat: Number(m[1].match(/\blat\s*=\s*["']([^"']+)/)?.[1]),
    lon: Number(m[1].match(/\blon\s*=\s*["']([^"']+)/)?.[1]),
  }));
  if (points.length < 2) throw new Error('aucune trace dans ce fichier');

  const cumulative = [0];
  for (let i = 1; i < points.length; i++) cumulative.push(cumulative[i - 1] + distance(points[i - 1], points[i]));
  const total = cumulative.at(-1);
  if (meters <= 0) return { xml, total, removed: 0 };
  if (total < meters * 4) throw new Error(`trace trop courte (${Math.round(total)} m) pour retirer ${meters} m à chaque extrémité`);

  let index = -1;
  let removed = 0;
  const output = xml.replace(pattern, (match) => {
    index++;
    if (cumulative[index] >= meters && total - cumulative[index] >= meters) return match;
    removed++;
    return '';
  });
  return { xml: output, total, removed };
}

const meta = existsSync(metaFile) ? JSON.parse(await readFile(metaFile, 'utf8')) : {};
await mkdir(gpxDir, { recursive: true });

for (const file of positionals) {
  const source = await readFile(file, 'utf8');
  const { xml, total, removed } = trimTrack(source, trim);

  const trkHead = source.match(/<trk\b[\s\S]*?(?=<trkseg|<\/trk>)/)?.[0] ?? '';
  const gpxName = trkHead.match(/<name>([\s\S]*?)<\/name>/)?.[1] ?? source.match(/<name>([\s\S]*?)<\/name>/)?.[1];
  const name = values.name ?? (gpxName ? decode(gpxName) : basename(file, '.gpx'));
  const firstTime = source.match(/<time>([^<]+)<\/time>/g)?.[1] ?? source.match(/<time>([^<]+)<\/time>/)?.[0];
  const date = firstTime ? firstTime.replace(/<\/?time>/g, '').slice(0, 10) : '';

  let slug = slugify(date ? `${date}-${name}` : name);
  for (let n = 2; existsSync(join(gpxDir, `${slug}.gpx`)) || meta[slug]; n++) slug = `${slugify(date ? `${date}-${name}` : name)}-${n}`;

  await writeFile(join(gpxDir, `${slug}.gpx`), xml);
  meta[slug] = { name, ...(values.type ? { type: values.type } : {}) };

  console.log(`✓ ${name}`);
  console.log(`  public/rides/gpx/${slug}.gpx — ${(total / 1000).toFixed(1)} km, ${removed} points retirés (${trim} m à chaque extrémité)`);
}

const sorted = Object.fromEntries(Object.entries(meta).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(metaFile, JSON.stringify(sorted, null, 2) + '\n');
console.log('\nNote, type et commentaire se règlent dans src/data/rides.json ou depuis la page (/rides/ → Exporter).');
