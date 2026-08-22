export const createHealthPortalSyncService = ({
  ensureHealthPortals,
  shouldRunBackgroundHealthPortalSync,
  syncHealthPortal,
  refreshHealthPortalToken,
  getPortalCatalogEntry,
  healthPortalEnvConfig,
  readHouseholds,
  writeHouseholds,
}) => {
  const applyHealthPortalSyncToHousehold = async (household, source = 'background') => {
    const portalIds = Object.keys(ensureHealthPortals(household));
    let nextHousehold = { ...household, healthPortals: ensureHealthPortals(household) };

    for (const portalId of portalIds) {
      const portal = nextHousehold.healthPortals[portalId];
      if (portal.status !== 'connected') continue;
      if (!portal.nextSyncDueAt) continue;
      const dueAt = Date.parse(portal.nextSyncDueAt);
      if (!Number.isFinite(dueAt) || dueAt > Date.now()) continue;

      const catalog = getPortalCatalogEntry(portalId);
      const env = healthPortalEnvConfig(catalog?.oauthProvider);
      const expiresAt = Date.parse(portal.tokenExpiresAt || '');
      if (env.useLiveMode && catalog?.authMode === 'oauth_smart' && Number.isFinite(expiresAt) && expiresAt <= Date.now() + 60000) {
        try {
          const refreshed = await refreshHealthPortalToken(nextHousehold, portalId);
          nextHousehold = { ...nextHousehold, healthPortals: refreshed.portals, updatedAt: new Date().toISOString() };
        } catch (error) {
          console.warn(`[health-portal] token refresh failed for ${portalId}:`, error instanceof Error ? error.message : error);
        }
      }

      const synced = await syncHealthPortal(nextHousehold, portalId, source);
      nextHousehold = {
        ...nextHousehold,
        healthPortals: synced.portals,
        updatedAt: new Date().toISOString(),
      };
    }

    return nextHousehold;
  };

  const runBackgroundHealthPortalSync = async () => {
    const households = await readHouseholds();
    let changed = false;
    const nextHouseholds = await Promise.all(
      households.map(async (household) => {
        if (!shouldRunBackgroundHealthPortalSync(household)) return household;
        changed = true;
        return applyHealthPortalSyncToHousehold(household, 'background');
      }),
    );
    if (changed) {
      await writeHouseholds(nextHouseholds);
    }
    return { processed: nextHouseholds.length, changed };
  };

  return {
    shouldRunBackgroundHealthPortalSync,
    applyHealthPortalSyncToHousehold,
    runBackgroundHealthPortalSync,
  };
};
