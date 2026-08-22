import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import './styles-glucose.css';
import './styles-type-theme.css';
import './styles-workspace-visual.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initMonitoring } from './services/monitoring';
import { initPwaInstall, registerServiceWorker } from './lib/pwa-install';
import './styles-admin.css';
import './styles-voice-guide.css';
import './styles-pricing.css';

initMonitoring();
initPwaInstall();
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="Type1 and 2 hit an unexpected error">
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
