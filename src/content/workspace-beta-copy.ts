import type { Language } from '../types';

export type WorkspaceBetaCopy = {
  badge: string;
  title: string;
  body: string;
  dismiss: string;
};

export const WORKSPACE_BETA_COPY: Record<Language, WorkspaceBetaCopy> = {
  en: {
    badge: 'Beta',
    title: 'Support software — not a medical device',
    body: 'Type1 and 2 helps families notice change and coordinate next steps. It is software only — we do not diagnose, treat, or provide medical care.',
    dismiss: 'Dismiss',
  },
  ru: {
    badge: 'Бета',
    title: 'Программа поддержки — не медицинское изделие',
    body: 'Type1 and 2 помогает семье замечать изменения и согласовывать следующий шаг. Это только программа — мы не диагностируем, не лечим и не оказываем медицинскую помощь.',
    dismiss: 'Скрыть',
  },
  uk: {
    badge: 'Бета',
    title: 'Програмне забезпечення підтримки — не медичний виріб',
    body: 'Type1 and 2 допомагає сім’ї помічати зміни та узгоджувати наступний крок. Це лише програмне забезпечення — ми не діагностуємо, не лікуємо і не надаємо медичну допомогу.',
    dismiss: 'Приховати',
  },
  es: {
    badge: 'Beta',
    title: 'Software de apoyo — no es un dispositivo médico',
    body: 'Type1 and 2 ayuda a las familias a notar cambios y coordinar el siguiente paso. Es solo software — no diagnosticamos, no tratamos ni ofrecemos atención médica.',
    dismiss: 'Ocultar',
  },
  fr: {
    badge: 'Bêta',
    title: 'Logiciel d’accompagnement — pas un dispositif médical',
    body: 'Type1 and 2 aide les familles à repérer les changements et coordonner la prochaine étape. Logiciel uniquement — nous ne diagnostiquons pas, ne traitons pas et ne fournissons pas de soins médicaux.',
    dismiss: 'Masquer',
  },
  de: {
    badge: 'Beta',
    title: 'Unterstützungssoftware — kein Medizinprodukt',
    body: 'Type1 and 2 hilft Familien, Veränderungen zu bemerken und den nächsten Schritt abzustimmen. Reine Software — wir diagnostizieren nicht, behandeln nicht und bieten keine medizinische Versorgung.',
    dismiss: 'Ausblenden',
  },
  zh: {
    badge: '测试版',
    title: '支持软件 — 非医疗器械',
    body: 'Type1 and 2 帮助家庭察觉变化并协调下一步。仅为软件——我们不诊断、不治疗，也不提供医疗护理。',
    dismiss: '关闭',
  },
  ja: {
    badge: 'ベータ',
    title: '支援ソフト — 医療機器ではありません',
    body: 'Type1 and 2 は変化に気づき、次の一歩を家族で調整するためのツールです。ソフトウェアのみ — 診断・治療・医療ケアは提供しません。',
    dismiss: '閉じる',
  },
  pt: {
    badge: 'Beta',
    title: 'Software de apoio — não é dispositivo médico',
    body: 'Type1 and 2 ajuda famílias a notar mudanças e coordenar o próximo passo. É apenas software — não diagnosticamos, não tratamos e não fornecemos cuidado médico.',
    dismiss: 'Ocultar',
  },
  he: {
    badge: 'בטא',
    title: 'תוכנת תמיכה — לא מכשיר רפואי',
    body: 'Type1 and 2 עוזרת למשפחות לשים לב לשינוי ולתאם את הצעד הבא. תוכנה בלבד — איננו מאבחנים, מטפלים או מספקים טיפול רפואי.',
    dismiss: 'הסתר',
  },
  ar: {
    badge: 'تجريبي',
    title: 'برنامج دعم — ليس جهازًا طبيًا',
    body: 'Type1 and 2 يساعد العائلات على ملاحظة التغيّر وتنسيق الخطوة التالية. برمجيات فقط — لا نشخّص ولا نعالج ولا نقدم رعاية طبية.',
    dismiss: 'إخفاء',
  },
};

export const ERROR_BOUNDARY_COPY: Record<Language, { title: string; body: string; action: string }> = {
  en: { title: 'Something went wrong', body: 'Refresh the page. If the problem continues, sign out and sign in again.', action: 'Refresh' },
  ru: { title: 'Что-то пошло не так', body: 'Обновите страницу. Если проблема останется, выйдите и войдите снова.', action: 'Обновить' },
  uk: { title: 'Щось пішло не так', body: 'Оновіть сторінку. Якщо проблема залишиться, вийдіть і увійдіть знову.', action: 'Оновити' },
  es: { title: 'Algo salió mal', body: 'Actualiza la página. Si continúa, cierra sesión y vuelve a entrar.', action: 'Actualizar' },
  fr: { title: 'Une erreur est survenue', body: 'Actualisez la page. Si le problème continue, déconnectez-vous puis reconnectez-vous.', action: 'Actualiser' },
  de: { title: 'Etwas ist schiefgelaufen', body: 'Seite neu laden. Wenn es weiter passiert, abmelden und erneut anmelden.', action: 'Neu laden' },
  zh: { title: '出现问题', body: '请刷新页面。若仍有问题，请退出并重新登录。', action: '刷新' },
  ja: { title: '問題が発生しました', body: 'ページを更新してください。続く場合は一度サインアウトして再ログインしてください。', action: '更新' },
  pt: { title: 'Algo deu errado', body: 'Atualize a página. Se continuar, saia e entre novamente.', action: 'Atualizar' },
  he: { title: 'משהו השתבש', body: 'רעננו את הדף. אם הבעיה נמשכת, התנתקו והתחברו שוב.', action: 'רענון' },
  ar: { title: 'حدث خطأ', body: 'حدّث الصفحة. إذا استمرت المشكلة، سجّل الخروج ثم الدخول مجددًا.', action: 'تحديث' },
};
