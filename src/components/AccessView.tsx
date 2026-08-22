import React, { useEffect, useState } from 'react';
import {
  confirmPasswordReset,
  getGoogleAuthStatus,
  requestPasswordReset,
  signIn,
  signInWithGoogle,
  signUp,
  type GoogleAuthStatus,
} from '../lib/api';
import { AUTH_SOCIAL_COPY, AUTH_TYPE_COPY, COPY, RESET_COPY, type AccessCopy } from '../content/access-copy';
import {
  diabetesTypeForApi,
  readSignupDiabetesChoice,
  setSignupDiabetesChoice,
  type SignupDiabetesChoice,
} from '../lib/signup-diabetes-type';
import { Language, RTL_LANGUAGES, type UserRole } from '../types';
import { AuthScreenShell } from './auth/AuthScreenShell';
import { AuthTypeSelector } from './auth/AuthTypeSelector';
import { GoogleSignInPanel } from './auth/GoogleSignInPanel';
import { PasswordField } from './auth/PasswordField';
import { t1dBtnPrimary, t1dBtnSecondary, t1dInput, t1dSoftLabel } from '../lib/t1d-ui';

type Mode = 'signin' | 'signup';
type AuthPanel = 'auth' | 'reset';

export interface AccessUser {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  organization?: string;
  isSuperAdmin?: boolean;
}

interface AccessViewProps {
  mode: Mode;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  signupChoice?: SignupDiabetesChoice | null;
  onBack: () => void;
  onSuccess: (user: AccessUser) => void | Promise<void>;
  onModeChange: (mode: Mode) => void;
}

const normalizeError = (message: string, copy: AccessCopy) => {
  if (message === 'Email or password is incorrect') return copy.errors.incorrectCredentials;
  if (
    message === 'This email already has a T1D account'
    || message === 'Unable to create account with these details'
  ) return copy.errors.duplicateEmail;
  if (message === 'Email and password are required') return copy.errors.missingCredentials;
  if (message === 'Request failed') return copy.errors.requestFailed;
  if (message === 'Origin not allowed') return copy.errors.requestFailed;
  return message || copy.errors.requestFailed;
};

const defaultSignupRole = (choice: SignupDiabetesChoice | null): UserRole =>
  choice === 'type2' ? 'adult' : 'parent';

export const AccessView: React.FC<AccessViewProps> = ({
  mode,
  lang,
  setLang,
  theme,
  setTheme,
  signupChoice = null,
  onBack,
  onSuccess,
  onModeChange,
}) => {
  const initialChoice = signupChoice ?? readSignupDiabetesChoice();
  const typeCopy = AUTH_TYPE_COPY[lang];
  const copy = COPY[lang][mode];
  const socialCopy = AUTH_SOCIAL_COPY[lang];
  const resetCopy = RESET_COPY[lang];
  const isRTL = RTL_LANGUAGES.includes(lang);
  const [selectedChoice, setSelectedChoice] = useState<SignupDiabetesChoice | null>(initialChoice);
  const [panel, setPanel] = useState<AuthPanel>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devResetToken, setDevResetToken] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const labelClass = t1dSoftLabel(theme);
  const cardClass = theme === 'dark' ? 't1d-auth-card t1d-auth-card--dark' : 't1d-auth-card';
  const diabetesTypeForApiValue = selectedChoice ? diabetesTypeForApi(selectedChoice) : null;
  const selectedDiabetesType = selectedChoice === 'type1' || selectedChoice === 'type2' ? selectedChoice : null;

  useEffect(() => {
    if (selectedChoice) setSignupDiabetesChoice(selectedChoice);
  }, [selectedChoice]);

  useEffect(() => {
    getGoogleAuthStatus()
      .then((response: GoogleAuthStatus) => {
        setGoogleEnabled(response.enabled);
        setGoogleClientId(response.clientId || import.meta.env.VITE_GOOGLE_CLIENT_ID || '');
      })
      .catch(() => setGoogleEnabled(false));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const googleAuth = params.get('google_auth');
    if (googleAuth === 'error') setError(socialCopy.googleFailed);
    if (googleAuth === 'no_account') setError(socialCopy.googleNoAccount);
    if (googleAuth) {
      params.delete('google_auth');
      const nextSearch = params.toString();
      window.history.replaceState({}, '', `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`);
    }
  }, [socialCopy.googleFailed, socialCopy.googleNoAccount]);

  const completeAuth = async (user: AccessUser) => {
    await onSuccess(user);
  };

  const handleGoogleCredential = async (credential: string) => {
    if (!googleEnabled) {
      setError(socialCopy.googleUnavailable);
      return;
    }
    if (mode === 'signup' && !selectedChoice) {
      setError(typeCopy.choiceRequired);
      return;
    }

    setError('');
    setNotice('');
    setBusy(true);
    try {
      const response = await signInWithGoogle({
        credential,
        mode,
        role: mode === 'signup' ? defaultSignupRole(selectedChoice) : undefined,
        diabetesType: diabetesTypeForApiValue ?? undefined,
      });
      await completeAuth({ ...response.user, password: '' });
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : '';
      setError(message === 'no_account' ? socialCopy.googleNoAccount : socialCopy.googleFailed);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'signup' && !selectedChoice) {
      setError(typeCopy.choiceRequired);
      return;
    }
    setError('');
    setNotice('');
    setBusy(true);

    try {
      if (mode === 'signin') {
        const response = await signIn({ email, password, diabetesType: diabetesTypeForApiValue ?? undefined });
        await completeAuth({ ...response.user, password });
        return;
      }

      const role = defaultSignupRole(selectedChoice);
      const fullName = email.split('@')[0]?.trim() || 'Member';
      const response = await signUp({
        email,
        password,
        fullName,
        role,
        organization: '',
        diabetesType: diabetesTypeForApiValue ?? 'type1',
      });
      await completeAuth({ ...response.user, password });
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : '';
      setError(normalizeError(message, copy));
    } finally {
      setBusy(false);
    }
  };

  const handleResetRequest = async () => {
    if (!email.trim()) {
      setError(resetCopy.emailRequired);
      return;
    }
    setError('');
    setNotice('');
    setBusy(true);
    try {
      const response = await requestPasswordReset(email.trim());
      setNotice(response.message);
      if (response.resetToken) {
        setDevResetToken(response.resetToken);
        setResetToken(response.resetToken);
      }
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : resetCopy.tokenRequired;
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const handleResetConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!resetToken.trim() || !newPassword.trim()) {
      setError(resetCopy.tokenRequired);
      return;
    }
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await confirmPasswordReset(resetToken.trim(), newPassword);
      setNotice(resetCopy.passwordUpdated);
      setPanel('auth');
      setPassword('');
      setNewPassword('');
      setResetToken('');
      setDevResetToken('');
      onModeChange('signin');
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : resetCopy.tokenRequired;
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScreenShell
      lang={lang}
      setLang={setLang}
      theme={theme}
      setTheme={setTheme}
      diabetesType={selectedDiabetesType}
      signupChoice={selectedChoice}
      isRTL={isRTL}
      onBack={onBack}
      backLabel={copy.back}
      mode={mode}
    >
      <section className={`${cardClass} t1d-auth-card--elevated p-7 md:p-8`}>
        {panel === 'reset' ? (
          <>
            <p className={labelClass}>{resetCopy.title}</p>
            <h1 className="mt-2 text-center text-2xl font-semibold text-stone-900 dark:text-slate-100">
              {resetCopy.title}
            </h1>
            <p className={`mt-3 text-center text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}>
              {resetCopy.body}
            </p>
            <form className="mt-6 space-y-4" onSubmit={handleResetConfirm}>
              <div className="space-y-2">
                <label htmlFor="reset-email" className={labelClass}>{copy.fields.email}</label>
                <input
                  id="reset-email"
                  className={`${t1dInput(theme)} ${isRTL ? 'text-right' : 'text-left'}`}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={copy.placeholders.email}
                  autoComplete="email"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleResetRequest}
                  className={`${t1dBtnSecondary(theme)} w-full disabled:opacity-60`}
                >
                  {resetCopy.sendLink}
                </button>
              </div>
              {devResetToken ? (
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-xs text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
                  <p className="font-semibold">{resetCopy.devTokenNote}</p>
                  <p className="mt-1 break-all font-mono">{devResetToken}</p>
                </div>
              ) : null}
              <div className="space-y-2">
                <label htmlFor="reset-token" className={labelClass}>{resetCopy.tokenPlaceholder}</label>
                <input
                  id="reset-token"
                  className={`${t1dInput(theme)} ${isRTL ? 'text-right' : 'text-left'}`}
                  value={resetToken}
                  onChange={(event) => setResetToken(event.target.value)}
                  placeholder={resetCopy.tokenPlaceholder}
                />
              </div>
              <PasswordField
                theme={theme}
                id="reset-new-password"
                label={resetCopy.updatePassword}
                value={newPassword}
                onChange={setNewPassword}
                placeholder={copy.placeholders.password}
                showLabel={socialCopy.showPassword}
                hideLabel={socialCopy.hidePassword}
                rtl={isRTL}
              />
              {error ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300">
                  {error}
                </p>
              ) : null}
              {notice ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                  {notice}
                </p>
              ) : null}
              <button type="submit" disabled={busy} className={`${t1dBtnPrimary(theme)} w-full disabled:opacity-60`}>
                {resetCopy.updatePassword}
              </button>
            </form>
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setPanel('auth');
                  setError('');
                  setNotice('');
                }}
                className="text-sm font-semibold text-orange-800 dark:text-amber-200"
              >
                {resetCopy.backToSignIn}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={`text-center ${labelClass}`}>{copy.eyebrow}</p>
            <h1 className="mt-2 text-center text-2xl font-semibold text-stone-900 dark:text-slate-100">
              {copy.title}
            </h1>
            <p className={`mt-2 text-center text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}>
              {copy.subtitle}
            </p>

            {mode === 'signup' ? (
              <div className="mt-6">
                <AuthTypeSelector
                  lang={lang}
                  theme={theme}
                  value={selectedChoice}
                  onChange={setSelectedChoice}
                  isRTL={isRTL}
                />
              </div>
            ) : null}

            <div className="mt-6 space-y-5">
              {googleEnabled && googleClientId ? (
                <GoogleSignInPanel
                  clientId={googleClientId}
                  disabled={busy}
                  onCredential={handleGoogleCredential}
                  onError={() => setError(socialCopy.googleFailed)}
                />
              ) : (
                <div className={`rounded-2xl border px-4 py-3 text-sm ${theme === 'dark' ? 'border-white/10 bg-white/[0.04] text-slate-300' : 'border-stone-200 bg-stone-50/90 text-stone-600'}`}>
                  {socialCopy.googleUnavailable}
                </div>
              )}

              <div className="t1d-auth-divider">{socialCopy.orEmail}</div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="access-email" className={labelClass}>{copy.fields.email}</label>
                  <input
                    id="access-email"
                    className={`${t1dInput(theme)} ${isRTL ? 'text-right' : 'text-left'}`}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={copy.placeholders.email}
                    autoComplete="email"
                    required
                  />
                </div>

                <PasswordField
                  theme={theme}
                  id={mode === 'signup' ? 'access-password-signup' : 'access-password-signin'}
                  label={copy.fields.password}
                  value={password}
                  onChange={setPassword}
                  placeholder={copy.placeholders.password}
                  showLabel={socialCopy.showPassword}
                  hideLabel={socialCopy.hidePassword}
                  rtl={isRTL}
                />

                {mode === 'signin' ? (
                  <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setPanel('reset');
                        setError('');
                        setNotice('');
                      }}
                      className="text-sm font-semibold text-orange-800 dark:text-amber-200"
                    >
                      {resetCopy.forgot}
                    </button>
                  </div>
                ) : null}

                {error ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={busy}
                  className={`${t1dBtnPrimary(theme)} w-full disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {busy ? copy.working : copy.primary}
                </button>
              </form>

              <div className="border-t border-stone-200/80 pt-5 text-center dark:border-white/10">
                <button
                  type="button"
                  onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-sm font-semibold text-orange-800 transition hover:text-orange-700 dark:text-amber-200 dark:hover:text-amber-100"
                >
                  {copy.switchAction}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </AuthScreenShell>
  );
};

export default AccessView;
