import type { Language } from '../types';
import { PRODUCT_NAME } from '../content/brand';

export type GuideIntent =
  | 'greeting'
  | 'nav_member'
  | 'nav_public'
  | 'mychart'
  | 'dexcom'
  | 'pricing'
  | 'type1'
  | 'type2'
  | 'alerts'
  | 'night'
  | 'nutrition'
  | 'family'
  | 'voice_help'
  | 'fallback';

type GuideReply = { text: string; intent: GuideIntent; action?: { type: 'member_section' | 'public_page'; id: string } };

const normalize = (input: string) => input.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

const includesAny = (text: string, words: string[]) => words.some((w) => text.includes(w));

const REPLIES: Record<Language, Record<GuideIntent, string>> = {
  en: {
    greeting: `Hello — I'm the ${PRODUCT_NAME} voice guide. I know this site, type 1 and type 2 diabetes, connections, family setup, and pricing. Ask out loud in Member zone, or type here anytime.`,
    nav_member: 'In Member zone, the sidebar is your map: Now for glucose, Meals for camera nutrition, Timeline for events, Connections for Dexcom and MyChart, Alerts for backup, Settings, Family, History, and this Voice guide.',
    nav_public: 'On the public site you will find How it helps, At night, Family, Good to know, Learning Center, FAQ, Pricing, and this Voice guide. Sign in when you are ready for connections and full voice.',
    mychart: 'MyChart lives under Connections. Connect read-only — labs, medications, and visits flow into your timeline so the family sees clinic context beside glucose.',
    dexcom: 'Dexcom and Libre connect in Connections too. Choose your sensor, link the account, and readings appear in Now with trend and confidence.',
    pricing: 'Plans on Pricing: Starter free, Member about twelve dollars a month, Family Plus for households, and an annual member option. Billing is staged — the page shows the full comparison.',
    type1: 'Type 1 is built for families — shared day view, school handoffs, night backup, and caregiver invites. Gentler language when data is delayed, clearer who responds.',
    type2: 'Type 2 supports adults and partners — meal scan, steadier day rhythm, and alerts tuned to reduce alarm fatigue while still catching meaningful change.',
    alerts: 'Alerts and backup show who gets notified, when a second caregiver joins, and what was already sent — so nobody guesses at three in the morning.',
    night: 'At night the system stays closer — calm alerts, backup loop, and less noise. You can read more on the At night page, or open Alerts in Member zone.',
    nutrition: 'Meals uses your camera to estimate carbs and calories — helpful for type 2 rhythm and family meal logging. Open Meals in Member zone after sign-in.',
    family: 'Family is where invites, roles, and who responds live. Everyone sees the same gentle picture — open Family in Member zone or the Family page here.',
    voice_help: 'Tap the microphone in Member zone and speak naturally. I listen in your language, answer in a calm spoken voice, and you can toggle the speaker anytime.',
    fallback: `I want to get that right. Try Connections, MyChart, Dexcom, type 1 or 2, Family invites, night alerts, or Pricing — or open FAQ for longer answers.`,
  },
  ru: {
    greeting: `Здравствуйте — я голосовой помощник ${PRODUCT_NAME}. Знаю сайт, диабет 1 и 2 типа, подключения, семью и тарифы. В Member zone можно говорить вслух, здесь — пишите в любой момент.`,
    nav_member: 'В Member zone слева карта: Сейчас — глюкоза, Еда — камера и БЖУ, Хронология — события, Подключения — Dexcom и MyChart, Сигналы — резерв, Настройки, Семья, История и этот голосовой помощник.',
    nav_public: 'На сайте: Как помогает, Ночью, Семья, Good to know, Обучение, FAQ, Тарифы и эта страница. Войдите, когда готовы к подключениям и полному голосу.',
    mychart: 'MyChart — в Подключениях. Связка только для чтения: анализы, лекарства и визиты попадают в хронологию рядом с глюкозой.',
    dexcom: 'Dexcom и Libre — там же. Выберите датчик, свяжите аккаунт — показания в «Сейчас» с трендом и уверенностью.',
    pricing: 'Тарифы на Pricing: Старт бесплатно, Member около двенадцати долларов в месяц, Family Plus для семьи, годовой вариант. Страница показывает сравнение — оплата подключается позже.',
    type1: 'Тип 1 — для семей: общий день, школа, ночной резерв, приглашения опекунов. Мягче при задержке данных, яснее кто отвечает.',
    type2: 'Тип 2 — для взрослых и партнёров: скан еды, ровнее день, сигналы без лишней усталости от тревог.',
    alerts: 'Сигналы и резерв — кому пришло, когда подключился второй опекун, что уже отправлено — без догадок ночью.',
    night: 'Ночью система ближе — спокойные сигналы, резерв, меньше шума. Подробнее на странице «Ночью» или в Сигналах в Member zone.',
    nutrition: 'Еда — камера для оценки углеводов и калорий. Полезно для типа 2 и семейного журнала. Откройте Еда после входа.',
    family: 'Семья — приглашения, роли, кто отвечает. Одна спокойная картина для всех — раздел Семья или эта страница на сайте.',
    voice_help: 'Микрофон в Member zone — говорите естественно. Слышу язык, отвечаю спокойным голосом; динамик можно выключить.',
    fallback: 'Хочу ответить точнее. Спросите про Подключения, MyChart, Dexcom, тип 1 или 2, Семью, ночные сигналы или тарифы — или откройте FAQ.',
  },
  uk: {} as Record<GuideIntent, string>,
  es: {} as Record<GuideIntent, string>,
  fr: {} as Record<GuideIntent, string>,
  de: {} as Record<GuideIntent, string>,
  zh: {} as Record<GuideIntent, string>,
  ja: {} as Record<GuideIntent, string>,
  pt: {} as Record<GuideIntent, string>,
  he: {} as Record<GuideIntent, string>,
  ar: {} as Record<GuideIntent, string>,
};

const pick = (lang: Language, intent: GuideIntent) => REPLIES[lang]?.[intent] || REPLIES.en[intent];

export const detectIntent = (raw: string, lang: Language): GuideReply => {
  const text = normalize(raw);
  if (!text) return { text: pick(lang, 'greeting'), intent: 'greeting' };

  if (includesAny(text, ['hello', 'hi', 'hey', 'start', 'help', 'привет', 'здрав', 'помог', 'начн', 'voice guide', 'голос'])) {
    return { text: pick(lang, 'greeting'), intent: 'greeting' };
  }
  if (includesAny(text, ['mychart', 'epic', 'clinic', 'portal', 'health record', 'мед', 'клиник', 'портал', 'анализ', 'лабора'])) {
    return { text: pick(lang, 'mychart'), intent: 'mychart', action: { type: 'member_section', id: 'system' } };
  }
  if (includesAny(text, ['dexcom', 'libre', 'sensor', 'cgm', 'датчик', 'глюк', 'freestyle'])) {
    return { text: pick(lang, 'dexcom'), intent: 'dexcom', action: { type: 'member_section', id: 'system' } };
  }
  if (includesAny(text, ['price', 'pricing', 'plan', 'cost', 'тариф', 'цен', 'оплат', 'subscription', 'подписк'])) {
    return { text: pick(lang, 'pricing'), intent: 'pricing', action: { type: 'public_page', id: 'pricing' } };
  }
  if (includesAny(text, ['type 1', 'type1', 't1d', 'child', 'school', 'тип 1', 'ребен', 'школ', ' реб'])) {
    return { text: pick(lang, 'type1'), intent: 'type1', action: { type: 'member_section', id: 'family' } };
  }
  if (includesAny(text, ['type 2', 'type2', 't2d', 'adult', 'partner', 'meal', 'carb', 'тип 2', 'взросл', 'партнер', 'еда', 'углев', 'калор'])) {
    return { text: pick(lang, 'type2'), intent: 'type2', action: { type: 'member_section', id: 'nutrition' } };
  }
  if (includesAny(text, ['night', 'sleep', 'bed', 'ноч', 'сон', 'спать'])) {
    return { text: pick(lang, 'night'), intent: 'night', action: { type: 'public_page', id: 'night' } };
  }
  if (includesAny(text, ['alert', 'notify', 'backup', 'сигнал', 'оповещ', 'резерв'])) {
    return { text: pick(lang, 'alerts'), intent: 'alerts', action: { type: 'member_section', id: 'alerts' } };
  }
  if (includesAny(text, ['food', 'camera', 'nutrition', 'meal', 'photo', 'камер', 'фото', 'питан', 'бжу'])) {
    return { text: pick(lang, 'nutrition'), intent: 'nutrition', action: { type: 'member_section', id: 'nutrition' } };
  }
  if (includesAny(text, ['family', 'invite', 'caregiver', 'parent', 'семь', 'приглаш', 'опекун', 'родит'])) {
    return { text: pick(lang, 'family'), intent: 'family', action: { type: 'member_section', id: 'family' } };
  }
  if (includesAny(text, ['voice', 'microphone', 'speak', 'listen', 'голос', 'микрофон', 'говор', 'слуш', 'динамик'])) {
    return { text: pick(lang, 'voice_help'), intent: 'voice_help', action: { type: 'member_section', id: 'guide' } };
  }
  if (includesAny(text, ['navigate', 'where', 'find', 'open', 'go to', 'section', 'menu', 'sidebar', 'где', 'найти', 'откр', 'раздел', 'меню'])) {
    return { text: pick(lang, 'nav_member'), intent: 'nav_member' };
  }
  if (includesAny(text, ['faq', 'learn', 'how it works', 'how it helps', 'website', 'site', 'trust', 'сайт', 'обуч', 'как это', 'как помог'])) {
    return { text: pick(lang, 'nav_public'), intent: 'nav_public' };
  }
  if (includesAny(text, ['connect', 'connection', 'подключ'])) {
    return { text: pick(lang, 'mychart'), intent: 'mychart', action: { type: 'member_section', id: 'system' } };
  }

  return { text: pick(lang, 'fallback'), intent: 'fallback' };
};

export const speechLang = (lang: Language): string => ({
  en: 'en-US', ru: 'ru-RU', uk: 'uk-UA', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
  zh: 'zh-CN', ja: 'ja-JP', pt: 'pt-BR', he: 'he-IL', ar: 'ar-SA',
}[lang] || 'en-US');
