import type { IconName } from '../../components/icons';
import { site } from '../site';
import type { AppData, Lang, Text } from '../types';

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
  applePrivacy: {
    fr: 'https://www.apple.com/fr/legal/privacy/',
    en: 'https://www.apple.com/legal/privacy/',
    de: 'https://www.apple.com/de/legal/privacy/',
  },
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
  const tr = (texts: Text) => texts[lang];
  const name = app.name;
  const email = app.contactEmail;
  const online = has('story-generation');
  const icloud = has('icloud-sync');
  const purchases = has('revenuecat') || has('storekit');

  const summary = online
    ? tr({
        fr: `${name} ne demande aucun compte, n’affiche aucune publicité et ne vous suit pas. Pour écrire une histoire, les choix faits dans l’app sont envoyés à notre serveur ; l’histoire obtenue est ensuite conservée uniquement sur votre appareil.`,
        en: `${name} requires no account, shows no ads and does not track you. To write a story, the choices you make in the app are sent to our server; the resulting story is then kept only on your device.`,
        de: `${name} verlangt kein Konto, zeigt keine Werbung und verfolgt dich nicht. Um eine Geschichte zu schreiben, werden die in der App getroffenen Entscheidungen an unseren Server gesendet; die fertige Geschichte wird anschließend nur auf deinem Gerät gespeichert.`,
      })
    : tr({
        fr: `${name} ne collecte aucune donnée personnelle permettant de vous identifier. Tout ce que vous saisissez reste sur votre appareil${icloud ? ', ou dans votre propre compte iCloud si vous activez la synchronisation' : ''}.${has('revenuecat') ? ' Seules les informations nécessaires aux achats intégrés sont traitées, de manière anonyme, par Apple et RevenueCat.' : ''}`,
        en: `${name} does not collect any personal data that identifies you. Everything you enter stays on your device${icloud ? ', or in your own iCloud account if you turn on sync' : ''}.${has('revenuecat') ? ' Only the information needed for in-app purchases is processed, anonymously, by Apple and RevenueCat.' : ''}`,
        de: `${name} erfasst keine personenbezogenen Daten, die dich identifizieren. Alles, was du eingibst, bleibt auf deinem Gerät${icloud ? ' oder in deinem eigenen iCloud-Account, wenn du die Synchronisierung aktivierst' : ''}.${has('revenuecat') ? ' Nur die für In-App-Käufe nötigen Informationen werden anonym von Apple und RevenueCat verarbeitet.' : ''}`,
      });

  const glance: LegalDocument['glance'] = [
    { icon: 'user-off', label: tr({ fr: 'Aucun compte', en: 'No account', de: 'Kein Konto' }) },
    { icon: 'ban', label: tr({ fr: 'Aucune publicité', en: 'No ads', de: 'Keine Werbung' }) },
    { icon: 'eye-off', label: tr({ fr: 'Aucun pistage', en: 'No tracking', de: 'Kein Tracking' }) },
    online
      ? { icon: 'sparkles', label: tr({ fr: 'Histoires écrites en ligne', en: 'Stories written online', de: 'Geschichten online geschrieben' }) }
      : { icon: 'device', label: tr({ fr: 'Données sur votre appareil', en: 'Data on your device', de: 'Daten auf deinem Gerät' }) },
  ];
  if (icloud) glance.push({ icon: 'cloud', label: tr({ fr: 'Synchro via votre iCloud', en: 'Sync via your iCloud', de: 'Sync über dein iCloud' }) });

  const sections: LegalSection[] = [];
  const add = (id: string, title: Text, html: Text) => sections.push({ id, title: tr(title), html: tr(html) });

  add(
    'responsable',
    { fr: 'Qui sommes-nous ?', en: 'Who we are', de: 'Wer wir sind' },
    {
      fr: `<p>${name} est développée et publiée par ${site.author} (« nous »), responsable des traitements décrits sur cette page. Pour toute question, écrivez à ${mail(email)}.</p>`,
      en: `<p>${name} is developed and published by ${site.author} (“we”), who is responsible for the processing described on this page. For any question, email ${mail(email)}.</p>`,
      de: `<p>${name} wird von ${site.author} („wir“) entwickelt und veröffentlicht, der für die auf dieser Seite beschriebene Verarbeitung verantwortlich ist. Bei Fragen schreib an ${mail(email)}.</p>`,
    },
  );

  add(
    'donnees',
    { fr: 'Les données que vous saisissez', en: 'Data you enter', de: 'Daten, die du eingibst' },
    {
      fr: `<p>Les informations que vous saisissez dans ${name} — ${app.userData.fr} — sont enregistrées dans le stockage local de l’app, sur votre appareil. ${online ? 'Elles ne sont pas conservées sur nos serveurs.' : 'Elles ne nous sont jamais transmises et nous n’y avons pas accès.'}</p>
<p>Si vous sauvegardez votre appareil (sauvegarde iCloud ou sur ordinateur), ces données peuvent être incluses dans la sauvegarde. Celle-ci est gérée par Apple, conformément à sa ${a(LINKS.applePrivacy.fr, 'politique de confidentialité')}.</p>`,
      en: `<p>The information you enter in ${name} — ${app.userData.en} — is saved in the app’s local storage, on your device. ${online ? 'It is not kept on our servers.' : 'It is never sent to us and we have no access to it.'}</p>
<p>If you back up your device (iCloud or computer backup), this data may be included in the backup, which is managed by Apple under its ${a(LINKS.applePrivacy.en, 'privacy policy')}.</p>`,
      de: `<p>Die Informationen, die du in ${name} eingibst – ${app.userData.de} –, werden im lokalen Speicher der App auf deinem Gerät gesichert. ${online ? 'Sie werden nicht auf unseren Servern aufbewahrt.' : 'Sie werden nie an uns übertragen, und wir haben keinen Zugriff darauf.'}</p>
<p>Wenn du dein Gerät sicherst (iCloud-Backup oder Backup auf dem Computer), können diese Daten im Backup enthalten sein. Dieses wird von Apple gemäß seiner ${a(LINKS.applePrivacy.de, 'Datenschutzrichtlinie')} verwaltet.</p>`,
    },
  );

  if (has('story-generation')) {
    add(
      'histoires',
      { fr: 'Création des histoires', en: 'How stories are created', de: 'Wie Geschichten entstehen' },
      {
        fr: `<p>Pour écrire une histoire, l’app envoie à notre fonction serveur, hébergée par ${a(LINKS.supabase, 'Supabase')}, les paramètres que vous avez choisis : âge de l’enfant, héros, compagnon, décor, durée de lecture, langue de l’appareil et, uniquement si vous le saisissez, le prénom de l’enfant. Ces paramètres sont transmis à un modèle d’intelligence artificielle qui rédige le texte, puis l’histoire est renvoyée à l’app.</p>
<p>Aucun compte ni identifiant personnel n’accompagne la demande, et ces informations ne servent qu’à générer l’histoire demandée. Le prénom est facultatif : laissez le champ vide si vous préférez ne pas le transmettre.</p>`,
        en: `<p>To write a story, the app sends the settings you chose to our server function, hosted by ${a(LINKS.supabase, 'Supabase')}: the child’s age, hero, companion, setting, reading time, device language and, only if you enter it, the child’s first name. These settings are passed to an artificial intelligence model that writes the text, and the story is then returned to the app.</p>
<p>No account or personal identifier is attached to the request, and this information is only used to generate the story you asked for. The first name is optional: leave the field empty if you would rather not send it.</p>`,
        de: `<p>Um eine Geschichte zu schreiben, sendet die App die von dir gewählten Einstellungen an unsere Serverfunktion, die bei ${a(LINKS.supabase, 'Supabase')} gehostet wird: Alter des Kindes, Held, Begleiter, Schauplatz, Lesedauer, Gerätesprache und – nur wenn du ihn eingibst – den Vornamen des Kindes. Diese Einstellungen werden an ein KI-Modell übergeben, das den Text schreibt; anschließend wird die Geschichte an die App zurückgeschickt.</p>
<p>Der Anfrage ist weder ein Konto noch eine persönliche Kennung beigefügt, und diese Informationen dienen ausschließlich dazu, die gewünschte Geschichte zu erzeugen. Der Vorname ist optional: Lass das Feld leer, wenn du ihn lieber nicht übermitteln möchtest.</p>`,
      },
    );
  }

  if (icloud) {
    add(
      'icloud',
      { fr: 'Synchronisation iCloud', en: 'iCloud sync', de: 'iCloud-Synchronisierung' },
      {
        fr: `<p>Si vous activez la synchronisation iCloud, vos données sont également enregistrées dans la base de données privée CloudKit de votre compte iCloud, pour être disponibles sur vos autres appareils Apple. Elles sont hébergées et protégées par Apple ; en tant que développeur, nous n’avons aucun accès à leur contenu.</p>
<p>Vous pouvez désactiver la synchronisation à tout moment dans les réglages de l’app, et supprimer les données enregistrées dans iCloud depuis Réglages › [votre nom] › iCloud › Gérer le stockage.</p>`,
        en: `<p>If you turn on iCloud sync, your data is also saved in the private CloudKit database of your iCloud account, so it is available on your other Apple devices. It is hosted and protected by Apple; as the developer, we have no access to its content.</p>
<p>You can turn sync off at any time in the app’s settings, and delete the data stored in iCloud from Settings › [your name] › iCloud › Manage Storage.</p>`,
        de: `<p>Wenn du die iCloud-Synchronisierung aktivierst, werden deine Daten zusätzlich in der privaten CloudKit-Datenbank deines iCloud-Accounts gespeichert, damit sie auf deinen anderen Apple-Geräten verfügbar sind. Sie werden von Apple gehostet und geschützt; als Entwickler haben wir keinerlei Zugriff auf ihren Inhalt.</p>
<p>Du kannst die Synchronisierung jederzeit in den Einstellungen der App deaktivieren und die in iCloud gespeicherten Daten unter Einstellungen › [Dein Name] › iCloud › Speicher verwalten löschen.</p>`,
      },
    );
  }

  if (has('revenuecat')) {
    add(
      'achats',
      { fr: 'Achats intégrés', en: 'In-app purchases', de: 'In-App-Käufe' },
      {
        fr: `<p>Les achats intégrés sont réglés auprès d’Apple, avec votre identifiant Apple. Nous ne recevons jamais vos coordonnées bancaires, votre nom ni votre adresse e-mail.</p>
<p>Pour vérifier vos achats et les restaurer sur vos appareils, l’app utilise le service ${a(LINKS.revenuecat, 'RevenueCat')} (RevenueCat, Inc., États-Unis). RevenueCat reçoit un identifiant anonyme généré par l’app, les informations de transaction transmises par l’App Store (produit, date, statut) et des données techniques nécessaires à la communication avec ses serveurs (modèle d’appareil, versions d’iOS et de l’app, pays de la boutique, adresse IP). Ces données servent uniquement à gérer l’accès aux fonctions Premium : elles ne sont pas utilisées pour vous identifier ni à des fins publicitaires.</p>`,
        en: `<p>In-app purchases are paid to Apple, with your Apple Account. We never receive your payment details, your name or your email address.</p>
<p>To verify your purchases and restore them on your devices, the app uses ${a(LINKS.revenuecat, 'RevenueCat')} (RevenueCat, Inc., United States). RevenueCat receives an anonymous identifier generated by the app, the transaction information provided by the App Store (product, date, status) and the technical data needed to talk to its servers (device model, iOS and app versions, storefront country, IP address). This data is only used to manage access to Premium features: it is not used to identify you or for advertising.</p>`,
        de: `<p>In-App-Käufe werden über Apple mit deinem Apple Account bezahlt. Wir erhalten niemals deine Zahlungsdaten, deinen Namen oder deine E-Mail-Adresse.</p>
<p>Um deine Käufe zu prüfen und auf deinen Geräten wiederherzustellen, nutzt die App den Dienst ${a(LINKS.revenuecat, 'RevenueCat')} (RevenueCat, Inc., USA). RevenueCat erhält eine von der App erzeugte anonyme Kennung, die vom App Store übermittelten Transaktionsinformationen (Produkt, Datum, Status) sowie die für die Kommunikation mit seinen Servern nötigen technischen Daten (Gerätemodell, iOS- und App-Version, Land des Stores, IP-Adresse). Diese Daten dienen ausschließlich dazu, den Zugang zu den Premium-Funktionen zu verwalten: Sie werden weder zu deiner Identifizierung noch zu Werbezwecken verwendet.</p>`,
      },
    );
  }

  if (has('storekit')) {
    add(
      'achats',
      { fr: 'Achats intégrés', en: 'In-app purchases', de: 'In-App-Käufe' },
      {
        fr: `<p>L’achat intégré est réglé auprès d’Apple, avec votre identifiant Apple. Nous ne recevons jamais vos coordonnées bancaires, votre nom ni votre adresse e-mail. L’app vérifie directement sur votre appareil, grâce à StoreKit, si l’achat a été effectué : aucun service tiers n’intervient.</p>`,
        en: `<p>The in-app purchase is paid to Apple, with your Apple Account. We never receive your payment details, your name or your email address. The app checks directly on your device, using StoreKit, whether the purchase was made: no third-party service is involved.</p>`,
        de: `<p>Der In-App-Kauf wird über Apple mit deinem Apple Account bezahlt. Wir erhalten niemals deine Zahlungsdaten, deinen Namen oder deine E-Mail-Adresse. Die App prüft direkt auf deinem Gerät mithilfe von StoreKit, ob der Kauf erfolgt ist: Kein Drittanbieter ist beteiligt.</p>`,
      },
    );
  }

  if (has('camera-on-device') || has('camera-pcc')) {
    const pcc = has('camera-pcc');
    add(
      'appareil-photo',
      { fr: 'Appareil photo', en: 'Camera', de: 'Kamera' },
      {
        fr: `<p>Si vous utilisez le calcul du score par photo, lorsque cette fonction est disponible sur votre appareil, l’app vous demande l’accès à l’appareil photo. La photo est analysée par Apple Intelligence ${pcc ? 'sur votre iPhone ou, si nécessaire, via Private Cloud Compute, l’infrastructure sécurisée d’Apple, qui n’en conserve aucune trace et n’y donne accès à personne, pas même à Apple' : 'directement sur votre iPhone, avec le modèle intégré à l’appareil'}, dans le seul but de reconnaître les cartes. Elle n’est jamais envoyée sur nos serveurs, n’est pas enregistrée et n’est pas ajoutée à votre photothèque : seules les valeurs des cartes sont conservées avec le score.</p>
<p>Vous pouvez retirer cet accès à tout moment dans Réglages › Confidentialité et sécurité › Appareil photo. La saisie manuelle reste toujours disponible.</p>`,
        en: `<p>If you use photo scoring, when this feature is available on your device, the app asks for access to the camera. The photo is analyzed by Apple Intelligence ${pcc ? 'on your iPhone or, when needed, through Private Cloud Compute, Apple’s secure infrastructure, which keeps no trace of it and gives access to no one, not even Apple' : 'directly on your iPhone, using the on-device model'}, for the sole purpose of recognizing the cards. It is never sent to our servers, is not stored and is not added to your photo library: only the card values are kept with the score.</p>
<p>You can remove this access at any time in Settings › Privacy & Security › Camera. Manual entry always remains available.</p>`,
        de: `<p>Wenn du die Punkteberechnung per Foto nutzt – sofern diese Funktion auf deinem Gerät verfügbar ist –, bittet die App um Zugriff auf die Kamera. Das Foto wird von Apple Intelligence ${pcc ? 'auf deinem iPhone oder bei Bedarf über Private Cloud Compute analysiert, die sichere Infrastruktur von Apple, die keine Spuren davon speichert und niemandem Zugriff gewährt, nicht einmal Apple' : 'direkt auf deinem iPhone mit dem integrierten Modell des Geräts analysiert'}, und zwar ausschließlich, um die Karten zu erkennen. Es wird nie an unsere Server gesendet, nicht gespeichert und nicht zu deiner Mediathek hinzugefügt: Nur die Kartenwerte werden mit dem Punktestand gespeichert.</p>
<p>Du kannst diesen Zugriff jederzeit unter Einstellungen › Datenschutz & Sicherheit › Kamera entziehen. Die manuelle Eingabe bleibt immer verfügbar.</p>`,
      },
    );
  }

  if (has('notifications')) {
    add(
      'notifications',
      { fr: 'Notifications', en: 'Notifications', de: 'Mitteilungen' },
      {
        fr: `<p>Si vous activez le rappel quotidien, l’app programme une notification locale sur votre appareil. Aucune donnée n’est envoyée pour cela, et vous pouvez désactiver le rappel à tout moment.</p>`,
        en: `<p>If you turn on the daily reminder, the app schedules a local notification on your device. No data is sent for this, and you can turn the reminder off at any time.</p>`,
        de: `<p>Wenn du die tägliche Erinnerung aktivierst, plant die App eine lokale Mitteilung auf deinem Gerät. Dafür werden keine Daten gesendet, und du kannst die Erinnerung jederzeit deaktivieren.</p>`,
      },
    );
  }

  if (has('speech')) {
    add(
      'lecture',
      { fr: 'Lecture à voix haute', en: 'Reading aloud', de: 'Vorlesen' },
      {
        fr: `<p>La lecture à voix haute utilise les voix de synthèse intégrées à iOS : le texte est lu directement par votre appareil.</p>`,
        en: `<p>Reading aloud uses the speech voices built into iOS: the text is read directly by your device.</p>`,
        de: `<p>Das Vorlesen nutzt die in iOS integrierten Sprachausgabe-Stimmen: Der Text wird direkt von deinem Gerät vorgelesen.</p>`,
      },
    );
  }

  if (has('external-links')) {
    add(
      'liens',
      { fr: 'Liens externes', en: 'External links', de: 'Externe Links' },
      {
        fr: `<p>L’app peut contenir des liens vers des sites externes, par exemple vers des règles officielles ou d’autres ressources utiles. Ces sites sont soumis à leur propre politique de confidentialité.</p>`,
        en: `<p>The app may contain links to external websites, for example to official rules or other useful resources. These websites have their own privacy policies.</p>`,
        de: `<p>Die App kann Links zu externen Websites enthalten, zum Beispiel zu offiziellen Spielregeln oder anderen nützlichen Ressourcen. Für diese Websites gelten deren eigene Datenschutzerklärungen.</p>`,
      },
    );
  }

  add(
    'pistage',
    { fr: 'Ni publicité, ni pistage', en: 'No ads, no tracking', de: 'Keine Werbung, kein Tracking' },
    {
      fr: `<p>${name} n’affiche aucune publicité, n’intègre aucun outil de mesure d’audience ou d’analyse et ne vous suit pas à travers d’autres apps ou sites. Nous ne vendons, ne louons et ne partageons aucune donnée.</p>`,
      en: `<p>${name} shows no ads, includes no analytics or audience measurement tools and does not track you across other apps or websites. We do not sell, rent or share any data.</p>`,
      de: `<p>${name} zeigt keine Werbung, enthält keine Analyse- oder Reichweitenmessungs-Tools und verfolgt dich nicht über andere Apps oder Websites hinweg. Wir verkaufen, vermieten und teilen keine Daten.</p>`,
    },
  );

  add(
    'enfants',
    { fr: 'Enfants', en: 'Children', de: 'Kinder' },
    online
      ? {
          fr: `<p>${name} est conçue pour être utilisée par des parents avec leurs enfants. Le seul élément personnel pouvant être transmis est le prénom de l’enfant, facultatif, dans le seul but de l’intégrer à l’histoire. Nous ne créons aucun profil et ne collectons aucune autre donnée concernant les enfants.</p>`,
          en: `<p>${name} is designed to be used by parents together with their children. The only personal detail that may be sent is the child’s first name, which is optional and only used to include it in the story. We create no profile and collect no other data about children.</p>`,
          de: `<p>${name} ist dafür gedacht, von Eltern gemeinsam mit ihren Kindern genutzt zu werden. Die einzige persönliche Angabe, die übermittelt werden kann, ist der optionale Vorname des Kindes – ausschließlich, um ihn in die Geschichte einzubauen. Wir erstellen keine Profile und erfassen keine weiteren Daten über Kinder.</p>`,
        }
      : {
          fr: `<p>${name} peut être utilisée par tous. Nous ne collectons sciemment aucune donnée personnelle concernant les enfants.</p>`,
          en: `<p>${name} can be used by everyone. We do not knowingly collect any personal data about children.</p>`,
          de: `<p>${name} kann von allen genutzt werden. Wir erfassen wissentlich keine personenbezogenen Daten über Kinder.</p>`,
        },
  );

  const purchaseRetention = has('revenuecat')
    ? { fr: ' et RevenueCat', en: ' and RevenueCat', de: ' und RevenueCat' }
    : { fr: '', en: '', de: '' };
  add(
    'conservation',
    { fr: 'Conservation et suppression', en: 'Retention and deletion', de: 'Speicherdauer und Löschung' },
    {
      fr:
        `<p>Vous gardez la main sur vos données : vous pouvez les modifier ou les supprimer à tout moment dans l’app. Supprimer l’app efface toutes les données enregistrées sur l’appareil${icloud ? ' ; les données synchronisées restent dans votre compte iCloud jusqu’à ce que vous les supprimiez' : ''}.</p>` +
        (purchases
          ? `<p>Les informations d’achat sont conservées par Apple${purchaseRetention.fr} aussi longtemps que nécessaire pour gérer vos achats et respecter leurs obligations légales.</p>`
          : ''),
      en:
        `<p>You stay in control of your data: you can edit or delete it at any time in the app. Deleting the app erases all the data stored on the device${icloud ? '; synced data remains in your iCloud account until you delete it' : ''}.</p>` +
        (purchases
          ? `<p>Purchase information is kept by Apple${purchaseRetention.en} for as long as needed to manage your purchases and meet their legal obligations.</p>`
          : ''),
      de:
        `<p>Du behältst die Kontrolle über deine Daten: Du kannst sie jederzeit in der App bearbeiten oder löschen. Wenn du die App löschst, werden alle auf dem Gerät gespeicherten Daten entfernt${icloud ? '; synchronisierte Daten bleiben in deinem iCloud-Account, bis du sie löschst' : ''}.</p>` +
        (purchases
          ? `<p>Kaufinformationen werden von Apple${purchaseRetention.de} so lange aufbewahrt, wie es für die Verwaltung deiner Käufe und die Erfüllung ihrer gesetzlichen Pflichten nötig ist.</p>`
          : ''),
    },
  );

  add(
    'droits',
    { fr: 'Vos droits', en: 'Your rights', de: 'Deine Rechte' },
    {
      fr: `<p>Conformément au Règlement général sur la protection des données (RGPD), vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité. Comme nous ne détenons aucune donnée permettant de vous identifier, la plupart de ces droits s’exercent directement dans l’app. Pour toute demande, écrivez à ${mail(email)}.</p>
<p>Vous pouvez aussi adresser une réclamation à l’autorité de protection des données de votre pays (en France, la ${a(LINKS.cnil, 'CNIL')}).</p>`,
      en: `<p>Under the General Data Protection Regulation (GDPR) and other applicable laws, you have the right to access, rectify, erase, restrict, object to and port your data. Because we hold no data that identifies you, most of these rights can be exercised directly in the app. For any request, email ${mail(email)}.</p>
<p>You can also lodge a complaint with the data protection authority of your country.</p>`,
      de: `<p>Nach der Datenschutz-Grundverordnung (DSGVO) hast du das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit. Da wir keine Daten besitzen, die dich identifizieren, kannst du die meisten dieser Rechte direkt in der App ausüben. Für jede Anfrage schreib an ${mail(email)}.</p>
<p>Du kannst dich außerdem bei der Datenschutz-Aufsichtsbehörde deines Landes beschweren.</p>`,
    },
  );

  add(
    'modifications',
    { fr: 'Modifications', en: 'Changes', de: 'Änderungen' },
    {
      fr: `<p>Cette politique peut évoluer, notamment lors de l’ajout de nouvelles fonctionnalités. La date de dernière mise à jour figure en haut de cette page, et les changements importants seront signalés dans les notes de version de l’app.</p>`,
      en: `<p>This policy may change, especially when new features are added. The date of the last update is shown at the top of this page, and significant changes will be mentioned in the app’s release notes.</p>`,
      de: `<p>Diese Datenschutzerklärung kann sich ändern, insbesondere wenn neue Funktionen hinzukommen. Das Datum der letzten Aktualisierung steht oben auf dieser Seite, und wichtige Änderungen werden in den Versionshinweisen der App erwähnt.</p>`,
    },
  );

  add('contact', { fr: 'Contact', en: 'Contact', de: 'Kontakt' }, {
    fr: `<p>Une question sur cette politique ou sur vos données ? Écrivez à ${mail(email)}.</p>`,
    en: `<p>Questions about this policy or your data? Email ${mail(email)}.</p>`,
    de: `<p>Fragen zu dieser Datenschutzerklärung oder zu deinen Daten? Schreib an ${mail(email)}.</p>`,
  });

  return { summary, glance, sections };
}
