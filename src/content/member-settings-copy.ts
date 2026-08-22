import type { Language } from '../types';

export type MemberSettingsCopy = {
  profileTitle: string;
  profileSubtitle: string;
  fullName: string;
  email: string;
  organization: string;
  timezone: string;
  language: string;
  notificationsTitle: string;
  emailNotifications: string;
  pushNotifications: string;
  marketingEmails: string;
  saveProfile: string;
  savingProfile: string;
  profileSaved: string;
  personalTitle: string;
  personalSubtitle: string;
  safetyTitle: string;
  accountTitle: string;
};

const en: MemberSettingsCopy = {
  profileTitle: 'Your profile',
  profileSubtitle: 'Name, contact, timezone, and how we reach you.',
  fullName: 'Full name',
  email: 'Email (sign-in)',
  organization: 'Organization / clinic',
  timezone: 'Timezone',
  language: 'Language follows the selector in the header.',
  notificationsTitle: 'Notifications',
  emailNotifications: 'Email alerts for safety events',
  pushNotifications: 'Browser push notifications',
  marketingEmails: 'Product updates and tips',
  saveProfile: 'Save profile',
  savingProfile: 'Saving…',
  profileSaved: 'Profile updated.',
  personalTitle: 'Personal',
  personalSubtitle: 'Account details and notification preferences.',
  safetyTitle: 'Safety preferences',
  accountTitle: 'Account',
};

const ru: MemberSettingsCopy = {
  profileTitle: 'Ваш профиль',
  profileSubtitle: 'Имя, контакт, часовой пояс и способы связи.',
  fullName: 'Полное имя',
  email: 'Email (вход)',
  organization: 'Организация / клиника',
  timezone: 'Часовой пояс',
  language: 'Язык выбирается в шапке сайта.',
  notificationsTitle: 'Уведомления',
  emailNotifications: 'Email при событиях безопасности',
  pushNotifications: 'Push-уведомления в браузере',
  marketingEmails: 'Обновления продукта и советы',
  saveProfile: 'Сохранить профиль',
  savingProfile: 'Сохранение…',
  profileSaved: 'Профиль обновлён.',
  personalTitle: 'Личное',
  personalSubtitle: 'Данные аккаунта и настройки уведомлений.',
  safetyTitle: 'Настройки безопасности',
  accountTitle: 'Аккаунт',
};

export const MEMBER_SETTINGS_COPY: Record<Language, MemberSettingsCopy> = {
  en,
  ru,
  uk: ru,
  es: en,
  fr: en,
  de: en,
  zh: en,
  ja: en,
  pt: en,
  he: en,
  ar: en,
};

export const MEMBER_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Kyiv',
  'Europe/Moscow',
  'Asia/Tokyo',
  'Asia/Shanghai',
];
