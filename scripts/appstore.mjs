#!/usr/bin/env node
/**
 * Synchronise les données publiques de l'App Store avec le site.
 *
 *   npm run appstore          → notes, versions et notes de version (src/data/appstore.json)
 *   npm run appstore:images   → idem + icônes, captures d'écran et badges (public/appstore/…)
 *
 * Toutes les apps publiées sous le compte développeur sont récupérées
 * automatiquement : il n'y a rien à déclarer ici quand une app est ajoutée.
 * En cas d'erreur réseau, les données existantes sont conservées et le script
 * se termine sans échec pour ne jamais bloquer un déploiement.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEVELOPER_ID = '1812098736';
/** Boutiques interrogées pour agréger les notes (la première sert aux textes FR, `us` aux textes EN, `de` aux textes DE). */
const STOREFRONTS = ['fr', 'us', 'de', 'gb', 'ca', 'be', 'ch', 'it', 'es', 'nl', 'at', 'lu', 'dk', 'jp', 'au'];
const LOCALE_STOREFRONT = { fr: 'fr', en: 'us', de: 'de' };
const BADGE_LOCALES = { fr: 'fr-fr', en: 'en-us', de: 'de-de' };
const SCREENSHOT_WIDTH = 600;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = join(root, 'src/data/appstore.json');
const publicDir = join(root, 'public/appstore');
const withImages = process.argv.includes('--images');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, { attempts = 3, as = 'json' } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'benjamin-bleriot-portfolio' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return as === 'json' ? await response.json() : Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      await sleep(600 * attempt);
    }
  }
  throw new Error(`${url} → ${lastError?.message ?? lastError}`);
}

/** Remplace le suffixe de taille d'une URL mzstatic (…/320x480bb.jpg) par une autre taille/format. */
const resize = (url, suffix) => url.replace(/\/[^/]+$/, `/${suffix}`);

async function lookup(storefront) {
  const url = `https://itunes.apple.com/lookup?id=${DEVELOPER_ID}&entity=software&country=${storefront}&limit=200`;
  const json = await fetchWithRetry(url);
  return json.results.filter((result) => result.wrapperType === 'software');
}

function localeData(app) {
  return {
    name: app.trackName,
    version: app.version,
    releaseNotes: app.releaseNotes ?? '',
    currentVersionReleaseDate: app.currentVersionReleaseDate,
    price: app.price ?? 0,
    formattedPrice: app.formattedPrice ?? '',
    url: app.trackViewUrl?.split('?')[0] ?? '',
  };
}

async function download(url, target) {
  const buffer = await fetchWithRetry(url, { as: 'buffer' });
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buffer);
}

async function downloadImages(app, byStorefront) {
  const id = String(app.trackId);
  const dir = join(publicDir, id);
  // PNG pour les aperçus de partage, WebP léger pour l'affichage.
  await download(resize(app.artworkUrl512, '512x512bb.png'), join(dir, 'icon.png'));
  await download(resize(app.artworkUrl512, '400x400bb.webp'), join(dir, 'icon.webp'));

  for (const [locale, storefront] of Object.entries(LOCALE_STOREFRONT)) {
    const source = byStorefront[storefront]?.get(id) ?? app;
    const shots = source.screenshotUrls ?? [];
    const localeDir = join(dir, locale);
    await rm(localeDir, { recursive: true, force: true });
    for (const [index, shot] of shots.entries()) {
      const name = `${String(index + 1).padStart(2, '0')}.webp`;
      await download(resize(shot, `${SCREENSHOT_WIDTH}x0w.webp`), join(localeDir, name));
    }
    console.log(`  ✓ ${app.trackName} — ${shots.length} captures (${locale})`);
  }
}

async function downloadBadges() {
  for (const [locale, code] of Object.entries(BADGE_LOCALES)) {
    const url = `https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/black/${code}?size=250x83`;
    await download(url, join(publicDir, `badge-${locale}.svg`));
  }
  console.log(`  ✓ Badges App Store officiels (${Object.keys(BADGE_LOCALES).join(', ')})`);
}

async function main() {
  const previous = existsSync(dataFile) ? JSON.parse(await readFile(dataFile, 'utf8')) : { apps: {} };
  const byStorefront = {};

  for (const storefront of STOREFRONTS) {
    try {
      const apps = await lookup(storefront);
      byStorefront[storefront] = new Map(apps.map((app) => [String(app.trackId), app]));
    } catch (error) {
      console.warn(`  ! Boutique ${storefront} ignorée : ${error.message}`);
    }
    await sleep(350);
  }

  const reference = byStorefront.fr ?? byStorefront.us;
  if (!reference) {
    console.warn('App Store injoignable : les données existantes sont conservées.');
    return;
  }

  const apps = {};
  for (const [id, app] of reference) {
    const ratings = {};
    let weighted = 0;
    let count = 0;
    for (const [storefront, map] of Object.entries(byStorefront)) {
      const entry = map.get(id);
      const ratingCount = entry?.userRatingCount ?? 0;
      if (!ratingCount) continue;
      ratings[storefront] = { average: Number(entry.averageUserRating.toFixed(3)), count: ratingCount };
      weighted += entry.averageUserRating * ratingCount;
      count += ratingCount;
    }

    const locales = {};
    for (const [locale, storefront] of Object.entries(LOCALE_STOREFRONT)) {
      const entry = byStorefront[storefront]?.get(id);
      locales[locale] = entry ? localeData(entry) : previous.apps?.[id]?.locales?.[locale] ?? localeData(app);
    }

    apps[id] = {
      bundleId: app.bundleId,
      releaseDate: app.releaseDate,
      minimumOsVersion: app.minimumOsVersion,
      languages: app.languageCodesISO2A ?? [],
      genre: app.primaryGenreName,
      fileSizeBytes: Number(app.fileSizeBytes ?? 0),
      rating: {
        average: count ? Number((weighted / count).toFixed(3)) : 0,
        count,
        storefronts: ratings,
      },
      locales,
    };

    if (withImages) {
      try {
        await downloadImages(app, byStorefront);
      } catch (error) {
        console.warn(`  ! Images de ${app.trackName} non mises à jour : ${error.message}`);
      }
    }
  }

  if (withImages) {
    try {
      await downloadBadges();
    } catch (error) {
      console.warn(`  ! Badges non mis à jour : ${error.message}`);
    }
  }

  const output = { developerId: DEVELOPER_ID, fetchedAt: new Date().toISOString(), apps };
  await mkdir(dirname(dataFile), { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(output, null, 2)}\n`);

  for (const [id, app] of Object.entries(apps)) {
    const { average, count } = app.rating;
    console.log(`  ${app.locales.fr.name} (${id}) — v${app.locales.fr.version}, ${average.toFixed(2)}★ sur ${count} notes`);
  }
  console.log(`Données App Store enregistrées dans ${dataFile.replace(`${root}/`, '')}`);
}

main().catch((error) => {
  console.warn(`Synchronisation App Store impossible : ${error.message}`);
  console.warn('Les données existantes sont conservées.');
});
