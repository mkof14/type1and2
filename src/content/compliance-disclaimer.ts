import type { Language } from '../types';

export type ComplianceDisclaimer = {
  short: string;
  footer: string;
  bannerTitle: string;
  bannerBody: string;
  bullets: string[];
};

const en: ComplianceDisclaimer = {
  short: 'Not a medical device. Not a doctor. We do not sell CGM hardware or make diagnoses.',
  footer:
    'Type1 and 2 is software support only — not a medical device, not a doctor, not a pharmacy, and not an equipment seller. We do not diagnose, treat, prescribe, or guarantee outcomes.',
  bannerTitle: 'Important — please read',
  bannerBody:
    'This website and product are for education and daily coordination only. They are not medical advice and do not create a doctor–patient relationship.',
  bullets: [
    'We are not doctors, nurses, pharmacies, or emergency services.',
    'We do not sell, ship, install, or calibrate CGM pumps, pens, or other medical hardware.',
    'We do not diagnose diabetes or any other condition, and we do not prescribe treatment.',
    'Software messages depend on device data, connectivity, and human response — they can be delayed or incomplete.',
    'We do not provide medical advice, clinical oversight, or emergency response through this product.',
  ],
};

export const COMPLIANCE_DISCLAIMER: Record<Language, ComplianceDisclaimer> = {
  en,
  ru: {
    short: 'Не медицинское устройство. Не врач. Мы не продаём CGM и не ставим диагнозы.',
    footer:
      'Type1 and 2 — только программная поддержка: не медицинское устройство, не врач, не аптека и не продавец оборудования. Мы не диагностируем, не лечим, не назначаем терапию и не гарантируем результат.',
    bannerTitle: 'Важно — прочитайте',
    bannerBody:
      'Этот сайт и продукт предназначены для обучения и ежедневной координации. Это не медицинский совет и не создаёт отношений «врач–пациент».',
    bullets: [
      'Мы не врачи, не медсёстры, не аптека и не служба экстренной помощи.',
      'Мы не продаём, не отправляем, не устанавливаем и не калибруем CGM, помпы, ручки и другое медоборудование.',
      'Мы не ставим диагноз сахарного диабета или других состояний и не назначаем лечение.',
      'Сообщения программы зависят от данных устройства, связи и реакции людей — они могут запаздывать или быть неполными.',
      'Мы не оказываем медицинских консультаций, клинического сопровождения и экстренной помощи через этот продукт.',
    ],
  },
  uk: {
    short: 'Не медичний пристрій. Не лікар. Ми не продаємо CGM і не ставимо діагнози.',
    footer:
      'Type1 and 2 — лише програмна підтримка: не медичний пристрій, не лікар, не аптека й не продавець обладнання. Ми не діагностуємо, не лікуємо, не призначаємо терапію й не гарантуємо результат.',
    bannerTitle: 'Важливо — прочитайте',
    bannerBody:
      'Цей сайт і продукт призначені для навчання та щоденної координації. Це не медична порада і не створює стосунків «лікар–пацієнт».',
    bullets: [
      'Ми не лікарі, не медсестри, не аптека й не екстрені служби.',
      'Ми не продаємо, не відправляємо, не встановлюємо й не калібруємо CGM, помпи, ручки та інше медобладнання.',
      'Ми не ставимо діагноз цукрового діабету чи інших станів і не призначаємо лікування.',
      'Повідомлення залежать від даних пристрою, звʼязку та реакції людей — вони можуть запізнюватися або бути неповними.',
      'Ми не надаємо медичних порад, клінічного супроводу чи екстреної допомоги через цей продукт.',
    ],
  },
  es: {
    short: 'No es un dispositivo médico. No somos médicos. No vendemos CGM ni diagnosticamos.',
    footer:
      'Type1 and 2 es solo software de apoyo: no es un dispositivo médico, no es un médico, no es una farmacia ni un vendedor de equipos. No diagnosticamos, tratamos, recetamos ni garantizamos resultados.',
    bannerTitle: 'Importante — lea esto',
    bannerBody:
      'Este sitio y producto son para educación y coordinación diaria. No son consejo médico ni crean una relación médico–paciente.',
    bullets: [
      'No somos médicos, enfermeras, farmacias ni servicios de emergencia.',
      'No vendemos, enviamos, instalamos ni calibramos CGM, bombas, plumas u otro hardware médico.',
      'No diagnosticamos diabetes ni otras condiciones ni prescribimos tratamiento.',
      'Los mensajes dependen de datos del dispositivo, conectividad y respuesta humana — pueden retrasarse o estar incompletos.',
      'No ofrecemos consejo médico, supervisión clínica ni respuesta de emergencia a través de este producto.',
    ],
  },
  fr: {
    short: 'Pas un dispositif médical. Pas un médecin. Nous ne vendons pas de CGM et ne posons pas de diagnostic.',
    footer:
      'Type1 and 2 est un logiciel de soutien uniquement — pas un dispositif médical, pas un médecin, pas une pharmacie ni un vendeur d’équipement. Nous ne diagnostiquons pas, ne traitons pas, ne prescrivons pas et ne garantissons aucun résultat.',
    bannerTitle: 'Important — à lire',
    bannerBody:
      'Ce site et ce produit servent à l’éducation et à la coordination quotidienne. Ce n’est pas un avis médical et cela ne crée pas de relation médecin–patient.',
    bullets: [
      'Nous ne sommes ni médecins, ni infirmiers, ni pharmacie, ni services d’urgence.',
      'Nous ne vendons, n’expédions, n’installons ni ne calibrons de CGM, pompes, stylos ou autre matériel médical.',
      'Nous ne diagnostiquons pas le diabète ni d’autres affections et ne prescrivons pas de traitement.',
      'Les messages dépendent des données, de la connectivité et de la réponse humaine — ils peuvent être retardés ou incomplets.',
      'Nous ne fournissons pas de conseil médical, de supervision clinique ni de réponse d’urgence via ce produit.',
    ],
  },
  de: {
    short: 'Kein Medizinprodukt. Kein Arzt. Wir verkaufen kein CGM und stellen keine Diagnosen.',
    footer:
      'Type1 and 2 ist reine Software-Unterstützung — kein Medizinprodukt, kein Arzt, keine Apotheke und kein Gerätehändler. Wir diagnostizieren, behandeln, verschreiben nicht und garantieren keine Ergebnisse.',
    bannerTitle: 'Wichtig — bitte lesen',
    bannerBody:
      'Diese Website und dieses Produkt dienen Bildung und täglicher Koordination. Es ist keine medizinische Beratung und begründet kein Arzt–Patient-Verhältnis.',
    bullets: [
      'Wir sind keine Ärzte, Pflegekräfte, Apotheken oder Notdienste.',
      'Wir verkaufen, versenden, installieren oder kalibrieren kein CGM, keine Pumpen, Pens oder andere Medizingeräte.',
      'Wir stellen keinen Diabetes oder andere Erkrankungen fest und verschreiben keine Behandlung.',
      'Meldungen hängen von Gerätedaten, Verbindung und menschlicher Reaktion ab — sie können verzögert oder unvollständig sein.',
      'Wir bieten über dieses Produkt keine medizinische Beratung, klinische Betreuung oder Notfallreaktion.',
    ],
  },
  zh: {
    short: '非医疗设备。非医生。我们不销售 CGM，也不做诊断。',
    footer:
      'Type1 and 2 仅为软件支持——不是医疗设备、不是医生、不是药房，也不是设备销售方。我们不诊断、不治疗、不开处方，也不保证结果。',
    bannerTitle: '重要 — 请阅读',
    bannerBody: '本网站和产品用于教育和日常协调，不构成医疗建议，也不建立医患关系。',
    bullets: [
      '我们不是医生、护士、药房或急救服务。',
      '我们不销售、配送、安装或校准 CGM、泵、笔或其他医疗硬件。',
      '我们不诊断糖尿病或其他疾病，也不开具治疗方案。',
      '软件信息依赖设备数据、连接和人工响应——可能延迟或不完整。',
      '我们通过本产品不提供医疗建议、临床监督或紧急响应。',
    ],
  },
  ja: {
    short: '医療機器ではありません。医師ではありません。CGM の販売や診断は行いません。',
    footer:
      'Type1 and 2 はソフトウェア支援のみです — 医療機器でも医師でも薬局でも機器販売者でもありません。診断・治療・処方・結果の保証は行いません。',
    bannerTitle: '重要 — お読みください',
    bannerBody: 'このサイトと製品は教育と日常の連携のためのものです。医療助言ではなく、医師と患者の関係は生じません。',
    bullets: [
      '私たちは医師・看護師・薬局・救急サービスではありません。',
      'CGM、ポンプ、ペンなどの医療機器の販売・配送・設置・校正は行いません。',
      '糖尿病などの診断や治療の処方は行いません。',
      '表示は機器データ・接続・人の対応に依存し、遅延や欠落がある場合があります。',
      'この製品を通じて医療助言、臨床監督、緊急対応は提供しません。',
    ],
  },
  pt: {
    short: 'Não é dispositivo médico. Não somos médicos. Não vendemos CGM nem diagnosticamos.',
    footer:
      'Type1 and 2 é apenas software de apoio — não é dispositivo médico, médico, farmácia ou vendedor de equipamentos. Não diagnosticamos, tratamos, prescrevemos nem garantimos resultados.',
    bannerTitle: 'Importante — leia',
    bannerBody:
      'Este site e produto servem para educação e coordenação diária. Não são aconselhamento médico nem criam relação médico–paciente.',
    bullets: [
      'Não somos médicos, enfermeiros, farmácias ou serviços de emergência.',
      'Não vendemos, enviamos, instalamos ou calibramos CGM, bombas, canetas ou outro hardware médico.',
      'Não diagnosticamos diabetes ou outras condições nem prescrevemos tratamento.',
      'As mensagens dependem de dados do dispositivo, conectividade e resposta humana — podem atrasar ou ficar incompletas.',
      'Não fornecemos aconselhamento médico, supervisão clínica ou resposta de emergência por meio deste produto.',
    ],
  },
  he: {
    short: 'לא מכשיר רפואי. לא רופא. איננו מוכרים CGM ואיננו מאבחנים.',
    footer:
      'Type1 and 2 הוא תמיכת תוכנה בלבד — לא מכשיר רפואי, לא רופא, לא בית מרקחת ולא מוכר ציוד. איננו מאבחנים, מטפלים, מרשמים או מבטיחים תוצאות.',
    bannerTitle: 'חשוב — קראו',
    bannerBody: 'האתר והמוצר מיועדים ללמידה ולתיאום יומי. זו לא ייעוץ רפואי ולא יוצרת יחסי רופא–מטופל.',
    bullets: [
      'איננו רופאים, אחיות, בתי מרקחת או שירותי חירום.',
      'איננו מוכרים, שולחים, מתקינים או מכיילים CGM, מש pumps, עטים או ציוד רפואי אחר.',
      'איננו מאבחנים סוכרת או מצבים אחרים ואיננו מרשמים טיפול.',
      'הודעות התוכנה תלויות בנתוני מכשיר, קישוריות ותגובה אנושית — עלולות להתעכב או להיות חלקיות.',
      'איננו מספקים ייעוץ רפואי, פיקוח קליני או מענה חירום דרך מוצר זה.',
    ],
  },
  ar: {
    short: 'ليس جهازًا طبيًا. لسنا أطباء. لا نبيع CGM ولا نشخّص.',
    footer:
      'Type1 and 2 دعم برمجي فقط — ليس جهازًا طبيًا ولا طبيبًا ولا صيدلية ولا بائع معدات. لا نشخّص ولا نعالج ولا نصف ولا نضمن النتائج.',
    bannerTitle: 'مهم — اقرأ',
    bannerBody: 'هذا الموقع والمنتج للتعليم والتنسيق اليومي. ليسا نصيحة طبية ولا ينشئان علاقة طبيب–مريض.',
    bullets: [
      'لسنا أطباء أو ممرضين أو صيدليات أو خدمات طوارئ.',
      'لا نبيع أو نشحن أو نثبت أو نعاير CGM أو مضخات أو أقلام أو أي معدات طبية.',
      'لا نشخّص السكري أو أي حالة ولا نصف العلاج.',
      'تعتمد الرسائل على بيانات الجهاز والاتصال والاستجابة البشرية — وقد تتأخر أو تكون ناقصة.',
      'لا نقدم نصيحة طبية أو إشرافًا سريريًا أو استجابة طوارئ من خلال هذا المنتج.',
    ],
  },
};
