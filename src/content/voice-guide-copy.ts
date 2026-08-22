import type { Language } from '../types';
import { PRODUCT_NAME } from './brand';

export type VoiceGuideMode = 'preview' | 'full';

export type VoiceGuideCopy = {
  guideName: string;
  guideRole: string;
  sectionTitle: string;
  sectionSubtitle: string;
  previewBadge: string;
  fullBadge: string;
  micOn: string;
  micOff: string;
  speakerOn: string;
  speakerOff: string;
  listening: string;
  speaking: string;
  idle: string;
  placeholder: string;
  send: string;
  signInCta: string;
  signInHint: string;
  previewLimit: string;
  promoTitle: string;
  promoBody: string;
  promoLink: string;
  pageTitle: string;
  pageSubtitle: string;
  pageIntro: string;
  features: string[];
};

const en: VoiceGuideCopy = {
  guideName: 'Voice guide',
  guideRole: 'Plain-language help for ${PRODUCT}',
  sectionTitle: 'Voice guide',
  sectionSubtitle: 'Speak or type — navigation, diabetes type 1 & 2, MyChart, Dexcom, alerts, and everyday help in your language.',
  previewBadge: 'Preview · text chat',
  fullBadge: 'Full · voice in & out',
  micOn: 'Microphone on',
  micOff: 'Microphone off',
  speakerOn: 'Speaker on',
  speakerOff: 'Speaker off',
  listening: 'Listening…',
  speaking: 'Speaking…',
  idle: 'Ready to help',
  placeholder: 'Ask about type 1, type 2, connections, family, night alerts…',
  send: 'Send',
  signInCta: 'Sign in for full voice',
  signInHint: 'Member zone unlocks microphone, spoken replies, and a live audio meter.',
  previewLimit: 'Public preview: chat works here; full voice and mic levels open after sign-in.',
  promoTitle: 'Voice guide on ${PRODUCT}',
  promoBody: 'Friendly help with the site, type 1 & type 2 diabetes, MyChart, Dexcom, family setup, and pricing. Preview here — full voice in Member zone.',
  promoLink: 'Open voice guide',
  pageTitle: 'Voice guide',
  pageSubtitle: 'Plain-language help for ${PRODUCT} — preview here, speak naturally when signed in.',
  pageIntro: 'Ask about daily safety, devices, family roles, night backup, or where anything lives on the site. I detect your language and answer in the same words.',
  features: [
    'Typewriter chat replies',
    'Detects your language',
    'Answers in the same language',
    'Real mic level meter in Member zone',
    'Navigation shortcuts to Connections & Family',
  ],
};

const ru: VoiceGuideCopy = {
  guideName: 'Голосовой помощник',
  guideRole: 'Простые ответы по ${PRODUCT}',
  sectionTitle: 'Голосовой помощник',
  sectionSubtitle: 'Говорите или пишите — навигация, диабет 1 и 2 типа, MyChart, Dexcom, сигналы и помощь по сайту на вашем языке.',
  previewBadge: 'Превью · текст',
  fullBadge: 'Полный · голос',
  micOn: 'Микрофон вкл',
  micOff: 'Микрофон выкл',
  speakerOn: 'Динамик вкл',
  speakerOff: 'Динамик выкл',
  listening: 'Слушаю…',
  speaking: 'Говорю…',
  idle: 'Готов помочь',
  placeholder: 'Спросите про тип 1, тип 2, подключения, семью, ночные сигналы…',
  send: 'Отправить',
  signInCta: 'Войти для полного голоса',
  signInHint: 'Member zone открывает микрофон, озвучку ответов и индикатор звука.',
  previewLimit: 'Публичное превью: чат здесь; полный голос и уровень микрофона — после входа.',
  promoTitle: 'Голосовой помощник ${PRODUCT}',
  promoBody: 'Помощь по сайту, диабету 1 и 2 типа, MyChart, Dexcom, семье и тарифам. Превью здесь — полный голос в Member zone.',
  promoLink: 'Открыть помощника',
  pageTitle: 'Голосовой помощник',
  pageSubtitle: 'Простые ответы по ${PRODUCT} — превью здесь, говорите естественно после входа.',
  pageIntro: 'Спросите про безопасность, устройства, роли в семье, ночной резерв или где что на сайте. Слышу язык и отвечаю теми же словами.',
  features: [
    'Ответы с эффектом печати',
    'Определяет язык',
    'Отвечает на том же языке',
    'Реальный уровень микрофона в Member',
    'Быстрые переходы к Подключениям и Семье',
  ],
};

const fill = (copy: VoiceGuideCopy): VoiceGuideCopy => {
  const product = PRODUCT_NAME;
  const withProduct = (text: string) => text.replace(/\$\{PRODUCT\}/g, product);
  return {
    ...copy,
    guideRole: withProduct(copy.guideRole),
    promoTitle: withProduct(copy.promoTitle),
    promoBody: withProduct(copy.promoBody),
    pageSubtitle: withProduct(copy.pageSubtitle),
  };
};

export const VOICE_GUIDE_COPY: Record<Language, VoiceGuideCopy> = {
  en: fill(en),
  ru: fill(ru),
  uk: fill(en),
  es: fill(en),
  fr: fill(en),
  de: fill(en),
  zh: fill(en),
  ja: fill(en),
  pt: fill(en),
  he: fill(en),
  ar: fill(en),
};
