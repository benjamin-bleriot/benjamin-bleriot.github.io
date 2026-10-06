import type { AppData } from './types';

/**
 * Les apps présentées sur le site, dans l'ordre d'affichage.
 *
 * Pour ajouter une app : copiez un bloc, changez `slug`, `appStoreId` et les textes,
 * puis lancez `npm run appstore:images` pour récupérer l'icône et les captures.
 * Les pages /slug/, /slug/privacy/, /slug/terms/ et /slug/support/ sont créées
 * automatiquement, en français, en anglais (/en/slug/…) et en allemand (/de/slug/…).
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
    category: { fr: 'Jeux', en: 'Games', de: 'Spiele' },
    tagline: { fr: 'Le compteur de points pour Skyjo', en: 'The score keeper for Skyjo', de: 'Der Punktezähler für Skyjo' },
    eyebrow: { fr: 'Soirées Skyjo', en: 'Skyjo nights', de: 'Skyjo-Abende' },
    headline: { fr: 'Comptez moins.<br>Jouez plus.', en: 'Count less.<br>Play more.', de: 'Weniger rechnen.<br>Mehr spielen.' },
    lead: {
      fr: 'Ajoutez vos joueurs, saisissez les points de chaque manche : Skyjo Keeper calcule les totaux, tient le classement et annonce le vainqueur. Fini la feuille de score égarée et les calculs de fin de soirée.',
      en: 'Add your players and enter each round’s points: Skyjo Keeper adds up the totals, keeps the leaderboard and crowns the winner. No more lost score sheets or late-night maths.',
      de: 'Füge deine Mitspieler hinzu und trage die Punkte jeder Runde ein: Skyjo Keeper rechnet die Summen zusammen, führt die Rangliste und kürt den Sieger. Schluss mit verlorenen Punktezetteln und Rechnerei zu später Stunde.',
    },
    highlights: [
      { icon: 'users', label: { fr: '2 à 8 joueurs', en: '2 to 8 players', de: '2 bis 8 Spieler' } },
      { icon: 'wifi-off', label: { fr: 'Fonctionne hors ligne', en: 'Works offline', de: 'Funktioniert offline' } },
      { icon: 'moon', label: { fr: 'Mode sombre', en: 'Dark mode', de: 'Dunkelmodus' } },
    ],
    features: [
      {
        icon: 'users',
        shot: 6,
        title: { fr: 'De 2 à 8 joueurs', en: 'From 2 to 8 players', de: 'Von 2 bis 8 Spielern' },
        text: {
          fr: 'Une partie à deux ou autour d’une grande tablée : ajoutez les joueurs et lancez-vous en quelques secondes.',
          en: 'A game for two or a big table of friends: add your players and start in seconds.',
          de: 'Eine Partie zu zweit oder eine große Runde mit Freunden: Spieler hinzufügen und in Sekunden loslegen.',
        },
      },
      {
        icon: 'trophy',
        shot: 2,
        title: { fr: 'Classement en temps réel', en: 'Live leaderboard', de: 'Rangliste in Echtzeit' },
        text: {
          fr: 'Totaux et classement se mettent à jour après chaque manche, et la victoire est célébrée comme il se doit.',
          en: 'Totals and rankings update after every round, and every victory gets the celebration it deserves.',
          de: 'Summen und Rangliste werden nach jeder Runde aktualisiert, und jeder Sieg wird gebührend gefeiert.',
        },
      },
      {
        icon: 'target',
        shot: 6,
        title: { fr: 'Score cible au choix', en: 'Custom target score', de: 'Zielpunktzahl nach Wahl' },
        text: {
          fr: 'Fixez le score qui met fin à la partie selon vos habitudes de jeu.',
          en: 'Choose the score that ends the game, to match the way you play.',
          de: 'Leg die Punktzahl fest, mit der die Partie endet – ganz nach euren Spielgewohnheiten.',
        },
      },
      {
        icon: 'double',
        shot: 3,
        title: { fr: 'Règle du score doublé', en: 'Doubled-score rule', de: 'Regel der doppelten Punkte' },
        text: {
          fr: 'Activez l’option « Doubler le score de fin de manche » et la pénalité est appliquée automatiquement.',
          en: 'Turn on the end-of-round doubling option and the penalty is applied for you.',
          de: 'Aktiviere die Option „Punkte am Rundenende verdoppeln“, und die Strafe wird automatisch angewendet.',
        },
      },
      {
        icon: 'history',
        shot: 7,
        title: { fr: 'Historique des manches', en: 'Round history', de: 'Rundenverlauf' },
        text: {
          fr: 'Retrouvez chaque manche, corrigez un score saisi trop vite et revivez les retournements de situation.',
          en: 'Review every round, fix a score entered too quickly and relive the comebacks.',
          de: 'Sieh dir jede Runde an, korrigiere eine zu schnell eingegebene Punktzahl und erlebe die Wendungen noch einmal.',
        },
      },
      {
        icon: 'repeat',
        shot: 5,
        title: { fr: 'Revanche en un geste', en: 'One-tap rematch', de: 'Revanche mit einem Tipp' },
        text: {
          fr: 'Relancez une partie identique, avec les mêmes joueurs et les mêmes règles.',
          en: 'Start an identical game again, with the same players and the same rules.',
          de: 'Starte dieselbe Partie noch einmal, mit denselben Spielern und denselben Regeln.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Ajoutez vos joueurs', en: 'Add your players', de: 'Spieler hinzufügen' },
        text: { fr: 'Entre 2 et 8, avec le score cible de votre choix.', en: 'Between 2 and 8, with the target score you want.', de: 'Zwischen 2 und 8, mit der Zielpunktzahl deiner Wahl.' },
      },
      {
        title: { fr: 'Saisissez les points', en: 'Enter the points', de: 'Punkte eintragen' },
        text: { fr: 'Manche après manche, en quelques touches.', en: 'Round after round, in just a few taps.', de: 'Runde für Runde, mit wenigen Tipps.' },
      },
      {
        title: { fr: 'Laissez l’app compter', en: 'Let the app count', de: 'Die App rechnen lassen' },
        text: { fr: 'Totaux, classement et fin de partie sont automatiques.', en: 'Totals, rankings and the end of the game are automatic.', de: 'Summen, Rangliste und Spielende laufen automatisch.' },
      },
    ],
    pricing: {
      model: 'lifetime',
      premiumName: { fr: 'Version illimitée', en: 'Unlimited version', de: 'Unbegrenzte Version' },
      free: [
        { fr: 'Une partie par jour', en: 'One game per day', de: 'Eine Partie pro Tag' },
        { fr: 'Score cible jusqu’à 100 points', en: 'Target score up to 100 points', de: 'Zielpunktzahl bis 100 Punkte' },
      ],
      premium: [
        { fr: 'Parties illimitées', en: 'Unlimited games', de: 'Unbegrenzt viele Partien' },
        { fr: 'Tous les scores cibles', en: 'All target scores', de: 'Alle Zielpunktzahlen' },
        { fr: 'Achat unique, accès à vie', en: 'One-time purchase, lifetime access', de: 'Einmalkauf, lebenslanger Zugang' },
      ],
    },
    faq: [
      {
        q: { fr: 'Skyjo Keeper est-il gratuit ?', en: 'Is Skyjo Keeper free?', de: 'Ist Skyjo Keeper kostenlos?' },
        a: {
          fr: 'Oui. La version gratuite permet une partie par jour, avec un score cible jusqu’à 100 points. Un achat unique débloque les parties illimitées et tous les scores cibles, à vie et sans abonnement.',
          en: 'Yes. The free version lets you play one game per day with a target score of up to 100 points. A one-time purchase unlocks unlimited games and every target score, for life and with no subscription.',
          de: 'Ja. Mit der Gratisversion spielst du eine Partie pro Tag mit einer Zielpunktzahl bis 100 Punkte. Ein Einmalkauf schaltet unbegrenzt viele Partien und alle Zielpunktzahlen frei – lebenslang und ohne Abo.',
        },
      },
      {
        q: { fr: 'Faut-il un compte ou une connexion Internet ?', en: 'Do I need an account or an internet connection?', de: 'Brauche ich ein Konto oder eine Internetverbindung?' },
        a: {
          fr: 'Non. Aucun compte n’est nécessaire et vos parties sont enregistrées sur votre iPhone. Une connexion n’est utile que pour effectuer ou restaurer un achat.',
          en: 'No. There is no account and your games are saved on your iPhone. A connection is only needed to make or restore a purchase.',
          de: 'Nein. Es gibt kein Konto, und deine Partien werden auf deinem iPhone gespeichert. Eine Verbindung brauchst du nur, um einen Kauf zu tätigen oder wiederherzustellen.',
        },
      },
      {
        q: { fr: 'Puis-je corriger un score saisi par erreur ?', en: 'Can I fix a score I entered by mistake?', de: 'Kann ich eine falsch eingegebene Punktzahl korrigieren?' },
        a: {
          fr: 'Oui. Depuis l’historique, vous pouvez modifier les scores d’une manche : les totaux et le classement sont recalculés.',
          en: 'Yes. From the history you can edit a round’s scores, and the totals and rankings are recalculated.',
          de: 'Ja. Im Verlauf kannst du die Punkte einer Runde bearbeiten; Summen und Rangliste werden neu berechnet.',
        },
      },
      {
        q: { fr: 'Les règles du jeu sont-elles disponibles dans l’app ?', en: 'Are the game rules available in the app?', de: 'Sind die Spielregeln in der App verfügbar?' },
        a: {
          fr: 'Oui, un rappel des règles de Skyjo est accessible directement depuis l’app.',
          en: 'Yes, a summary of the Skyjo rules is available right inside the app.',
          de: 'Ja, eine Zusammenfassung der Skyjo-Regeln findest du direkt in der App.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-il ?', en: 'Which devices are supported?', de: 'Auf welchen Geräten funktioniert die App?' },
        a: {
          fr: 'Sur iPhone, avec iOS 18 ou une version ultérieure.',
          en: 'iPhone, running iOS 18 or later.',
          de: 'Auf dem iPhone, ab iOS 18.',
        },
      },
    ],
    reviews: [
      {
        title: { fr: 'Très utile', en: 'Very useful', de: 'Sehr nützlich' },
        text: {
          fr: 'Application qui simplifie le côté rébarbatif du comptage des points. En prime, Benjamin le développeur est incroyablement réactif. Bravo !',
          en: 'An app that takes the tedium out of counting points. On top of that, Benjamin the developer is incredibly responsive. Well done!',
          de: 'Eine App, die das lästige Punktezählen vereinfacht. Dazu reagiert Benjamin, der Entwickler, unglaublich schnell. Bravo!',
        },
        author: 'Dolby01',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Très pratique pour les points', en: 'Great for keeping score', de: 'Sehr praktisch zum Punktezählen' },
        text: {
          fr: 'Le compteur de points que j’attendais pour jouer au Skyjo. La famille est comblée et le suivi des points n’est plus une corvée.',
          en: 'The score keeper I was waiting for to play Skyjo. The whole family loves it and keeping score is no longer a chore.',
          de: 'Der Punktezähler, auf den ich für Skyjo gewartet habe. Die ganze Familie ist begeistert, und Punktezählen ist keine lästige Pflicht mehr.',
        },
        author: 'DomBook78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Au top', en: 'Top notch', de: 'Spitze' },
        text: {
          fr: 'Le must have des soirées Skyjo. Plus besoin de se prendre la tête à tout compter. Et ça permet de détecter les tricheurs ahah',
          en: 'A must-have for Skyjo nights. No more headaches counting everything. And it helps catch the cheaters, haha',
          de: 'Ein Muss für Skyjo-Abende. Kein Kopfzerbrechen mehr beim Zusammenzählen. Und man erwischt damit die Schummler, haha',
        },
        author: 'SgrGhost78',
        rating: 5,
        original: 'fr',
      },
    ],
    theme: { accent: '#7048e8', gradient: ['#8b5cf6', '#3b1c9c'], glow: '#35c4c0' },
    shots: { card: [2, 4], hero: [3, 2, 4] },
    requirements: { fr: 'iOS 18 ou ultérieur', en: 'iOS 18 or later', de: 'Ab iOS 18' },
    contactEmail: 'contact.skyjokeeper@gmail.com',
    trademark: {
      fr: 'Skyjo est une marque de Magilano GmbH. Skyjo Keeper est une application indépendante, qui n’est ni affiliée à Magilano ni approuvée par Magilano.',
      en: 'Skyjo is a trademark of Magilano GmbH. Skyjo Keeper is an independent app, not affiliated with or endorsed by Magilano.',
      de: 'Skyjo ist eine Marke der Magilano GmbH. Skyjo Keeper ist eine unabhängige App, die weder mit Magilano verbunden ist noch von Magilano unterstützt wird.',
    },
    userData: {
      fr: 'les noms des joueurs, les scores, les manches et l’historique de vos parties',
      en: 'player names, scores, rounds and your game history',
      de: 'Namen der Spieler, Punkte, Runden und den Verlauf deiner Partien',
    },
    privacy: { updated: UPDATED, practices: ['revenuecat'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui aide à compter les points pendant les parties du jeu de cartes Skyjo',
        en: 'an iOS app that helps you keep score during games of the Skyjo card game',
        de: 'einer iOS-App, die beim Punktezählen während Partien des Kartenspiels Skyjo hilft',
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
    category: { fr: 'Jeux', en: 'Games', de: 'Spiele' },
    tagline: { fr: 'Le compteur de points pour Flip 7', en: 'The score keeper for Flip 7', de: 'Der Punktezähler für Flip 7' },
    eyebrow: { fr: 'Soirées Flip 7', en: 'Flip 7 nights', de: 'Flip-7-Abende' },
    headline: { fr: 'Retournez les cartes.<br>Flip compte.', en: 'You flip the cards.<br>Flip does the math.', de: 'Du deckst die Karten auf.<br>Flip rechnet.' },
    lead: {
      fr: 'Le compteur conçu spécialement pour Flip 7. Touchez les cartes de chaque joueur : bonus, multiplicateur ×2 et Flip 7 sont calculés pour vous, et le classement évolue en direct jusqu’aux 200 points.',
      en: 'The score keeper built specifically for Flip 7. Tap each player’s cards and Flip handles the bonuses, the ×2 multiplier and the Flip 7 bonus, with a live leaderboard all the way to 200 points.',
      de: 'Der Punktezähler, der speziell für Flip 7 entwickelt wurde. Tippe die Karten jedes Spielers an: Boni, ×2-Multiplikator und Flip-7-Bonus werden für dich berechnet, und die Rangliste läuft live bis 200 Punkte mit.',
    },
    highlights: [
      { icon: 'sparkles', label: { fr: 'Bonus Flip 7 automatique', en: 'Automatic Flip 7 bonus', de: 'Automatischer Flip-7-Bonus' } },
      { icon: 'bolt', label: { fr: 'Classique & Vengeance', en: 'Classic & Vengeance', de: 'Classic & Vengeance' } },
      { icon: 'user-off', label: { fr: 'Sans compte', en: 'No account', de: 'Ohne Konto' } },
    ],
    features: [
      {
        icon: 'cards',
        shot: 2,
        title: { fr: 'Saisie guidée des cartes', en: 'Guided card entry', de: 'Geführte Karteneingabe' },
        text: {
          fr: 'Touchez les cartes de 0 à 12, ajoutez les bonus de +2 à +10 et le multiplicateur ×2 : le score se calcule tout seul.',
          en: 'Tap cards from 0 to 12, add +2 to +10 bonuses and the ×2 multiplier, and the score adds itself up.',
          de: 'Tippe Karten von 0 bis 12 an, füge Boni von +2 bis +10 und den ×2-Multiplikator hinzu – die Punkte rechnen sich von selbst.',
        },
      },
      {
        icon: 'sparkles',
        shot: 4,
        title: { fr: 'Flip 7 détecté', en: 'Flip 7 detection', de: 'Flip 7 erkannt' },
        text: {
          fr: 'Sept cartes différentes ? Les 15 points de bonus sont ajoutés aussitôt, avec un badge et un compteur par joueur.',
          en: 'Seven different cards? The 15-point bonus is added instantly, with a badge and a counter for each player.',
          de: 'Sieben verschiedene Karten? Die 15 Bonuspunkte werden sofort hinzugefügt, mit Abzeichen und Zähler für jeden Spieler.',
        },
      },
      {
        icon: 'bolt',
        shot: 1,
        title: { fr: 'Mode Vengeance', en: 'Vengeance mode', de: 'Vengeance-Modus' },
        text: {
          fr: 'Cartes de 0 à 13, divisions et malus : la variante Vengeance est entièrement prise en charge.',
          en: 'Cards from 0 to 13, dividers and penalties: the Vengeance variant is fully supported.',
          de: 'Karten von 0 bis 13, Teiler und Minuspunkte: Die Vengeance-Variante wird vollständig unterstützt.',
        },
      },
      {
        icon: 'trophy',
        shot: 5,
        title: { fr: 'Course aux 200 points', en: 'Race to 200', de: 'Wettlauf bis 200' },
        text: {
          fr: 'Le classement se met à jour après chaque tour et la partie s’arrête d’elle-même à 200 points, confettis compris.',
          en: 'The leaderboard updates after every turn and the game ends on its own at 200 points, confetti included.',
          de: 'Die Rangliste wird nach jedem Zug aktualisiert, und die Partie endet bei 200 Punkten von selbst – mit Konfetti.',
        },
      },
      {
        icon: 'history',
        shot: 7,
        title: { fr: 'Historique des scores', en: 'Score history', de: 'Punkteverlauf' },
        text: {
          fr: 'Retrouvez chaque manche et les cartes jouées. Un appui long permet de corriger ou de supprimer un score.',
          en: 'Review every round and the cards played. Press and hold to edit or delete a score.',
          de: 'Sieh dir jede Runde und die gespielten Karten an. Halte eine Punktzahl gedrückt, um sie zu bearbeiten oder zu löschen.',
        },
      },
      {
        icon: 'repeat',
        shot: 6,
        title: { fr: 'Revanche immédiate', en: 'Instant rematch', de: 'Sofortige Revanche' },
        text: {
          fr: 'Relancez la même partie, dupliquez-la ou retrouvez vos joueurs enregistrés pour démarrer plus vite.',
          en: 'Replay the same game, duplicate it or pick your saved players to get started faster.',
          de: 'Spiel dieselbe Partie noch einmal, dupliziere sie oder wähle deine gespeicherten Spieler, um schneller loszulegen.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Ajoutez les joueurs', en: 'Add the players', de: 'Spieler hinzufügen' },
        text: { fr: 'Vos joueurs habituels sont mémorisés.', en: 'Your regular players are remembered.', de: 'Deine Stammspieler werden gespeichert.' },
      },
      {
        title: { fr: 'Touchez les cartes', en: 'Tap the cards', de: 'Karten antippen' },
        text: { fr: 'Bonus, ×2 et Flip 7 sont calculés pour vous.', en: 'Bonuses, ×2 and Flip 7 are worked out for you.', de: 'Boni, ×2 und Flip 7 werden für dich berechnet.' },
      },
      {
        title: { fr: 'Suivez la course', en: 'Follow the race', de: 'Das Rennen verfolgen' },
        text: { fr: 'Le classement évolue en direct jusqu’à 200.', en: 'The leaderboard updates live up to 200.', de: 'Die Rangliste läuft live bis 200 mit.' },
      },
    ],
    pricing: {
      model: 'lifetime',
      premiumName: { fr: 'Premium à vie', en: 'Lifetime Premium', de: 'Premium auf Lebenszeit' },
      free: [{ fr: 'Une partie d’essai pour découvrir l’app', en: 'One trial game to discover the app', de: 'Eine Probepartie zum Kennenlernen' }],
      premium: [
        { fr: 'Parties illimitées', en: 'Unlimited games', de: 'Unbegrenzt viele Partien' },
        { fr: 'Mode Vengeance', en: 'Vengeance mode', de: 'Vengeance-Modus' },
        { fr: 'Achat unique, sans abonnement', en: 'One-time purchase, no subscription', de: 'Einmalkauf, ohne Abo' },
      ],
    },
    faq: [
      {
        q: { fr: 'Flip est-elle gratuite ?', en: 'Is Flip free?', de: 'Ist Flip kostenlos?' },
        a: {
          fr: 'Vous pouvez créer une partie d’essai gratuitement. Le Premium, en achat unique, débloque les parties illimitées et le mode Vengeance, à vie et sans abonnement.',
          en: 'You can create a trial game for free. Premium, a one-time purchase, unlocks unlimited games and Vengeance mode, for life and with no subscription.',
          de: 'Du kannst kostenlos eine Probepartie anlegen. Premium, ein Einmalkauf, schaltet unbegrenzt viele Partien und den Vengeance-Modus frei – lebenslang und ohne Abo.',
        },
      },
      {
        q: { fr: 'Comment le bonus Flip 7 est-il calculé ?', en: 'How is the Flip 7 bonus calculated?', de: 'Wie wird der Flip-7-Bonus berechnet?' },
        a: {
          fr: 'Dès qu’un joueur a sept cartes numérotées différentes, l’app ajoute automatiquement les 15 points de bonus et incrémente son compteur de Flip 7.',
          en: 'As soon as a player has seven different number cards, the app automatically adds the 15-point bonus and increases their Flip 7 counter.',
          de: 'Sobald ein Spieler sieben verschiedene Zahlenkarten hat, fügt die App automatisch die 15 Bonuspunkte hinzu und erhöht seinen Flip-7-Zähler.',
        },
      },
      {
        q: { fr: 'Le mode Vengeance est-il pris en charge ?', en: 'Is Vengeance mode supported?', de: 'Wird der Vengeance-Modus unterstützt?' },
        a: {
          fr: 'Oui. Les cartes de 0 à 13 et les cartes spéciales (divisions, malus, carte Zéro) sont gérées par le calcul du score.',
          en: 'Yes. Cards from 0 to 13 and the special cards (dividers, penalties, the Zero card) are all handled by the score calculation.',
          de: 'Ja. Die Karten von 0 bis 13 und die Sonderkarten (Teiler, Minuspunkte, Null-Karte) werden bei der Punkteberechnung berücksichtigt.',
        },
      },
      {
        q: { fr: 'Mes parties sont-elles sauvegardées ?', en: 'Are my games saved?', de: 'Werden meine Partien gespeichert?' },
        a: {
          fr: 'Oui, tout l’historique est enregistré sur votre iPhone, sans compte. Vous pouvez reprendre une partie en cours à tout moment.',
          en: 'Yes, your whole history is saved on your iPhone, with no account. You can resume a game in progress at any time.',
          de: 'Ja, dein gesamter Verlauf wird ohne Konto auf deinem iPhone gespeichert. Du kannst eine laufende Partie jederzeit fortsetzen.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-elle ?', en: 'Which devices are supported?', de: 'Auf welchen Geräten funktioniert die App?' },
        a: { fr: 'Sur iPhone, avec iOS 26 ou une version ultérieure.', en: 'iPhone, running iOS 26 or later.', de: 'Auf dem iPhone, ab iOS 26.' },
      },
    ],
    reviews: [
      {
        title: { fr: 'Très bien !', en: 'Very good!', de: 'Sehr gut!' },
        text: {
          fr: 'Application qui fonctionne bien avec un design clair et sympa.',
          en: 'Works well, with a clear and friendly design.',
          de: 'Funktioniert gut, mit einem klaren und sympathischen Design.',
        },
        author: 'SgrGhost78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Top', en: 'Great', de: 'Top' },
        text: {
          fr: 'Application pratique qui fonctionne bien ! Le fait qu’il retienne le nom après l’enregistrement, c’est génial pour créer des parties avec différents groupes d’amis 🥳',
          en: 'A handy app that works well! Remembering names once saved is great for setting up games with different groups of friends 🥳',
          de: 'Praktische App, die gut funktioniert! Dass sie sich die Namen nach dem Speichern merkt, ist super, um Partien mit verschiedenen Freundesgruppen anzulegen 🥳',
        },
        author: 'Erasmus974',
        rating: 4,
        original: 'fr',
      },
      {
        title: { fr: 'Super', en: 'Super', de: 'Super' },
        text: { fr: 'Hyper pratique !', en: 'Super handy!', de: 'Total praktisch!' },
        author: 'Vivi le petit radis',
        rating: 4,
        original: 'fr',
      },
    ],
    theme: { accent: '#0b9aa3', gradient: ['#1cc3c4', '#07606b'], glow: '#7df0e6' },
    shots: { card: [2, 1], hero: [3, 2, 4] },
    requirements: { fr: 'iOS 26 ou ultérieur', en: 'iOS 26 or later', de: 'Ab iOS 26' },
    contactEmail: EMAIL,
    trademark: {
      fr: 'Flip 7 est une marque de The Op Games. Flip est une application indépendante, qui n’est ni affiliée à The Op Games ni approuvée par The Op Games.',
      en: 'Flip 7 is a trademark of The Op Games. Flip is an independent app, not affiliated with or endorsed by The Op Games.',
      de: 'Flip 7 ist eine Marke von The Op Games. Flip ist eine unabhängige App, die weder mit The Op Games verbunden ist noch von The Op Games unterstützt wird.',
    },
    userData: {
      fr: 'les noms des joueurs, les scores, les cartes jouées et l’historique de vos parties',
      en: 'player names, scores, the cards played and your game history',
      de: 'Namen der Spieler, Punkte, die gespielten Karten und den Verlauf deiner Partien',
    },
    privacy: { updated: UPDATED, practices: ['revenuecat', 'camera-on-device', 'external-links'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui aide à compter les points pendant les parties du jeu de cartes Flip 7',
        en: 'an iOS app that helps you keep score during games of the Flip 7 card game',
        de: 'einer iOS-App, die beim Punktezählen während Partien des Kartenspiels Flip 7 hilft',
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
    category: { fr: 'Forme et santé', en: 'Health & Fitness', de: 'Gesundheit und Fitness' },
    tagline: { fr: 'Votre calendrier de courses', en: 'Your race calendar', de: 'Dein Wettkampfkalender' },
    eyebrow: { fr: 'Saison de course', en: 'Race season', de: 'Laufsaison' },
    headline: { fr: 'Toute votre saison,<br>d’un seul coup d’œil.', en: 'Your whole season,<br>at a glance.', de: 'Deine ganze Saison<br>auf einen Blick.' },
    lead: {
      fr: 'Du 10 km au marathon en passant par le trail, Jogr réunit vos courses à venir dans un calendrier clair, puis garde la trace de vos résultats et de vos sensations. Simple, élégant et entièrement hors ligne.',
      en: 'From 10Ks to marathons and trail races, Jogr gathers your upcoming races in a clear calendar, then keeps track of your results and how each one felt. Simple, elegant and fully offline.',
      de: 'Vom 10-km-Lauf über Trailläufe bis zum Marathon: Jogr sammelt deine kommenden Wettkämpfe in einem übersichtlichen Kalender und hält danach deine Ergebnisse und Eindrücke fest. Einfach, elegant und komplett offline.',
    },
    highlights: [
      { icon: 'mountain', label: { fr: 'Route, trail, triathlon', en: 'Road, trail, triathlon', de: 'Straße, Trail, Triathlon' } },
      { icon: 'wifi-off', label: { fr: '100 % hors ligne', en: '100% offline', de: '100 % offline' } },
      { icon: 'shield', label: { fr: 'Aucune donnée collectée', en: 'No data collected', de: 'Keine Daten erfasst' } },
    ],
    features: [
      {
        icon: 'calendar',
        shot: 3,
        title: { fr: 'Calendrier des courses', en: 'Race calendar', de: 'Wettkampfkalender' },
        text: {
          fr: 'Visualisez toutes vos courses de l’année dans une vue annuelle claire et motivante.',
          en: 'See every race of the year in a clean, motivating annual view.',
          de: 'Sieh alle Wettkämpfe des Jahres in einer klaren, motivierenden Jahresansicht.',
        },
      },
      {
        icon: 'flag',
        shot: 4,
        title: { fr: 'Chaque détail compte', en: 'Every detail', de: 'Jedes Detail zählt' },
        text: {
          fr: 'Nom, date, distance, dénivelé et ville : une course s’ajoute en quelques secondes.',
          en: 'Name, date, distance, elevation and city: add a race in seconds.',
          de: 'Name, Datum, Distanz, Höhenmeter und Ort: Ein Wettkampf ist in Sekunden angelegt.',
        },
      },
      {
        icon: 'timer',
        shot: { fr: 5, en: 6, de: 6 },
        title: { fr: 'Vos résultats', en: 'Your results', de: 'Deine Ergebnisse' },
        text: {
          fr: 'Enregistrez votre temps et gardez une trace de chacune de vos performances.',
          en: 'Log your finish time and keep a record of every performance.',
          de: 'Trag deine Zielzeit ein und behalte jede deiner Leistungen im Blick.',
        },
      },
      {
        icon: 'heart',
        shot: { fr: 5, en: 6, de: 6 },
        title: { fr: 'Vos sensations', en: 'How it felt', de: 'Dein Gefühl' },
        text: {
          fr: 'Donnez une note à la course, décrivez vos impressions et les conditions du jour.',
          en: 'Rate the race and write down your impressions and the day’s conditions.',
          de: 'Bewerte den Wettkampf und notiere deine Eindrücke und die Bedingungen des Tages.',
        },
      },
      {
        icon: 'history',
        shot: { fr: 6, en: 5, de: 5 },
        title: { fr: 'Historique mensuel', en: 'Monthly history', de: 'Monatlicher Verlauf' },
        text: {
          fr: 'Revivez vos courses passées, mois après mois, et mesurez le chemin parcouru.',
          en: 'Relive your past races month by month and see how far you have come.',
          de: 'Erlebe deine vergangenen Wettkämpfe Monat für Monat noch einmal und sieh, wie weit du gekommen bist.',
        },
      },
      {
        icon: 'mountain',
        shot: 1,
        title: { fr: 'Route, trail et triathlon', en: 'Road, trail and triathlon', de: 'Straße, Trail und Triathlon' },
        text: {
          fr: 'Distinguez vos types de courses pour mieux organiser votre saison.',
          en: 'Tell your race types apart to organize your season better.',
          de: 'Unterscheide deine Wettkampfarten, um deine Saison besser zu planen.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Planifiez', en: 'Plan', de: 'Planen' },
        text: { fr: 'Ajoutez vos prochaines courses au calendrier.', en: 'Add your next races to the calendar.', de: 'Trag deine nächsten Wettkämpfe in den Kalender ein.' },
      },
      {
        title: { fr: 'Enregistrez', en: 'Record', de: 'Festhalten' },
        text: { fr: 'Temps, note et ressenti, juste après l’arrivée.', en: 'Time, rating and feelings, right after the finish.', de: 'Zeit, Bewertung und Gefühl, direkt nach dem Zieleinlauf.' },
      },
      {
        title: { fr: 'Revivez', en: 'Relive', de: 'Erinnern' },
        text: { fr: 'Parcourez votre historique mois par mois.', en: 'Browse your history month by month.', de: 'Blättere Monat für Monat durch deinen Verlauf.' },
      },
    ],
    pricing: {
      model: 'lifetime',
      premiumName: { fr: 'Jogr Premium', en: 'Jogr Premium', de: 'Jogr Premium' },
      free: [{ fr: 'Jusqu’à 3 courses', en: 'Up to 3 races', de: 'Bis zu 3 Wettkämpfe' }],
      premium: [
        { fr: 'Courses illimitées', en: 'Unlimited races', de: 'Unbegrenzt viele Wettkämpfe' },
        { fr: 'Types de course : route, trail, triathlon', en: 'Race types: road, trail, triathlon', de: 'Wettkampfarten: Straße, Trail, Triathlon' },
        { fr: 'Achat unique, accès à vie', en: 'One-time purchase, lifetime access', de: 'Einmalkauf, lebenslanger Zugang' },
      ],
    },
    faq: [
      {
        q: { fr: 'Jogr est-elle gratuite ?', en: 'Is Jogr free?', de: 'Ist Jogr kostenlos?' },
        a: {
          fr: 'Oui, vous pouvez enregistrer jusqu’à 3 courses gratuitement. Un achat unique débloque les courses illimitées et les types de course (route, trail, triathlon).',
          en: 'Yes, you can save up to 3 races for free. A one-time purchase unlocks unlimited races and race types (road, trail, triathlon).',
          de: 'Ja, du kannst bis zu 3 Wettkämpfe kostenlos speichern. Ein Einmalkauf schaltet unbegrenzt viele Wettkämpfe und die Wettkampfarten (Straße, Trail, Triathlon) frei.',
        },
      },
      {
        q: { fr: 'Mes données sont-elles envoyées quelque part ?', en: 'Is my data sent anywhere?', de: 'Werden meine Daten irgendwohin gesendet?' },
        a: {
          fr: 'Non. Jogr fonctionne entièrement hors ligne : vos courses restent sur votre iPhone. Aucun compte, aucun pistage.',
          en: 'No. Jogr works fully offline: your races stay on your iPhone. No account, no tracking.',
          de: 'Nein. Jogr funktioniert komplett offline: Deine Wettkämpfe bleiben auf deinem iPhone. Kein Konto, kein Tracking.',
        },
      },
      {
        q: { fr: 'Jogr enregistre-t-elle mes sorties GPS ?', en: 'Does Jogr record GPS runs?', de: 'Zeichnet Jogr GPS-Läufe auf?' },
        a: {
          fr: 'Non, Jogr n’est pas un traceur GPS : c’est un calendrier pour planifier vos courses et conserver vos résultats. Elle complète votre montre ou votre app d’entraînement.',
          en: 'No, Jogr is not a GPS tracker: it is a calendar to plan your races and keep your results. It complements your watch or training app.',
          de: 'Nein, Jogr ist kein GPS-Tracker, sondern ein Kalender, um deine Wettkämpfe zu planen und deine Ergebnisse festzuhalten. Er ergänzt deine Uhr oder deine Trainings-App.',
        },
      },
      {
        q: { fr: 'À quoi sert le lien « Parcours Prévention Santé » ?', en: 'What is the “Parcours Prévention Santé” link?', de: 'Was ist der Link „Parcours Prévention Santé“?' },
        a: {
          fr: 'Jogr donne un accès rapide au Parcours Prévention Santé de la Fédération française d’athlétisme, souvent demandé pour s’inscrire aux courses en France.',
          en: 'Jogr gives quick access to the French Athletics Federation’s health prevention course, often required to enter races in France.',
          de: 'Jogr bietet schnellen Zugang zum Gesundheitspräventions-Kurs des Französischen Leichtathletikverbands, der für die Anmeldung zu Wettkämpfen in Frankreich oft verlangt wird.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-elle ?', en: 'Which devices are supported?', de: 'Auf welchen Geräten funktioniert die App?' },
        a: { fr: 'Sur iPhone, avec iOS 18.2 ou une version ultérieure.', en: 'iPhone, running iOS 18.2 or later.', de: 'Auf dem iPhone, ab iOS 18.2.' },
      },
    ],
    reviews: [
      {
        title: { fr: 'Excellent !', en: 'Excellent!', de: 'Hervorragend!' },
        text: {
          fr: 'Vu passer sur Runningfr. Offline, simple, pas de pub ni de fonctions intrusives, l’entre-deux parfait entre une feuille Excel et une app plus complète mais trop chargée.',
          en: 'Spotted it on Runningfr. Offline, simple, no ads and nothing intrusive: the perfect middle ground between an Excel sheet and a more complete but cluttered app.',
          de: 'Auf Runningfr entdeckt. Offline, einfach, keine Werbung und nichts Aufdringliches: der perfekte Mittelweg zwischen einer Excel-Tabelle und einer umfangreicheren, aber überladenen App.',
        },
        author: 'chantepierre',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Le calendrier que j’attendais', en: 'The calendar I was waiting for', de: 'Der Kalender, auf den ich gewartet habe' },
        text: {
          fr: 'Application idéale pour planifier et suivre ses courses de l’année. La vue calendrier est très pratique.',
          en: 'The ideal app to plan and follow the year’s races. The calendar view is really handy.',
          de: 'Die ideale App, um die Wettkämpfe des Jahres zu planen und zu verfolgen. Die Kalenderansicht ist sehr praktisch.',
        },
        author: 'DomBook78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'Utile et pratique', en: 'Useful and handy', de: 'Nützlich und praktisch' },
        text: { fr: 'Super pratique pour planifier ses courses.', en: 'Super handy for planning your races.', de: 'Super praktisch, um seine Wettkämpfe zu planen.' },
        author: 'NicoZenn',
        rating: 5,
        original: 'fr',
      },
    ],
    theme: { accent: '#1673e0', gradient: ['#2b96f5', '#0a3f9e'], glow: '#19d3c5' },
    shots: { card: [3, 6], hero: [5, 3, 6] },
    requirements: { fr: 'iOS 18.2 ou ultérieur', en: 'iOS 18.2 or later', de: 'Ab iOS 18.2' },
    contactEmail: EMAIL,
    userData: {
      fr: 'vos courses (nom, date, distance, dénivelé, ville), vos temps, vos notes et vos ressentis',
      en: 'your races (name, date, distance, elevation, city), your times, ratings and notes',
      de: 'deine Wettkämpfe (Name, Datum, Distanz, Höhenmeter, Ort), deine Zeiten, Bewertungen und Notizen',
    },
    privacy: { updated: UPDATED, practices: ['storekit', 'external-links'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui aide à planifier ses courses à pied, à enregistrer ses résultats et à suivre sa saison',
        en: 'an iOS app that helps you plan your running races, record your results and follow your season',
        de: 'einer iOS-App, die hilft, Laufwettkämpfe zu planen, Ergebnisse festzuhalten und die Saison zu verfolgen',
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
    category: { fr: 'Finance', en: 'Finance', de: 'Finanzen' },
    tagline: { fr: 'Le suivi de dépenses tout simple', en: 'The simple spending tracker', de: 'Der einfache Ausgaben-Tracker' },
    eyebrow: { fr: 'Budget au quotidien', en: 'Everyday budget', de: 'Budget im Alltag' },
    headline: { fr: 'Voyez enfin où<br>va votre argent.', en: 'Finally see where<br>your money goes.', de: 'Sieh endlich, wohin<br>dein Geld fließt.' },
    lead: {
      fr: 'Budgy vous aide à reprendre le contrôle de vos dépenses, sans complexité : notez une dépense en quelques secondes, rangez-la par catégorie et par portefeuille, et comprenez vos habitudes grâce à des statistiques claires.',
      en: 'Budgy helps you take control of your spending without the complexity: log an expense in seconds, sort it by category and wallet, and understand your habits with clear statistics.',
      de: 'Budgy hilft dir, deine Ausgaben ohne Aufwand in den Griff zu bekommen: Erfasse eine Ausgabe in Sekunden, ordne sie nach Kategorie und Geldbörse und verstehe deine Gewohnheiten dank klarer Statistiken.',
    },
    highlights: [
      { icon: 'bolt', label: { fr: 'Saisie en quelques secondes', en: 'Log in seconds', de: 'In Sekunden erfasst' } },
      { icon: 'wallet', label: { fr: 'Portefeuilles et devises', en: 'Wallets & currencies', de: 'Geldbörsen & Währungen' } },
      { icon: 'cloud', label: { fr: 'Synchronisation iCloud', en: 'iCloud sync', de: 'iCloud-Synchronisierung' } },
    ],
    features: [
      {
        icon: 'receipt',
        shot: 3,
        title: { fr: 'Saisie express', en: 'Quick entry', de: 'Blitzschnelle Eingabe' },
        text: {
          fr: 'Montant, date, catégorie, note et portefeuille : une dépense s’ajoute en quelques secondes.',
          en: 'Amount, date, category, note and wallet: an expense is added in seconds.',
          de: 'Betrag, Datum, Kategorie, Notiz und Geldbörse: Eine Ausgabe ist in Sekunden erfasst.',
        },
      },
      {
        icon: 'calendar',
        shot: 2,
        title: { fr: 'Calendrier des dépenses', en: 'Spending calendar', de: 'Ausgabenkalender' },
        text: {
          fr: 'Parcourez vos dépenses jour par jour, avec le total de chaque journée.',
          en: 'Browse your spending day by day, with a total for each day.',
          de: 'Blättere Tag für Tag durch deine Ausgaben, mit der Summe jedes Tages.',
        },
      },
      {
        icon: 'tag',
        shot: 7,
        title: { fr: 'Catégories sur mesure', en: 'Custom categories', de: 'Eigene Kategorien' },
        text: {
          fr: 'Gardez les catégories proposées ou créez les vôtres, avec leur icône et leur couleur.',
          en: 'Keep the built-in categories or create your own, with an icon and a color.',
          de: 'Behalte die vorgeschlagenen Kategorien oder erstelle eigene, mit Symbol und Farbe.',
        },
      },
      {
        icon: 'wallet',
        shot: 6,
        title: { fr: 'Plusieurs portefeuilles', en: 'Multiple wallets', de: 'Mehrere Geldbörsen' },
        text: {
          fr: 'Séparez comptes, cartes, voyages ou devises : chaque portefeuille a sa propre monnaie.',
          en: 'Separate accounts, cards, trips or currencies: each wallet has its own currency.',
          de: 'Trenne Konten, Karten, Reisen oder Währungen: Jede Geldbörse hat ihre eigene Währung.',
        },
      },
      {
        icon: 'pie',
        shot: 4,
        title: { fr: 'Statistiques claires', en: 'Clear statistics', de: 'Klare Statistiken' },
        text: {
          fr: 'Analysez vos dépenses par semaine, mois ou année, avec la répartition par catégorie.',
          en: 'Review your spending by week, month or year, with a breakdown by category.',
          de: 'Analysiere deine Ausgaben nach Woche, Monat oder Jahr, mit Aufschlüsselung nach Kategorie.',
        },
      },
      {
        icon: 'repeat',
        shot: 5,
        title: { fr: 'Dépenses récurrentes', en: 'Recurring expenses', de: 'Wiederkehrende Ausgaben' },
        text: {
          fr: 'Abonnements, loyer, factures : automatisez ce qui revient chaque mois.',
          en: 'Subscriptions, rent, bills: automate what comes back every month.',
          de: 'Abos, Miete, Rechnungen: Automatisiere, was jeden Monat wiederkommt.',
        },
      },
      {
        icon: 'bell',
        shot: 9,
        title: { fr: 'Rappel quotidien', en: 'Daily reminder', de: 'Tägliche Erinnerung' },
        text: {
          fr: 'Une notification pour ne jamais oublier de noter vos dépenses du jour.',
          en: 'A gentle notification so you never forget to log the day’s spending.',
          de: 'Eine Mitteilung, damit du nie vergisst, die Ausgaben des Tages einzutragen.',
        },
      },
      {
        icon: 'cloud',
        shot: 8,
        title: { fr: 'Synchronisation iCloud', en: 'iCloud sync', de: 'iCloud-Synchronisierung' },
        text: {
          fr: 'Retrouvez vos données à jour sur tous vos appareils Apple, via votre propre iCloud.',
          en: 'Keep your data up to date across your Apple devices, through your own iCloud.',
          de: 'Halte deine Daten auf allen deinen Apple-Geräten aktuell – über dein eigenes iCloud.',
        },
      },
    ],
    steps: [
      {
        title: { fr: 'Notez', en: 'Log', de: 'Erfassen' },
        text: { fr: 'Une dépense en quelques secondes.', en: 'An expense in a few seconds.', de: 'Eine Ausgabe in wenigen Sekunden.' },
      },
      {
        title: { fr: 'Classez', en: 'Sort', de: 'Ordnen' },
        text: { fr: 'Par catégorie et par portefeuille.', en: 'By category and by wallet.', de: 'Nach Kategorie und Geldbörse.' },
      },
      {
        title: { fr: 'Comprenez', en: 'Understand', de: 'Verstehen' },
        text: { fr: 'Où part votre argent, en un regard.', en: 'Where your money goes, at a glance.', de: 'Wohin dein Geld fließt, auf einen Blick.' },
      },
    ],
    pricing: {
      model: 'subscription',
      premiumName: { fr: 'Budgy Premium', en: 'Budgy Premium', de: 'Budgy Premium' },
      free: [
        { fr: 'Dépenses et catégories', en: 'Expenses and categories', de: 'Ausgaben und Kategorien' },
        { fr: 'Un portefeuille', en: 'One wallet', de: 'Eine Geldbörse' },
        { fr: 'Statistiques de la semaine', en: 'Weekly statistics', de: 'Wochenstatistiken' },
        { fr: 'Rappel quotidien', en: 'Daily reminder', de: 'Tägliche Erinnerung' },
      ],
      premium: [
        { fr: 'Portefeuilles et devises illimités', en: 'Unlimited wallets and currencies', de: 'Unbegrenzt viele Geldbörsen und Währungen' },
        { fr: 'Statistiques mensuelles et annuelles', en: 'Monthly and yearly statistics', de: 'Monats- und Jahresstatistiken' },
        { fr: 'Dépenses récurrentes', en: 'Recurring expenses', de: 'Wiederkehrende Ausgaben' },
        { fr: 'Synchronisation iCloud', en: 'iCloud sync', de: 'iCloud-Synchronisierung' },
      ],
    },
    faq: [
      {
        q: { fr: 'Budgy est-elle gratuite ?', en: 'Is Budgy free?', de: 'Ist Budgy kostenlos?' },
        a: {
          fr: 'Oui, l’essentiel du suivi de dépenses est gratuit. Budgy Premium, proposé en abonnement, ajoute les portefeuilles multiples, les statistiques mensuelles et annuelles, les dépenses récurrentes et la synchronisation iCloud.',
          en: 'Yes, the core of expense tracking is free. Budgy Premium, available as a subscription, adds multiple wallets, monthly and yearly statistics, recurring expenses and iCloud sync.',
          de: 'Ja, das Wichtigste der Ausgabenverfolgung ist kostenlos. Budgy Premium, als Abo erhältlich, bietet zusätzlich mehrere Geldbörsen, Monats- und Jahresstatistiken, wiederkehrende Ausgaben und die iCloud-Synchronisierung.',
        },
      },
      {
        q: { fr: 'Mes données financières sont-elles partagées ?', en: 'Is my financial data shared?', de: 'Werden meine Finanzdaten weitergegeben?' },
        a: {
          fr: 'Non. Vos dépenses sont stockées sur votre iPhone et, si vous activez la synchronisation, dans votre propre compte iCloud. Elles ne nous sont jamais transmises.',
          en: 'No. Your expenses are stored on your iPhone and, if you turn on sync, in your own iCloud account. They are never sent to us.',
          de: 'Nein. Deine Ausgaben werden auf deinem iPhone gespeichert und, wenn du die Synchronisierung aktivierst, in deinem eigenen iCloud-Account. Sie werden nie an uns übertragen.',
        },
      },
      {
        q: { fr: 'Budgy se connecte-t-elle à ma banque ?', en: 'Does Budgy connect to my bank?', de: 'Verbindet sich Budgy mit meiner Bank?' },
        a: {
          fr: 'Non. Budgy ne demande aucun accès bancaire : vous gardez la main sur ce que vous saisissez.',
          en: 'No. Budgy never asks for bank access: you stay in control of what you enter.',
          de: 'Nein. Budgy verlangt keinen Bankzugang: Du behältst die Kontrolle über das, was du eingibst.',
        },
      },
      {
        q: { fr: 'Comment résilier mon abonnement ?', en: 'How do I cancel my subscription?', de: 'Wie kündige ich mein Abo?' },
        a: {
          fr: 'Sur votre iPhone, ouvrez Réglages › [votre nom] › Abonnements, puis choisissez Budgy. L’abonnement reste actif jusqu’à la fin de la période en cours.',
          en: 'On your iPhone, open Settings › [your name] › Subscriptions, then choose Budgy. Your subscription stays active until the end of the current period.',
          de: 'Öffne auf deinem iPhone Einstellungen › [Dein Name] › Abonnements und wähle dann Budgy. Das Abo bleibt bis zum Ende des laufenden Zeitraums aktiv.',
        },
      },
      {
        q: { fr: 'Sur quels appareils fonctionne-t-elle ?', en: 'Which devices are supported?', de: 'Auf welchen Geräten funktioniert die App?' },
        a: { fr: 'Sur iPhone, avec iOS 26 ou une version ultérieure.', en: 'iPhone, running iOS 26 or later.', de: 'Auf dem iPhone, ab iOS 26.' },
      },
    ],
    reviews: [
      {
        title: { fr: 'Le top des applications de budget', en: 'The best budget app', de: 'Die beste Budget-App' },
        text: {
          fr: 'Simple d’utilisation et jolie. Ça change des autres applications.',
          en: 'Easy to use and beautiful. A nice change from other apps.',
          de: 'Einfach zu bedienen und schön. Eine angenehme Abwechslung zu anderen Apps.',
        },
        author: 'DomBook78',
        rating: 5,
        original: 'fr',
      },
      {
        title: { fr: 'D’une grande simplicité', en: 'Wonderfully simple', de: 'Herrlich einfach' },
        text: {
          fr: 'L’application est super. J’en avais marre d’avoir des applications de budget qui sont vieilles et pas pratiques. Budgy répond bien à ce problème. Hâte de voir la suite.',
          en: 'The app is great. I was tired of budget apps that felt old and impractical. Budgy solves that nicely. Can’t wait to see what’s next.',
          de: 'Die App ist super. Ich hatte genug von veralteten, unpraktischen Budget-Apps. Budgy löst dieses Problem sehr gut. Ich bin gespannt, wie es weitergeht.',
        },
        author: 'SgrGhost78',
        rating: 5,
        original: 'fr',
      },
    ],
    theme: { accent: '#139a62', gradient: ['#2fcf86', '#0b6b43'], glow: '#f5b83d' },
    shots: { card: [4, 2], hero: [3, 4, 2] },
    requirements: { fr: 'iOS 26 ou ultérieur', en: 'iOS 26 or later', de: 'Ab iOS 26' },
    contactEmail: EMAIL,
    userData: {
      fr: 'vos dépenses, catégories, portefeuilles, devises, notes et préférences',
      en: 'your expenses, categories, wallets, currencies, notes and preferences',
      de: 'deine Ausgaben, Kategorien, Geldbörsen, Währungen, Notizen und Einstellungen',
    },
    privacy: { updated: UPDATED, practices: ['icloud-sync', 'revenuecat', 'notifications'] },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS de suivi des dépenses personnelles',
        en: 'an iOS app for tracking personal spending',
        de: 'einer iOS-App zur Verfolgung persönlicher Ausgaben',
      },
      purchases: 'subscription',
      clauses: ['no-financial-advice'],
    },
    supportFaq: [
      {
        q: { fr: 'Mes données ne se synchronisent pas entre mes appareils', en: 'My data does not sync between devices', de: 'Meine Daten werden zwischen meinen Geräten nicht synchronisiert' },
        a: {
          fr: 'Vérifiez que la synchronisation iCloud est activée dans les réglages de Budgy, que vous êtes connecté au même compte iCloud sur chaque appareil, et que iCloud Drive est activé dans Réglages › [votre nom] › iCloud. La synchronisation peut prendre quelques minutes.',
          en: 'Make sure iCloud sync is turned on in Budgy’s settings, that you are signed in to the same iCloud account on each device, and that iCloud Drive is enabled in Settings › [your name] › iCloud. Syncing can take a few minutes.',
          de: 'Prüfe, ob die iCloud-Synchronisierung in den Einstellungen von Budgy aktiviert ist, ob du auf jedem Gerät mit demselben iCloud-Account angemeldet bist und ob iCloud Drive unter Einstellungen › [Dein Name] › iCloud aktiviert ist. Die Synchronisierung kann einige Minuten dauern.',
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
    category: { fr: 'Éducation', en: 'Education', de: 'Bildung' },
    tagline: { fr: 'Des histoires du soir sur mesure', en: 'Personalized bedtime stories', de: 'Gutenachtgeschichten nach Maß' },
    eyebrow: { fr: 'Bientôt', en: 'Coming soon', de: 'Demnächst' },
    headline: { fr: 'Une histoire unique,<br>chaque soir.', en: 'A one-of-a-kind story,<br>every night.', de: 'Jeden Abend<br>eine einzigartige Geschichte.' },
    lead: {
      fr: 'Lumi invente des histoires du soir sur mesure : choisissez un héros, un compagnon et un décor, ajoutez le prénom de votre enfant si vous le souhaitez, et laissez la magie opérer. L’histoire peut ensuite être lue à voix haute.',
      en: 'Lumi creates bedtime stories made to measure: pick a hero, a companion and a setting, add your child’s first name if you like, and let the magic happen. The story can then be read aloud.',
      de: 'Lumi erfindet Gutenachtgeschichten nach Maß: Wähle einen Helden, einen Begleiter und einen Schauplatz, füge auf Wunsch den Vornamen deines Kindes hinzu und lass den Zauber wirken. Die Geschichte kann anschließend vorgelesen werden.',
    },
    highlights: [
      { icon: 'child', label: { fr: 'De 2 à 10 ans', en: 'Ages 2 to 10', de: 'Von 2 bis 10 Jahren' } },
      { icon: 'speaker', label: { fr: 'Lecture à voix haute', en: 'Read aloud', de: 'Vorlesen' } },
      { icon: 'user-off', label: { fr: 'Sans compte', en: 'No account', de: 'Ohne Konto' } },
    ],
    features: [
      {
        icon: 'sparkles',
        title: { fr: 'Des histoires sur mesure', en: 'Stories made to measure', de: 'Geschichten nach Maß' },
        text: {
          fr: 'Huit héros, huit compagnons ou objets magiques et huit décors : des centaines de combinaisons.',
          en: 'Eight heroes, eight companions or magic objects and eight settings: hundreds of combinations.',
          de: 'Acht Helden, acht Begleiter oder Zaubergegenstände und acht Schauplätze: Hunderte Kombinationen.',
        },
      },
      {
        icon: 'child',
        title: { fr: 'Votre enfant en héros', en: 'Your child as the hero', de: 'Dein Kind als Held' },
        text: {
          fr: 'Ajoutez son prénom, si vous le souhaitez, pour qu’il devienne le personnage principal.',
          en: 'Add their first name, if you like, and they become the main character.',
          de: 'Füge auf Wunsch seinen Vornamen hinzu, und dein Kind wird zur Hauptfigur.',
        },
      },
      {
        icon: 'target',
        title: { fr: 'Adaptée à son âge', en: 'Right for their age', de: 'Passend zum Alter' },
        text: {
          fr: 'Le vocabulaire et le récit s’adaptent à l’âge de l’enfant, de 2 à 10 ans.',
          en: 'The vocabulary and the plot adapt to the child’s age, from 2 to 10.',
          de: 'Wortschatz und Handlung passen sich dem Alter des Kindes an, von 2 bis 10 Jahren.',
        },
      },
      {
        icon: 'timer',
        title: { fr: 'De 3 à 10 minutes', en: '3 to 10 minutes', de: '3 bis 10 Minuten' },
        text: {
          fr: 'Choisissez la durée de lecture selon le temps du coucher.',
          en: 'Choose the reading time that fits bedtime.',
          de: 'Wähle die Lesedauer passend zur Schlafenszeit.',
        },
      },
      {
        icon: 'speaker',
        title: { fr: 'Lecture à voix haute', en: 'Read aloud', de: 'Vorlesen' },
        text: {
          fr: 'L’histoire peut être racontée par les voix intégrées à iOS.',
          en: 'The story can be narrated with the voices built into iOS.',
          de: 'Die Geschichte kann mit den in iOS integrierten Stimmen erzählt werden.',
        },
      },
      {
        icon: 'book',
        title: { fr: 'Une bibliothèque', en: 'A little library', de: 'Eine kleine Bibliothek' },
        text: {
          fr: 'Les histoires sont conservées sur l’appareil pour être relues à volonté.',
          en: 'Stories are kept on the device so you can read them again and again.',
          de: 'Die Geschichten werden auf dem Gerät gespeichert, damit du sie immer wieder lesen kannst.',
        },
      },
    ],
    faq: [
      {
        q: { fr: 'Quand Lumi sera-t-elle disponible ?', en: 'When will Lumi be available?', de: 'Wann ist Lumi verfügbar?' },
        a: {
          fr: 'Lumi est en cours de développement. Écrivez-moi si vous souhaitez être prévenu de sa sortie.',
          en: 'Lumi is currently in development. Email me if you would like to hear when it launches.',
          de: 'Lumi ist derzeit in Entwicklung. Schreib mir, wenn du beim Start Bescheid bekommen möchtest.',
        },
      },
      {
        q: { fr: 'Comment les histoires sont-elles écrites ?', en: 'How are the stories written?', de: 'Wie werden die Geschichten geschrieben?' },
        a: {
          fr: 'Par un modèle d’intelligence artificielle, à partir des choix faits dans l’app. Nous recommandons qu’un adulte accompagne la lecture.',
          en: 'By an artificial intelligence model, based on the choices made in the app. We recommend that an adult joins in the reading.',
          de: 'Von einem KI-Modell, auf Grundlage der in der App getroffenen Auswahl. Wir empfehlen, dass ein Erwachsener beim Lesen dabei ist.',
        },
      },
    ],
    reviews: [],
    theme: { accent: '#6a4ee8', gradient: ['#4b33c9', '#160f4d'], glow: '#ffc56b' },
    requirements: { fr: 'iOS 26 ou ultérieur', en: 'iOS 26 or later', de: 'Ab iOS 26' },
    languages: ['FR', 'EN'],
    contactEmail: EMAIL,
    userData: {
      fr: 'les histoires créées, leurs paramètres et le prénom éventuellement saisi',
      en: 'the stories you create, their settings and any first name you enter',
      de: 'die erstellten Geschichten, ihre Einstellungen und einen eventuell eingegebenen Vornamen',
    },
    privacy: { updated: UPDATED, practices: ['story-generation', 'speech'], draft: true },
    terms: {
      updated: UPDATED,
      purpose: {
        fr: 'une application iOS qui génère des histoires du soir personnalisées pour les enfants',
        en: 'an iOS app that generates personalized bedtime stories for children',
        de: 'einer iOS-App, die personalisierte Gutenachtgeschichten für Kinder erzeugt',
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
