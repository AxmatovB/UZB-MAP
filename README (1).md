<div align="center">

```
██╗   ██╗███████╗██████╗       ███╗   ███╗ █████╗ ██████╗ 
██║   ██║╚══███╔╝██╔══██╗      ████╗ ████║██╔══██╗██╔══██╗
██║   ██║  ███╔╝ ██████╔╝█████╗██╔████╔██║███████║██████╔╝
██║   ██║ ███╔╝  ██╔══██╗╚════╝██║╚██╔╝██║██╔══██║██╔═══╝ 
╚██████╔╝███████╗██████╔╝      ██║ ╚═╝ ██║██║  ██║██║     
 ╚═════╝ ╚══════╝╚═════╝       ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝     
```

### 🗺️ O'zbekiston va Toshkent shahrining interaktiv xaritasi

*OpenStreetMap asosida, offline-first, tezkor va CDN'ga bog'liq bo'lmagan*

[![Node](https://img.shields.io/badge/node-%3E%3D16-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Leaflet](https://img.shields.io/badge/Leaflet-offline-199900?logo=leaflet&logoColor=white)](https://leafletjs.com)
[![OSM](https://img.shields.io/badge/data-OpenStreetMap-7EBC6F?logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org)
[![License: ODbL](https://img.shields.io/badge/license-ODbL-blue.svg)](https://opendatacommons.org/licenses/odbl/)
[![Stars](https://img.shields.io/github/stars/AxmatovB/UZB-MAP?style=social)](https://github.com/AxmatovB/UZB-MAP)

</div>

---

```
        .--.                              
     .-(    ).      🇺🇿  O'ZBEKISTON        
    (___.__)__)     14 viloyat · 200+ tuman  
                                              
    ┌──────────────────────────────────┐
    │   ▓▓▓▓▓  Qoraqalpog'iston ▓▓▓▓▓   │
    │  ▓▓ Xorazm    Navoiy   Buxoro ▓▓  │
    │ ▓▓ Qashqadaryo   Samarqand  ▓▓▓   │
    │  ▓▓ Surxondaryo  Jizzax  ▓▓▓▓     │
    │   ▓▓ Sirdaryo ★TOSHKENT★ ▓▓▓      │
    │    ▓▓ Namangan Farg'ona And. ▓▓   │
    └──────────────────────────────────┘
         ★ = shahar markazi (metro bor)
```

## 📖 Loyiha haqida

**UZB-MAP** — O'zbekiston va Toshkent shahrining ma'muriy chegaralari (viloyat/tuman), metro liniyalari, va turli muassasalarni (maktab, kasalxona, masjid, bozor va boshqalar) ko'rsatuvchi interaktiv veb-xarita.

Xarita **offline-first** tamoyilida qurilgan — barcha asosiy qatlamlar oldindan tayyorlangan JSON fayllar sifatida saqlanadi. Bu shuni anglatadiki:

- ⚡ Ochilganda darhol ishga tushadi
- 🔌 Overpass API'ga real-vaqtda bog'liq emas
- 📦 Leaflet kutubxonasi ham lokal saqlangan (CDN kerak emas)

> Bu — kattaroq loyihaning **faqat xarita qismi**, mustaqil ishlaydigan holatda ajratib olingan.

---

## 🚀 Tezkor boshlash

```bash
npm install
npm start
```

So'ngra brauzerda oching 👉 **http://localhost:8080**

Portni o'zgartirish uchun:

```bash
PORT=3000 npm start
```

---

## ✨ Xususiyatlari

| # | Xususiyat | Tavsif |
|---|-----------|--------|
| 🏛️ | **Viloyatlar / Tumanlar** | Barcha 14 viloyat va 200+ tuman chegaralari |
| 🔍 | **Qidiruv** | Nom, manzil yoki koordinata bo'yicha (offline indeks + ixtiyoriy Yandex/Nominatim) |
| 🗂️ | **Qatlamlar** | Metro (yo'l va bekatlar), KPP, bozorlar, supermarketlar, parklar, shifoxonalar, o'quv binolari, masjidlar, ko'priklar, mahallalar va 15+ boshqa turdagi obyekt |
| 🎨 | **Rang sozlash** | Har bir viloyat/tuman uchun o'ng tugma orqali rang tanlash — `prefs.json`ga saqlanadi |
| 📴 | **Offline geometriya** | Chegaralar va nuqta qatlamlari `geodata/layers/` papkasida tayyor holda |

---

## 📁 Loyiha tuzilishi

```
map/
├── index.html            🖥️  Butun ilova (Leaflet asosida, bitta fayl)
├── data.js               📊  Toshkent shahri tumanlari uchun oldindan yuklangan OSM ma'lumoti
├── server.js             🌐  Yengil server: statik fayllar + 3 ta ixtiyoriy proksi
├── geodata/layers/       🗺️  Barcha chegara va nuqta qatlamlari (JSON)
├── lib/leaflet/          📦  Leaflet kutubxonasi (offline, CDN'ga bog'liq emas)
├── scripts/              🛠️  Ma'lumotni yangilash/tozalash uchun yordamchi skriptlar
└── docs/                 📚  Batafsil hujjatlar
```

---

## 📚 Hujjatlar

| Fayl | Nima haqida |
|------|-------------|
| [`docs/SETUP.md`](https://github.com/AxmatovB/UZB-MAP/blob/main/docs/SETUP.md) | O'rnatish, sozlash, muhit o'zgaruvchilari, deploy qilish |
| [`docs/DATA.md`](https://github.com/AxmatovB/UZB-MAP/blob/main/docs/DATA.md) | Ma'lumot manbai, qatlamlar formati, ularni qanday yangilash |
| [`docs/OFFLINE_TILES.md`](https://github.com/AxmatovB/UZB-MAP/blob/main/docs/OFFLINE_TILES.md) | Internetsiz ishlashi uchun xarita rasmlarini (tiles) mahalliy joylashtirish |

---

## 🧭 Qatlamlar ro'yxati (vizual)

```
        ┌───────────────────────────────┐
        │   🗺️  XARITA QATLAMLARI        │
        ├───────────────────────────────┤
        │ 🚇 Metro yo'llari / bekatlar   │
        │ 🚧 KPP (nazorat postlari)      │
        │ 🏪 Bozorlar / Supermarketlar   │
        │ 🌳 Parklar                     │
        │ 🏥 Shifoxonalar                │
        │ 🏫 O'quv binolari              │
        │ 🕌 Masjidlar                   │
        │ 🌉 Ko'priklar                  │
        │ 🏘️ Mahallalar                  │
        │ ➕ 15+ boshqa obyekt turlari   │
        └───────────────────────────────┘
```

---

## ⚖️ Manba va litsenziya

Xarita ma'lumotlari — [OpenStreetMap](https://www.openstreetmap.org/copyright) hissachilaridan, **[ODbL](https://opendatacommons.org/licenses/odbl/)** litsenziyasi ostida.

> Har qanday nashr/tarqatishda `© OpenStreetMap contributors` atributsiyasi saqlanishi shart (xaritaning o'zida allaqachon mavjud).

---

<div align="center">

```
   made with 🗺️ + 💻  in  Toshkent, O'zbekiston
```

**[⭐ Star bering](https://github.com/AxmatovB/UZB-MAP)** agar loyiha foydali bo'lsa!

</div>
