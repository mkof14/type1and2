export const DOWNLOAD_ARTIFACTS = {
  desktopWindows: '/downloads/type1and2-desktop.url',
  desktopMac: '/downloads/type1and2-desktop.webloc',
  mobileHtml: '/downloads/type1and2-mobile.html',
  pwaManifest: '/downloads/type1and2-app.webmanifest',
} as const;

export const resolveDesktopDownloadHref = () => {
  if (typeof navigator === 'undefined') return DOWNLOAD_ARTIFACTS.desktopWindows;
  const ua = navigator.userAgent;
  if (/Mac|Macintosh/.test(ua) && !/iPhone|iPad|iPod/.test(ua)) return DOWNLOAD_ARTIFACTS.desktopMac;
  return DOWNLOAD_ARTIFACTS.desktopWindows;
};

export const resolveDesktopDownloadName = (href: string) =>
  href.endsWith('.webloc') ? 'Type1and2 Desktop.webloc' : 'Type1and2 Desktop.url';

export const triggerFileDownload = (href: string, filename: string) => {
  if (typeof document === 'undefined') return;
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};
