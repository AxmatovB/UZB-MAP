# Toshkent interaktiv xaritasi

O'zbekiston va Toshkent shahrining ma'muriy chegaralari (viloyat/tuman), metro, muassasalar (maktab, kasalxona, masjid, bozor va h.k.) hamda boshqa qatlamlarni ko'rsatadigan interaktiv xarita. [OpenStreetMap](https://www.openstreetmap.org) ma'lumotlari asosida, offline-first — asosiy qatlamlar oldindan yuklab olingan JSON fayllar sifatida saqlanadi, shuning uchun ochilganda tezkor ishlaydi va Overpass API'ga bog'liq emas.

Bu — kattaroq loyihaning **faqat xarita qismi**, mustaqil ishlaydigan holatda ajratib olingan.

## Tezkor boshlash

```bash
npm install
npm start
```

So'ng brauzerda oching: **http://localhost:8080**

Port o'zgartirish uchun: `PORT=3000 npm start`

## Xususiyatlari

- **Viloyatlar / Tumanlar** — barcha 14 viloyat va 200+ tuman chegaralari
- **Qidiruv** — nom, manzil yoki koordinata bo'yicha (offline indeks + ixtiyoriy Yandex/Nominatim)
- **Qatlamlar** — metro (yo'l va bekatlar), KPP, bozorlar, supermarketlar, parklar, shifoxonalar, o'quv binolari, masjidlar, ko'priklar, mahallalar va boshqa 15+ turdagi obyekt
- **Rang sozlash** — har bir viloyat/tuman uchun o'ng tugma orqali rang tanlash, saqlanadi (`prefs.json`)
- **Offline geometriya** — chegaralar va nuqta qatlamlari `geodata/layers/` papkasida tayyor holda

## Loyiha tuzilishi

```
map/
├── index.html              Butun ilova (Leaflet asosida, bitta fayl)
├── data.js                 Toshkent shahri tumanlari uchun oldindan yuklangan OSM ma'lumoti
├── server.js                Yengil server: statik fayllar + 3 ta ixtiyoriy proksi
├── geodata/layers/          Barcha chegara va nuqta qatlamlari (JSON)
├── lib/leaflet/              Leaflet kutubxonasi (offline, CDN'ga bog'liq emas)
├── scripts/                  Ma'lumotni yangilash/tozalash uchun yordamchi skriptlar
└── docs/                     Batafsil hujjatlar (quyida)
```

## Hujjatlar

| Fayl | Nima haqida |
|---|---|
| [docs/SETUP.md](docs/SETUP.md) | O'rnatish, sozlash, muhit o'zgaruvchilari, deploy qilish |
| [docs/DATA.md](docs/DATA.md) | Ma'lumot manbai, qatlamlar formati, ularni qanday yangilash |
| [docs/OFFLINE_TILES.md](docs/OFFLINE_TILES.md) | Internetsiz ishlashi uchun xarita rasmlarini (tiles) mahalliy joylashtirish |

## Manba va litsenziya

Xarita ma'lumotlari — [OpenStreetMap](https://www.openstreetmap.org/copyright) hissachilaridan, [ODbL](https://opendatacommons.org/licenses/odbl/) litsenziyasi ostida. Har qanday nashr/tarqatishda `© OpenStreetMap contributors` atributsiyasi saqlanishi kerak (xaritaning o'zida allaqachon bor).
