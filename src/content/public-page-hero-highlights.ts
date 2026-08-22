import type { Language } from '../types';

export type PublicHeroHighlightPage =
  | 'system'
  | 'night'
  | 'family'
  | 'how'
  | 'faq'
  | 'learn'
  | 'news'
  | 'trust'
  | 'voiceGuide'
  | 'pricing'
  | 'privacy'
  | 'terms'
  | 'medical'
  | 'compliance'
  | 'downloadDesktop'
  | 'downloadMobile';

const EN: Partial<Record<PublicHeroHighlightPage, string[]>> = {
  system: ['Device data → plain language', 'One calm next step', 'Type 1 & Type 2 paths'],
  night: ['Closer night support', 'Backup caregiver loop', 'Fewer false alarms'],
  family: ['One shared picture', 'Clear who responds', 'School & caregiver invites'],
  how: ['Step-by-step walkthrough', 'Day and night rhythm', 'Built for real households'],
  faq: ['Honest answers', 'Type 1 & Type 2 scope', 'Privacy & limits explained'],
  learn: ['Basics & daily safety', 'Devices & family roles', 'Growing glossary'],
  news: ['Curated diabetes updates', 'Plain-language summaries', 'Links to trusted sources'],
  trust: ['Software support only', 'Not a medical device', 'Clear privacy boundaries'],
  voiceGuide: [
    'Typewriter chat replies',
    'Detects your language',
    'Answers in the same language',
    'Real mic level meter in Member zone',
    'Navigation shortcuts to Connections & Family',
  ],
  pricing: ['Month or year billing', 'Family plans included', 'Compare features at a glance'],
  privacy: ['What we store', 'What we never sell', 'Your export & delete rights'],
  terms: ['Fair use in plain words', 'Account & household rules', 'Billing when live'],
  medical: ['Not a doctor replacement', 'When to call your clinic', 'Emergency guidance limits'],
  compliance: ['Security practices', 'Audit-friendly logs', 'Regional readiness notes'],
  downloadDesktop: ['Install on Mac or PC', 'Same calm workspace', 'Offline-friendly shell'],
  downloadMobile: ['Phone & tablet ready', 'Quick day view', 'Same household sync'],
};

const RU: Partial<Record<PublicHeroHighlightPage, string[]>> = {
  system: ['Данные устройства → простой язык', 'Один спокойный шаг', 'Пути тип 1 и тип 2'],
  night: ['Ближе ночью', 'Резервный опекун', 'Меньше ложных тревог'],
  family: ['Одна общая картина', 'Понятно, кто отвечает', 'Школа и приглашения'],
  how: ['Пошаговый обзор', 'День и ночь', 'Для реальных семей'],
  faq: ['Честные ответы', 'Тип 1 и 2', 'Приватность и границы'],
  learn: ['Основы и безопасность', 'Устройства и роли', 'Растущий глоссарий'],
  news: ['Подборка новостей', 'Простые резюме', 'Ссылки на источники'],
  trust: ['Только поддержка', 'Не медицинское устройство', 'Прозрачная приватность'],
  voiceGuide: [
    'Ответы с эффектом печати',
    'Определяет язык',
    'Отвечает на том же языке',
    'Реальный уровень микрофона в Member',
    'Быстрые переходы к Подключениям и Семье',
  ],
  pricing: ['Месяц или год', 'Семейные планы', 'Сравнение функций'],
  privacy: ['Что храним', 'Что не продаём', 'Экспорт и удаление'],
  terms: ['Правила простым языком', 'Аккаунт и семья', 'Оплата когда включим'],
  medical: ['Не замена врача', 'Когда звонить в клинику', 'Границы экстренной помощи'],
  compliance: ['Практики безопасности', 'Журналы для аудита', 'Региональная готовность'],
  downloadDesktop: ['Mac или PC', 'Тот же workspace', 'Оболочка офлайн'],
  downloadMobile: ['Телефон и планшет', 'Быстрый день', 'Синхрон семьи'],
};

export const PUBLIC_PAGE_HERO_HIGHLIGHTS: Record<Language, Partial<Record<PublicHeroHighlightPage, string[]>>> = {
  en: EN,
  ru: RU,
  uk: RU,
  es: EN,
  fr: EN,
  de: EN,
  zh: EN,
  ja: EN,
  pt: EN,
  he: EN,
  ar: EN,
};

export const resolvePublicPageHeroHighlights = (lang: Language, page: PublicHeroHighlightPage): string[] =>
  PUBLIC_PAGE_HERO_HIGHLIGHTS[lang]?.[page] ?? PUBLIC_PAGE_HERO_HIGHLIGHTS.en[page] ?? [];
