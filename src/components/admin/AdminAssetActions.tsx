import React from 'react';
import type { T1DTheme } from '../../lib/t1d-ui';
import { t1dBtnSecondary } from '../../lib/t1d-ui';
import { ADMIN_ACTIONS } from '../../content/admin-copy';
import { copyToClipboard, downloadPdfFromHtml, downloadText, printHtml, shareContent } from '../../lib/admin-asset-actions';

type AdminAssetActionsProps = {
  theme: T1DTheme;
  title: string;
  content: string;
  url?: string;
  html?: string;
  filename?: string;
  onView?: () => void;
  compact?: boolean;
};

export const AdminAssetActions: React.FC<AdminAssetActionsProps> = ({
  theme,
  title,
  content,
  url,
  html,
  filename = 'asset',
  onView,
  compact = false,
}) => {
  const btn = `${t1dBtnSecondary(theme)} ${compact ? 'px-3 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`;

  const handleCopy = () => void copyToClipboard(content);
  const handleShare = () => void shareContent({ title, text: content, url });
  const handleSend = () => void shareContent({ title: `Send: ${title}`, text: content, url: url || `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(content)}` });
  const handleDownload = () => void downloadText(html || content, `${filename}.txt`, html ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8');
  const handlePrint = () => void printHtml(html || `<pre>${content.replace(/</g, '&lt;')}</pre>`, title);
  const handlePdf = () => void downloadPdfFromHtml(html || `<html><body><h1>${title}</h1><pre>${content}</pre></body></html>`, `${filename}.pdf`);

  return (
    <div className="t1d-admin-actions">
      {onView ? (
        <button type="button" className={btn} onClick={onView}>{ADMIN_ACTIONS.view}</button>
      ) : url ? (
        <a href={url} target="_blank" rel="noreferrer" className={btn}>{ADMIN_ACTIONS.view}</a>
      ) : null}
      <button type="button" className={btn} onClick={handleCopy}>{ADMIN_ACTIONS.copy}</button>
      <button type="button" className={btn} onClick={handleShare}>{ADMIN_ACTIONS.share}</button>
      <button type="button" className={btn} onClick={handleSend}>{ADMIN_ACTIONS.send}</button>
      <button type="button" className={btn} onClick={handleDownload}>{ADMIN_ACTIONS.download}</button>
      <button type="button" className={btn} onClick={handlePrint}>{ADMIN_ACTIONS.print}</button>
      <button type="button" className={btn} onClick={handlePdf}>{ADMIN_ACTIONS.pdf}</button>
    </div>
  );
};
