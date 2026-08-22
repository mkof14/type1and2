import type { Language } from '../types';

export interface MemberChromeCopy {
  zoneBadge: string;
  zoneScope: string;
  zoneLead: string;
  activeAccessSignin: string;
  activeAccessSignup: string;
  activeSetup: string;
  activeWorkspace: string;
  signOut: string;
}

const en: MemberChromeCopy = {
  zoneBadge: 'Member',
  zoneScope: 'Type 1 & Type 2',
  zoneLead: 'Signed-in view for your household — glucose, meals, alerts, and who responds.',
  activeAccessSignin: 'Sign in',
  activeAccessSignup: 'Create account',
  activeSetup: 'Member · setup',
  activeWorkspace: 'Member · workspace',
  signOut: 'Sign out',
};

export const MEMBER_CHROME_COPY: Record<Language, MemberChromeCopy> = {
  en,
  ru: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'Ваш кабинет — глюкоза, еда, сигналы и кто отвечает в семье.',
    activeAccessSignin: 'Вход',
    activeAccessSignup: 'Создание аккаунта',
    activeSetup: 'Member · настройка',
    activeWorkspace: 'Member · рабочая зона',
    signOut: 'Выйти',
  },
  uk: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'Ваш особистий кабінет — щоденна підтримка для типу 1 і типу 2.',
    activeAccessSignin: 'Вхід',
    activeAccessSignup: 'Створення акаунта',
    activeSetup: 'Member · налаштування',
    activeWorkspace: 'Member · робочий простір',
    signOut: 'Вийти',
  },
  es: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'Tu vista diaria con sesión iniciada — apoyo familiar para tipo 1 y ritmo calmado para tipo 2.',
    activeAccessSignin: 'Iniciar sesión',
    activeAccessSignup: 'Crear cuenta',
    activeSetup: 'Member · configuración',
    activeWorkspace: 'Member · espacio de trabajo',
    signOut: 'Salir',
  },
  fr: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'Votre vue quotidienne connectée — soutien familial type 1 et rythme calme type 2.',
    activeAccessSignin: 'Connexion',
    activeAccessSignup: 'Créer un compte',
    activeSetup: 'Member · configuration',
    activeWorkspace: 'Member · espace membre',
    signOut: 'Déconnexion',
  },
  de: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'Ihre angemeldete Tagesansicht — Familienunterstützung für Typ 1 und ruhiger Rhythmus für Typ 2.',
    activeAccessSignin: 'Anmelden',
    activeAccessSignup: 'Konto erstellen',
    activeSetup: 'Member · Einrichtung',
    activeWorkspace: 'Member · Mitgliederbereich',
    signOut: 'Abmelden',
  },
  zh: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: '您的已登录日常视图 — 1 型家庭支持与 2 型成人节奏。',
    activeAccessSignin: '登录',
    activeAccessSignup: '创建账号',
    activeSetup: 'Member · 设置',
    activeWorkspace: 'Member · 工作区',
    signOut: '退出',
  },
  ja: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'サインイン済みのデイリー表示 — 1 型の家族サポートと 2 型の落ち着いたリズム。',
    activeAccessSignin: 'サインイン',
    activeAccessSignup: 'アカウント作成',
    activeSetup: 'Member · セットアップ',
    activeWorkspace: 'Member · ワークスペース',
    signOut: 'サインアウト',
  },
  pt: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'Sua visão diária conectada — apoio familiar para tipo 1 e ritmo calmo para tipo 2.',
    activeAccessSignin: 'Entrar',
    activeAccessSignup: 'Criar conta',
    activeSetup: 'Member · configuração',
    activeWorkspace: 'Member · área de membro',
    signOut: 'Sair',
  },
  he: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'התצוגה היומית שלך — תמיכה משפחתית לסוג 1 וקצב רגוע לסוג 2.',
    activeAccessSignin: 'התחברות',
    activeAccessSignup: 'יצירת חשבון',
    activeSetup: 'Member · הגדרה',
    activeWorkspace: 'Member · סביבת עבודה',
    signOut: 'יציאה',
  },
  ar: {
    zoneBadge: 'Member',
    zoneScope: 'Type 1 & Type 2',
    zoneLead: 'عرضك اليومي بعد تسجيل الدخول — دعم عائلي للنوع 1 وإيقاع هادئ للنوع 2.',
    activeAccessSignin: 'تسجيل الدخول',
    activeAccessSignup: 'إنشاء حساب',
    activeSetup: 'Member · الإعداد',
    activeWorkspace: 'Member · مساحة الأعضاء',
    signOut: 'تسجيل الخروج',
  },
};
