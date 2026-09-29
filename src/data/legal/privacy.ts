import type { IconName } from '../../components/icons';
import { site } from '../site';
import type { AppData, Lang } from '../types';

export interface LegalSection {
  id: string;
  title: string;
  html: string;
}

export interface LegalDocument {
  summary: string;
  glance: { icon: IconName; label: string }[];
  sections: LegalSection[];
}

const LINKS = {
  applePrivacy: { fr: 'https://www.apple.com/fr/legal/privacy/', en: 'https://www.apple.com/legal/privacy/' },
  revenuecat: 'https://www.revenuecat.com/privacy/',
  supabase: 'https://supabase.com/privacy',
  cnil: 'https://www.cnil.fr/',
};

const a = (href: string, label: string) => `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
const mail = (email: string) => `<a href="mailto:${email}">${email}</a>`;

/**
 * Assemble la politique de confidentialité d'une app à partir de ses
 * pratiques déclarées (src/data/apps.ts → privacy.practices).
 */
export function buildPrivacy(app: AppData, lang: Lang): LegalDocument {
  const has = (practice: AppData['privacy']['practices'][number]) => app.privacy.practices.includes(practice);
  const fr = lang === 'fr';
  const name = app.name;
  const email = app.contactEmail;
  const online = has('story-generation');
  const icloud = has('icloud-sync');
  const purchases = has('revenuecat') || has('storekit');

  const summary = online
    ? fr
      ? `${name} ne demande aucun compte, n’affiche aucune publicité et ne vous suit pas. Pour écrire une histoire, les choix faits dans l’app sont envoyés à notre serveur ; l’histoire obtenue est ensuite conservée uniquement sur votre appareil.`
      : `${name} requires no account, shows no ads and does not track you. To write a story, the choices you make in the app are sent to our server; the resulting story is then kept only on your device.`
    : fr
      ? `${name} ne collecte aucune donnée personnelle permettant de vous identifier. Tout ce que vous saisissez reste sur votre appareil${icloud ? ', ou dans votre propre compte iCloud si vous activez la synchronisation' : ''}.${has('revenuecat') ? ' Seules les informations nécessaires aux achats intégrés sont traitées, de manière anonyme, par Apple et RevenueCat.' : ''}`
      : `${name} does not collect any personal data that identifies you. Everything you enter stays on your device${icloud ? ', or in your own iCloud account if you turn on sync' : ''}.${has('revenuecat') ? ' Only the information needed for in-app purchases is processed, anonymously, by Apple and RevenueCat.' : ''}`;

  const glance: LegalDocument['glance'] = [
    { icon: 'user-off', label: fr ? 'Aucun compte' : 'No account' },
    { icon: 'ban', label: fr ? 'Aucune publicité' : 'No ads' },
    { icon: 'eye-off', label: fr ? 'Aucun pistage' : 'No tracking' },
    online
      ? { icon: 'sparkles', label: fr ? 'Histoires écrites en ligne' : 'Stories written online' }
      : { icon: 'device', label: fr ? 'Données sur votre appareil' : 'Data on your device' },
  ];
  if (icloud) glance.push({ icon: 'cloud', label: fr ? 'Synchro via votre iCloud' : 'Sync via your iCloud' });

  const sections: LegalSection[] = [];
  const add = (id: string, title: string, html: string) => sections.push({ id, title, html });

  add(
    'responsable',
    fr ? 'Qui sommes-nous ?' : 'Who we are',
    fr
      ? `<p>${name} est développée et publiée par ${site.author} (« nous »), responsable des traitements décrits sur cette page. Pour toute question, écrivez à ${mail(email)}.</p>`
      : `<p>${name} is developed and published by ${site.author} (“we”), who is responsible for the processing described on this page. For any question, email ${mail(email)}.</p>`,
  );

  add(
    'donnees',
    fr ? 'Les données que vous saisissez' : 'Data you enter',
    (fr
      ? `<p>Les informations que vous saisissez dans ${name} — ${app.userData.fr} — sont enregistrées dans le stockage local de l’app, sur votre appareil. ${online ? 'Elles ne sont pas conservées sur nos serveurs.' : 'Elles ne nous sont jamais transmises et nous n’y avons pas accès.'}</p>
<p>Si vous sauvegardez votre appareil (sauvegarde iCloud ou sur ordinateur), ces données peuvent être incluses dans la sauvegarde. Celle-ci est gérée par Apple, conformément à sa ${a(LINKS.applePrivacy.fr, 'politique de confidentialité')}.</p>`
      : `<p>The information you enter in ${name} — ${app.userData.en} — is saved in the app’s local storage, on your device. ${online ? 'It is not kept on our servers.' : 'It is never sent to us and we have no access to it.'}</p>
<p>If you back up your device (iCloud or computer backup), this data may be included in the backup, which is managed by Apple under its ${a(LINKS.applePrivacy.en, 'privacy policy')}.</p>`),
  );

  if (has('story-generation')) {
    add(
      'histoires',
      fr ? 'Création des histoires' : 'How stories are created',
      fr
        ? `<p>Pour écrire une histoire, l’app envoie à notre fonction serveur, hébergée par ${a(LINKS.supabase, 'Supabase')}, les paramètres que vous avez choisis : âge de l’enfant, héros, compagnon, décor, durée de lecture, langue de l’appareil et, uniquement si vous le saisissez, le prénom de l’enfant. Ces paramètres sont transmis à un modèle d’intelligence artificielle qui rédige le texte, puis l’histoire est renvoyée à l’app.</p>
<p>Aucun compte ni identifiant personnel n’accompagne la demande, et ces informations ne servent qu’à générer l’histoire demandée. Le prénom est facultatif : laissez le champ vide si vous préférez ne pas le transmettre.</p>`
        : `<p>To write a story, the app sends the settings you chose to our server function, hosted by ${a(LINKS.supabase, 'Supabase')}: the child’s age, hero, companion, setting, reading time, device language and, only if you enter it, the child’s first name. These settings are passed to an artificial intelligence model that writes the text, and the story is then returned to the app.</p>
<p>No account or personal identifier is attached to the request, and this information is only used to generate the story you asked for. The first name is optional: leave the field empty if you would rather not send it.</p>`,
    );
  }

  if (icloud) {
    add(
      'icloud',
      fr ? 'Synchronisation iCloud' : 'iCloud sync',
      fr
        ? `<p>Si vous activez la synchronisation iCloud, vos données sont également enregistrées dans la base de données privée CloudKit de votre compte iCloud, pour être disponibles sur vos autres appareils Apple. Elles sont hébergées et protégées par Apple ; en tant que développeur, nous n’avons aucun accès à leur contenu.</p>
<p>Vous pouvez désactiver la synchronisation à tout moment dans les réglages de l’app, et supprimer les données enregistrées dans iCloud depuis Réglages › [votre nom] › iCloud › Gérer le stockage.</p>`
        : `<p>If you turn on iCloud sync, your data is also saved in the private CloudKit database of your iCloud account, so it is available on your other Apple devices. It is hosted and protected by Apple; as the developer, we have no access to its content.</p>
<p>You can turn sync off at any time in the app’s settings, and delete the data stored in iCloud from Settings › [your name] › iCloud › Manage Storage.</p>`,
    );
  }

  if (has('revenuecat')) {
    add(
      'achats',
      fr ? 'Achats intégrés' : 'In-app purchases',
      fr
        ? `<p>Les achats intégrés sont réglés auprès d’Apple, avec votre identifiant Apple. Nous ne recevons jamais vos coordonnées bancaires, votre nom ni votre adresse e-mail.</p>
<p>Pour vérifier vos achats et les restaurer sur vos appareils, l’app utilise le service ${a(LINKS.revenuecat, 'RevenueCat')} (RevenueCat, Inc., États-Unis). RevenueCat reçoit un identifiant anonyme généré par l’app, les informations de transaction transmises par l’App Store (produit, date, statut) et des données techniques nécessaires à la communication avec ses serveurs (modèle d’appareil, versions d’iOS et de l’app, pays de la boutique, adresse IP). Ces données servent uniquement à gérer l’accès aux fonctions Premium : elles ne sont pas utilisées pour vous identifier ni à des fins publicitaires.</p>`
        : `<p>In-app purchases are paid to Apple, with your Apple Account. We never receive your payment details, your name or your email address.</p>
<p>To verify your purchases and restore them on your devices, the app uses ${a(LINKS.revenuecat, 'RevenueCat')} (RevenueCat, Inc., United States). RevenueCat receives an anonymous identifier generated by the app, the transaction information provided by the App Store (product, date, status) and the technical data needed to talk to its servers (device model, iOS and app versions, storefront country, IP address). This data is only used to manage access to Premium features: it is not used to identify you or for advertising.</p>`,
    );
  }

  if (has('storekit')) {
    add(
      'achats',
      fr ? 'Achats intégrés' : 'In-app purchases',
      fr
        ? `<p>L’achat intégré est réglé auprès d’Apple, avec votre identifiant Apple. Nous ne recevons jamais vos coordonnées bancaires, votre nom ni votre adresse e-mail. L’app vérifie directement sur votre appareil, grâce à StoreKit, si l’achat a été effectué : aucun service tiers n’intervient.</p>`
        : `<p>The in-app purchase is paid to Apple, with your Apple Account. We never receive your payment details, your name or your email address. The app checks directly on your device, using StoreKit, whether the purchase was made: no third-party service is involved.</p>`,
    );
  }

  if (has('camera-on-device') || has('camera-pcc')) {
    const pcc = has('camera-pcc');
    add(
      'appareil-photo',
      fr ? 'Appareil photo' : 'Camera',
      fr
        ? `<p>Si vous utilisez le calcul du score par photo, lorsque cette fonction est disponible sur votre appareil, l’app vous demande l’accès à l’appareil photo. La photo est analysée par Apple Intelligence ${pcc ? 'sur votre iPhone ou, si nécessaire, via Private Cloud Compute, l’infrastructure sécurisée d’Apple, qui n’en conserve aucune trace et n’y donne accès à personne, pas même à Apple' : 'directement sur votre iPhone, avec le modèle intégré à l’appareil'}, dans le seul but de reconnaître les cartes. Elle n’est jamais envoyée sur nos serveurs, n’est pas enregistrée et n’est pas ajoutée à votre photothèque : seules les valeurs des cartes sont conservées avec le score.</p>
<p>Vous pouvez retirer cet accès à tout moment dans Réglages › Confidentialité et sécurité › Appareil photo. La saisie manuelle reste toujours disponible.</p>`
        : `<p>If you use photo scoring, when this feature is available on your device, the app asks for access to the camera. The photo is analyzed by Apple Intelligence ${pcc ? 'on your iPhone or, when needed, through Private Cloud Compute, Apple’s secure infrastructure, which keeps no trace of it and gives access to no one, not even Apple' : 'directly on your iPhone, using the on-device model'}, for the sole purpose of recognizing the cards. It is never sent to our servers, is not stored and is not added to your photo library: only the card values are kept with the score.</p>
<p>You can remove this access at any time in Settings › Privacy & Security › Camera. Manual entry always remains available.</p>`,
    );
  }

  if (has('notifications')) {
    add(
      'notifications',
      fr ? 'Notifications' : 'Notifications',
      fr
        ? `<p>Si vous activez le rappel quotidien, l’app programme une notification locale sur votre appareil. Aucune donnée n’est envoyée pour cela, et vous pouvez désactiver le rappel à tout moment.</p>`
        : `<p>If you turn on the daily reminder, the app schedules a local notification on your device. No data is sent for this, and you can turn the reminder off at any time.</p>`,
    );
  }

  if (has('speech')) {
    add(
      'lecture',
      fr ? 'Lecture à voix haute' : 'Reading aloud',
      fr
        ? `<p>La lecture à voix haute utilise les voix de synthèse intégrées à iOS : le texte est lu directement par votre appareil.</p>`
        : `<p>Reading aloud uses the speech voices built into iOS: the text is read directly by your device.</p>`,
    );
  }

  if (has('external-links')) {
    add(
      'liens',
      fr ? 'Liens externes' : 'External links',
      fr
        ? `<p>L’app peut contenir des liens vers des sites externes, par exemple vers des règles officielles ou d’autres ressources utiles. Ces sites sont soumis à leur propre politique de confidentialité.</p>`
        : `<p>The app may contain links to external websites, for example to official rules or other useful resources. These websites have their own privacy policies.</p>`,
    );
  }

  add(
    'pistage',
    fr ? 'Ni publicité, ni pistage' : 'No ads, no tracking',
    fr
      ? `<p>${name} n’affiche aucune publicité, n’intègre aucun outil de mesure d’audience ou d’analyse et ne vous suit pas à travers d’autres apps ou sites. Nous ne vendons, ne louons et ne partageons aucune donnée.</p>`
      : `<p>${name} shows no ads, includes no analytics or audience measurement tools and does not track you across other apps or websites. We do not sell, rent or share any data.</p>`,
  );

  add(
    'enfants',
    fr ? 'Enfants' : 'Children',
    online
      ? fr
        ? `<p>${name} est conçue pour être utilisée par des parents avec leurs enfants. Le seul élément personnel pouvant être transmis est le prénom de l’enfant, facultatif, dans le seul but de l’intégrer à l’histoire. Nous ne créons aucun profil et ne collectons aucune autre donnée concernant les enfants.</p>`
        : `<p>${name} is designed to be used by parents together with their children. The only personal detail that may be sent is the child’s first name, which is optional and only used to include it in the story. We create no profile and collect no other data about children.</p>`
      : fr
        ? `<p>${name} peut être utilisée par tous. Nous ne collectons sciemment aucune donnée personnelle concernant les enfants.</p>`
        : `<p>${name} can be used by everyone. We do not knowingly collect any personal data about children.</p>`,
  );

  add(
    'conservation',
    fr ? 'Conservation et suppression' : 'Retention and deletion',
    (fr
      ? `<p>Vous gardez la main sur vos données : vous pouvez les modifier ou les supprimer à tout moment dans l’app. Supprimer l’app efface toutes les données enregistrées sur l’appareil${icloud ? ' ; les données synchronisées restent dans votre compte iCloud jusqu’à ce que vous les supprimiez' : ''}.</p>`
      : `<p>You stay in control of your data: you can edit or delete it at any time in the app. Deleting the app erases all the data stored on the device${icloud ? '; synced data remains in your iCloud account until you delete it' : ''}.</p>`) +
      (purchases
        ? fr
          ? `<p>Les informations d’achat sont conservées par Apple${has('revenuecat') ? ' et RevenueCat' : ''} aussi longtemps que nécessaire pour gérer vos achats et respecter leurs obligations légales.</p>`
          : `<p>Purchase information is kept by Apple${has('revenuecat') ? ' and RevenueCat' : ''} for as long as needed to manage your purchases and meet their legal obligations.</p>`
        : ''),
  );

  add(
    'droits',
    fr ? 'Vos droits' : 'Your rights',
    fr
      ? `<p>Conformément au Règlement général sur la protection des données (RGPD), vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité. Comme nous ne détenons aucune donnée permettant de vous identifier, la plupart de ces droits s’exercent directement dans l’app. Pour toute demande, écrivez à ${mail(email)}.</p>
<p>Vous pouvez aussi adresser une réclamation à l’autorité de protection des données de votre pays (en France, la ${a(LINKS.cnil, 'CNIL')}).</p>`
      : `<p>Under the General Data Protection Regulation (GDPR) and other applicable laws, you have the right to access, rectify, erase, restrict, object to and port your data. Because we hold no data that identifies you, most of these rights can be exercised directly in the app. For any request, email ${mail(email)}.</p>
<p>You can also lodge a complaint with the data protection authority of your country.</p>`,
  );

  add(
    'modifications',
    fr ? 'Modifications' : 'Changes',
    fr
      ? `<p>Cette politique peut évoluer, notamment lors de l’ajout de nouvelles fonctionnalités. La date de dernière mise à jour figure en haut de cette page, et les changements importants seront signalés dans les notes de version de l’app.</p>`
      : `<p>This policy may change, especially when new features are added. The date of the last update is shown at the top of this page, and significant changes will be mentioned in the app’s release notes.</p>`,
  );

  add(
    'contact',
    'Contact',
    fr
      ? `<p>Une question sur cette politique ou sur vos données ? Écrivez à ${mail(email)}.</p>`
      : `<p>Questions about this policy or your data? Email ${mail(email)}.</p>`,
  );

  return { summary, glance, sections };
}
