/**
 * Sorties vélo de la page privée /rides/ : chaque fichier de public/rides/gpx/
 * est analysé à la compilation, complété par src/data/rides.json (nom, type, note).
 */
import fs from 'node:fs';
import path from 'node:path';
import meta from '../data/rides.json';
import { analyzeGpx, guessType, parseGpx, type RideAnalysis, type RideStats, type RideTrack, type RideType } from './gpx';

export interface RideMeta {
  name?: string;
  type?: RideType;
  /** De 1 à 5. */
  rating?: number | null;
  note?: string;
}

export interface RideSummary {
  slug: string;
  name: string;
  type: RideType;
  rating: number | null;
  note: string;
  /** Adresse du fichier GPX à télécharger. */
  gpx: string;
  stats: RideStats;
  overview: number[];
  spark: number[];
  bounds: RideAnalysis['bounds'];
}

export interface Ride {
  summary: RideSummary;
  track: RideTrack;
}

const GPX_DIR = path.join(process.cwd(), 'public/rides/gpx');
const metadata = meta as Record<string, RideMeta>;

let cache: Ride[] | undefined;

export function loadRides(): Ride[] {
  if (cache) return cache;
  const files = fs.existsSync(GPX_DIR) ? fs.readdirSync(GPX_DIR).filter((f) => f.toLowerCase().endsWith('.gpx')) : [];
  const rides: Ride[] = [];
  for (const file of files) {
    const slug = file.replace(/\.gpx$/i, '');
    const parsed = parseGpx(fs.readFileSync(path.join(GPX_DIR, file), 'utf8'));
    const analysis = analyzeGpx(parsed);
    if (!analysis) {
      console.warn(`[rides] ${file} : aucune trace exploitable, fichier ignoré.`);
      continue;
    }
    const info = metadata[slug] ?? {};
    rides.push({
      summary: {
        slug,
        name: info.name ?? parsed.name ?? slug,
        type: info.type ?? guessType(parsed.type),
        rating: info.rating ?? null,
        note: info.note ?? '',
        gpx: `/rides/gpx/${encodeURIComponent(file)}`,
        stats: analysis.stats,
        overview: analysis.overview,
        spark: analysis.spark,
        bounds: analysis.bounds,
      },
      track: analysis.track,
    });
  }
  rides.sort((a, b) => (b.summary.stats.start ?? '').localeCompare(a.summary.stats.start ?? ''));
  cache = rides;
  return rides;
}
