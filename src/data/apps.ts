import type { AppData } from './types';

/**
 * Les apps présentées sur le site, dans l'ordre d'affichage.
 *
 * Pour ajouter une app : copiez un bloc, changez `slug`, `appStoreId` et les textes,
 * puis lancez `npm run appstore:images` pour récupérer l'icône et les captures.
 * Les pages /slug/, /slug/privacy/, /slug/terms/ et /slug/support/ sont créées
 * automatiquement, en français et en anglais (/en/slug/…).
 */
const UPDATED = '2026-09-29';
const EMAIL = 'benjamin.bleriot.pro@gmail.com';

export const apps: AppData[] = [
  // ─────────────────────────────────────────────────────────── Skyjo Keeper
  {
    slug: 'skyjo',
    status: 'live',
    appStoreId: '6754793003',
    bundleId: 'com.benjaminbleriot.skyjokeeper',
    name: 'Skyjo Keeper',
    category: { fr: 'Jeux', en: 'Games' },
    tagline: { fr: 'Le compteur de points pour Skyjo', en: 'The score keeper for Skyjo' },
    eyebrow: { fr: 'Soirées Skyjo', en: 'Skyjo nights' },
    headline: { fr: 'Comptez moins.<br>Jouez plus.', en: 'Count less.<br>Play more.' },
    lead: {
      fr: 'Ajoutez vos joueurs, saisissez les points de chaque manche : Skyjo Keeper calcule les totaux, tient le classement et annonce le vainqueur. Fini la feuille de score égarée et les calculs de fin de soirée.',
      en: 'Add your players and enter each round’s points: Skyjo Keeper adds up the totals, keeps the leaderboard and crowns the winner. No more lost score sheets or late-night maths.',
    },
    highlights: [
      { icon: 'users', label: { fr: '2 à 8 joueurs', en: '2 to 8 players' } },
      { icon: 'wifi-off', label: { fr: 'Fonctionne hors ligne', en: 'Works offline' } },
      { icon: 'moon', label: { fr: 'Mode sombre', en: 'Dark mode' } },
    ],
    features: [
      {
        icon: 'users',
        title: { fr: 'De 2 à 8 joueurs', en: 'From 2 to 8 players' },
        text: {
          fr: 'Une partie à deux ou autour d’une grande tablée : ajoutez les joueurs et lancez-vous en quelques secondes.',
          en: 'A game for two or a big table of friends: add your players and start in seconds.',
        },
      },
      {
        icon: 'trophy',
        title: { fr: 'Classement en temps réel', en: 'Live leaderboard' },
        text: {
          fr: 'Totaux et classement se mettent à jour après chaque manche, et la victoire est célébrée comme il se doit.',
          en: 'Totals and rankings update after every round, and every victory gets the celebration it deserves.',
        },
      },
      {
        icon: 'target',
        title: { fr: 'Score cible au choix', en: 'Custom target score' },
        text: {
          fr: 'Fixez le score qui met fin à la partie selon vos habitudes de jeu.',
          en: 'Choose the score that ends the game, to match the way you play.',
        },
      },
      {
        icon: 'double',
        title: { fr: 'Règle du score doublé', en: 'Doubled-score rule' },
        text: {
          fr: 'Activez l’option « Doubler le score de fin de manche » et la pénalité est appliquée automatiquement.',
          en: 'Turn on the end-of-round doubling option and the penalty is applied for you.',
        },
      },
      {
        icon: 'history',
        title: { fr: 'Historique des manches', en: 'Round history' },
        text: {
          fr: 'Retrouvez chaque manche, corrigez un score saisi trop vite et revivez les retournements de situation.',
          en: 'Review every round, fix a score entered too quickly and relive the comebacks.',
        },
      },
      {
        icon: 'repeat',
        title: { fr: 'Revanche en un geste', en: 'One-tap rematch' },
        text: {
          fr: 'Relancez une partie identique, avec les mêmes joueurs et les mêmes règles.',
          en: 'Start an identical game again, with the same players and the same rules.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Ajoutez vos joueurs', en: 'Add your players' },
        text: { fr: 'Entre 2 et 8, avec le score cible de votre choix.', en: 'Between 2 and 8, with the target score you want.' },
      },
      {
        title: { fr: 'Saisissez les points', en: 'Enter the points' },
        text: { fr: 'Manche après manche, en quelques touches.', en: 'Round after round, in just a few taps.' },
      },
      {
        title: { fr: 'Laissez l’app compter', en: 'Let the app count' },
        text: { fr: 'Totaux, classement et fin de partie sont automatiques.', en: 'Totals, rankings and the end of the game are automatic.' },
      },
    ],
    pricing: {
      model: 'lifetime',
      premiumName: { fr: 'Version illimitée', en: 'Unlimited version' },
      free: [
        { fr: 'Une partie par jour', en: 'One game per day' },
        { fr: 'Score cible jusqu’à 100 points', en: 'Target score up to 100 points' },
      ],
      premium: [
        { fr: 'Parties illimitées', en: 'Unlimited games' },
        { fr: 'Tous les scores cibles', en: 'All target scores' },
        { fr: 'Achat unique, accès à vie', en: 'One-time purchase, lifetime access' },
      ],
    },
    faq: [
      {
        q: { fr: 'Skyjo Keeper est-il gratuit ?', en: 'Is Skyjo Keeper free?' },
        a: {
          fr: 'Oui. La version gratuite permet une partie par jour, avec un score cible jusqu’à 100 points. Un achat unique débloque les parties illimitées et tous les scores cibles, à vie et sans abonnement.',
          en: 'Yes. The free version lets you play one game per day with a target score of up to 100 points. A one-time purchase unlocks unlimited games and every target score, for life and with no subscription.',
        },
      },
      {
        q: { fr: 'Faut-il un compte ou une connexion Internet ?', en: 'Do I need an account or an internet connection?' },
        a: {
          fr: 'Non. Aucun compte n’est nécessaire et vos parties sont enregistrées sur votre iPhone. Une connexion n’est utile que pour effectuer ou restaurer un achat.',
          en: 'No. There is no account and your games are saved on your iPhone. A connection is only needed to make or restore a purchase.',
        },
      },
      {
        q: { fr: 'Puis-je corriger un score saisi par erreur ?', en: 'Can I fix a score I entered by mistake?' },
        a: {
          fr: 'Oui. Depuis l’historique, vous pouvez modifier les scores d’une manche : les totaux et le classement sont recalculés.',
          en: 'Yes. From the history you can edit a round’s scores, and the totals and rankings are recalculated.',
        },
      },
      {
        q: { fr: 'Les règles du jeu sont-elles disponibles dans l’app ?', en: 'Are the game rules available in the app?' },
        a: {
          fr: 'Oui, un rappel des règles de Skyjo est accessible directement depuis l’app.',
          en: 'Yes, a summary of the Skyjo rules is available right inside the app.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-il ?', en: 'Which devices are supported?' },
        a: {
          fr: 'Sur iPhone, avec iOS 18 ou une version ultérieure.',
          en: 'iPhone, running iOS 18 or later.',
        },
      },
    ],
    reviews: [
      {
        title: { fr: 'Très utile', en: 'Very useful' },
        text: {
          fr: 'Application qui simplifie le côté rébarbatif du comptage des points. En prime, Benjamin le développeur est incroyablement réactif. Bravo !',
          en: 'An app that takes the tedium out of counting points. On top of that, Benjamin the developer is incredibly responsive. Well done!',
        },
        author: 'Dolby01',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Très pratique pour les points', en: 'Great for keeping score' },
        text: {
          fr: 'Le compteur de points que j’attendais pour jouer au Skyjo. La famille est comblée et le suivi des points n’est plus une corvée.',
          en: 'The score keeper I was waiting for to play Skyjo. The whole family loves it and keeping score is no longer a chore.',
        },
        author: 'DomBook78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Au top', en: 'Top notch' },
        text: {
          fr: 'Le must have des soirées Skyjo. Plus besoin de se prendre la tête à tout compter. Et ça permet de détecter les tricheurs ahah',
          en: 'A must-have for Skyjo nights. No more headaches counting everything. And it helps catch the cheaters, haha',
        },
        author: 'SgrGhost78',
        rating: 5,
        original: 'fr',
      },
    ],
    theme: { accent: '#7048e8', gradient: ['#8b5cf6', '#3b1c9c'], glow: '#35c4c0' },
    shots: { card: [2, 4], hero: [3, 2, 4] },
    requirements: { fr: 'iOS 18 ou ultérieur', en: 'iOS 18 or later' },
    contactEmail: 'contact.skyjokeeper@gmail.com',
    trademark: {
      fr: 'Skyjo est une marque de Magilano GmbH. Skyjo Keeper est une application indépendante, qui n’est ni affiliée à Magilano ni approuvée par Magilano.',
      en: 'Skyjo is a trademark of Magilano GmbH. Skyjo Keeper is an independent app, not affiliated with or endorsed by Magilano.',
    },
    userData: {
      fr: 'les noms des joueurs, les scores, les manches et l’historique de vos parties',
      en: 'player names, scores, rounds and your game history',
    },
    privacy: { updated: UPDATED, practices: ['revenuecat'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui aide à compter les points pendant les parties du jeu de cartes Skyjo',
        en: 'an iOS app that helps you keep score during games of the Skyjo card game',
      },
      purchases: 'lifetime',
    },
  },

  // ─────────────────────────────────────────────────────────── Flip
  {
    slug: 'flipseven',
    status: 'live',
    appStoreId: '6760317673',
    bundleId: 'com.benjaminbleriot.flipseven',
    name: 'Flip',
    category: { fr: 'Jeux', en: 'Games' },
    tagline: { fr: 'Le compteur de points pour Flip 7', en: 'The score keeper for Flip 7' },
    eyebrow: { fr: 'Soirées Flip 7', en: 'Flip 7 nights' },
    headline: { fr: 'Retournez les cartes.<br>Flip compte.', en: 'You flip the cards.<br>Flip does the math.' },
    lead: {
      fr: 'Le compteur conçu spécialement pour Flip 7. Touchez les cartes de chaque joueur : bonus, multiplicateur ×2 et Flip 7 sont calculés pour vous, et le classement évolue en direct jusqu’aux 200 points.',
      en: 'The score keeper built specifically for Flip 7. Tap each player’s cards and Flip handles the bonuses, the ×2 multiplier and the Flip 7 bonus, with a live leaderboard all the way to 200 points.',
    },
    highlights: [
      { icon: 'sparkles', label: { fr: 'Bonus Flip 7 automatique', en: 'Automatic Flip 7 bonus' } },
      { icon: 'bolt', label: { fr: 'Classique & Vengeance', en: 'Classic & Vengeance' } },
      { icon: 'user-off', label: { fr: 'Sans compte', en: 'No account' } },
    ],
    features: [
      {
        icon: 'cards',
        title: { fr: 'Saisie guidée des cartes', en: 'Guided card entry' },
        text: {
          fr: 'Touchez les cartes de 0 à 12, ajoutez les bonus de +2 à +10 et le multiplicateur ×2 : le score se calcule tout seul.',
          en: 'Tap cards from 0 to 12, add +2 to +10 bonuses and the ×2 multiplier, and the score adds itself up.',
        },
      },
      {
        icon: 'sparkles',
        title: { fr: 'Flip 7 détecté', en: 'Flip 7 detection' },
        text: {
          fr: 'Sept cartes différentes ? Les 15 points de bonus sont ajoutés aussitôt, avec un badge et un compteur par joueur.',
          en: 'Seven different cards? The 15-point bonus is added instantly, with a badge and a counter for each player.',
        },
      },
      {
        icon: 'bolt',
        title: { fr: 'Mode Vengeance', en: 'Vengeance mode' },
        text: {
          fr: 'Cartes de 0 à 13, divisions et malus : la variante Vengeance est entièrement prise en charge.',
          en: 'Cards from 0 to 13, dividers and penalties: the Vengeance variant is fully supported.',
        },
      },
      {
        icon: 'trophy',
        title: { fr: 'Course aux 200 points', en: 'Race to 200' },
        text: {
          fr: 'Le classement se met à jour après chaque tour et la partie s’arrête d’elle-même à 200 points, confettis compris.',
          en: 'The leaderboard updates after every turn and the game ends on its own at 200 points, confetti included.',
        },
      },
      {
        icon: 'history',
        title: { fr: 'Historique des scores', en: 'Score history' },
        text: {
          fr: 'Retrouvez chaque manche et les cartes jouées. Un appui long permet de corriger ou de supprimer un score.',
          en: 'Review every round and the cards played. Press and hold to edit or delete a score.',
        },
      },
      {
        icon: 'repeat',
        title: { fr: 'Revanche immédiate', en: 'Instant rematch' },
        text: {
          fr: 'Relancez la même partie, dupliquez-la ou retrouvez vos joueurs enregistrés pour démarrer plus vite.',
          en: 'Replay the same game, duplicate it or pick your saved players to get started faster.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Ajoutez les joueurs', en: 'Add the players' },
        text: { fr: 'Vos joueurs habituels sont mémorisés.', en: 'Your regular players are remembered.' },
      },
      {
        title: { fr: 'Touchez les cartes', en: 'Tap the cards' },
        text: { fr: 'Bonus, ×2 et Flip 7 sont calculés pour vous.', en: 'Bonuses, ×2 and Flip 7 are worked out for you.' },
      },
      {
        title: { fr: 'Suivez la course', en: 'Follow the race' },
        text: { fr: 'Le classement évolue en direct jusqu’à 200.', en: 'The leaderboard updates live up to 200.' },
      },
    ],
    pricing: {
      model: 'lifetime',
      premiumName: { fr: 'Premium à vie', en: 'Lifetime Premium' },
      free: [{ fr: 'Une partie d’essai pour découvrir l’app', en: 'One trial game to discover the app' }],
      premium: [
        { fr: 'Parties illimitées', en: 'Unlimited games' },
        { fr: 'Mode Vengeance', en: 'Vengeance mode' },
        { fr: 'Achat unique, sans abonnement', en: 'One-time purchase, no subscription' },
      ],
    },
    faq: [
      {
        q: { fr: 'Flip est-elle gratuite ?', en: 'Is Flip free?' },
        a: {
          fr: 'Vous pouvez créer une partie d’essai gratuitement. Le Premium, en achat unique, débloque les parties illimitées et le mode Vengeance, à vie et sans abonnement.',
          en: 'You can create a trial game for free. Premium, a one-time purchase, unlocks unlimited games and Vengeance mode, for life and with no subscription.',
        },
      },
      {
        q: { fr: 'Comment le bonus Flip 7 est-il calculé ?', en: 'How is the Flip 7 bonus calculated?' },
        a: {
          fr: 'Dès qu’un joueur a sept cartes numérotées différentes, l’app ajoute automatiquement les 15 points de bonus et incrémente son compteur de Flip 7.',
          en: 'As soon as a player has seven different number cards, the app automatically adds the 15-point bonus and increases their Flip 7 counter.',
        },
      },
      {
        q: { fr: 'Le mode Vengeance est-il pris en charge ?', en: 'Is Vengeance mode supported?' },
        a: {
          fr: 'Oui. Les cartes de 0 à 13 et les cartes spéciales (divisions, malus, carte Zéro) sont gérées par le calcul du score.',
          en: 'Yes. Cards from 0 to 13 and the special cards (dividers, penalties, the Zero card) are all handled by the score calculation.',
        },
      },
      {
        q: { fr: 'Mes parties sont-elles sauvegardées ?', en: 'Are my games saved?' },
        a: {
          fr: 'Oui, tout l’historique est enregistré sur votre iPhone, sans compte. Vous pouvez reprendre une partie en cours à tout moment.',
          en: 'Yes, your whole history is saved on your iPhone, with no account. You can resume a game in progress at any time.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-elle ?', en: 'Which devices are supported?' },
        a: { fr: 'Sur iPhone, avec iOS 26 ou une version ultérieure.', en: 'iPhone, running iOS 26 or later.' },
      },
    ],
    reviews: [
      {
        title: { fr: 'Très bien !', en: 'Very good!' },
        text: {
          fr: 'Application qui fonctionne bien avec un design clair et sympa.',
          en: 'Works well, with a clear and friendly design.',
        },
        author: 'SgrGhost78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Top', en: 'Great' },
        text: {
          fr: 'Application pratique qui fonctionne bien ! Le fait qu’il retienne le nom après l’enregistrement, c’est génial pour créer des parties avec différents groupes d’amis 🥳',
          en: 'A handy app that works well! Remembering names once saved is great for setting up games with different groups of friends 🥳',
        },
        author: 'Erasmus974',
        rating: 4,
        original: 'fr',
      },
      {
        title: { fr: 'Super', en: 'Super' },
        text: { fr: 'Hyper pratique !', en: 'Super handy!' },
        author: 'Vivi le petit radis',
        rating: 4,
        original: 'fr',
      },
    ],
    theme: { accent: '#0b9aa3', gradient: ['#1cc3c4', '#07606b'], glow: '#7df0e6' },
    shots: { card: [2, 1], hero: [3, 2, 4] },
    requirements: { fr: 'iOS 26 ou ultérieur', en: 'iOS 26 or later' },
    contactEmail: EMAIL,
    trademark: {
      fr: 'Flip 7 est une marque de The Op Games. Flip est une application indépendante, qui n’est ni affiliée à The Op Games ni approuvée par The Op Games.',
      en: 'Flip 7 is a trademark of The Op Games. Flip is an independent app, not affiliated with or endorsed by The Op Games.',
    },
    userData: {
      fr: 'les noms des joueurs, les scores, les cartes jouées et l’historique de vos parties',
      en: 'player names, scores, the cards played and your game history',
    },
    privacy: { updated: UPDATED, practices: ['revenuecat', 'camera-on-device', 'external-links'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui aide à compter les points pendant les parties du jeu de cartes Flip 7',
        en: 'an iOS app that helps you keep score during games of the Flip 7 card game',
      },
      purchases: 'lifetime',
    },
  },

  // ─────────────────────────────────────────────────────────── Jogr
  {
    slug: 'jogr',
    status: 'live',
    appStoreId: '6745412690',
    bundleId: 'com.benjaminbleriot.jogr',
    name: 'Jogr',
    category: { fr: 'Forme et santé', en: 'Health & Fitness' },
    tagline: { fr: 'Votre calendrier de courses', en: 'Your race calendar' },
    eyebrow: { fr: 'Saison de course', en: 'Race season' },
    headline: { fr: 'Toute votre saison,<br>d’un seul coup d’œil.', en: 'Your whole season,<br>at a glance.' },
    lead: {
      fr: 'Du 10 km au marathon en passant par le trail, Jogr réunit vos courses à venir dans un calendrier clair, puis garde la trace de vos résultats et de vos sensations. Simple, élégant et entièrement hors ligne.',
      en: 'From 10Ks to marathons and trail races, Jogr gathers your upcoming races in a clear calendar, then keeps track of your results and how each one felt. Simple, elegant and fully offline.',
    },
    highlights: [
      { icon: 'mountain', label: { fr: 'Route, trail, triathlon', en: 'Road, trail, triathlon' } },
      { icon: 'wifi-off', label: { fr: '100 % hors ligne', en: '100% offline' } },
      { icon: 'shield', label: { fr: 'Aucune donnée collectée', en: 'No data collected' } },
    ],
    features: [
      {
        icon: 'calendar',
        title: { fr: 'Calendrier des courses', en: 'Race calendar' },
        text: {
          fr: 'Visualisez toutes vos courses de l’année dans une vue annuelle claire et motivante.',
          en: 'See every race of the year in a clean, motivating annual view.',
        },
      },
      {
        icon: 'flag',
        title: { fr: 'Chaque détail compte', en: 'Every detail' },
        text: {
          fr: 'Nom, date, distance, dénivelé et ville : une course s’ajoute en quelques secondes.',
          en: 'Name, date, distance, elevation and city: add a race in seconds.',
        },
      },
      {
        icon: 'timer',
        title: { fr: 'Vos résultats', en: 'Your results' },
        text: {
          fr: 'Enregistrez votre temps et gardez une trace de chacune de vos performances.',
          en: 'Log your finish time and keep a record of every performance.',
        },
      },
      {
        icon: 'heart',
        title: { fr: 'Vos sensations', en: 'How it felt' },
        text: {
          fr: 'Donnez une note à la course, décrivez vos impressions et les conditions du jour.',
          en: 'Rate the race and write down your impressions and the day’s conditions.',
        },
      },
      {
        icon: 'history',
        title: { fr: 'Historique mensuel', en: 'Monthly history' },
        text: {
          fr: 'Revivez vos courses passées, mois après mois, et mesurez le chemin parcouru.',
          en: 'Relive your past races month by month and see how far you have come.',
        },
      },
      {
        icon: 'mountain',
        title: { fr: 'Route, trail et triathlon', en: 'Road, trail and triathlon' },
        text: {
          fr: 'Distinguez vos types de courses pour mieux organiser votre saison.',
          en: 'Tell your race types apart to organize your season better.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Planifiez', en: 'Plan' },
        text: { fr: 'Ajoutez vos prochaines courses au calendrier.', en: 'Add your next races to the calendar.' },
      },
      {
        title: { fr: 'Enregistrez', en: 'Record' },
        text: { fr: 'Temps, note et ressenti, juste après l’arrivée.', en: 'Time, rating and feelings, right after the finish.' },
      },
      {
        title: { fr: 'Revivez', en: 'Relive' },
        text: { fr: 'Parcourez votre historique mois par mois.', en: 'Browse your history month by month.' },
      },
    ],
    pricing: {
      model: 'lifetime',
      premiumName: { fr: 'Jogr Premium', en: 'Jogr Premium' },
      free: [{ fr: 'Jusqu’à 3 courses', en: 'Up to 3 races' }],
      premium: [
        { fr: 'Courses illimitées', en: 'Unlimited races' },
        { fr: 'Types de course : route, trail, triathlon', en: 'Race types: road, trail, triathlon' },
        { fr: 'Achat unique, accès à vie', en: 'One-time purchase, lifetime access' },
      ],
    },
    faq: [
      {
        q: { fr: 'Jogr est-elle gratuite ?', en: 'Is Jogr free?' },
        a: {
          fr: 'Oui, vous pouvez enregistrer jusqu’à 3 courses gratuitement. Un achat unique débloque les courses illimitées et les types de course (route, trail, triathlon).',
          en: 'Yes, you can save up to 3 races for free. A one-time purchase unlocks unlimited races and race types (road, trail, triathlon).',
        },
      },
      {
        q: { fr: 'Mes données sont-elles envoyées quelque part ?', en: 'Is my data sent anywhere?' },
        a: {
          fr: 'Non. Jogr fonctionne entièrement hors ligne : vos courses restent sur votre iPhone. Aucun compte, aucun pistage.',
          en: 'No. Jogr works fully offline: your races stay on your iPhone. No account, no tracking.',
        },
      },
      {
        q: { fr: 'Jogr enregistre-t-elle mes sorties GPS ?', en: 'Does Jogr record GPS runs?' },
        a: {
          fr: 'Non, Jogr n’est pas un traceur GPS : c’est un calendrier pour planifier vos courses et conserver vos résultats. Elle complète votre montre ou votre app d’entraînement.',
          en: 'No, Jogr is not a GPS tracker: it is a calendar to plan your races and keep your results. It complements your watch or training app.',
        },
      },
      {
        q: { fr: 'À quoi sert le lien « Parcours Prévention Santé » ?', en: 'What is the “Parcours Prévention Santé” link?' },
        a: {
          fr: 'Jogr donne un accès rapide au Parcours Prévention Santé de la Fédération française d’athlétisme, souvent demandé pour s’inscrire aux courses en France.',
          en: 'Jogr gives quick access to the French Athletics Federation’s health prevention course, often required to enter races in France.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-elle ?', en: 'Which devices are supported?' },
        a: { fr: 'Sur iPhone, avec iOS 18.2 ou une version ultérieure.', en: 'iPhone, running iOS 18.2 or later.' },
      },
    ],
    reviews: [
      {
        title: { fr: 'Excellent !', en: 'Excellent!' },
        text: {
          fr: 'Vu passer sur Runningfr. Offline, simple, pas de pub ni de fonctions intrusives, l’entre-deux parfait entre une feuille Excel et une app plus complète mais trop chargée.',
          en: 'Spotted it on Runningfr. Offline, simple, no ads and nothing intrusive: the perfect middle ground between an Excel sheet and a more complete but cluttered app.',
        },
        author: 'chantepierre',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Le calendrier que j’attendais', en: 'The calendar I was waiting for' },
        text: {
          fr: 'Application idéale pour planifier et suivre ses courses de l’année. La vue calendrier est très pratique.',
          en: 'The ideal app to plan and follow the year’s races. The calendar view is really handy.',
        },
        author: 'DomBook78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Utile et pratique', en: 'Useful and handy' },
        text: { fr: 'Super pratique pour planifier ses courses.', en: 'Super handy for planning your races.' },
        author: 'NicoZenn',
        rating: 5,
        original: 'fr',
      },
    ],
    theme: { accent: '#1673e0', gradient: ['#2b96f5', '#0a3f9e'], glow: '#19d3c5' },
    shots: { card: [3, 6], hero: [5, 3, 6] },
    requirements: { fr: 'iOS 18.2 ou ultérieur', en: 'iOS 18.2 or later' },
    contactEmail: EMAIL,
    userData: {
      fr: 'vos courses (nom, date, distance, dénivelé, ville), vos temps, vos notes et vos ressentis',
      en: 'your races (name, date, distance, elevation, city), your times, ratings and notes',
    },
    privacy: { updated: UPDATED, practices: ['storekit', 'external-links'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui aide à planifier ses courses à pied, à enregistrer ses résultats et à suivre sa saison',
        en: 'an iOS app that helps you plan your running races, record your results and follow your season',
      },
      purchases: 'lifetime',
    },
  },

  // ─────────────────────────────────────────────────────────── Budgy
  {
    slug: 'budgy',
    status: 'live',
    appStoreId: '6762646444',
    bundleId: 'com.benjaminbleriot.expensestracker',
    name: 'Budgy',
    category: { fr: 'Finance', en: 'Finance' },
    tagline: { fr: 'Le suivi de dépenses tout simple', en: 'The simple spending tracker' },
    eyebrow: { fr: 'Budget au quotidien', en: 'Everyday budget' },
    headline: { fr: 'Voyez enfin où<br>va votre argent.', en: 'Finally see where<br>your money goes.' },
    lead: {
      fr: 'Budgy vous aide à reprendre le contrôle de vos dépenses, sans complexité : notez une dépense en quelques secondes, rangez-la par catégorie et par portefeuille, et comprenez vos habitudes grâce à des statistiques claires.',
      en: 'Budgy helps you take control of your spending without the complexity: log an expense in seconds, sort it by category and wallet, and understand your habits with clear statistics.',
    },
    highlights: [
      { icon: 'bolt', label: { fr: 'Saisie en quelques secondes', en: 'Log in seconds' } },
      { icon: 'wallet', label: { fr: 'Portefeuilles et devises', en: 'Wallets & currencies' } },
      { icon: 'cloud', label: { fr: 'Synchronisation iCloud', en: 'iCloud sync' } },
    ],
    features: [
      {
        icon: 'receipt',
        title: { fr: 'Saisie express', en: 'Quick entry' },
        text: {
          fr: 'Montant, date, catégorie, note et portefeuille : une dépense s’ajoute en quelques secondes.',
          en: 'Amount, date, category, note and wallet: an expense is added in seconds.',
        },
      },
      {
        icon: 'calendar',
        title: { fr: 'Calendrier des dépenses', en: 'Spending calendar' },
        text: {
          fr: 'Parcourez vos dépenses jour par jour, avec le total de chaque journée.',
          en: 'Browse your spending day by day, with a total for each day.',
        },
      },
      {
        icon: 'tag',
        title: { fr: 'Catégories sur mesure', en: 'Custom categories' },
        text: {
          fr: 'Gardez les catégories proposées ou créez les vôtres, avec leur icône et leur couleur.',
          en: 'Keep the built-in categories or create your own, with an icon and a color.',
        },
      },
      {
        icon: 'wallet',
        title: { fr: 'Plusieurs portefeuilles', en: 'Multiple wallets' },
        text: {
          fr: 'Séparez comptes, cartes, voyages ou devises : chaque portefeuille a sa propre monnaie.',
          en: 'Separate accounts, cards, trips or currencies: each wallet has its own currency.',
        },
      },
      {
        icon: 'pie',
        title: { fr: 'Statistiques claires', en: 'Clear statistics' },
        text: {
          fr: 'Analysez vos dépenses par semaine, mois ou année, avec la répartition par catégorie.',
          en: 'Review your spending by week, month or year, with a breakdown by category.',
        },
      },
      {
        icon: 'repeat',
        title: { fr: 'Dépenses récurrentes', en: 'Recurring expenses' },
        text: {
          fr: 'Abonnements, loyer, factures : automatisez ce qui revient chaque mois.',
          en: 'Subscriptions, rent, bills: automate what comes back every month.',
        },
      },
      {
        icon: 'bell',
        title: { fr: 'Rappel quotidien', en: 'Daily reminder' },
        text: {
          fr: 'Une notification pour ne jamais oublier de noter vos dépenses du jour.',
          en: 'A gentle notification so you never forget to log the day’s spending.',
        },
      },
      {
        icon: 'cloud',
        title: { fr: 'Synchronisation iCloud', en: 'iCloud sync' },
        text: {
          fr: 'Retrouvez vos données à jour sur tous vos appareils Apple, via votre propre iCloud.',
          en: 'Keep your data up to date across your Apple devices, through your own iCloud.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Notez', en: 'Log' },
        text: { fr: 'Une dépense en quelques secondes.', en: 'An expense in a few seconds.' },
      },
      {
        title: { fr: 'Classez', en: 'Sort' },
        text: { fr: 'Par catégorie et par portefeuille.', en: 'By category and by wallet.' },
      },
      {
        title: { fr: 'Comprenez', en: 'Understand' },
        text: { fr: 'Où part votre argent, en un regard.', en: 'Where your money goes, at a glance.' },
      },
    ],
    pricing: {
      model: 'subscription',
      premiumName: { fr: 'Budgy Premium', en: 'Budgy Premium' },
      free: [
        { fr: 'Dépenses et catégories', en: 'Expenses and categories' },
        { fr: 'Un portefeuille', en: 'One wallet' },
        { fr: 'Statistiques de la semaine', en: 'Weekly statistics' },
        { fr: 'Rappel quotidien', en: 'Daily reminder' },
      ],
      premium: [
        { fr: 'Portefeuilles et devises illimités', en: 'Unlimited wallets and currencies' },
        { fr: 'Statistiques mensuelles et annuelles', en: 'Monthly and yearly statistics' },
        { fr: 'Dépenses récurrentes', en: 'Recurring expenses' },
        { fr: 'Synchronisation iCloud', en: 'iCloud sync' },
      ],
    },
    faq: [
      {
        q: { fr: 'Budgy est-elle gratuite ?', en: 'Is Budgy free?' },
        a: {
          fr: 'Oui, l’essentiel du suivi de dépenses est gratuit. Budgy Premium, proposé en abonnement, ajoute les portefeuilles multiples, les statistiques mensuelles et annuelles, les dépenses récurrentes et la synchronisation iCloud.',
          en: 'Yes, the core of expense tracking is free. Budgy Premium, available as a subscription, adds multiple wallets, monthly and yearly statistics, recurring expenses and iCloud sync.',
        },
      },
      {
        q: { fr: 'Mes données financières sont-elles partagées ?', en: 'Is my financial data shared?' },
        a: {
          fr: 'Non. Vos dépenses sont stockées sur votre iPhone et, si vous activez la synchronisation, dans votre propre compte iCloud. Elles ne nous sont jamais transmises.',
          en: 'No. Your expenses are stored on your iPhone and, if you turn on sync, in your own iCloud account. They are never sent to us.',
        },
      },
      {
        q: { fr: 'Budgy se connecte-t-elle à ma banque ?', en: 'Does Budgy connect to my bank?' },
        a: {
          fr: 'Non. Budgy ne demande aucun accès bancaire : vous gardez la main sur ce que vous saisissez.',
          en: 'No. Budgy never asks for bank access: you stay in control of what you enter.',
        },
      },
      {
        q: { fr: 'Comment résilier mon abonnement ?', en: 'How do I cancel my subscription?' },
        a: {
          fr: 'Sur votre iPhone, ouvrez Réglages › [votre nom] › Abonnements, puis choisissez Budgy. L’abonnement reste actif jusqu’à la fin de la période en cours.',
          en: 'On your iPhone, open Settings › [your name] › Subscriptions, then choose Budgy. Your subscription stays active until the end of the current period.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-elle ?', en: 'Which devices are supported?' },
        a: { fr: 'Sur iPhone, avec iOS 26 ou une version ultérieure.', en: 'iPhone, running iOS 26 or later.' },
      },
    ],
    reviews: [
      {
        title: { fr: 'Le top des applications de budget', en: 'The best budget app' },
        text: {
          fr: 'Simple d’utilisation et jolie. Ça change des autres applications.',
          en: 'Easy to use and beautiful. A nice change from other apps.',
        },
        author: 'DomBook78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'D’une grande simplicité', en: 'Wonderfully simple' },
        text: {
          fr: 'L’application est super. J’en avais marre d’avoir des applications de budget qui sont vieilles et pas pratiques. Budgy répond bien à ce problème. Hâte de voir la suite.',
          en: 'The app is great. I was tired of budget apps that felt old and impractical. Budgy solves that nicely. Can’t wait to see what’s next.',
        },
        author: 'SgrGhost78',
        rating: 5,
        original: 'fr',
      },
    ],
    theme: { accent: '#139a62', gradient: ['#2fcf86', '#0b6b43'], glow: '#f5b83d' },
    shots: { card: [4, 2], hero: [3, 4, 2] },
    requirements: { fr: 'iOS 26 ou ultérieur', en: 'iOS 26 or later' },
    contactEmail: EMAIL,
    userData: {
      fr: 'vos dépenses, catégories, portefeuilles, devises, notes et préférences',
      en: 'your expenses, categories, wallets, currencies, notes and preferences',
    },
    privacy: { updated: UPDATED, practices: ['icloud-sync', 'revenuecat', 'notifications'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS de suivi des dépenses personnelles',
        en: 'an iOS app for tracking personal spending',
      },
      purchases: 'subscription',
      clauses: ['no-financial-advice'],
    },
    supportFaq: [
      {
        q: { fr: 'Mes données ne se synchronisent pas entre mes appareils', en: 'My data does not sync between devices' },
        a: {
          fr: 'Vérifiez que la synchronisation iCloud est activée dans les réglages de Budgy, que vous êtes connecté au même compte iCloud sur chaque appareil, et que iCloud Drive est activé dans Réglages › [votre nom] › iCloud. La synchronisation peut prendre quelques minutes.',
          en: 'Make sure iCloud sync is turned on in Budgy’s settings, that you are signed in to the same iCloud account on each device, and that iCloud Drive is enabled in Settings › [your name] › iCloud. Syncing can take a few minutes.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── Lumi (bientôt)
  {
    slug: 'lumi',
    status: 'soon',
    bundleId: 'com.benjaminbleriot.StoryChild',
    icon: '/images/apps/lumi/icon.webp',
    name: 'Lumi',
    category: { fr: 'Éducation', en: 'Education' },
    tagline: { fr: 'Des histoires du soir sur mesure', en: 'Personalized bedtime stories' },
    eyebrow: { fr: 'Bientôt', en: 'Coming soon' },
    headline: { fr: 'Une histoire unique,<br>chaque soir.', en: 'A one-of-a-kind story,<br>every night.' },
    lead: {
      fr: 'Lumi invente des histoires du soir sur mesure : choisissez un héros, un compagnon et un décor, ajoutez le prénom de votre enfant si vous le souhaitez, et laissez la magie opérer. L’histoire peut ensuite être lue à voix haute.',
      en: 'Lumi creates bedtime stories made to measure: pick a hero, a companion and a setting, add your child’s first name if you like, and let the magic happen. The story can then be read aloud.',
    },
    highlights: [
      { icon: 'child', label: { fr: 'De 2 à 10 ans', en: 'Ages 2 to 10' } },
      { icon: 'speaker', label: { fr: 'Lecture à voix haute', en: 'Read aloud' } },
      { icon: 'user-off', label: { fr: 'Sans compte', en: 'No account' } },
    ],
    features: [
      {
        icon: 'sparkles',
        title: { fr: 'Des histoires sur mesure', en: 'Stories made to measure' },
        text: {
          fr: 'Huit héros, huit compagnons ou objets magiques et huit décors : des centaines de combinaisons.',
          en: 'Eight heroes, eight companions or magic objects and eight settings: hundreds of combinations.',
        },
      },
      {
        icon: 'child',
        title: { fr: 'Votre enfant en héros', en: 'Your child as the hero' },
        text: {
          fr: 'Ajoutez son prénom, si vous le souhaitez, pour qu’il devienne le personnage principal.',
          en: 'Add their first name, if you like, and they become the main character.',
        },
      },
      {
        icon: 'target',
        title: { fr: 'Adaptée à son âge', en: 'Right for their age' },
        text: {
          fr: 'Le vocabulaire et le récit s’adaptent à l’âge de l’enfant, de 2 à 10 ans.',
          en: 'The vocabulary and the plot adapt to the child’s age, from 2 to 10.',
        },
      },
      {
        icon: 'timer',
        title: { fr: 'De 3 à 10 minutes', en: '3 to 10 minutes' },
        text: {
          fr: 'Choisissez la durée de lecture selon le temps du coucher.',
          en: 'Choose the reading time that fits bedtime.',
        },
      },
      {
        icon: 'speaker',
        title: { fr: 'Lecture à voix haute', en: 'Read aloud' },
        text: {
          fr: 'L’histoire peut être racontée par les voix intégrées à iOS.',
          en: 'The story can be narrated with the voices built into iOS.',
        },
      },
      {
        icon: 'book',
        title: { fr: 'Une bibliothèque', en: 'A little library' },
        text: {
          fr: 'Les histoires sont conservées sur l’appareil pour être relues à volonté.',
          en: 'Stories are kept on the device so you can read them again and again.',
        },
      },
    ],
    faq: [
      {
        q: { fr: 'Quand Lumi sera-t-elle disponible ?', en: 'When will Lumi be available?' },
        a: {
          fr: 'Lumi est en cours de développement. Écrivez-moi si vous souhaitez être prévenu de sa sortie.',
          en: 'Lumi is currently in development. Email me if you would like to hear when it launches.',
        },
      },
      {
        q: { fr: 'Comment les histoires sont-elles écrites ?', en: 'How are the stories written?' },
        a: {
          fr: 'Par un modèle d’intelligence artificielle, à partir des choix faits dans l’app. Nous recommandons qu’un adulte accompagne la lecture.',
          en: 'By an artificial intelligence model, based on the choices made in the app. We recommend that an adult joins in the reading.',
        },
      },
    ],
    reviews: [],
    theme: { accent: '#6a4ee8', gradient: ['#4b33c9', '#160f4d'], glow: '#ffc56b' },
    requirements: { fr: 'iOS 26 ou ultérieur', en: 'iOS 26 or later' },
    languages: ['FR', 'EN'],
    contactEmail: EMAIL,
    userData: {
      fr: 'les histoires créées, leurs paramètres et le prénom éventuellement saisi',
      en: 'the stories you create, their settings and any first name you enter',
    },
    privacy: { updated: UPDATED, practices: ['story-generation', 'speech'], draft: true },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui génère des histoires du soir personnalisées pour les enfants',
        en: 'an iOS app that generates personalized bedtime stories for children',
      },
      purchases: 'none',
      clauses: ['ai-content'],
      draft: true,
    },
  },
];

export const visibleApps = apps.filter((app) => !app.hidden);
export const liveApps = visibleApps.filter((app) => app.status === 'live');
export const getApp = (slug: string) => visibleApps.find((app) => app.slug === slug);
