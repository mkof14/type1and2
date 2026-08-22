import type { Language } from '../types';

export type HealthPortalCopy = {
  title: string;
  subtitle: string;
  unifiedTitle: string;
  unifiedSubtitle: string;
  connect: string;
  disconnect: string;
  sync: string;
  syncing: string;
  connected: string;
  disconnected: string;
  records: string;
  lastSync: string;
  liveSync: string;
  noRecords: string;
  portalHint: string;
  autoSync: string;
  nextAutoSync: string;
  oauthConnect: string;
  liveMode: string;
  mockMode: string;
  types: Record<string, string>;
};

const en: HealthPortalCopy = {
  title: 'Health records',
  subtitle: 'Hospital portals and health apps in one timeline.',
  unifiedTitle: 'Your clinic timeline',
  unifiedSubtitle: 'Labs, meds, and visits pulled from connected portals.',
  connect: 'Connect',
  disconnect: 'Disconnect',
  sync: 'Sync now',
  syncing: 'Syncing…',
  connected: 'Connected',
  disconnected: 'Not connected',
  records: 'records',
  lastSync: 'Last sync',
  liveSync: 'Live sync active',
  noRecords: 'Connect MyChart to see labs and visits here.',
  portalHint: 'Encrypted read-only sync · you stay in control',
  autoSync: 'Auto-sync every hour',
  nextAutoSync: 'Next auto-sync',
  oauthConnect: 'Connect with MyChart',
  liveMode: 'Live FHIR',
  mockMode: 'Demo mode',
  types: {
    labs: 'Labs',
    medications: 'Medications',
    visits: 'Visits',
    allergies: 'Allergies',
    conditions: 'Conditions',
    immunizations: 'Immunizations',
    vitals: 'Vitals',
    activity: 'Activity',
    procedures: 'Procedures',
    care_team: 'Care team',
    nutrition: 'Nutrition',
    sleep: 'Sleep',
  },
};

const ru: HealthPortalCopy = {
  title: 'Медицинские записи',
  subtitle: 'Порталы клиник и приложения здоровья в одной хронологии.',
  unifiedTitle: 'Хронология из клиники',
  unifiedSubtitle: 'Анализы, лекарства и визиты из подключённых порталов.',
  connect: 'Подключить',
  disconnect: 'Отключить',
  sync: 'Синхронизировать',
  syncing: 'Синхронизация…',
  connected: 'Подключено',
  disconnected: 'Не подключено',
  records: 'записей',
  lastSync: 'Последняя синхронизация',
  liveSync: 'Живая синхронизация',
  noRecords: 'Подключите MyChart — здесь появятся анализы и визиты.',
  portalHint: 'Шифрованная синхронизация · только чтение',
  autoSync: 'Авто-синхронизация каждый час',
  nextAutoSync: 'Следующая авто-синхронизация',
  oauthConnect: 'Подключить MyChart',
  liveMode: 'Живой FHIR',
  mockMode: 'Демо-режим',
  types: {
    labs: 'Анализы',
    medications: 'Лекарства',
    visits: 'Визиты',
    allergies: 'Аллергии',
    conditions: 'Диагнозы',
    immunizations: 'Прививки',
    vitals: 'Показатели',
    activity: 'Активность',
    procedures: 'Процедуры',
    care_team: 'Команда',
    nutrition: 'Питание',
    sleep: 'Сон',
  },
};

export const HEALTH_PORTAL_COPY: Record<Language, HealthPortalCopy> = {
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
