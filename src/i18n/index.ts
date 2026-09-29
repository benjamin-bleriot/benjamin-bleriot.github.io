import type { Lang } from '../data/types';
import { ui, type UIKey } from './ui';

export type { Lang };

/** Traduit une clé d'interface, avec variables optionnelles : t('app.ratings', { n: 12 }). */
export function useTranslations(lang: Lang) {
  return (key: UIKey, vars: Record<string, string | number> = {}) =>
    (ui[lang][key] as string).replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`));
}

/** Chemin d'une page dans une langue : '/jogr/' → '/en/jogr/'. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return lang === 'fr' ? clean : `/en${clean === '/' ? '/' : clean}`;
}

export const otherLang = (lang: Lang): Lang => (lang === 'fr' ? 'en' : 'fr');

export const htmlLang = (lang: Lang) => (lang === 'fr' ? 'fr-FR' : 'en-US');

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
