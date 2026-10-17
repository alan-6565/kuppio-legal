// Shared by s/ (shop link) and qr/ (printable poster), #117 in Hidden-Gem.
// Reads one published shop with Supabase's public (anon) key; the database's
// row-level security only returns shops that are published and not removed.
// The anon key is meant to be public: it's the same one shipped in the app.
window.KUPPIO = {
  supabaseUrl: 'https://fyskaxvnhaoenugiwymq.supabase.co',
  anonKey: 'sb_publishable_IeW3BT3QnGvYhBOkZmLihg_QXICFBG7',
  base: 'https://alan-6565.github.io/kuppio-legal',

  // Shop ids are uuids or slugs; anything else is ignored.
  shopId() {
    const id = new URLSearchParams(location.search).get('id') || '';
    return /^[A-Za-z0-9_-]{1,80}$/.test(id) ? id : null;
  },

  async loadShop(id) {
    const fields = 'id,name,category,is_home_based,address,service_area,description,photos';
    const res = await fetch(
      `${this.supabaseUrl}/rest/v1/spots?id=eq.${encodeURIComponent(id)}&select=${fields}&limit=1`,
      { headers: { apikey: this.anonKey, Authorization: `Bearer ${this.anonKey}` } },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    return rows[0] || null;
  },

  shareUrl: (id) => `https://alan-6565.github.io/kuppio-legal/s/?id=${encodeURIComponent(id)}`,
  appUrl: (id) => `kuppio://spot/${encodeURIComponent(id)}`,

  // Home businesses only publish an area, never an address.
  place(shop) {
    const where = shop.is_home_based ? shop.service_area : shop.address;
    return where ? String(where).split(',').slice(0, 2).join(',').trim() : '';
  },

  // Only https images from the shop's photos.
  photo(shop) {
    const url = (shop.photos || [])[0];
    return typeof url === 'string' && url.startsWith('https://') ? url : null;
  },
};
