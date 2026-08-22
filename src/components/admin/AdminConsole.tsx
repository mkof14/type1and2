import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { AdminAuth } from '../../lib/api';
import { adminPathForSection, resolveAdminSection, type AdminSectionId } from '../../lib/admin-routing';
import { ADMIN_ACTIONS } from '../../content/admin-copy';
import { T1DPageBackdrop } from '../layout/T1DPageBackdrop';
import { AdminSidebar } from './AdminSidebar';
import { AdminSectionRouter } from './AdminSectionPages';
import { t1dBtnPrimary, t1dBtnSecondary, t1dInput, t1dPanelPrimary, t1dShell, t1dSoftLabel, t1dHelpText, type T1DTheme } from '../../lib/t1d-ui';

const ADMIN_TOKEN_KEY = 't1d_admin_token';

type AdminConsoleProps = {
  theme: T1DTheme;
  setTheme: (theme: 'light' | 'dark') => void;
  onBackToPublic: () => void;
  isSuperAdmin?: boolean;
};

export const AdminConsole: React.FC<AdminConsoleProps> = ({ theme, setTheme, onBackToPublic, isSuperAdmin = false }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [token, setToken] = useState<AdminAuth | null>(() => {
    if (isSuperAdmin) return 'session';
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || null;
  });
  const [section, setSection] = useState<AdminSectionId>(() => resolveAdminSection(window.location.pathname));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSuperAdmin) setToken('session');
  }, [isSuperAdmin]);

  const navigate = useCallback((next: AdminSectionId) => {
    setSection(next);
    const path = adminPathForSection(next);
    if (window.location.pathname !== path) {
      window.history.pushState({ adminSection: next }, '', path);
    }
  }, []);

  useEffect(() => {
    const onPop = () => setSection(resolveAdminSection(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    window.sessionStorage.setItem(ADMIN_TOKEN_KEY, trimmed);
    setToken(trimmed);
    setTokenInput('');
    setError(null);
  };

  const handleSignOut = () => {
    window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setError(null);
  };

  if (!token) {
    return (
      <div className={`${t1dShell(theme)} relative min-h-screen`}>
        <T1DPageBackdrop theme={theme} />
        <div className="t1d-container relative z-10 py-16 max-w-lg">
          <h1 className="text-3xl font-black">{ADMIN_ACTIONS.consoleTitle}</h1>
          <p className={`mt-3 ${t1dHelpText(theme)}`}>{isSuperAdmin ? ADMIN_ACTIONS.superAdminHint : ADMIN_ACTIONS.tokenHint}</p>
          {!isSuperAdmin ? (
            <form className={`${t1dPanelPrimary(theme)} mt-8 space-y-4`} onSubmit={handleUnlock}>
              <label className="block space-y-2">
                <span className={t1dSoftLabel(theme)}>Bearer secret</span>
                <input type="password" className={`${t1dInput(theme)} w-full`} value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="T1D_CRON_SECRET" />
              </label>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <button type="submit" className={t1dBtnPrimary(theme)} disabled={!tokenInput.trim()}>{ADMIN_ACTIONS.unlock}</button>
            </form>
          ) : (
            <p className={`mt-6 ${t1dHelpText(theme)}`}>Sign in at /access with your super admin account, then return here.</p>
          )}
          <button type="button" className={`${t1dBtnSecondary(theme)} mt-4`} onClick={onBackToPublic}>{ADMIN_ACTIONS.backToSite}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`t1d-admin-app ${theme === 'dark' ? 't1d-admin-app--dark' : ''}`}>
      <T1DPageBackdrop theme={theme} />
      <div className="t1d-admin-layout">
        <AdminSidebar theme={theme} active={section} onNavigate={navigate} onBackToPublic={onBackToPublic} />
        <div className="t1d-admin-main">
          <header className="t1d-admin-topbar">
            <button type="button" className="t1d-admin-back-site t1d-admin-back-site--top" onClick={onBackToPublic}>
              <ArrowLeft size={16} aria-hidden />
              <span>{ADMIN_ACTIONS.backToSite}</span>
            </button>
            <div className="t1d-admin-topbar__actions">
              <button type="button" className={t1dBtnSecondary(theme)} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
              <button type="button" className={t1dBtnSecondary(theme)} onClick={onBackToPublic}>{ADMIN_ACTIONS.backToSite}</button>
              {token !== 'session' ? (
                <button type="button" className={t1dBtnSecondary(theme)} onClick={handleSignOut}>{ADMIN_ACTIONS.signOutToken}</button>
              ) : null}
            </div>
          </header>
          <AdminSectionRouter section={section} theme={theme} auth={token} />
        </div>
      </div>
    </div>
  );
};
