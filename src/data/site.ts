import type { Text } from './types';

/** Informations générales sur le site et son auteur. */
export const site = {
  author: 'Benjamin Blériot',
  initials: 'BB',
  email: 'benjamin.bleriot.pro@gmail.com',
  github: 'https://github.com/benjamin-bleriot',
  appStoreDeveloper: 'https://apps.apple.com/developer/benjamin-bleriot/id1812098736',
  /** Photo de profil facultative, ex. '/images/avatar.jpg' (sinon, monogramme). */
  avatar: '',
  role: {
    fr: 'Développeur iOS',
    en: 'iOS developer',
  } satisfies Text,
  stack: ['Swift', 'SwiftUI', 'SwiftData', 'CloudKit', 'StoreKit', 'Foundation Models', 'Kotlin', 'Jetpack Compose'],
};

/** Projets open source présentés en bas de la page d'accueil. */
export const projects: {
  name: string;
  kind: Text;
  description: Text;
  url: string;
  repo: string;
}[] = [
  {
    name: 'Komoot → GPX',
    kind: { fr: 'Outil web', en: 'Web tool' },
    description: {
      fr: 'Collez le lien d’un itinéraire Komoot public et récupérez son fichier GPX. Sans serveur, sans collecte de données.',
      en: 'Paste a public Komoot route link and download its GPX file. No server, no data collected.',
    },
    url: 'https://benjamin-bleriot.github.io/komoot-to-gpx/',
    repo: 'https://github.com/benjamin-bleriot/komoot-to-gpx',
  },
  {
    name: 'Komoot Private GPX Export',
    kind: { fr: 'Extension Chrome', en: 'Chrome extension' },
    description: {
      fr: 'Ajoute un bouton « Exporter en GPX » aux tours Komoot que votre compte peut exporter, y compris vos tours privés.',
      en: 'Adds an “Export GPX” button to the Komoot tours your account can export, including your private tours.',
    },
    url: 'https://github.com/benjamin-bleriot/komoot-private-gpx-extension',
    repo: 'https://github.com/benjamin-bleriot/komoot-private-gpx-extension',
  },
];
