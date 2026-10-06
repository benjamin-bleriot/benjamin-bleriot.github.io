import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { buildRedirects } from './src/data/redirects.mjs';

// Adresse publique du site. En déploiement, GitHub Actions fournit l'URL réelle
// (utile le jour où un nom de domaine personnalisé est ajouté).
const site = process.env.SITE_URL ?? 'https://benjamin-bleriot.github.io';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  redirects: buildRedirects(),
  integrations: [
    sitemap({
      // /rides/ et /trip/ sont des pages privées : hors du plan du site.
      filter: (page) => !/^\/(rides|trip)\//.test(new URL(page).pathname),
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US', de: 'de-DE' },
      },
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
