import type { Language } from '../types';

type FaqItem = { question: string; answer: string };
type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  horizon: string;
};

const localized = <T,>(value: Record<Language, T>) => value;

export const EXTRA_FAQ_ITEMS = localized({
  en: [
    {
      question: 'Do you sell CGM, pumps, or pens?',
      answer: 'No. Type1 and 2 is software only. We do not sell, ship, install, or calibrate medical hardware. You connect devices you already own.',
    },
    {
      question: 'Does Type1 and 2 provide medical care?',
      answer: 'No. We are a software company only. We do not provide medical advice, clinical oversight, or emergency response.',
    },
    {
      question: 'What is the difference between Type 1 and Type 2 in the app?',
      answer: 'Type 1 focuses on insulin-dependent safety: stronger low alerts, parent/caregiver roles, and night escalation. Type 2 uses gentler day defaults and watches high glucose earlier while keeping the same calm response flow.',
    },
    {
      question: 'Who should create the account?',
      answer: 'Usually a parent or adult living with diabetes creates the household, then invites family or backup support. Choose Type 1 or Type 2 during signup so defaults match your household.',
    },
    {
      question: 'Can I sign in with Google?',
      answer: 'Yes, when Google sign-in is enabled for your deployment. You can also use email and password, including password reset if you forget your credentials.',
    },
    {
      question: 'Does Voice guide speak and answer in my language?',
      answer: 'Yes. Voice guide follows the site language you choose — all eleven supported languages. On the public site you can chat in that language; in Member zone you can also speak and hear replies in the same language.',
    },
    {
      question: 'How do I reset a forgotten password?',
      answer: 'On the sign-in screen tap “Forgot password?”, enter your email, then paste the reset token from your email (or the development token in local testing) and choose a new password.',
    },
  ] satisfies FaqItem[],
  ru: [
    { question: 'Вы продаёте CGM, помпы или ручки?', answer: 'Нет. Type1 and 2 — только программа. Мы не продаём, не отправляем, не устанавливаем и не калибруем медоборудование.' },
    { question: 'Type1 and 2 оказывает медицинскую помощь?', answer: 'Нет. Мы software-компания. Мы не даём медицинских консультаций, клинического сопровождения и экстренной помощи.' },
    { question: 'Чем отличаются тип 1 и тип 2 в приложении?', answer: 'Тип 1 — сильнее сигналы при низком сахаре, роли родителя, ночная эскалация. Тип 2 — мягче днём и раньше внимание к высокому сахару.' },
    { question: 'Кто должен создавать аккаунт?', answer: 'Обычно родитель или взрослый с диабетом создаёт семью. При регистрации выберите тип 1 или 2.' },
    { question: 'Можно войти через Google?', answer: 'Да, если вход через Google включён. Также email, пароль и сброс пароля.' },
    { question: 'Голосовой помощник говорит и отвечает на моём языке?', answer: 'Да. Помощник использует язык сайта, который вы выбрали — все одиннадцать языков. На публичном сайте можно писать в чат; в Member zone можно говорить и слышать ответ на том же языке.' },
    { question: 'Как сбросить забытый пароль?', answer: 'На экране входа «Забыли пароль?» → email → токен → новый пароль.' },
  ],
  uk: [
    { question: 'Ви продаєте CGM, помпи чи ручки?', answer: 'Ні. Type1 and 2 — лише програмне забезпечення.' },
    { question: 'Ви лікарі чи надаєте медичну допомогу?', answer: 'Ні. Ми software-компанія. Не надаємо медичних порад, клінічного супроводу чи екстреної допомоги.' },
    { question: 'Чим відрізняються тип 1 і тип 2?', answer: 'Тип 1 — сильніші низькі сигнали і нічна ескалація. Тип 2 — мʼякший день і раніше увага до високого цукру.' },
    { question: 'Хто створює обліковий запис?', answer: 'Зазвичай батько або дорослий із діабетом. Оберіть тип 1 або 2.' },
    { question: 'Чи можна увійти через Google?', answer: 'Так, якщо увімкнено. Також email і пароль.' },
    { question: 'Голосовий помічник відповідає моєю мовою?', answer: 'Так. Він використовує мову сайту — усі одинадцять мов. На сайті — чат; у Member zone — голос і відповідь тією ж мовою.' },
    { question: 'Як скинути пароль?', answer: '«Забули пароль?» → email → токен → новий пароль.' },
  ],
  es: [
    { question: '¿Venden CGM, bombas o plumas?', answer: 'No. Solo software. No vendemos hardware médico.' },
    { question: '¿Type1 and 2 ofrece atención médica?', answer: 'No. Solo software. No ofrecemos consejo médico, supervisión clínica ni respuesta de emergencia.' },
    { question: '¿Diferencia tipo 1 y 2?', answer: 'Tipo 1: alertas bajas más fuertes y escalada nocturna. Tipo 2: día más suave y atención temprana a altos.' },
    { question: '¿Quién crea la cuenta?', answer: 'Normalmente un padre o adulto con diabetes. Elija tipo 1 o 2.' },
    { question: '¿Entrar con Google?', answer: 'Sí, si está habilitado. También email y contraseña.' },
    { question: '¿Voice guide habla y responde en mi idioma?', answer: 'Sí. Sigue el idioma del sitio que elija — los once idiomas. En el sitio público puede chatear; en Member zone también hablar y escuchar en el mismo idioma.' },
    { question: '¿Restablecer contraseña?', answer: '«¿Olvidaste tu contraseña?» → email → token → nueva contraseña.' },
  ],
  fr: [
    { question: 'Vendez-vous des CGM, pompes ou stylos ?', answer: 'Non. Logiciel uniquement.' },
    { question: 'Type1 and 2 fournit-il des soins médicaux ?', answer: 'Non. Logiciel uniquement. Pas de conseil médical, supervision clinique ni réponse d’urgence.' },
    { question: 'Différence type 1 et 2 ?', answer: 'Type 1 : alertes basses et nuit. Type 2 : jour doux et hyperglycémies tôt.' },
    { question: 'Qui crée le compte ?', answer: 'Un parent ou adulte. Choisissez type 1 ou 2.' },
    { question: 'Connexion Google ?', answer: 'Oui si activé. Email et mot de passe aussi.' },
    { question: 'Voice guide parle-t-il et répond-il dans ma langue ?', answer: 'Oui. Il suit la langue du site — les onze langues. Chat sur le site public ; voix et réponses dans la même langue en Member zone.' },
    { question: 'Mot de passe oublié ?', answer: '« Mot de passe oublié ? » → email → jeton → nouveau mot de passe.' },
  ],
  de: [
    { question: 'Verkaufen Sie CGM oder Pumpen?', answer: 'Nein. Nur Software.' },
    { question: 'Bietet Type1 and 2 medizinische Versorgung?', answer: 'Nein. Nur Software. Keine medizinische Beratung, klinische Betreuung oder Notfallreaktion.' },
    { question: 'Unterschied Typ 1 und 2?', answer: 'Typ 1: Unterzucker und Nacht. Typ 2: sanfter Tag, frühe Hohe.' },
    { question: 'Wer erstellt das Konto?', answer: 'Elternteil oder Erwachsener. Typ 1 oder 2 wählen.' },
    { question: 'Google-Anmeldung?', answer: 'Ja wenn aktiviert. Auch E-Mail/Passwort.' },
    { question: 'Spricht Voice guide meine Sprache und antwortet darin?', answer: 'Ja. Er folgt der gewählten Sprache — alle elf. Chat auf der öffentlichen Seite; in Member zone auch sprechen und hören in derselben Sprache.' },
    { question: 'Passwort vergessen?', answer: '« Passwort vergessen? » → E-Mail → Token → neues Passwort.' },
  ],
  zh: [
    { question: '销售 CGM 或泵吗？', answer: '不。仅为软件。' },
    { question: 'Type1 and 2 是否提供医疗护理？', answer: '不。仅为软件。不提供医疗建议、临床监督或紧急响应。' },
    { question: '1 型与 2 型区别？', answer: '1 型：低值与夜间；2 型：温和日间与早关注高值。' },
    { question: '谁创建账户？', answer: '家长或成年患者。注册时选 1 型或 2 型。' },
    { question: 'Google 登录？', answer: '启用时可。也可邮箱密码。' },
    { question: 'Voice guide 会用我的语言回答和说话吗？', answer: '会。它跟随您选择的网站语言——共十一种。公开网站可聊天；Member zone 还可用同一语言说话并听到回复。' },
    { question: '忘记密码？', answer: '登录页“忘记密码？”→ 邮箱 → 令牌 → 新密码。' },
  ],
  ja: [
    { question: 'CGMやポンプを販売？', answer: 'いいえ。ソフトウェアのみ。' },
    { question: 'Type1 and 2 は医療ケアを提供しますか？', answer: 'いいえ。ソフトウェアのみ。医療助言、臨床監督、緊急対応は提供しません。' },
    { question: '1型と2型の違い？', answer: '1型：低値と夜。2型：穏やかな昼と早い高値注意。' },
    { question: '誰がアカウント作成？', answer: '保護者または成人患者。1型か2型を選択。' },
    { question: 'Googleサインイン？', answer: '有効なら可。メールも可。' },
    { question: 'Voice guideは私の言語で答えて話しますか？', answer: 'はい。サイトで選んだ言語（11言語）に合わせます。公開サイトではチャット、Member zoneでは同じ言語で話して聞くこともできます。' },
    { question: 'パスワード忘れ？', answer: '「パスワードをお忘れですか？」→ メール → トークン。' },
  ],
  pt: [
    { question: 'Vendem CGM ou bombas?', answer: 'Não. Apenas software.' },
    { question: 'O Type1 and 2 oferece cuidado médico?', answer: 'Não. Apenas software. Não fornecemos aconselhamento médico, supervisão clínica ou resposta de emergência.' },
    { question: 'Diferença tipo 1 e 2?', answer: 'Tipo 1: baixas e noite. Tipo 2: dia suave e altos cedo.' },
    { question: 'Quem cria a conta?', answer: 'Pai ou adulto. Escolha tipo 1 ou 2.' },
    { question: 'Entrar com Google?', answer: 'Sim se habilitado. Email também.' },
    { question: 'O Voice guide fala e responde no meu idioma?', answer: 'Sim. Segue o idioma do site — os onze idiomas. Chat no site público; na Member zone também falar e ouvir no mesmo idioma.' },
    { question: 'Esqueceu a senha?', answer: '« Esqueceu a senha? » → email → token.' },
  ],
  he: [
    { question: 'מוכרים CGM?', answer: 'לא. תוכנה בלבד.' },
    { question: 'האם Type1 and 2 מספק טיפול רפואי?', answer: 'לא. תוכנה בלבד. אין ייעוץ רפואי, פיקוח קליני או מענה חירום.' },
    { question: 'הבדל סוג 1 ו-2?', answer: 'סוג 1: נמוכים ולילה. סוג 2: יום רך וגבohים מוקדם.' },
    { question: 'מי יוצר חשבון?', answer: 'הורה או מבוגר. בחרו סוג 1 או 2.' },
    { question: 'Google?', answer: 'כן אם מופעל. גם אימייל.' },
    { question: 'האם Voice guide עונה ומדבר בשפתי?', answer: 'כן. הוא עוקב אחר שפת האתר — כל 11 השפות. צ\'אט באתר הציבורי; ב-Member zone גם דיבור והאזנה באותה שפה.' },
    { question: 'שכחתם סיסמה?', answer: '« שכחתם סיסמה? » → אימייל → אסימון.' },
  ],
  ar: [
    { question: 'هل تبيعون CGM؟', answer: 'لا. برمجيات فقط.' },
    { question: 'هل يقدّم Type1 and 2 رعاية طبية؟', answer: 'لا. برمجيات فقط. لا نقدم نصيحة طبية أو إشرافًا سريريًا أو استجابة طوارئ.' },
    { question: 'فرق النوع 1 و2؟', answer: 'النوع 1: انخفاض وليل. النوع 2: نهار أخف وارتفاع مبكر.' },
    { question: 'من ينشئ الحساب؟', answer: 'الوالد أو البالغ. اختر النوع 1 أو 2.' },
    { question: 'Google؟', answer: 'نعم إذا مفعّل. أيضًا البريد.' },
    { question: 'هل يجيب Voice guide ويتحدث بلغتي؟', answer: 'نعم. يتبع لغة الموقع — كل اللغات الـ11. محادثة في الموقع العام؛ في Member zone يمكنك أيضًا التحدث والاستماع بنفس اللغة.' },
    { question: 'نسيت كلمة المرور؟', answer: '« هل نسيت كلمة المرور؟ » → بريد → رمز.' },
  ],
});

export const KNOWLEDGE_QUICK_TIPS = localized({
  en: {
    how: ['Start with steps 1–3 if you are new.', 'Step 7: Voice guide answers in your site language.', 'Parents: Parents column. Type 2 adults: Type 2 column.'],
    faq: ['Voice guide speaks all 11 site languages.', 'See Learning Center for deeper articles.', 'Type 1 vs Type 2 — dedicated FAQ.'],
    learn: ['Open “Voice guide in your language” in Using The Product.', 'Filter by category, open articles.', 'Pathways: foundations → safety → devices → daily life.'],
    news: ['Categories are product/research focus, not personal medical advice.', 'Featured story = recent family-relevant changes.', 'Status shows research vs product focus.'],
    trust: ['Plain-language boundaries — not legal substitute.', 'We do not sell devices or provide clinical care.', 'Full legal text: Privacy, Terms, Medical, Compliance.'],
  },
  ru: {
    how: ['Новичкам — шаги 1–3.', 'Шаг 7: голосовой помощник на языке сайта.', 'Родителям — колонка Parents. T2 — колонка Type 2.'],
    faq: ['Голосовой помощник — все 11 языков сайта.', 'Learning Center — глубже.', 'Тип 1 vs 2 — отдельный вопрос.'],
    learn: ['Статья «Голосовой помощник на вашем языке» в Using The Product.', 'Фильтр → статьи.', 'Маршрут: основы → безопасность → устройства → быт.'],
    news: ['Категории — продукт/исследования, не медсовет.', 'Главная история — недавние изменения.', 'Статус — исследование или фокус.'],
    trust: ['Простые границы — не legal-замена.', 'Не продаём устройства и не лечим.', 'Полный текст: Privacy, Terms, Medical, Compliance.'],
  },
  uk: {
    how: ['Новачкам — кроки 1–3.', 'Батькам — Parents. T2 — Type 2.', 'Вночі сильніше.'],
    faq: ['Learning Center — глибше.', 'Продаж обладнання — FAQ.', 'Тип 1 vs 2 — окреме питання.'],
    learn: ['Фільтр → статті.', 'Глосарій.', 'Маршрут: основи → безпека → пристрої.'],
    news: ['Категорії — продукт/дослідження.', 'Головна історія.', 'Статус.'],
    trust: ['Прості межі.', 'Не продаємо пристрої.', 'Privacy, Terms, Medical, Compliance.'],
  },
  es: {
    how: ['Pasos 1–3 para empezar.', 'Padres: Parents. T2: Type 2.', 'Noche más fuerte.'],
    faq: ['Learning Center.', 'Venta de equipos — FAQ.', 'Tipo 1 vs 2.'],
    learn: ['Filtrar y abrir artículos.', 'Glosario.', 'Rutas sugeridas.'],
    news: ['No es consejo médico personal.', 'Historia destacada.', 'Estados.'],
    trust: ['Límites claros.', 'No vendemos dispositivos.', 'Páginas legales completas.'],
  },
  fr: {
    how: ['Étapes 1–3.', 'Parents / Type 2.', 'Nuit plus forte.'],
    faq: ['Learning Center.', 'Vente d’équipement.', 'Type 1 vs 2.'],
    learn: ['Filtrer.', 'Glossaire.', 'Parcours.'],
    news: ['Pas conseil médical personnel.', 'À la une.', 'Statuts.'],
    trust: ['Limites simples.', 'Pas de vente d’appareils.', 'Pages légales.'],
  },
  de: {
    how: ['Schritte 1–3.', 'Parents / Type 2.', 'Nacht stärker.'],
    faq: ['Learning Center.', 'Geräteverkauf FAQ.', 'Typ 1 vs 2.'],
    learn: ['Filtern.', 'Glossar.', 'Wege.'],
    news: ['Kein persönlicher Medizinrat.', 'Top-Story.', 'Status.'],
    trust: ['Klare Grenzen.', 'Kein Geräteverkauf.', 'Legal-Seiten.'],
  },
  zh: {
    how: ['步骤 1–3 开始.', 'Parents / Type 2 栏.', '夜间更强.'],
    faq: ['Learning Center.', '设备销售 FAQ.', '1 型 vs 2 型.'],
    learn: ['筛选文章.', '术语表.', '学习路径.'],
    news: ['非个人医疗建议.', '头条.', '状态.'],
    trust: ['通俗边界.', '不销售设备.', '法律页.'],
  },
  ja: {
    how: ['ステップ1–3.', 'Parents / Type 2.', '夜は強め.'],
    faq: ['Learning Center.', '機器販売FAQ.', '1型vs2型.'],
    learn: ['フィルター.', '用語集.', 'パス.'],
    news: ['個人の医療助言ではない.', '注目.', 'ステータス.'],
    trust: ['境界説明.', '機器販売なし.', '法的ページ.'],
  },
  pt: {
    how: ['Passos 1–3.', 'Parents / Type 2.', 'Noite mais forte.'],
    faq: ['Learning Center.', 'Venda de equipamentos.', 'Tipo 1 vs 2.'],
    learn: ['Filtrar.', 'Glossário.', 'Caminhos.'],
    news: ['Não é conselho médico.', 'Destaque.', 'Status.'],
    trust: ['Limites claros.', 'Sem venda de dispositivos.', 'Páginas legais.'],
  },
  he: {
    how: ['שלבים 1–3.', 'Parents / Type 2.', 'לילה חזק יותר.'],
    faq: ['Learning Center.', 'מכירת ציוד.', 'סוג 1 vs 2.'],
    learn: ['סינון.', 'מילון.', 'מסלולים.'],
    news: ['לא ייעוץ רפואי.', 'סיפור מוביל.', 'סטטוס.'],
    trust: ['גבולות.', 'לא מוכרים ציוד.', 'דפים משפטיים.'],
  },
  ar: {
    how: ['الخطوات 1–3.', 'Parents / Type 2.', 'ليلاً أقوى.'],
    faq: ['Learning Center.', 'بيع المعدات.', 'النوع 1 vs 2.'],
    learn: ['تصفية.', 'قاموس.', 'مسارات.'],
    news: ['ليس نصيحة طبية.', 'بارز.', 'الحالة.'],
    trust: ['حدود واضحة.', 'لا بيع معدات.', 'صفحات قانونية.'],
  },
});

export const KNOWLEDGE_TIPS_LABEL: Record<Language, string> = {
  en: 'Quick tips for this page',
  ru: 'Краткие подсказки',
  uk: 'Короткі поради',
  es: 'Consejos rápidos',
  fr: 'Conseils rapides',
  de: 'Kurztipps',
  zh: '快速提示',
  ja: 'クイックヒント',
  pt: 'Dicas rápidas',
  he: 'טיפים מהירים',
  ar: 'نصائح سريعة',
};

export const EXTRA_NEWS_EN: NewsItem[] = [
  {
    id: 'news-t1d-product',
    title: 'Type1 and 2 adds clearer Type 1 / Type 2 signup paths and password reset',
    summary: 'Public pages explain household differences, Google sign-in when enabled, and self-service password reset.',
    category: 'Product Update',
    status: 'Available now',
    horizon: 'This release',
  },
  {
    id: 'news-education',
    title: 'Learning Center and FAQ expand with equipment boundaries and care-team reminders',
    summary: 'New entries clarify software-only scope — not a clinician and not a device seller — in all supported languages.',
    category: 'Education',
    status: 'Live on site',
    horizon: 'This release',
  },
];
