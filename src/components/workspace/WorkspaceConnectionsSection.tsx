import React from 'react';
import { Link2, Radio, Stethoscope } from 'lucide-react';
import type { Language } from '../../types';
import type { HealthRecordsSummary, WorkspacePayload } from '../../lib/api';
import type { GlucoseUnit } from '../../lib/glucose-units';
import type { T1DTheme } from '../../lib/t1d-ui';
import { t1dSoftLabel } from '../../lib/t1d-ui';
import { HEALTH_PORTAL_COPY } from '../../content/health-portal-copy';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';
import { ConnectionPanel } from './ConnectionPanel';
import { HealthRecordsPanel } from './HealthRecordsPanel';

const CONNECTIONS_STRIP: Record<Language, { sensor: string; clinic: string; live: string; off: string }> = {
  en: { sensor: 'CGM sensor', clinic: 'Clinic portals', live: 'On', off: 'Off' },
  ru: { sensor: 'Датчик CGM', clinic: 'Клиники', live: 'Вкл', off: 'Выкл' },
  uk: { sensor: 'Датчик CGM', clinic: 'Клініки', live: 'Увімк', off: 'Вимк' },
  es: { sensor: 'Sensor CGM', clinic: 'Clínicas', live: 'On', off: 'Off' },
  fr: { sensor: 'Capteur CGM', clinic: 'Cliniques', live: 'On', off: 'Off' },
  de: { sensor: 'CGM-Sensor', clinic: 'Kliniken', live: 'An', off: 'Aus' },
  zh: { sensor: 'CGM 传感器', clinic: '诊所门户', live: '开', off: '关' },
  ja: { sensor: 'CGMセンサー', clinic: 'クリニック', live: 'オン', off: 'オフ' },
  pt: { sensor: 'Sensor CGM', clinic: 'Clínicas', live: 'On', off: 'Off' },
  he: { sensor: 'חיישן CGM', clinic: 'פורטלים', live: 'פעיל', off: 'כבוי' },
  ar: { sensor: 'مستشعر CGM', clinic: 'العيادات', live: 'تشغيل', off: 'إيقاف' },
};

const BLOCK: Record<Language, { sensor: string; sensorHint: string; clinic: string; clinicHint: string }> = {
  en: {
    sensor: 'Glucose sensor',
    sensorHint: 'Dexcom G6/G7, Libre — live readings into your day view.',
    clinic: 'MyChart & clinic records',
    clinicHint: 'Labs, meds, and visits from your hospital portal — read-only sync.',
  },
  ru: {
    sensor: 'Датчик глюкозы',
    sensorHint: 'Dexcom G6/G7, Libre — показания сразу в вашем дне.',
    clinic: 'MyChart и записи клиники',
    clinicHint: 'Анализы, лекарства и визиты из портала больницы — только чтение.',
  },
  uk: {
    sensor: 'Датчик глюкози',
    sensorHint: 'Dexcom G6/G7, Libre — показники одразу у вашому дні.',
    clinic: 'MyChart і записи клініки',
    clinicHint: 'Аналізи, ліки та візити з порталу лікарні.',
  },
  es: { sensor: 'Sensor de glucosa', sensorHint: 'Dexcom, Libre — lecturas en vivo.', clinic: 'MyChart y registros', clinicHint: 'Análisis, medicamentos y visitas.' },
  fr: { sensor: 'Capteur glucose', sensorHint: 'Dexcom, Libre — lectures en direct.', clinic: 'MyChart et dossiers', clinicHint: 'Analyses, médicaments et visites.' },
  de: { sensor: 'Glukose-Sensor', sensorHint: 'Dexcom, Libre — Live-Werte.', clinic: 'MyChart & Akten', clinicHint: 'Labor, Medikamente und Besuche.' },
  zh: { sensor: '葡萄糖传感器', sensorHint: 'Dexcom、Libre — 实时读数。', clinic: 'MyChart 与诊所记录', clinicHint: '化验、用药和就诊记录。' },
  ja: { sensor: 'グルコースセンサー', sensorHint: 'Dexcom、Libre — ライブ読み取り。', clinic: 'MyChart とクリニック', clinicHint: '検査・薬・受診記録。' },
  pt: { sensor: 'Sensor de glicose', sensorHint: 'Dexcom, Libre — leituras ao vivo.', clinic: 'MyChart e registros', clinicHint: 'Exames, medicamentos e consultas.' },
  he: { sensor: 'חיישן גלוקוז', sensorHint: 'Dexcom, Libre — קריאות חיות.', clinic: 'MyChart ורשומות', clinicHint: 'בדיקות, תרופות וביקורים.' },
  ar: { sensor: 'مستشعر الجلوكوز', sensorHint: 'Dexcom وLibre — قراءات مباشرة.', clinic: 'MyChart والسجلات', clinicHint: 'تحاليل وأدوية وزيارات.' },
};

export type WorkspaceConnectionsSectionProps = {
  lang: Language;
  theme: T1DTheme;
  isRTL?: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  deviceStatus: WorkspacePayload['deviceStatus'];
  dexcom: WorkspacePayload['dexcomConnection'];
  glucoseUnit: GlucoseUnit;
  glucoseLabel: string;
  trendLabel: string;
  connectionBusy: boolean;
  healthPortalBusy: boolean;
  healthRecords: HealthRecordsSummary;
  onDexcomConnect: () => Promise<void>;
  onDexcomDisconnect: () => Promise<void>;
  onDexcomPoll: () => Promise<void>;
  onHealthPortalConnect: (portalId: string) => Promise<void>;
  onHealthPortalSync: (portalId: string) => Promise<void>;
  onHealthPortalDisconnect: (portalId: string) => Promise<void>;
};

export const WorkspaceConnectionsSection: React.FC<WorkspaceConnectionsSectionProps> = ({
  lang,
  theme,
  isRTL = false,
  sectionTitle,
  sectionSubtitle,
  deviceStatus,
  dexcom,
  glucoseUnit,
  glucoseLabel,
  trendLabel,
  connectionBusy,
  healthPortalBusy,
  healthRecords,
  onDexcomConnect,
  onDexcomDisconnect,
  onDexcomPoll,
  onHealthPortalConnect,
  onHealthPortalSync,
  onHealthPortalDisconnect,
}) => {
  const strip = CONNECTIONS_STRIP[lang];
  const block = BLOCK[lang];
  const portalCopy = HEALTH_PORTAL_COPY[lang];
  const softLabel = t1dSoftLabel(theme);
  const sensorLive = dexcom?.status === 'connected' || deviceStatus?.status === 'connected';
  const mychartLive = healthRecords.portals.some((p) => p.id === 'epic_mychart' && p.connection.status === 'connected');
  const clinicCount = healthRecords.connectedCount;

  return (
    <section className={`t1d-connections-section ${theme === 'dark' ? 't1d-connections-section--dark' : ''} ${isRTL ? 'text-right' : 'text-left'}`}>
      <WorkspaceSectionHeader title={sectionTitle} subtitle={sectionSubtitle} theme={theme} isRTL={isRTL} />

      <div className={`t1d-connections-strip ${theme === 'dark' ? 't1d-connections-strip--dark' : ''}`}>
        <div className={`t1d-connections-strip__item ${sensorLive ? 'is-live' : ''}`}>
          <Radio size={16} aria-hidden />
          <span>{strip.sensor}</span>
          <strong>{sensorLive ? strip.live : strip.off}</strong>
        </div>
        <div className={`t1d-connections-strip__item ${mychartLive || clinicCount > 0 ? 'is-live' : ''}`}>
          <Stethoscope size={16} aria-hidden />
          <span>{strip.clinic}</span>
          <strong>{clinicCount > 0 ? `${clinicCount} ${portalCopy.connected.toLowerCase()}` : strip.off}</strong>
        </div>
        <div className="t1d-connections-strip__item t1d-connections-strip__item--hint">
          <Link2 size={16} aria-hidden />
          <span>{portalCopy.portalHint}</span>
        </div>
      </div>

      <div className="t1d-connections-block">
        <header className="t1d-connections-block__head">
          <span className={`t1d-connections-block__icon t1d-connections-block__icon--sensor`} aria-hidden><Radio size={18} /></span>
          <div>
            <p className={softLabel}>{block.sensor}</p>
            <h3 className="t1d-connections-block__title">{block.sensorHint}</h3>
          </div>
        </header>
        <ConnectionPanel
          lang={lang}
          theme={theme}
          isRTL={isRTL}
          embedded
          deviceStatus={deviceStatus}
          dexcom={dexcom}
          glucoseUnit={glucoseUnit}
          glucoseLabel={glucoseLabel}
          trendLabel={trendLabel}
          onConnect={onDexcomConnect}
          onDisconnect={onDexcomDisconnect}
          onPoll={onDexcomPoll}
          busy={connectionBusy}
        />
      </div>

      <div className="t1d-connections-block">
        <header className="t1d-connections-block__head">
          <span className={`t1d-connections-block__icon t1d-connections-block__icon--clinic`} aria-hidden><Stethoscope size={18} /></span>
          <div>
            <p className={softLabel}>{block.clinic}</p>
            <h3 className="t1d-connections-block__title">{block.clinicHint}</h3>
          </div>
        </header>
        <HealthRecordsPanel
          lang={lang}
          theme={theme}
          isRTL={isRTL}
          embedded
          featuredPortalId="epic_mychart"
          summary={healthRecords}
          busy={healthPortalBusy}
          onConnect={onHealthPortalConnect}
          onSync={onHealthPortalSync}
          onDisconnect={onHealthPortalDisconnect}
        />
      </div>
    </section>
  );
};
