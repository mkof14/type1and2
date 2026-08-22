import type { Language } from '../types';

export type WorkspaceSectionId =
  | 'now'
  | 'nutrition'
  | 'timeline'
  | 'system'
  | 'health-records'
  | 'alerts'
  | 'settings'
  | 'family'
  | 'history'
  | 'guide';

export const WORKSPACE_SECTION_ORDER: WorkspaceSectionId[] = [
  'now',
  'nutrition',
  'timeline',
  'system',
  'alerts',
  'settings',
  'family',
  'history',
  'guide',
];

type NavEntry = { label: string; hint: string };

export const WORKSPACE_NAV: Record<Language, Record<WorkspaceSectionId, NavEntry>> = {
  en: {
    now: { label: 'Now', hint: 'State & actions' },
    nutrition: { label: 'Meals', hint: 'Scan & analyze food' },
    timeline: { label: 'Timeline', hint: 'Recent steps' },
    system: { label: 'Connections', hint: 'Dexcom · MyChart · portals' },
    'health-records': { label: 'Health records', hint: 'MyChart & medical portals' },
    alerts: { label: 'Alerts', hint: 'Who gets notified' },
    settings: { label: 'Settings', hint: 'Day & night feel' },
    family: { label: 'Family', hint: 'People & invite' },
    history: { label: 'History', hint: 'Past days' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  ru: {
    now: { label: 'Сейчас', hint: 'Состояние и действия' },
    nutrition: { label: 'Еда', hint: 'Скан и анализ' },
    timeline: { label: 'Хронология', hint: 'Последние шаги' },
    system: { label: 'Подключения', hint: 'Dexcom · MyChart · порталы' },
    'health-records': { label: 'Мед. записи', hint: 'MyChart и порталы' },
    alerts: { label: 'Сигналы', hint: 'Кому приходит' },
    settings: { label: 'Настройки', hint: 'День и ночь' },
    family: { label: 'Семья', hint: 'Люди и код' },
    history: { label: 'История', hint: 'Прошлые дни' },
    guide: { label: 'Голос', hint: 'Говорите и спрашивайте' },
  },
  uk: {
    now: { label: 'Зараз', hint: 'Стан і дії' },
    nutrition: { label: 'Їжа', hint: 'Скан і аналіз' },
    timeline: { label: 'Хронологія', hint: 'Останні кроки' },
    system: { label: 'Зв’язок', hint: 'Датчик і пристрій' },
    'health-records': { label: 'Мед. записи', hint: 'MyChart і портали' },
    alerts: { label: 'Сигнали', hint: 'Кому надходить' },
    settings: { label: 'Налаштування', hint: 'День і ніч' },
    family: { label: 'Сім’я', hint: 'Люди та код' },
    history: { label: 'Історія', hint: 'Минулі дні' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  es: {
    now: { label: 'Ahora', hint: 'Estado y acciones' },
    nutrition: { label: 'Comidas', hint: 'Escanear y analizar' },
    timeline: { label: 'Línea', hint: 'Pasos recientes' },
    system: { label: 'Conexión', hint: 'Sensor y dispositivo' },
    'health-records': { label: 'Historial médico', hint: 'MyChart y portales' },
    alerts: { label: 'Alertas', hint: 'Quién recibe' },
    settings: { label: 'Ajustes', hint: 'Día y noche' },
    family: { label: 'Familia', hint: 'Personas e invitación' },
    history: { label: 'Historial', hint: 'Días pasados' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  fr: {
    now: { label: 'Maintenant', hint: 'État et actions' },
    nutrition: { label: 'Repas', hint: 'Scanner et analyser' },
    timeline: { label: 'Chronologie', hint: 'Étapes récentes' },
    system: { label: 'Connexion', hint: 'Capteur et appareil' },
    'health-records': { label: 'Dossier médical', hint: 'MyChart et portails' },
    alerts: { label: 'Alertes', hint: 'Qui est prévenu' },
    settings: { label: 'Réglages', hint: 'Jour et nuit' },
    family: { label: 'Famille', hint: 'Personnes et code' },
    history: { label: 'Historique', hint: 'Jours passés' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  de: {
    now: { label: 'Jetzt', hint: 'Status und Aktionen' },
    nutrition: { label: 'Mahlzeiten', hint: 'Essen scannen' },
    timeline: { label: 'Verlauf', hint: 'Letzte Schritte' },
    system: { label: 'Verbindung', hint: 'Sensor und Gerät' },
    'health-records': { label: 'Gesundheitsakte', hint: 'MyChart & Portale' },
    alerts: { label: 'Alarme', hint: 'Wer benachrichtigt wird' },
    settings: { label: 'Einstellungen', hint: 'Tag und Nacht' },
    family: { label: 'Familie', hint: 'Personen und Code' },
    history: { label: 'Verlauf', hint: 'Vergangene Tage' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  zh: {
    now: { label: '现在', hint: '状态与操作' },
    nutrition: { label: '饮食', hint: '扫描与分析' },
    timeline: { label: '时间线', hint: '最近步骤' },
    system: { label: '连接', hint: '传感器与设备' },
    'health-records': { label: '健康档案', hint: 'MyChart 与医疗门户' },
    alerts: { label: '提醒', hint: '通知对象' },
    settings: { label: '设置', hint: '白天与夜间' },
    family: { label: '家庭', hint: '成员与邀请' },
    history: { label: '历史', hint: '过往天数' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  ja: {
    now: { label: 'いま', hint: '状態とアクション' },
    nutrition: { label: '食事', hint: 'スキャンと分析' },
    timeline: { label: 'タイムライン', hint: '最近のステップ' },
    system: { label: '接続', hint: 'センサーとデバイス' },
    'health-records': { label: '健康記録', hint: 'MyChart とポータル' },
    alerts: { label: 'アラート', hint: '通知先' },
    settings: { label: '設定', hint: '昼と夜' },
    family: { label: '家族', hint: 'メンバーと招待' },
    history: { label: '履歴', hint: '過去の日' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  pt: {
    now: { label: 'Agora', hint: 'Estado e ações' },
    nutrition: { label: 'Refeições', hint: 'Escanear e analisar' },
    timeline: { label: 'Linha', hint: 'Passos recentes' },
    system: { label: 'Conexão', hint: 'Sensor e dispositivo' },
    'health-records': { label: 'Registros de saúde', hint: 'MyChart e portais' },
    alerts: { label: 'Alertas', hint: 'Quem recebe' },
    settings: { label: 'Preferências', hint: 'Dia e noite' },
    family: { label: 'Família', hint: 'Pessoas e convite' },
    history: { label: 'Histórico', hint: 'Dias anteriores' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  he: {
    now: { label: 'עכשיו', hint: 'מצב ופעולות' },
    nutrition: { label: 'ארוחות', hint: 'סריקה וניתוח' },
    timeline: { label: 'ציר זמן', hint: 'שלבים אחרונים' },
    system: { label: 'חיבור', hint: 'חיישן ומכשיר' },
    'health-records': { label: 'רשומות רפואיות', hint: 'MyChart ופורטלים' },
    alerts: { label: 'התראות', hint: 'מי מקבל' },
    settings: { label: 'הגדרות', hint: 'יום ולילה' },
    family: { label: 'משפחה', hint: 'אנשים והזמנה' },
    history: { label: 'היסטוריה', hint: 'ימים קודמים' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
  ar: {
    now: { label: 'الآن', hint: 'الحالة والإجراءات' },
    nutrition: { label: 'الوجبات', hint: 'مسح وتحليل' },
    timeline: { label: 'الخط الزمني', hint: 'الخطوات الأخيرة' },
    system: { label: 'الاتصال', hint: 'المستشعر والجهاز' },
    'health-records': { label: 'السجلات الطبية', hint: 'MyChart والبوابات' },
    alerts: { label: 'التنبيهات', hint: 'من يُبلَّغ' },
    settings: { label: 'الإعدادات', hint: 'النهار والليل' },
    family: { label: 'العائلة', hint: 'الأشخاص والرمز' },
    history: { label: 'السجل', hint: 'الأيام السابقة' },
    guide: { label: 'Voice guide', hint: 'Speak & navigate' },
  },
};
