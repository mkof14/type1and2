import { randomBytes } from 'node:crypto';
import { normalizeEmail } from './request-utils.mjs';

/** Bootstrap site owner — always full admin access when signing in with these credentials. */
export const SUPER_ADMIN_EMAIL = 'dnainform@gmail.com';
export const SUPER_ADMIN_PASSWORD = 'Mkof1@3@5';

export const isSuperAdminEmail = (email) => normalizeEmail(email) === SUPER_ADMIN_EMAIL;

export const isSuperAdminUser = (user) => Boolean(user?.isSuperAdmin) || isSuperAdminEmail(user?.email);

export const isSuperAdminPassword = (email, password) =>
  isSuperAdminEmail(email) && String(password || '') === SUPER_ADMIN_PASSWORD;

export const decorateSuperAdminUser = (user) => {
  if (!user || !isSuperAdminEmail(user.email)) return user;
  return { ...user, isSuperAdmin: true };
};

export const upsertSuperAdminUser = async ({
  readUsers,
  writeUsers,
  hashPassword,
  mirrorUsersToSql,
}) => {
  const users = await readUsers();
  const email = SUPER_ADMIN_EMAIL;
  const passwordHash = hashPassword(SUPER_ADMIN_PASSWORD);
  const index = users.findIndex((entry) => normalizeEmail(entry.email) === email);

  if (index === -1) {
    const created = {
      id: randomBytes(12).toString('hex'),
      email,
      passwordHash,
      fullName: 'Site Super Admin',
      role: 'parent',
      organization: 'Type1 and 2',
      isSuperAdmin: true,
      createdAt: new Date().toISOString(),
    };
    users.push(created);
    await writeUsers(users);
    mirrorUsersToSql([created]);
    return created;
  }

  const updated = {
    ...users[index],
    email,
    passwordHash,
    isSuperAdmin: true,
    fullName: users[index].fullName || 'Site Super Admin',
  };
  users[index] = updated;
  await writeUsers(users);
  mirrorUsersToSql([updated]);
  return updated;
};
