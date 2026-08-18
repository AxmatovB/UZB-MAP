# O'rnatish va sozlash

## Talablar

- [Node.js](https://nodejs.org/) 18 yoki undan yuqori versiya

## O'rnatish

```bash
npm install
npm start
```

Standart holatda `http://localhost:8080` manzilida ishga tushadi.

## Muhit o'zgaruvchilari

Barchasi ixtiyoriy — hech birini o'rnatmasangiz ham xarita to'liq ishlaydi (faqat qidiruv/manzil aniqlashda Yandex o'rniga faqat OSM ma'lumoti ishlatiladi).

| O'zgaruvchi | Standart | Vazifasi |
|---|---|---|
| `PORT` | `8080` | Server qaysi portda ishga tushishi |
| `YANDEX_GEOCODER_APIKEY` | (bo'sh) | Yandex Geocoder API kaliti — qidiruv va "manzil aniqlash"ni yaxshilaydi |
| `OVERPASS_URL` | `overpass-api.de` | Overpass proksi qaysi serverga so'rov yuborsin |

Misol:
```bash
PORT=3000 YANDEX_GEOCODER_APIKEY=sizning_kalitingiz npm start
```

### Yandex API kalitini qayerdan olish

1. https://developer.tech.yandex.ru/ saytiga kiring
2. "Geocoder API" uchun bepul kalit yarating (kuniga bepul so'rovlar limiti bor)
3. `YANDEX_GEOCODER_APIKEY` sifatida o'rnating

**Muhim:** kalitni hech qachon kodga yozmang yoki GitHub'ga commit qilmang — faqat muhit o'zgaruvchisi orqali bering. `.gitignore` allaqachon `.env` faylini e'tiborsiz qoldiradi (agar shunday fayl ishlatsangiz, `dotenv` paketini alohida o'rnating).

## Ishga tushirishni tekshirish

```bash
curl http://localhost:8080/api/prefs
# {} qaytishi kerak (hali hech qanday rang saqlanmagan)
```

## Production'ga joylashtirish

Bu — oddiy Express server, shuning uchun istalgan Node hosting (Railway, Render, VPS, Docker) bilan ishlaydi:

```bash
npm ci --omit=dev
PORT=80 npm start
```

Yoki `pm2`/`systemd` orqali doimiy ishga tushirish tavsiya etiladi:
```bash
npm install -g pm2
pm2 start server.js --name toshkent-map
```

Nginx/Caddy orqali reverse-proxy qilsangiz — statik fayllarni (`geodata/`, `lib/`, `data.js`) to'g'ridan-to'g'ri veb-serverdan berish tezroq bo'ladi, faqat `/api/*` yo'llarini Node'ga proksi qiling.
