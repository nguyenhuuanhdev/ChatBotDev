self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", async () => {
    // Xoá hết cache
    const keys = await caches.keys();
    for (const key of keys) await caches.delete(key);

    // Hủy đăng ký SW
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
    });
});
