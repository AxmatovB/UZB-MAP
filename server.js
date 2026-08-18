'use strict';
/*
 * Minimal standalone server for the Toshkent interactive map.
 *
 * This is a small, self-contained subset of the main "Operatorlar" project's
 * backend — just enough to run this map on its own: static files, saved
 * layer-color preferences, an Overpass proxy, and an optional Yandex
 * geocoder proxy. No database, no auth, no other project features.
 *
 * Run:  npm install && npm start
 * See README.md for details.
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const { fetch } = require('undici');

const PORT = process.env.PORT || 8080;
const PREFS_FILE = path.join(__dirname, 'prefs.json');
const YANDEX_APIKEY = process.env.YANDEX_GEOCODER_APIKEY || '';
const OVERPASS_URL = process.env.OVERPASS_URL || 'https://overpass-api.de/api/interpreter';

const app = express();

// ---- /api/prefs — shared layer-color preferences, saved to a local file ----
function readPrefs() {
  try { return JSON.parse(fs.readFileSync(PREFS_FILE, 'utf8')); }
  catch (e) { return {}; }
}
function writePrefs(prefs) {
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
}

app.get('/api/prefs', (req, res) => {
  res.json(readPrefs());
});

app.post('/api/prefs', express.json(), (req, res) => {
  const { store, id, color } = req.body || {};
  if (!store || !id) return res.status(400).json({ ok: false, error: 'store/id required' });
  const prefs = readPrefs();
  prefs[store] = prefs[store] || {};
  if (color === null || color === undefined) delete prefs[store][id];
  else prefs[store][id] = color;
  writePrefs(prefs);
  res.json({ ok: true });
});

// ---- /api/overpass — passthrough proxy so the browser doesn't hit Overpass
//      directly (avoids CORS/rate-limit surprises). Optional: the map falls
//      back to querying Overpass mirrors directly from the browser if this
//      fails or 404s. ----
app.post('/api/overpass', express.text({ type: '*/*', limit: '2mb' }), async (req, res) => {
  try {
    const r = await fetch(OVERPASS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: typeof req.body === 'string' ? req.body : '',
    });
    const text = await r.text();
    res.status(r.status).type('application/json').send(text);
  } catch (e) {
    res.status(502).json({ ok: false, error: 'overpass upstream failed: ' + e.message });
  }
});

// ---- /api/ygeocode — optional Yandex geocoder proxy (search box + reverse
//      address lookup). Needs a free Yandex API key: see README.md. Without
//      one, this degrades gracefully — search still works via OSM/Nominatim,
//      and the address line just won't show. ----
async function callYandex(geocode, extra) {
  const url = 'https://geocode-maps.yandex.ru/1.x/?apikey=' + YANDEX_APIKEY
    + '&geocode=' + encodeURIComponent(geocode)
    + '&format=json&lang=uz_UZ&results=5&bbox=' + encodeURIComponent('55.9,37.1~73.3,45.7') + '&rspn=1'
    + (extra || '');
  const r = await fetch(url);
  if (!r.ok) throw new Error('Yandex Geocoder HTTP ' + r.status);
  return r.json();
}

app.get('/api/ygeocode', async (req, res) => {
  if (!YANDEX_APIKEY) {
    return res.json({ response: { GeoObjectCollection: { featureMember: [] } } });
  }
  try {
    const { q, lat, lon } = req.query;
    if (lat !== undefined && lon !== undefined) {
      const js = await callYandex(lon + ',' + lat, '&kind=house');
      return res.json(js);
    }
    if (!q) return res.status(400).json({ ok: false, error: 'q or lat/lon required' });
    const js = await callYandex(String(q));
    res.json(js);
  } catch (e) {
    res.status(502).json({ ok: false, error: 'ygeocode failed: ' + e.message });
  }
});

// ---- static files (index.html, data.js, geodata/, lib/) ----
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Map running: http://localhost:${PORT}`);
  if (!YANDEX_APIKEY) console.log('(YANDEX_GEOCODER_APIKEY not set — search/address will use OSM/Nominatim only.)');
});
