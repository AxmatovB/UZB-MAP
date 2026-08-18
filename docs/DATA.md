# Ma'lumot manbai va formati

## Manba

Barcha geografik ma'lumot — [OpenStreetMap](https://www.openstreetmap.org)dan, asosan ikki usul bilan olingan:
- **Overpass API** — ko'p obyektli qatlamlar (bozorlar, maktablar, kesishmalar va h.k.)
- **Nominatim lookup API** — ma'muriy chegaralar (viloyat/tuman poligonlari), chunki bu usul Overpass'dagi kabi "outer/inner" birlashtirish xatolarisiz, tayyor bitta yaxlit konturni beradi

## Fayl tuzilishi

### `geodata/layers/*.json`

Har bir fayl — bitta qatlam. Umumiy shakl:

```json
{"t": "poi", "k": "bozorlar", "p": [[lat, lon, "Nomi", {teglar}], ...]}
```

Chegara qatlamlari (`districts_bound.json`, `regions_bound.json`) boshqacha, har bir element bitta hudud:

```json
{"t": "bound", "k": "districts", "p": [{"n": "Nomi", "c": [lat, lon], "r": [[[lat,lon], ...]]}]}
```
- `n` — nomi
- `c` — markaz (centroid)
- `r` — konturlar ro'yxati (odatda 1 ta; ba'zi tumanlarda haqiqiy eksklav bo'lsa 2+ bo'lishi mumkin — masalan So'x tumani)

### `data.js`

`window.LOCAL_DATA = {...}` — Toshkent shahri va uning atrofidagi tumanlar uchun oldindan bajarilgan Overpass so'rovi natijasi (xom holatda, brauzer o'zi ringlarga yig'adi). Bu — sahifa ochilganda **darhol** ko'rinadigan standart "Тumanlar" qatlamining manbai (qidiruvsiz).

### `geodata/layers/search.json`

Qidiruv indeksi. `scripts/build_search_areas.js` orqali `districts_bound.json`dan avtomatik quriladi — bu ikkisini qo'lda mos holatda saqlash shart emas, skriptni qayta ishga tushirish yetarli.

## Ma'lumotni yangilash

### Bitta tuman chegarasini tuzatish

```bash
curl "https://nominatim.openstreetmap.org/lookup?osm_ids=R<relation_id>&polygon_geojson=1&format=json" \
  -H "User-Agent: sizning-loyihangiz/1.0"
```

`relation_id`ni [openstreetmap.org](https://www.openstreetmap.org)da tuman nomini qidirib, uning URL'idagi raqamdan olasiz (masalan `openstreetmap.org/relation/5620904`). Natijadagi `geojson.coordinates[0]`ni `[lat, lon]`ga aylantirib, `districts_bound.json`dagi mos yozuvning `r` maydoniga qo'ying.

### Xato/ajralib qolgan bo'lakchalarni avtomatik tozalash

```bash
node scripts/prune_stray_district_rings.js
```

Bu skript har bir tumanning eng katta konturini asosiy deb hisoblab, undan uzoqda joylashgan kichik bo'lakchalarni (yoki tuman ichida shubhali "teshik" hosil qiluvchi kichik konturlarni) olib tashlaydi — haqiqiy eksklavlarni (So'x, Zarafshon) tegmasdan.

### Qidiruv indeksini qayta qurish

Chegara ma'lumotini o'zgartirgandan keyin **doim** shuni ishga tushiring:

```bash
node scripts/build_search_areas.js
```

## Litsenziya eslatmasi

OpenStreetMap ma'lumoti ODbL litsenziyasi ostida — uni qayta ishlatish/tarqatish erkin, lekin manba ko'rsatilishi shart (`© OpenStreetMap contributors`). Bu ilova buni allaqachon xarita pastki qismida ko'rsatadi.
