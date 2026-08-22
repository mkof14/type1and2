export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export const downloadText = (content: string, filename: string, mime = 'text/plain;charset=utf-8') => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const printHtml = (html: string, title = 'Print') => {
  const frame = document.createElement('iframe');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '0';
  frame.style.height = '0';
  frame.style.border = '0';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  frame.contentWindow?.focus();
  frame.contentWindow?.print();
  window.setTimeout(() => frame.remove(), 1000);
};

export const downloadPdfFromHtml = (html: string, filename: string) => {
  // Opens print dialog — user can Save as PDF; also save HTML fallback.
  downloadText(html, filename.replace(/\.pdf$/i, '.html'), 'text/html;charset=utf-8');
  printHtml(html, filename);
};

export const shareContent = async (payload: { title: string; text: string; url?: string }) => {
  if (navigator.share) {
    await navigator.share(payload);
    return;
  }
  await copyToClipboard(payload.url || payload.text);
};
