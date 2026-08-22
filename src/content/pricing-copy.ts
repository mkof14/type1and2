import type { Language } from '../types';
import { PRODUCT_NAME } from './brand';

export type BillingInterval = 'month' | 'year';
export type PaidPlanId = 'member' | 'family-plus';

export type PlanPricing = {
  amount: number;
  display: string;
  perLabel: string;
  stripePriceKey: string;
};

export type PricingPlan = {
  id: 'free' | PaidPlanId;
  name: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
  monthly?: PlanPricing;
  yearly?: PlanPricing;
};

export type ComparisonRow = {
  id: string;
  label: string;
  starter: string | boolean;
  member: string | boolean;
  familyPlus: string | boolean;
};

export type PricingCopy = {
  title: string;
  subtitle: string;
  eyebrow: string;
  note: string;
  toggleMonth: string;
  toggleYear: string;
  saveBadge: string;
  perMonth: string;
  perYear: string;
  billedMonthly: string;
  billedYearly: string;
  freeForever: string;
  ctaFree: string;
  ctaBuy: string;
  ctaSignIn: string;
  ctaCurrent: string;
  compareTitle: string;
  compareSubtitle: string;
  faqTitle: string;
  faq: Array<{ q: string; a: string }>;
  plans: PricingPlan[];
  comparison: ComparisonRow[];
  checkoutPending: string;
  checkoutError: string;
  checkoutDemo: string;
  popularLabel: string;
  saveAmountLabel: string;
  successTitle: string;
  successBody: string;
};

const comparisonEn: ComparisonRow[] = [
  { id: 'dashboard', label: 'Now dashboard & manual log', starter: true, member: true, familyPlus: true },
  { id: 'dexcom', label: 'Dexcom / Libre sync', starter: false, member: true, familyPlus: true },
  { id: 'mychart', label: 'MyChart & clinic records', starter: false, member: true, familyPlus: true },
  { id: 'meals', label: 'Meal scan & nutrition', starter: false, member: true, familyPlus: true },
  { id: 'voice', label: 'Voice guide (full)', starter: 'Preview', member: true, familyPlus: true },
  { id: 'people', label: 'People in household', starter: '2', member: '5', familyPlus: 'Unlimited' },
  { id: 'history', label: 'History retention', starter: '7 days', member: '30 days', familyPlus: '90 days' },
  { id: 'support', label: 'Priority support', starter: false, member: false, familyPlus: true },
  { id: 'trial', label: 'Free trial', starter: '—', member: '14 days', familyPlus: '14 days' },
];

const en: PricingCopy = {
  eyebrow: 'Pricing · early access',
  title: 'Simple plans for families and adults',
  subtitle: `${PRODUCT_NAME} — choose monthly or save with annual billing.`,
  note: 'Software-only support, not medical advice. Cancel anytime. Annual plans include 2 months free (≈17% off).',
  toggleMonth: 'Monthly',
  toggleYear: 'Yearly',
  saveBadge: 'Save 17%',
  perMonth: '/mo',
  perYear: '/yr',
  billedMonthly: 'Billed monthly',
  billedYearly: 'Billed once per year · 2 months free',
  freeForever: 'Free forever',
  ctaFree: 'Get started free',
  ctaBuy: 'Subscribe now',
  ctaSignIn: 'Sign in to subscribe',
  ctaCurrent: 'Current plan',
  compareTitle: 'Compare plans',
  compareSubtitle: 'See what each tier includes — same Member price for Type 1 and Type 2 paths.',
  faqTitle: 'Pricing questions',
  faq: [
    { q: 'How does annual billing work?', a: 'Pay once per year and get 2 months free vs paying monthly — the traditional ~17% annual discount.' },
    { q: 'Type 1 and Type 2 — same price?', a: 'Yes. One Member plan covers your path — family circle or adult support.' },
    { q: 'Is there a free trial?', a: 'Starter is free forever. Paid plans include a 14-day trial when you subscribe.' },
    { q: 'Clinic or school discounts?', a: 'Partner pricing for clinics and diabetes programs — contact support@type1and2.com.' },
  ],
  plans: [
    {
      id: 'free',
      name: 'Starter',
      tagline: 'Try the daily view and invite one backup person.',
      features: ['Now dashboard', 'Manual glucose log', '1 backup contact', 'Voice guide preview'],
    },
    {
      id: 'member',
      name: 'Member',
      tagline: 'Full workspace for one household — Type 1 or Type 2.',
      highlight: true,
      features: ['Dexcom / Libre', 'MyChart sync', 'Meal scan', 'Alerts & night rules', 'Voice guide (full)', 'Up to 5 people'],
      monthly: { amount: 12, display: '$12', perLabel: 'per month', stripePriceKey: 'member_monthly' },
      yearly: { amount: 120, display: '$120', perLabel: 'per year', stripePriceKey: 'member_yearly' },
    },
    {
      id: 'family-plus',
      name: 'Family Plus',
      tagline: 'Type 1 circles with school, nights, and multiple caregivers.',
      features: ['Everything in Member', 'Unlimited caregivers', 'Priority support', '90-day history', 'Admin handoff notes'],
      monthly: { amount: 24, display: '$24', perLabel: 'per month', stripePriceKey: 'family_plus_monthly' },
      yearly: { amount: 240, display: '$240', perLabel: 'per year', stripePriceKey: 'family_plus_yearly' },
    },
  ],
  comparison: comparisonEn,
  checkoutPending: 'Opening checkout…',
  checkoutError: 'Checkout could not start. Try again or contact support.',
  checkoutDemo: 'Online checkout is being set up — plans and prices are shown below.',
  popularLabel: 'Popular',
  saveAmountLabel: 'Save ${amount}/yr',
  successTitle: 'Welcome aboard',
  successBody: 'Your subscription is processing. Member features unlock once payment is confirmed.',
};

const comparisonRu: ComparisonRow[] = [
  { id: 'dashboard', label: 'Дашборд и ручной журнал', starter: true, member: true, familyPlus: true },
  { id: 'dexcom', label: 'Dexcom / Libre', starter: false, member: true, familyPlus: true },
  { id: 'mychart', label: 'MyChart и клиники', starter: false, member: true, familyPlus: true },
  { id: 'meals', label: 'Скан еды', starter: false, member: true, familyPlus: true },
  { id: 'voice', label: 'Голосовой помощник', starter: 'Превью', member: true, familyPlus: true },
  { id: 'people', label: 'Людей в доме', starter: '2', member: '5', familyPlus: 'Без лимита' },
  { id: 'history', label: 'История', starter: '7 дней', member: '30 дней', familyPlus: '90 дней' },
  { id: 'support', label: 'Приоритетная поддержка', starter: false, member: false, familyPlus: true },
  { id: 'trial', label: 'Пробный период', starter: '—', member: '14 дней', familyPlus: '14 дней' },
];

const ru: PricingCopy = {
  eyebrow: 'Тарифы · ранний доступ',
  title: 'Простые планы для семей и взрослых',
  subtitle: `${PRODUCT_NAME} — помесячно или со скидкой за год.`,
  note: 'Только программная поддержка. Отмена в любой момент. Годовой план — 2 месяца бесплатно (~17%).',
  toggleMonth: 'Месяц',
  toggleYear: 'Год',
  saveBadge: '−17%',
  perMonth: '/мес',
  perYear: '/год',
  billedMonthly: 'Оплата каждый месяц',
  billedYearly: 'Раз в год · 2 месяца бесплатно',
  freeForever: 'Бесплатно',
  ctaFree: 'Начать бесплатно',
  ctaBuy: 'Оформить подписку',
  ctaSignIn: 'Войти для оплаты',
  ctaCurrent: 'Текущий план',
  compareTitle: 'Сравнение планов',
  compareSubtitle: 'Что входит в каждый тариф — одна цена для типа 1 и типа 2.',
  faqTitle: 'Вопросы о ценах',
  faq: [
    { q: 'Как работает годовой план?', a: 'Оплата раз в год — 2 месяца бесплатно vs помесячно (~17% скидка).' },
    { q: 'Тип 1 и тип 2 — одна цена?', a: 'Да. Один план Member для вашего пути.' },
    { q: 'Есть пробный период?', a: 'Старт бесплатен. Платные планы — 14 дней trial при оформлении.' },
    { q: 'Скидки для клиник?', a: 'Партнёрские тарифы — support@type1and2.com.' },
  ],
  plans: [
    { id: 'free', name: 'Старт', tagline: 'Попробуйте день и одного резервного человека.', features: ['Дашборд «Сейчас»', 'Ручной журнал', '1 резервный контакт', 'Превью голосового помощника'] },
    { id: 'member', name: 'Member', tagline: 'Полный кабинет — тип 1 или тип 2.', highlight: true, features: ['Dexcom / Libre', 'MyChart', 'Скан еды', 'Сигналы и ночь', 'Голосовой помощник', 'До 5 человек'], monthly: { amount: 12, display: '$12', perLabel: 'в месяц', stripePriceKey: 'member_monthly' }, yearly: { amount: 120, display: '$120', perLabel: 'в год', stripePriceKey: 'member_yearly' } },
    { id: 'family-plus', name: 'Family Plus', tagline: 'Семьи с типом 1 — школа, ночь, опекуны.', features: ['Всё из Member', 'Неограниченные опекуны', 'Приоритет', 'История 90 дней', 'Заметки для передачи'], monthly: { amount: 24, display: '$24', perLabel: 'в месяц', stripePriceKey: 'family_plus_monthly' }, yearly: { amount: 240, display: '$240', perLabel: 'в год', stripePriceKey: 'family_plus_yearly' } },
  ],
  comparison: comparisonRu,
  checkoutPending: 'Открываем оплату…',
  checkoutError: 'Не удалось начать оплату. Попробуйте снова.',
  checkoutDemo: 'Онлайн-оплата скоро — ниже актуальные тарифы.',
  popularLabel: 'Популярный',
  saveAmountLabel: 'Экономия ${amount}/год',
  successTitle: 'Спасибо',
  successBody: 'Подписка обрабатывается. Member откроется после подтверждения оплаты.',
};

export const PRICING_COPY: Record<Language, PricingCopy> = {
  en,
  ru,
  uk: en,
  es: en,
  fr: en,
  de: en,
  zh: en,
  ja: en,
  pt: en,
  he: en,
  ar: en,
};

export const annualSavingsPercent = (monthly: number, yearly: number) =>
  Math.round((1 - yearly / (monthly * 12)) * 100);
