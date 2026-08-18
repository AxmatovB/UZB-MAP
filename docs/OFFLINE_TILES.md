# Offline xarita rasmlari (tiles)

Standart holatda bu paket xarita rasmlarini (tiles — asosdagi ko'cha/bino rasmlari) ochiq `tile.openstreetmap.org` serveridan onlayn yuklaydi. Bu ishlaydi, lekin:
- **internet talab qiladi**
- OpenStreetMap'ning [foydalanish siyosati](https://operations.osmfoundation.org/policies/tiles/) bor — juda ko'p (masalan butun call-markaz) foydalanuvchi bir vaqtda ishlatsa, ular IP'ingizni bloklashi mumkin

Agar internetsiz yoki katta yuklama ostida ishonchli ishlashi kerak bo'lsa, xarita rasmlarini **mahalliy** joylashtirish kerak. Bu ixtiyoriy va standart to'plamga kirmagan (hajmi ~1–1.5 GB bo'lgani uchun).

## Variant 1 — tayyor tile arxivini yuklab olish

Ko'p ochiq manbalar O'zbekiston/Markaziy Osiyo uchun tayyor `.mbtiles` arxivlarini beradi, masalan [Geofabrik](https://download.geofabrik.de/asia/uzbekistan.html) yoki [OpenMapTiles](https://data.maptiler.com/downloads/). Yuklab olgach, ularni `.png` tile'lariga aylantirish uchun [`tilelive`](https://github.com/mapbox/tilelive) yoki shunga o'xshash vositadan foydalaning.

## Variant 2 — o'zingiz render qiling (to'liq nazorat)

O'zbekiston OSM ma'lumotidan (`.osm.pbf`) o'zingiz tile serverini ko'tarish mumkin, masalan [`openstreetmap/openstreetmap-tile-server`](https://github.com/Overv/openstreetmap-tile-server) Docker image'i orqali:

```bash
docker run \
  -v osm-data:/data/database/ \
  -e DOWNLOAD_PBF=https://download.geofabrik.de/asia/uzbekistan-latest.osm.pbf \
  -e DOWNLOAD_POLY=https://download.geofabrik.de/asia/uzbekistan.poly \
  overv/openstreetmap-tile-server import

docker run -p 8081:80 -v osm-data:/data/database/ overv/openstreetmap-tile-server run
```

Bu server `http://localhost:8081/tile/{z}/{x}/{y}.png` formatida tile beradi.

## Ilovaga ulash

`index.html`da xarita asosi (tile layer) shu joyda belgilanadi:

```js
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {minZoom:5, maxZoom:19, attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
```

URL'ni mahalliy serveringizga almashtiring:

```js
L.tileLayer('http://localhost:8081/tile/{z}/{x}/{y}.png',
  {minZoom:5, maxZoom:19, attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
```

## Tile'larni oldindan yuklab, diskka joylab qo'yish (eng tez ishlash)

Agar har safar render qilishning hojati bo'lmasa, tile serverdan kerakli hudud/zoom oralig'ini bir marta yuklab, `tiles/{z}/{x}/{y}.png` papka tuzilishida diskka saqlab, `express.static('tiles')` orqali berish mumkin — bu asl loyihada shunday ishlagan (`map/tiles/` papkasi, ~1 GB, shu sabab bu standalone paketga kiritilmagan).
