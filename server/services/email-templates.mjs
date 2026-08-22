const PRODUCT_NAME = 'Type1 and 2';
const PRODUCT_DOMAIN = 'type1and2.com';

const resolveSiteUrl = () => {
  if (typeof globalThis !== 'undefined' && globalThis.location?.origin) {
    return globalThis.location.origin.replace(/\/$/, '');
  }
  return String(process.env.T1D_SITE_URL || process.env.VITE_SITE_URL || 'https://type1and2.com').replace(/\/$/, '');
};

/** Brand palette — explicit hex for email client compatibility */
const C = {
  page: '#c8d5e4',
  card: '#ffffff',
  footer: '#eef2f7',
  heading: '#0b1220',
  body: '#1e293b',
  muted: '#475569',
  faint: '#64748b',
  border: '#b8c5d4',
  mint: '#059669',
  mintLight: '#10b981',
  mintBg: '#ecfdf5',
  mintBorder: '#6ee7b7',
  orange: '#ea580c',
  orangeLight: '#f97316',
  orangeBg: '#fff7ed',
  orangeBorder: '#fdba74',
  teal: '#0d9488',
  tealBg: '#f0fdfa',
  slateBtn: '#0f172a',
  gradient: 'linear-gradient(90deg,#059669 0%,#14b8a6 38%,#f97316 100%)',
  headerBg: 'linear-gradient(135deg,#ecfdf5 0%,#ffffff 48%,#fff7ed 100%)',
};

const brandNameHtml = (size = 22) =>
  `<span style="font-size:${size}px;font-weight:900;letter-spacing:-0.04em;line-height:1.1;">
    <span style="color:${C.mint};">Type1</span><span style="color:${C.muted};font-weight:700;"> and </span><span style="color:${C.orange};">2</span>
  </span>`;

const accentFor = (variant) => ({
  type1: { bar: 'linear-gradient(90deg,#047857,#10b981)', hero: C.mintBg, heroBorder: C.mintBorder, dot: C.mint, label: C.mint },
  type2: { bar: 'linear-gradient(90deg,#c2410c,#f97316)', hero: C.orangeBg, heroBorder: C.orangeBorder, dot: C.orange, label: C.orange },
  neutral: { bar: C.gradient, hero: C.tealBg, heroBorder: '#99f6e4', dot: C.teal, label: C.teal },
}[variant] || { bar: C.gradient, hero: C.tealBg, heroBorder: '#99f6e4', dot: C.teal, label: C.teal });

const emailButton = (href, label, variant = 'slate') => {
  const styles = {
    slate: { td: `background:${C.slateBtn};box-shadow:0 10px 24px rgba(15,23,42,0.22);`, link: 'color:#ffffff;' },
    type1: { td: `background:linear-gradient(135deg,#047857,${C.mintLight});box-shadow:0 10px 24px rgba(5,150,105,0.35);`, link: 'color:#ffffff;' },
    type2: { td: `background:linear-gradient(135deg,#c2410c,${C.orangeLight});box-shadow:0 10px 24px rgba(234,88,12,0.35);`, link: 'color:#ffffff;' },
    outline: { td: `background:#ffffff;border:2px solid ${C.border};box-shadow:0 4px 14px rgba(15,23,42,0.06);`, link: `color:${C.heading};` },
  };
  const s = styles[variant] || styles.slate;
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:22px 0 10px;"><tr><td style="border-radius:999px;${s.td}"><a href="${href}" style="display:inline-block;padding:16px 28px;font-size:16px;font-weight:800;text-decoration:none;${s.link}border-radius:999px;letter-spacing:-0.01em;">${label}</a></td></tr></table>`;
};

const emailSectionLabel = (text, color = C.teal) =>
  `<p style="margin:0 0 10px;font-size:11px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:${color};">${text}</p>`;

const emailHero = (title, subtitle, variant = 'neutral') => {
  const a = accentFor(variant);
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 22px;border-radius:20px;overflow:hidden;border:1px solid ${a.heroBorder};background:${a.hero};">
    <tr><td style="width:6px;background:${a.bar};font-size:0;line-height:0;">&nbsp;</td>
    <td style="padding:22px 24px;">
      <h1 style="margin:0 0 ${subtitle ? '8' : '0'}px;font-size:34px;line-height:1.08;font-weight:900;letter-spacing:-0.03em;color:${C.heading};">${title}</h1>
      ${subtitle ? `<p style="margin:0;font-size:17px;line-height:1.45;color:${C.muted};font-weight:700;">${subtitle}</p>` : ''}
    </td></tr>
  </table>`;
};

const emailBadge = (text, variant = 'neutral') => {
  const a = accentFor(variant);
  const bg = variant === 'type1' ? C.mintBg : variant === 'type2' ? C.orangeBg : '#f8fafc';
  const color = variant === 'type1' ? C.mint : variant === 'type2' ? C.orange : C.teal;
  const border = variant === 'type1' ? C.mintBorder : variant === 'type2' ? C.orangeBorder : C.border;
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 16px;"><tr><td style="padding:8px 16px;border-radius:999px;font-size:11px;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;color:${color};background:${bg};border:2px solid ${border};">${text}</td></tr></table>`;
};

const emailParagraph = (html) =>
  `<p style="margin:0 0 16px;font-size:17px;line-height:1.75;color:${C.body};font-weight:500;">${html}</p>`;

const emailCard = (title, inner, variant = 'neutral') => {
  const a = accentFor(variant);
  const bg = variant === 'type1' ? C.mintBg : variant === 'type2' ? C.orangeBg : C.footer;
  const border = variant === 'type1' ? C.mintBorder : variant === 'type2' ? C.orangeBorder : C.border;
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:18px 0;border-radius:18px;border:1px solid ${border};background:${bg};overflow:hidden;">
    <tr><td style="height:4px;background:${a.bar};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="padding:18px 20px;">
      ${title ? `<p style="margin:0 0 8px;font-size:13px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:${a.label};">${title}</p>` : ''}
      <div style="font-size:16px;line-height:1.7;color:${C.body};font-weight:500;">${inner}</div>
    </td></tr>
  </table>`;
};

const emailFeature = (emoji, title, desc, dotColor = C.teal) =>
  `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 12px;">
    <tr>
      <td width="48" valign="top" style="padding-top:2px;">
        <div style="width:40px;height:40px;border-radius:12px;background:${dotColor}18;border:2px solid ${dotColor}44;text-align:center;line-height:36px;font-size:20px;">${emoji}</div>
      </td>
      <td valign="top" style="padding-left:12px;">
        <p style="margin:0 0 4px;font-size:16px;font-weight:800;color:${C.heading};">${title}</p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:${C.muted};font-weight:500;">${desc}</p>
      </td>
    </tr>
  </table>`;

const emailFeatureList = (items, dotColor = C.teal) =>
  `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 20px;padding:16px;border-radius:18px;background:#f8fafc;border:1px solid ${C.border};">
    <tr><td style="padding:4px 8px;">${items.map((item) => emailFeature(item.emoji, item.title, item.desc, dotColor)).join('')}</td></tr>
  </table>`;

const emailStatRow = (rows) =>
  `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;border-collapse:separate;border-spacing:8px 0;">
    <tr>${rows.map((row) => `<td width="${Math.floor(100 / rows.length)}%" style="padding:14px 12px;border-radius:16px;background:#f8fafc;border:1px solid ${C.border};text-align:center;vertical-align:top;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:${C.faint};">${row.label}</p>
      <p style="margin:0;font-size:20px;font-weight:900;color:${row.color || C.heading};letter-spacing:-0.02em;">${row.value}</p>
    </td>`).join('')}</tr>
  </table>`;

const emailQuote = (label, text) =>
  emailCard(label, `<p style="margin:0;font-size:16px;line-height:1.75;color:${C.body};font-style:normal;">${text}</p>`, 'neutral');

const emailBrandHeader = (siteUrl, accent = 'neutral') => {
  const a = accentFor(accent);
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.headerBg};">
    <tr><td style="height:8px;background:${a.bar};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td style="padding:26px 32px 22px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
        <td width="58" valign="middle">
          <div style="width:52px;height:52px;border-radius:16px;background:#ffffff;border:2px solid ${C.mintBorder};box-shadow:0 8px 20px rgba(5,150,105,0.15);padding:4px;text-align:center;">
            <img src="${siteUrl}/brand/logo-mark.png" width="44" height="44" alt="${PRODUCT_NAME}" style="display:block;margin:0 auto;border:0;" />
          </div>
        </td>
        <td valign="middle" style="padding-left:14px;">
          <img src="${siteUrl}/brand/logo-wordmark.png" width="168" height="32" alt="type1and2" style="display:block;border:0;max-width:168px;height:auto;margin-bottom:6px;" />
          <p style="margin:0;font-size:13px;font-weight:700;color:${C.teal};letter-spacing:-0.01em;">When it shifts, the right person knows.</p>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="height:1px;background:linear-gradient(90deg,transparent,${C.border},transparent);font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>`;
};

const emailFooter = () =>
  `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.footer};border-top:1px solid ${C.border};">
    <tr><td style="padding:22px 32px 26px;">
      <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding-right:10px;vertical-align:middle;">${brandNameHtml(18)}</td></tr></table>
      <p style="margin:10px 0 0;font-size:14px;line-height:1.65;color:${C.muted};font-weight:600;"><span style="color:${C.teal};">${PRODUCT_DOMAIN}</span> · Member support for Type 1 & Type 2</p>
      <p style="margin:10px 0 0;font-size:13px;line-height:1.65;color:${C.faint};">Software-only support — not medical advice. Always follow your care team's guidance.</p>
      <p style="margin:14px 0 0;font-size:12px;color:${C.faint};">© ${new Date().getFullYear()} ${PRODUCT_NAME}. All rights reserved.</p>
    </td></tr>
  </table>`;

const emailShell = ({ preheader, bodyHtml, accent = 'gradient' }) => {
  const siteUrl = resolveSiteUrl();
  const accentKey = accent === 'type1' ? 'type1' : accent === 'type2' ? 'type2' : 'neutral';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${PRODUCT_NAME}</title>
  <style>
    :root { color-scheme: light; }
    body { margin:0; padding:0; background:${C.page}; }
    h1 { color:${C.heading}; }
    p, td, li { color:${C.body}; }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.page};font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;color:${C.body};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.page};padding:32px 14px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:${C.card};border-radius:26px;overflow:hidden;box-shadow:0 24px 60px rgba(11,18,32,0.16);border:1px solid ${C.border};">
        <tr><td>${emailBrandHeader(siteUrl, accentKey)}</td></tr>
        <tr><td style="padding:24px 32px 28px;background:${C.card};color:${C.body};">${bodyHtml}</td></tr>
        <tr><td>${emailFooter()}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export const getEmailTemplates = () => {
  const SITE_URL = resolveSiteUrl();
  return [
    {
      id: 'welcome',
      name: 'Welcome — new member',
      category: 'Onboarding',
      subject: `Welcome to ${PRODUCT_NAME}`,
      preheader: 'Your member workspace for Type 1 and Type 2 is ready.',
      html: emailShell({
        preheader: 'Your member workspace is ready.',
        bodyHtml: `
          ${emailBadge('Member · Type 1 & Type 2', 'neutral')}
          ${emailHero('Welcome aboard', 'Your daily support space is ready')}
          ${emailParagraph(`Thanks for joining ${brandNameHtml(17)}. Your workspace brings glucose, meals, alerts, and health records into one calm daily picture.`)}
          ${emailFeatureList([
            { emoji: '🩸', title: 'Connect your sensor', desc: 'Dexcom and more — live or manual, in one timeline.' },
            { emoji: '👨‍👩‍👧', title: 'Invite your circle', desc: 'Parents, partners, and backup adults on the same view.' },
            { emoji: '🌙', title: 'Set day & night rules', desc: 'The right person responds when it matters.' },
          ], C.teal)}
          ${emailButton(`${SITE_URL}/workspace`, 'Open your workspace →', 'slate')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;">Questions? <a href="mailto:support@${PRODUCT_DOMAIN}" style="color:${C.mint};font-weight:800;text-decoration:none;">support@${PRODUCT_DOMAIN}</a></span>`)}`,
      }),
    },
    {
      id: 'invite-type1',
      name: 'Invite — Type 1 family',
      category: 'Invitation',
      subject: 'Join our Type 1 support circle',
      preheader: 'A shared daily view for lows, nights, and backup support.',
      html: emailShell({
        preheader: 'Join our Type 1 support circle.',
        accent: 'type1',
        bodyHtml: `
          ${emailBadge('Type 1 · Family circle', 'type1')}
          ${emailHero('You\'re invited', 'Someone wants you in their safety circle', 'type1')}
          ${emailParagraph(`Join a <strong style="color:${C.mint};font-weight:800;">Type 1 support circle</strong> on ${brandNameHtml(17)} — parents, caregivers, and backup adults see the same calm view.`)}
          ${emailCard('What you\'ll see', `
            ${emailFeature('📊', 'Shared daily view', 'Lows, highs, and who responded — no guessing.', C.mint)}
            ${emailFeature('🏫', 'School & daytime', 'Handoffs between parents and caregivers.', C.mint)}
            ${emailFeature('🌙', 'Night backup', 'Escalation when the primary adult is asleep.', C.mint)}
          `, 'type1')}
          ${emailButton(`${SITE_URL}/create-account?type=type1`, 'Accept invitation →', 'type1')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;">Have an invite code? You'll enter it during setup.</span>`)}`,
      }),
    },
    {
      id: 'invite-type2',
      name: 'Invite — Type 2 adult',
      category: 'Invitation',
      subject: 'Join your Type 2 support path',
      preheader: 'Meals, highs, and a calmer daily rhythm — together.',
      html: emailShell({
        preheader: 'Join your Type 2 support path.',
        accent: 'type2',
        bodyHtml: `
          ${emailBadge('Type 2 · Support path', 'type2')}
          ${emailHero('You\'re invited', 'A partner wants you on the same page', 'type2')}
          ${emailParagraph(`Join a <strong style="color:${C.orange};font-weight:800;">Type 2 support path</strong> on ${brandNameHtml(17)} — built for adults and partners around meals, highs, and steady check-ins.`)}
          ${emailCard('Built for your rhythm', `
            ${emailFeature('🍽️', 'Meal scanning', 'Carbs and patterns without spreadsheet stress.', C.orange)}
            ${emailFeature('📈', 'Gentler alerts', 'Tuned defaults — less alarm fatigue than Type 1.', C.orange)}
            ${emailFeature('🤝', 'Partner support', 'Someone can watch when you need backup.', C.orange)}
          `, 'type2')}
          ${emailButton(`${SITE_URL}/create-account?type=type2`, 'Accept invitation →', 'type2')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;">Not you? Ignore this email — no account will be created.</span>`)}`,
      }),
    },
    {
      id: 'password-reset',
      name: 'Password reset',
      category: 'Account',
      subject: 'Reset your password',
      preheader: 'Secure link to choose a new password.',
      html: emailShell({
        preheader: 'Reset your password securely.',
        bodyHtml: `
          ${emailBadge('Account security', 'neutral')}
          ${emailHero('Reset your password', 'Link expires in 60 minutes')}
          ${emailParagraph(`We received a request to reset your ${brandNameHtml(17)} password. Tap below to choose a new one.`)}
          ${emailButton(`${SITE_URL}/access`, 'Choose new password →', 'slate')}
          ${emailCard('Didn\'t request this?', 'You can safely ignore this email. Your password will not change unless you use the link above.', 'neutral')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;">Help: <a href="mailto:support@${PRODUCT_DOMAIN}" style="color:${C.mint};font-weight:800;text-decoration:none;">support@${PRODUCT_DOMAIN}</a></span>`)}`,
      }),
    },
    {
      id: 'marketing-newsletter',
      name: 'Marketing — monthly update',
      category: 'Marketing',
      subject: `What's new at ${PRODUCT_NAME}`,
      preheader: 'Product updates, member features, and support tips.',
      html: emailShell({
        preheader: 'Monthly product update.',
        bodyHtml: `
          ${emailBadge('Monthly update', 'neutral')}
          ${emailHero(`This month at ${PRODUCT_NAME}`, 'Clearer support for every day')}
          ${emailParagraph('What we shipped to make member life calmer:')}
          ${emailFeatureList([
            { emoji: '✨', title: 'Member zone', desc: 'Clearer Type 1 & Type 2 badges across workspace.' },
            { emoji: '🏥', title: 'Health records', desc: 'MyChart-style portals in one timeline.' },
            { emoji: '📧', title: 'Email library', desc: 'Branded templates for every lifecycle moment.' },
            { emoji: '⚙️', title: 'Admin console', desc: 'Support, finance, templates, and monitoring.' },
          ], C.teal)}
          ${emailStatRow([
            { label: 'Members', value: '2.4k+', color: C.mint },
            { label: 'Uptime', value: '99.9%', color: C.teal },
            { label: 'Support', value: '<4h', color: C.orange },
          ])}
          ${emailButton(`${SITE_URL}/workspace`, 'Open workspace →', 'slate')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;"><a href="${SITE_URL}/" style="color:${C.mint};font-weight:800;text-decoration:none;">Unsubscribe</a> from updates in Settings.</span>`)}`,
      }),
    },
    {
      id: 'support-reply',
      name: 'Support — ticket reply',
      category: 'Support',
      subject: 'We replied to your message',
      preheader: 'Your support request has an update.',
      html: emailShell({
        preheader: 'Support reply from Type1 and 2.',
        bodyHtml: `
          ${emailBadge('Support · Ticket update', 'neutral')}
          ${emailHero('We replied to your message', 'Reference SUP-1042')}
          ${emailParagraph(`Thanks for contacting ${brandNameHtml(17)} support. A team member reviewed your request:`)}
          ${emailQuote('Team reply', 'Hi — thanks for reaching out. We checked your connection settings and refreshed the sync on our side. Please open your workspace and try Connect again. If it still fails, reply with a screenshot and we\'ll escalate.')}
          ${emailStatRow([
            { label: 'Status', value: 'Replied', color: C.mint },
            { label: 'Priority', value: 'Medium', color: C.orange },
            { label: 'Avg reply', value: '<4h', color: C.teal },
          ])}
          ${emailButton(`mailto:support@${PRODUCT_DOMAIN}`, 'Reply to support →', 'outline')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;">Business days · We respond in English</span>`)}`,
      }),
    },
    {
      id: 'billing-receipt',
      name: 'Billing — receipt',
      category: 'Finance',
      subject: 'Your payment receipt',
      preheader: 'Thank you for your subscription payment.',
      html: emailShell({
        preheader: 'Payment receipt from Type1 and 2.',
        bodyHtml: `
          ${emailBadge('Receipt · Paid', 'neutral')}
          ${emailHero('Payment received', 'Thank you for your subscription')}
          ${emailParagraph(`Your ${brandNameHtml(17)} subscription was processed successfully.`)}
          ${emailCard('Payment details', `
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:16px;">
              <tr><td style="padding:10px 0;color:${C.muted};font-weight:700;">Plan</td><td style="padding:10px 0;text-align:right;font-weight:900;color:${C.heading};font-size:17px;">Member Monthly</td></tr>
              <tr><td style="padding:10px 0;color:${C.muted};font-weight:700;border-top:1px dashed ${C.border};">Amount</td><td style="padding:10px 0;text-align:right;font-weight:900;color:${C.mint};font-size:22px;border-top:1px dashed ${C.border};">$12.00</td></tr>
              <tr><td style="padding:10px 0;color:${C.muted};font-weight:700;">Date</td><td style="padding:10px 0;text-align:right;font-weight:700;color:${C.body};">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td></tr>
            </table>`, 'neutral')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;">Billing questions: <a href="mailto:support@${PRODUCT_DOMAIN}" style="color:${C.mint};font-weight:800;text-decoration:none;">support@${PRODUCT_DOMAIN}</a></span>`)}`,
      }),
    },
    {
      id: 'admin-alert',
      name: 'Admin — system alert',
      category: 'Operations',
      subject: 'System alert — review recommended',
      preheader: 'Operations alert from the admin console.',
      html: emailShell({
        preheader: 'Admin system alert.',
        accent: 'type2',
        bodyHtml: `
          ${emailBadge('Operations · Alert', 'type2')}
          ${emailHero('System alert', 'Action may be required', 'type2')}
          ${emailParagraph(`An operational threshold was reached on <strong style="color:${C.orange};font-weight:800;">${PRODUCT_DOMAIN}</strong>. Review monitoring before end of day.`)}
          ${emailFeatureList([
            { emoji: '⚡', title: 'Background jobs', desc: 'Verify Dexcom sync and health portal workers.' },
            { emoji: '💾', title: 'Storage health', desc: 'Check KV usage and write error rate.' },
            { emoji: '🔔', title: 'Active alerts', desc: 'Review open incidents in the console.' },
          ], C.orange)}
          ${emailButton(`${SITE_URL}/admin/monitoring`, 'Open monitoring →', 'slate')}
          ${emailParagraph(`<span style="color:${C.muted};font-size:15px;">Internal · Admin operators only</span>`)}`,
      }),
    },
  ];
};

export { PRODUCT_NAME, PRODUCT_DOMAIN, resolveSiteUrl as SITE_URL };
