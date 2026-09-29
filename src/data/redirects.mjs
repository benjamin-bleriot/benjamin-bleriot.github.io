/**
 * Anciennes adresses et raccourcis → nouvelles pages.
 * Chaque alias est décliné automatiquement pour la page de l'app et ses
 * sous-pages (confidentialité, conditions, assistance), en français et en anglais.
 *
 * ⚠️ N'utilisez jamais le nom d'un dépôt GitHub qui publie son propre site
 * (flip-score, komoot-to-gpx, jogr-ios…) : GitHub Pages le servirait à la place.
 */
export const aliases = {
  flip: 'flipseven',
  'flip-7': 'flipseven',
  flip7: 'flipseven',
  skyjokeeper: 'skyjo',
  'skyjo-keeper': 'skyjo',
  expensestracker: 'budgy',
  storychild: 'lumi',
};

/** Pages de l'ancien site (août 2026) renommées. */
const legacySlugs = {
  'flip-7-score': 'flipseven',
  'skyjo-keeper': 'skyjo',
  jogr: 'jogr',
  budgy: 'budgy',
};

const subpages = ['', 'privacy/', 'terms/', 'support/'];
const prefixes = ['', 'en/'];

export function buildRedirects() {
  /** @type {Record<string, string>} */
  const redirects = {};

  for (const [alias, slug] of Object.entries(aliases)) {
    for (const prefix of prefixes) {
      for (const sub of subpages) {
        redirects[`/${prefix}${alias}/${sub}`] = `/${prefix}${slug}/${sub}`;
      }
    }
  }

  for (const [old, slug] of Object.entries(legacySlugs)) {
    redirects[`/apps/${old}/`] = `/${slug}/`;
    redirects[`/privacy/${old}/`] = `/${slug}/privacy/`;
    redirects[`/terms/${old}/`] = `/${slug}/terms/`;
    redirects[`/changelog/${old}/`] = `/${slug}/`;
  }

  return redirects;
}
