import { LANGS, type Lang } from '../data/types';
import { ui, type UIKey } from './ui';

export type { Lang };
export { LANGS };

/** Nom de chaque langue, écrit dans cette langue (sélecteur de langue). */
export const LANG_NAMES: Record<Lang, string> = { fr: 'Français', en: 'English', de: 'Deutsch' };

/** Traduit une clé d'interface, avec variables optionnelles : t('app.ratings', { n: 12 }). */
export function useTranslations(lang: Lang) {
  return (key: UIKey, vars: Record<string, string | number> = {}) =>
    (ui[lang][key] as string).replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

/** Chemin d'une page dans une langue : '/jogr/' → '/en/jogr/' ou '/de/jogr/'. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === 'fr' ? clean : `/${lang}${clean}`;
}

/** Les autres langues du site, dans l'ordre d'affichage. */
export const otherLangs = (lang: Lang): Lang[] => LANGS.filter((other) => other !== lang);

const HTML_LANGS: Record<Lang, string> = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' };
export const htmlLang = (lang: Lang) => HTML_LANGS[lang];

export function formatDate(iso: string, lang: Lang, options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }) {
  return new Intl.DateTimeFormat(htmlLang(lang), { timeZone: 'UTC', ...options }).format(new Date(iso));
}

export function formatNumber(value: number, lang: Lang, digits = 0) {
  return new Intl.NumberFormat(htmlLang(lang), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Note arrondie à une décimale, affichée « 4,7 » ou « 4.7 ». */
export const formatRating = (value: number, lang: Lang) => formatNumber(Math.round(value * 10) / 10, lang, 1);
