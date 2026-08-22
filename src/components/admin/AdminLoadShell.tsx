import React, { useCallback, useEffect, useState } from 'react';
import type { AdminAuth } from '../../lib/api';
import { AdminPageBanner } from './AdminUi';

type UseAdminLoadOptions<T> = {
  auth: AdminAuth;
  loader: (auth: AdminAuth) => Promise<T>;
  fallback: T;
};

export const useAdminLoad = <T,>({ auth, loader, fallback }: UseAdminLoadOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    loader(auth)
      .then((next) => {
        setData(next);
        setUsingFallback(false);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load admin data';
        setError(message);
        setData(fallback);
        setUsingFallback(true);
      })
      .finally(() => setLoading(false));
  }, [auth, loader, fallback]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, usingFallback, reload };
};

export const AdminLoadShell: React.FC<{
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}> = ({ theme, loading, error, usingFallback, onRetry, children }) => (
  <>
    {usingFallback && error ? (
      <AdminPageBanner theme={theme} tone="warn">
        Live API unavailable ({error}). Showing demo data — sign in as super admin or set T1D_ADMIN_SECRET, then{' '}
        <button type="button" className="t1d-admin-banner__link" onClick={onRetry}>retry</button>.
      </AdminPageBanner>
    ) : null}
    {!usingFallback && error ? (
      <AdminPageBanner theme={theme} tone="error">
        {error}{' '}
        <button type="button" className="t1d-admin-banner__link" onClick={onRetry}>Retry</button>
      </AdminPageBanner>
    ) : null}
    {loading ? <p className="t1d-admin-loading">Loading…</p> : null}
    {!loading ? children : null}
  </>
);
