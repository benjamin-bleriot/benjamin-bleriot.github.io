import { site } from '../site';
import type { AppData, Lang, Text } from '../types';
import type { LegalSection } from './privacy';

const LINKS = {
  eula: {
    fr: 'https://www.apple.com/fr/legal/internet-services/itunes/dev/stdeula/',
    en: 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/',
    de: 'https://www.apple.com/de/legal/internet-services/itunes/dev/stdeula/',
  },
  refunds: 'https://reportaproblem.apple.com/',
};

const a = (href: string, label: string) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
const mail = (email: string) => `<a href="mailto:${email}">${email}</a>`;

/** Assemble les conditions d'utilisation d'une app (src/data/apps.ts → terms). */
export function buildTerms(app: AppData, lang: Lang, privacyHref: string): { summary: string; sections: LegalSection[] } {
  const tr = (texts: Text) => texts[lang];
  const name = app.name;
  const email = app.contactEmail;
  const clauses = app.terms.clauses ?? [];
  const icloud = app.privacy.practices.includes('icloud-sync');
  const premium = app.pricing?.premiumName[lang] ?? 'Premium';
  const refunds = a(LINKS.refunds, 'reportaproblem.apple.com');

  const summary = tr({
    fr: `Ces conditions encadrent l’utilisation de ${name}. Elles complètent le contrat de licence standard d’Apple, qui s’applique à toutes les apps de l’App Store.`,
    en: `These terms govern your use of ${name}. They supplement Apple’s standard license agreement, which applies to every App Store app.`,
    de: `Diese Bedingungen regeln die Nutzung von ${name}. Sie ergänzen Apples Standard-Lizenzvereinbarung, die für alle Apps im App Store gilt.`,
  });

  const sections: LegalSection[] = [];
  const add = (id: string, title: Text, html: Text) => sections.push({ id, title: tr(title), html: tr(html) });

  add(
    'objet',
    { fr: 'Objet', en: 'About these terms', de: 'Gegenstand' },
    {
      fr: `<p>Les présentes conditions régissent l’utilisation de ${name}, ${app.terms.purpose.fr}, éditée par ${site.author} (« nous »). En téléchargeant ou en utilisant l’app, vous acceptez ces conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser l’app.</p>`,
      en: `<p>These terms govern your use of ${name}, ${app.terms.purpose.en}, published by ${site.author} (“we”). By downloading or using the app, you agree to these terms. If you do not agree, please do not use the app.</p>`,
      de: `<p>Diese Bedingungen regeln die Nutzung von ${name}, ${app.terms.purpose.de}, herausgegeben von ${site.author} („wir“). Indem du die App lädst oder nutzt, akzeptierst du diese Bedingungen. Wenn du sie nicht akzeptierst, nutze die App bitte nicht.</p>`,
    },
  );

  add(
    'licence',
    { fr: 'Licence d’utilisation', en: 'License', de: 'Nutzungslizenz' },
    {
      fr: `<p>Nous vous accordons un droit personnel, non exclusif et non transférable d’utiliser ${name} sur les appareils Apple que vous possédez ou contrôlez, à des fins personnelles et non commerciales. Le ${a(LINKS.eula.fr, 'contrat de licence standard d’Apple (EULA)')} s’applique également.</p>`,
      en: `<p>We grant you a personal, non-exclusive and non-transferable right to use ${name} on the Apple devices you own or control, for personal and non-commercial purposes. Apple’s ${a(LINKS.eula.en, 'standard license agreement (EULA)')} also applies.</p>`,
      de: `<p>Wir gewähren dir ein persönliches, nicht exklusives und nicht übertragbares Recht, ${name} auf den Apple-Geräten, die du besitzt oder kontrollierst, für persönliche und nicht kommerzielle Zwecke zu nutzen. Außerdem gilt ${a(LINKS.eula.de, 'Apples Standard-Lizenzvereinbarung (EULA)')}.</p>`,
    },
  );

  if (app.terms.purchases === 'lifetime') {
    add(
      'achats',
      { fr: 'Achats intégrés', en: 'In-app purchases', de: 'In-App-Käufe' },
      {
        fr: `<p>${name} se télécharge gratuitement. Certaines fonctions sont réservées à la version ${premium}, débloquée par un achat intégré unique, sans abonnement. Le prix est affiché dans l’app avant l’achat ; le paiement est traité par Apple et débité sur votre compte Apple à la confirmation.</p>
<p>L’achat est lié à votre identifiant Apple : vous pouvez le restaurer sur vos autres appareils avec le bouton « Restaurer les achats ». Les demandes de remboursement sont traitées par Apple sur ${refunds}.</p>`,
        en: `<p>${name} is free to download. Some features are reserved for ${premium}, unlocked with a one-time in-app purchase, with no subscription. The price is shown in the app before you buy; payment is processed by Apple and charged to your Apple Account when you confirm.</p>
<p>The purchase is tied to your Apple Account: you can restore it on your other devices with the “Restore Purchases” button. Refund requests are handled by Apple at ${refunds}.</p>`,
        de: `<p>${name} kann kostenlos geladen werden. Einige Funktionen sind ${premium} vorbehalten, das mit einem einmaligen In-App-Kauf ohne Abo freigeschaltet wird. Der Preis wird vor dem Kauf in der App angezeigt; die Zahlung wird von Apple abgewickelt und bei der Bestätigung deinem Apple Account belastet.</p>
<p>Der Kauf ist an deinen Apple Account gebunden: Du kannst ihn auf deinen anderen Geräten mit der Schaltfläche „Käufe wiederherstellen“ wiederherstellen. Anfragen zur Rückerstattung bearbeitet Apple unter ${refunds}.</p>`,
      },
    );
  } else if (app.terms.purchases === 'subscription') {
    add(
      'abonnement',
      { fr: 'Abonnement', en: 'Subscription', de: 'Abo' },
      {
        fr: `<p>${name} se télécharge gratuitement. ${premium} est proposé sous forme d’abonnement à renouvellement automatique, dont la durée et le prix sont indiqués dans l’app avant l’achat.</p>
<ul>
<li>Le paiement est débité sur votre compte Apple à la confirmation de l’achat.</li>
<li>L’abonnement se renouvelle automatiquement, sauf si le renouvellement automatique est désactivé au moins 24 heures avant la fin de la période en cours.</li>
<li>Le renouvellement est facturé dans les 24 heures qui précèdent la fin de la période en cours.</li>
<li>Vous pouvez gérer ou résilier votre abonnement dans Réglages › [votre nom] › Abonnements. La résiliation prend effet à la fin de la période en cours.</li>
<li>Si un essai gratuit est proposé, la partie non utilisée de l’essai est perdue lors de la souscription.</li>
</ul>
<p>Les demandes de remboursement sont traitées par Apple sur ${refunds}.</p>`,
        en: `<p>${name} is free to download. ${premium} is offered as an auto-renewable subscription, whose length and price are shown in the app before you buy.</p>
<ul>
<li>Payment is charged to your Apple Account when you confirm the purchase.</li>
<li>The subscription renews automatically unless auto-renew is turned off at least 24 hours before the end of the current period.</li>
<li>Your account is charged for renewal within 24 hours before the end of the current period.</li>
<li>You can manage or cancel your subscription in Settings › [your name] › Subscriptions. Cancellation takes effect at the end of the current period.</li>
<li>If a free trial is offered, any unused portion of it is forfeited when you purchase a subscription.</li>
</ul>
<p>Refund requests are handled by Apple at ${refunds}.</p>`,
        de: `<p>${name} kann kostenlos geladen werden. ${premium} wird als automatisch verlängerbares Abo angeboten; Laufzeit und Preis werden vor dem Kauf in der App angezeigt.</p>
<ul>
<li>Die Zahlung wird bei der Bestätigung des Kaufs deinem Apple Account belastet.</li>
<li>Das Abo verlängert sich automatisch, sofern die automatische Verlängerung nicht spätestens 24 Stunden vor Ende des laufenden Zeitraums deaktiviert wird.</li>
<li>Die Verlängerung wird innerhalb von 24 Stunden vor Ende des laufenden Zeitraums berechnet.</li>
<li>Du kannst dein Abo unter Einstellungen › [Dein Name] › Abonnements verwalten oder kündigen. Die Kündigung wird zum Ende des laufenden Zeitraums wirksam.</li>
<li>Wird ein kostenloser Probezeitraum angeboten, verfällt dessen ungenutzter Teil mit dem Abschluss des Abos.</li>
</ul>
<p>Anfragen zur Rückerstattung bearbeitet Apple unter ${refunds}.</p>`,
      },
    );
  } else {
    add(
      'acces',
      { fr: 'Accès à l’app', en: 'Access to the app', de: 'Zugang zur App' },
      {
        fr: `<p>${name} est actuellement proposée sans achat intégré. Si des fonctions payantes sont ajoutées, leurs conditions seront affichées dans l’app avant tout achat et précisées sur cette page.</p>`,
        en: `<p>${name} is currently offered with no in-app purchase. If paid features are added, their terms will be shown in the app before any purchase and detailed on this page.</p>`,
        de: `<p>${name} wird derzeit ohne In-App-Käufe angeboten. Falls kostenpflichtige Funktionen hinzukommen, werden ihre Bedingungen vor jedem Kauf in der App angezeigt und auf dieser Seite erläutert.</p>`,
      },
    );
  }

  add(
    'donnees',
    { fr: 'Vos données', en: 'Your data', de: 'Deine Daten' },
    {
      fr: `<p>Les contenus que vous saisissez dans l’app vous appartiennent. Ils sont enregistrés sur votre appareil${icloud ? ' et, si vous activez la synchronisation, dans votre compte iCloud' : ''}. Pensez à sauvegarder votre appareil : nous ne pouvons pas récupérer des données supprimées ou perdues. Le traitement de vos données est détaillé dans la <a href="${privacyHref}">politique de confidentialité</a>.</p>`,
      en: `<p>The content you enter in the app belongs to you. It is saved on your device${icloud ? ' and, if you turn on sync, in your iCloud account' : ''}. Remember to back up your device: we cannot recover deleted or lost data. How your data is handled is explained in the <a href="${privacyHref}">privacy policy</a>.</p>`,
      de: `<p>Die Inhalte, die du in der App eingibst, gehören dir. Sie werden auf deinem Gerät gespeichert${icloud ? ' und, wenn du die Synchronisierung aktivierst, in deinem iCloud-Account' : ''}. Denk daran, dein Gerät zu sichern: Gelöschte oder verlorene Daten können wir nicht wiederherstellen. Wie deine Daten verarbeitet werden, erklärt die <a href="${privacyHref}">Datenschutzerklärung</a>.</p>`,
    },
  );

  if (clauses.includes('no-financial-advice')) {
    add(
      'conseil',
      { fr: 'Pas de conseil financier', en: 'No financial advice', de: 'Keine Finanzberatung' },
      {
        fr: `<p>${name} est un outil d’organisation personnelle. L’app ne fournit ni service bancaire, ni conseil financier, fiscal ou comptable. Les informations affichées dépendent des données que vous saisissez et sont fournies à titre indicatif : vous restez seul responsable de vos décisions financières.</p>`,
        en: `<p>${name} is a personal organization tool. It does not provide banking services or financial, tax or accounting advice. The information shown depends on the data you enter and is provided for information only: you remain solely responsible for your financial decisions.</p>`,
        de: `<p>${name} ist ein Werkzeug zur persönlichen Organisation. Die App bietet weder Bankdienstleistungen noch Finanz-, Steuer- oder Buchhaltungsberatung. Die angezeigten Informationen hängen von den Daten ab, die du eingibst, und dienen nur der Orientierung: Für deine finanziellen Entscheidungen bist allein du verantwortlich.</p>`,
      },
    );
  }

  if (clauses.includes('ai-content')) {
    add(
      'ia',
      { fr: 'Contenus générés par IA', en: 'AI-generated content', de: 'KI-generierte Inhalte' },
      {
        fr: `<p>Les histoires sont générées automatiquement par un modèle d’intelligence artificielle, à partir de vos choix. Malgré les consignes de sécurité appliquées, un texte peut contenir des erreurs, des incohérences ou des passages inadaptés. Nous recommandons qu’un adulte lise ou écoute l’histoire avec l’enfant, et vous remercions de nous signaler tout contenu inapproprié à ${mail(email)}.</p>`,
        en: `<p>Stories are generated automatically by an artificial intelligence model, based on your choices. Despite the safety rules in place, a text may contain mistakes, inconsistencies or unsuitable passages. We recommend that an adult reads or listens to the story with the child, and we thank you for reporting any inappropriate content to ${mail(email)}.</p>`,
        de: `<p>Die Geschichten werden auf Grundlage deiner Auswahl automatisch von einem KI-Modell erzeugt. Trotz der angewandten Sicherheitsvorgaben kann ein Text Fehler, Ungereimtheiten oder unpassende Passagen enthalten. Wir empfehlen, dass ein Erwachsener die Geschichte gemeinsam mit dem Kind liest oder anhört, und danken dir, wenn du uns unangemessene Inhalte an ${mail(email)} meldest.</p>`,
      },
    );
  }

  if (app.trademark) {
    add(
      'marques',
      { fr: 'Marques', en: 'Trademarks', de: 'Marken' },
      {
        fr: `<p>${app.trademark.fr}</p><p>${name} est un outil d’accompagnement : un exemplaire du jeu est nécessaire pour jouer.</p>`,
        en: `<p>${app.trademark.en}</p><p>${name} is a companion tool: you need a copy of the game to play.</p>`,
        de: `<p>${app.trademark.de}</p><p>${name} ist eine Begleit-App: Zum Spielen brauchst du ein Exemplar des Spiels.</p>`,
      },
    );
  }

  add(
    'utilisation',
    { fr: 'Utilisation acceptable', en: 'Acceptable use', de: 'Zulässige Nutzung' },
    {
      fr: `<p>Vous vous engagez à utiliser l’app conformément aux lois applicables et à ne pas chercher à la copier, la modifier, la décompiler ou en contourner les limitations techniques, sauf dans la mesure où la loi l’autorise.</p>`,
      en: `<p>You agree to use the app in accordance with applicable laws and not to copy, modify, decompile it or circumvent its technical limitations, except to the extent permitted by law.</p>`,
      de: `<p>Du verpflichtest dich, die App im Einklang mit den geltenden Gesetzen zu nutzen und sie nicht zu kopieren, zu verändern, zu dekompilieren oder ihre technischen Beschränkungen zu umgehen, soweit das Gesetz dies nicht ausdrücklich erlaubt.</p>`,
    },
  );

  add(
    'propriete',
    { fr: 'Propriété intellectuelle', en: 'Intellectual property', de: 'Geistiges Eigentum' },
    {
      fr: `<p>L’app, son nom, son icône, son design et ses contenus sont protégés par le droit de la propriété intellectuelle et restent la propriété de ${site.author}. Toute reproduction non autorisée est interdite.</p>`,
      en: `<p>The app, its name, icon, design and content are protected by intellectual property law and remain the property of ${site.author}. Any unauthorized reproduction is prohibited.</p>`,
      de: `<p>Die App, ihr Name, ihr Symbol, ihr Design und ihre Inhalte sind urheberrechtlich geschützt und bleiben Eigentum von ${site.author}. Jede nicht genehmigte Vervielfältigung ist untersagt.</p>`,
    },
  );

  add(
    'responsabilite',
    { fr: 'Responsabilité', en: 'Liability', de: 'Haftung' },
    {
      fr: `<p>Nous faisons de notre mieux pour proposer une app fiable et à jour, mais elle est fournie « en l’état », sans garantie d’absence d’erreur ni de disponibilité permanente. Dans les limites permises par la loi, nous ne pouvons être tenus responsables des dommages indirects liés à son utilisation, notamment d’une perte de données.</p>
<p>Rien dans ces conditions ne limite les droits dont vous bénéficiez en tant que consommateur en vertu de la loi applicable.</p>`,
      en: `<p>We do our best to provide a reliable, up-to-date app, but it is provided “as is”, without any guarantee that it will be error-free or always available. To the extent permitted by law, we cannot be held liable for indirect damage arising from its use, including data loss.</p>
<p>Nothing in these terms limits the rights you have as a consumer under applicable law.</p>`,
      de: `<p>Wir tun unser Bestes, um eine zuverlässige und aktuelle App anzubieten. Sie wird jedoch „wie besehen“ bereitgestellt, ohne Gewähr für Fehlerfreiheit oder ständige Verfügbarkeit. Soweit gesetzlich zulässig, haften wir nicht für mittelbare Schäden, die aus ihrer Nutzung entstehen, insbesondere nicht für Datenverlust.</p>
<p>Nichts in diesen Bedingungen schränkt die Rechte ein, die dir als Verbraucher nach geltendem Recht zustehen.</p>`,
    },
  );

  add(
    'evolution',
    { fr: 'Évolution de l’app et des conditions', en: 'Changes to the app and these terms', de: 'Änderungen der App und dieser Bedingungen' },
    {
      fr: `<p>Nous pouvons faire évoluer l’app, ajouter, modifier ou retirer des fonctionnalités, et mettre à jour ces conditions. La version en vigueur est toujours disponible sur cette page, avec sa date de mise à jour.</p>`,
      en: `<p>We may change the app, add, modify or remove features, and update these terms. The current version is always available on this page, together with its update date.</p>`,
      de: `<p>Wir können die App weiterentwickeln, Funktionen hinzufügen, ändern oder entfernen und diese Bedingungen aktualisieren. Die gültige Fassung ist immer auf dieser Seite verfügbar, zusammen mit dem Datum ihrer Aktualisierung.</p>`,
    },
  );

  add('contact', { fr: 'Contact', en: 'Contact', de: 'Kontakt' }, {
    fr: `<p>Une question sur ces conditions ? Écrivez à ${mail(email)}.</p>`,
    en: `<p>Questions about these terms? Email ${mail(email)}.</p>`,
    de: `<p>Fragen zu diesen Bedingungen? Schreib an ${mail(email)}.</p>`,
  });

  return { summary, sections };
}
