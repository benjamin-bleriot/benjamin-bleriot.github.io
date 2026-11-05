import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import appstore from '../data/appstore.json';
import { liveApps } from '../data/apps';
import type { AppData, Lang } from '../data/types';

interface StoreLocale {
  name: string;
  version: string;
  releaseNotes: string;
  currentVersionReleaseDate: string;
  price: number;
  formattedPrice: string;
  url: string;
}

export interface StoreApp {
  bundleId: string;
  releaseDate: string;
  minimumOsVersion: string;
  languages: string[];
  genre: string;
  fileSizeBytes: number;
  rating: { average: number; count: number };
  locales: Record<Lang, StoreLocale>;
}

const storeApps = appstore.apps as Record<string, StoreApp>;

/** Données publiques de l'App Store (notes, version…), synchronisées par `npm run appstore`. */
export const store = (app: AppData): StoreApp | undefined => (app.appStoreId ? storeApps[app.appStoreId] : undefined);

export const appStoreUrl = (app: AppData) => (app.appStoreId ? `https://apps.apple.com/app/id${app.appStoreId}` : undefined);

export const reviewUrl = (app: AppData) =>
  app.appStoreId ? `https://apps.apple.com/app/id${app.appStoreId}?action=write-review` : undefined;

export const iconUrl = (app: AppData) => app.icon ?? `/appstore/${app.appStoreId}/icon.webp`;

/** Icône PNG carrée, utilisée pour les aperçus de partage. */
export const iconPng = (app: AppData) => (app.icon ? app.icon.replace(/\.webp$/, '.png') : `/appstore/${app.appStoreId}/icon.png`);

/** Captures d'écran présentes dans public/appstore/<id>/<langue>/, dans l'ordre de l'App Store. */
export function screenshots(app: AppData, lang: Lang): string[] {
  if (!app.appStoreId) return [];
  for (const candidate of [lang, ...(lang === 'en' ? ['fr'] : ['en', 'fr'])]) {
    const dir = join(process.cwd(), 'public', 'appstore', app.appStoreId, candidate);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir)
      .filter((file) => /\.(webp|png|jpe?g)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (files.length) return files.map((file) => `/appstore/${app.appStoreId}/${candidate}/${file}`);
  }
  return [];
}

/** Récupère des captures par numéro (1…n), en ignorant celles qui n'existent pas. */
export function pickShots(app: AppData, lang: Lang, numbers: readonly number[] = []): string[] {
  const all = screenshots(app, lang);
  return numbers.map((n) => all[n - 1]).filter((shot): shot is string => Boolean(shot));
}

/**
 * Captures déjà encadrées propres à la page (public/images/apps/<slug>/<dossier>/<langue>/),
 * prioritaires sur celles de l'App Store : `tour` (une par fonctionnalité, dans l'ordre des
 * blocs) et `hero` (gauche, centre, droite).
 */
export function framedShots(app: AppData, lang: Lang, folder: 'tour' | 'hero'): string[] {
  for (const candidate of [lang, ...(lang === 'en' ? ['fr'] : ['en', 'fr'])]) {
    const dir = join(process.cwd(), 'public', 'images', 'apps', app.slug, folder, candidate);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir)
      .filter((file) => /\.(webp|png|jpe?g)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (files.length) return files.map((file) => `/images/apps/${app.slug}/${folder}/${candidate}/${file}`);
  }
  return [];
}

/** Captures du haut de page : celles encadrées (`hero`) si présentes, sinon `shots.hero`. */
export function heroShots(app: AppData, lang: Lang): string[] {
  const framed = framedShots(app, lang, 'hero');
  return framed.length === 3 ? framed : pickShots(app, lang, app.shots?.hero);
}

/** Capture affichée pour chaque bloc de fonctionnalité (voir `Feature.shot`), ou aucune si l'app n'en a pas. */
export function featureShots(app: AppData, lang: Lang): string[] {
  const framed = framedShots(app, lang, 'tour');
  if (framed.length) return app.features.map((_, index) => framed[index % framed.length]);
  const all = screenshots(app, lang);
  if (!all.length) return [];
  return app.features.map((feature, index) => {
    const n = typeof feature.shot === 'object' ? feature.shot[lang] : (feature.shot ?? index + 1);
    return all[n - 1] ?? all[index % all.length];
  });
}

export const rating = (app: AppData) => store(app)?.rating;

export const languagesOf = (app: AppData) => store(app)?.languages ?? app.languages ?? [];

/** Chiffres clés affichés sur la page d'accueil. */
export function portfolioStats() {
  let weighted = 0;
  let count = 0;
  const languages = new Set<string>();
  for (const app of liveApps) {
    const data = store(app);
    if (!data) continue;
    weighted += data.rating.average * data.rating.count;
    count += data.rating.count;
    data.languages.forEach((language) => languages.add(language));
  }
  return {
    apps: liveApps.length,
    average: count ? weighted / count : 0,
    count,
    /** Arrondi à la dizaine inférieure pour rester vrai entre deux synchronisations. */
    countRounded: Math.floor(count / 10) * 10,
    languages: languages.size,
  };
}

/** CSS custom properties d'une app, à placer dans un attribut style. */
export const themeStyle = (app: AppData) =>
  [
    `--accent:${app.theme.accent}`,
    `--grad-a:${app.theme.gradient[0]}`,
    `--grad-b:${app.theme.gradient[1]}`,
    `--glow:${app.theme.glow ?? app.theme.gradient[0]}`,
  ].join(';');
