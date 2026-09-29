# Benjamin Blériot — apps iPhone

Portfolio et pages officielles des apps iOS de Benjamin Blériot : présentation,
confidentialité, conditions d’utilisation et assistance, en français et en anglais.

Site statique généré avec [Astro](https://astro.build), publié sur GitHub Pages :
**https://benjamin-bleriot.github.io**

## Adresses

Chaque app dispose de quatre pages, en français et en anglais (préfixe `/en/`) :

| Page | Français | Anglais |
| --- | --- | --- |
| Présentation | `/flipseven/` | `/en/flipseven/` |
| Confidentialité | `/flipseven/privacy/` | `/en/flipseven/privacy/` |
| Conditions d’utilisation | `/flipseven/terms/` | `/en/flipseven/terms/` |
| Assistance | `/flipseven/support/` | `/en/flipseven/support/` |

Apps : `skyjo`, `flipseven`, `jogr`, `budgy`, `lumi` (bientôt).
Mentions légales : `/legal/`. Des raccourcis redirigent aussi vers la bonne page
(`/flip/`, `/skyjokeeper/`, `/expensestracker/`, `/storychild/`…).

### À renseigner dans App Store Connect

App Store Connect accepte une URL par langue : utilisez la version française pour le
français et la version `/en/` pour les autres langues.

| App | Politique de confidentialité | Assistance |
| --- | --- | --- |
| Skyjo Keeper | https://benjamin-bleriot.github.io/skyjo/privacy/ | https://benjamin-bleriot.github.io/skyjo/support/ |
| Flip | https://benjamin-bleriot.github.io/flipseven/privacy/ | https://benjamin-bleriot.github.io/flipseven/support/ |
| Jogr | https://benjamin-bleriot.github.io/jogr/privacy/ | https://benjamin-bleriot.github.io/jogr/support/ |
| Budgy | https://benjamin-bleriot.github.io/budgy/privacy/ | https://benjamin-bleriot.github.io/budgy/support/ |

Pour Budgy (abonnement), ajoutez aussi le lien des conditions d’utilisation dans la
description : https://benjamin-bleriot.github.io/budgy/terms/

## Développement

Node.js 22.12 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # vérifie les types puis génère dist/
npm run preview    # prévisualise dist/
```

## Modifier le contenu

Tout le contenu éditable est dans `src/data/` :

| Fichier | Contenu |
| --- | --- |
| `apps.ts` | Les apps : textes FR/EN, fonctionnalités, FAQ, avis, tarifs, couleurs, pratiques de données |
| `site.ts` | Nom, e-mail, liens, boîte à outils, projets open source |
| `legal/privacy.ts` | Modèle de politique de confidentialité (assemblé selon les pratiques de chaque app) |
| `legal/terms.ts` | Modèle de conditions d’utilisation |
| `redirects.mjs` | Raccourcis et anciennes adresses |
| `appstore.json` | Généré automatiquement — ne pas modifier à la main |

Les textes de l’interface (boutons, titres de sections) sont dans `src/i18n/ui.ts`.

### Politiques de confidentialité

Chaque app déclare ce qu’elle fait réellement dans `privacy.practices` :

| Pratique | Quand l’utiliser |
| --- | --- |
| `revenuecat` | Achats intégrés gérés avec RevenueCat |
| `storekit` | Achats intégrés vérifiés uniquement avec StoreKit |
| `icloud-sync` | Synchronisation CloudKit (base privée de l’utilisateur) |
| `camera-on-device` | Photo analysée sur l’appareil (Apple Intelligence) |
| `camera-pcc` | Photo analysée par Apple Intelligence, éventuellement via Private Cloud Compute |
| `notifications` | Notifications locales |
| `story-generation` | Contenu généré en ligne à partir des choix de l’utilisateur |
| `speech` | Lecture à voix haute par les voix d’iOS |
| `external-links` | Liens vers des sites externes |

La politique est alors rédigée automatiquement en français et en anglais. Pensez à
mettre à jour `privacy.updated` à chaque changement, et à ajouter la pratique
correspondante avant de publier une nouvelle fonction (par exemple `camera-pcc` pour
Skyjo Keeper le jour où le calcul du score par photo sort).

### Ajouter une app

1. Dans `src/data/apps.ts`, copiez le bloc d’une app existante et changez `slug`,
   `appStoreId`, `bundleId`, les textes et les couleurs (`theme`).
2. Récupérez l’icône et les captures d’écran :
   ```bash
   npm run appstore:images
   ```
3. Choisissez les captures de la carte d’accueil et du haut de page (`shots`).
4. `npm run dev` pour vérifier, puis poussez sur `main`.

Pour une app pas encore publiée, utilisez `status: 'soon'` et placez l’icône dans
`public/images/apps/<slug>/icon.webp` (+ `icon.png`). `hidden: true` masque une app
du site sans supprimer ses données.

⚠️ N’utilisez pas comme `slug` le nom d’un dépôt GitHub qui publie son propre site
Pages (`flip-score`, `komoot-to-gpx`, `jogr-ios`) : GitHub servirait ce dépôt à la place.

## Données App Store

`npm run appstore` interroge l’App Store (15 pays) et enregistre dans
`src/data/appstore.json` les notes, le nombre d’avis, la version et les nouveautés de
chaque app du compte développeur. `npm run appstore:images` télécharge en plus les
icônes, les captures (FR et EN) et les badges officiels dans `public/appstore/`.

Le déploiement exécute `npm run appstore` automatiquement, et le site est reconstruit
chaque lundi : les notes et versions restent à jour sans intervention. Les images, elles,
sont versionnées : relancez `npm run appstore:images` puis commitez après avoir changé
les captures sur l’App Store.

L’image de partage de l’accueil (`public/og.png`, `public/og-en.png`) se régénère avec
`python3 scripts/og.py` (nécessite Pillow).

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui compile le site et
le publie sur GitHub Pages (Settings › Pages › Source : **GitHub Actions**).

### Nom de domaine personnalisé

1. Settings › Pages › Custom domain : saisissez le domaine.
2. Ajoutez chez votre registrar les enregistrements DNS indiqués par GitHub.
3. Créez `public/CNAME` contenant uniquement le domaine, puis poussez.

Les URL canoniques, le plan du site et `robots.txt` suivent automatiquement l’adresse
fournie par GitHub Pages.

## Confidentialité du site

Aucun cookie, aucune mesure d’audience, aucune ressource externe : les polices et les
images sont servies par le site lui-même.
