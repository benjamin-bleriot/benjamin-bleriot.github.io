import type { IconName } from '../components/icons';

export type Lang = 'fr' | 'en';
export const LANGS: Lang[] = ['fr', 'en'];

/** Un texte disponible en français et en anglais. */
export type Text = Record<Lang, string>;

export interface Feature {
  icon: IconName;
  title: Text;
  text: Text;
}

export interface Step {
  title: Text;
  text: Text;
}

export interface Faq {
  q: Text;
  a: Text;
}

/** Avis réel de l'App Store (texte d'origine + traduction). */
export interface Review {
  title: Text;
  text: Text;
  author: string;
  rating: number;
  /** Langue d'origine de l'avis. */
  original: Lang;
}

/**
 * Pratiques de données utilisées pour générer automatiquement
 * la politique de confidentialité (voir src/data/legal/privacy.ts).
 */
export type DataPractice =
  | 'icloud-sync'
  | 'revenuecat'
  | 'storekit'
  | 'camera-on-device'
  | 'camera-pcc'
  | 'notifications'
  | 'story-generation'
  | 'speech'
  | 'external-links';

export type TermsClause = 'no-financial-advice' | 'ai-content';

export interface AppTheme {
  /** Couleur principale (liens, boutons) — doit rester lisible sur fond clair et sombre. */
  accent: string;
  /** Dégradé des cartes et du halo : [clair, foncé]. */
  gradient: [string, string];
  /** Couleur de lueur secondaire (facultative). */
  glow?: string;
}

export interface AppData {
  /** Adresse de la page : /slug/ */
  slug: string;
  status: 'live' | 'soon';
  /** Masque l'app du site sans supprimer ses données. */
  hidden?: boolean;
  appStoreId?: string;
  bundleId: string;
  /** Icône hors App Store (sinon récupérée automatiquement). */
  icon?: string;

  name: string;
  category: Text;
  tagline: Text;
  eyebrow: Text;
  headline: Text;
  lead: Text;
  highlights: { icon: IconName; label: Text }[];
  features: Feature[];
  steps?: Step[];
  pricing?: {
    model: 'lifetime' | 'subscription';
    free: Text[];
    premium: Text[];
    premiumName: Text;
  };
  faq: Faq[];
  reviews: Review[];
  theme: AppTheme;

  /** Captures (numéros 1…n) utilisées pour la carte d'accueil et le haut de page. */
  shots?: { card: [number, number]; hero: [number, number, number] };
  requirements: Text;
  /** Langues (si l'app n'est pas encore sur l'App Store). */
  languages?: string[];
  contactEmail: string;
  /** Mention de marque pour les compagnons de jeux de société. */
  trademark?: Text;

  /** Ce que l'utilisateur saisit dans l'app (utilisé dans la politique de confidentialité). */
  userData: Text;
  privacy: {
    updated: string;
    practices: DataPractice[];
    draft?: boolean;
  };
  terms: {
    updated: string;
    /** Description courte utilisée dans l'article « Objet ». */
    purpose: Text;
    purchases: 'lifetime' | 'subscription' | 'none';
    clauses?: TermsClause[];
    draft?: boolean;
  };
  supportFaq?: Faq[];
}
