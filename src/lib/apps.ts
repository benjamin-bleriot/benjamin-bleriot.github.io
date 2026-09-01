import fs from 'node:fs';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';

export type AppEntry = CollectionEntry<'apps'>;
export type Screenshot = AppEntry['data']['screenshots'][number];

const imageExtensions = new Set(['.avif', '.webp', '.png', '.jpg', '.jpeg']);

export function appPath(slug: string) {
  return `/apps/${slug}/`;
}

export function getAppIcon(app: AppEntry): string | undefined {
  if (app.data.icon && publicFileExists(app.data.icon)) return app.data.icon;

  for (const filename of ['icon.webp', 'icon.png', 'icon.jpg']) {
    const publicPath = `/images/apps/${app.data.slug}/${filename}`;
    if (publicFileExists(publicPath)) return publicPath;
  }

  return undefined;
}

export function getAppScreenshots(app: AppEntry): Screenshot[] {
  const declared = app.data.screenshots.filter(({ image }) => publicFileExists(image));
  const screenshotDirectory = path.join(process.cwd(), 'public', 'images', 'apps', app.data.slug, 'screenshots');

  if (!fs.existsSync(screenshotDirectory)) return declared;

  const declaredPaths = new Set(declared.map(({ image }) => image));
  const discovered = fs
    .readdirSync(screenshotDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => ({
      image: `/images/apps/${app.data.slug}/screenshots/${entry.name}`,
      alt: `Capture d’écran de ${app.data.name}`,
    }))
    .filter(({ image }) => !declaredPaths.has(image))
    .sort((a, b) => a.image.localeCompare(b.image, undefined, { numeric: true }));

  return [...declared, ...discovered];
}

function publicFileExists(publicPath: string): boolean {
  if (!publicPath.startsWith('/')) return false;
  return fs.existsSync(path.join(process.cwd(), 'public', publicPath.slice(1)));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
