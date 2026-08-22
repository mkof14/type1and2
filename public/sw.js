self.addEventListener('push', (event) => {
  let payload = { title: 'Type1 and 2 alert', body: 'Open the app to respond.' };
  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() };
    }
  } catch {
    // Keep default payload when push body is not JSON.
  }

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Type1 and 2 alert', {
      body: payload.body || '',
      icon: '/favicon.png',
      badge: '/favicon.png',
      data: payload,
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url.includes('/workspace'));
      if (existing) {
        return existing.focus();
      }
      return self.clients.openWindow('/workspace');
    }),
  );
});
