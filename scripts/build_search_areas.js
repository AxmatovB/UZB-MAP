'use strict';
/* ─────────────────────────────────────────────────────────────────────────────
   Stamp every entry of map/geodata/layers/search.json with the region and
   district it falls inside.

   Why a build step and not a runtime lookup: the index holds ~78k points and
   the boundaries are ~220 polygons with tens of thousands of vertices between
   them. Resolving that in the browser would mean either loading 4 MB of
   boundary data before the first search works, or doing point-in-polygon on
   every keystroke. Doing it once here costs about a second and leaves the
   search exactly as fast as it was.

   Two names can be identical and kilometres apart — searching "Bektemir"
   returns both a settlement in Toshkent/Bektemir tumani and another in
   Qashqadaryo/Kitob tumani — and until now the result list showed only the
   category ("шаҳарча"), so they were indistinguishable.

   Sources:
     map/data.js                              regions (14, full country
                                              coverage incl. Farg'ona and
                                              Qoraqalpog'iston, which
                                              regions_bound.json is missing)
     geodata/layers/districts_bound.json      districts (206)

   Output: search.json gains an `a` array of "Region / District" strings; each
   point gets a 5th element indexing into it. Points that land outside every
   polygon keep their old 4-element shape, and the map falls back to the old
   rendering for them — so this stays backward compatible in both directions.

   Run:  node scripts/build_search_areas.js
   ─────────────────────────────────────────────────────────────────────────── */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SEARCH_JSON = path.join(ROOT, 'geodata', 'layers', 'search.json');
const DISTRICTS_JSON = path.join(ROOT, 'geodata', 'layers', 'districts_bound.json');
const DATA_JS = path.join(ROOT, 'data.js');

// ── geometry ────────────────────────────────────────────────────────────────

// Ray casting. Same implementation the map already uses (inRing in
// map/index.html) so a point can never be classified one way here and another
// way on screen.
function inRing(pt, ring) {
  const x = pt[0], y = pt[1];
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

// Relation member ways → closed rings. Lifted from map/index.html stitchRings().
function stitchRings(ways) {
  const segs = ways.map((w) => w.map((p) => [p.lat, p.lon])).filter((s) => s.length > 1);
  const rings = [];
  const eq = (a, b) => Math.abs(a[0] - b[0]) < 1e-7 && Math.abs(a[1] - b[1]) < 1e-7;
  while (segs.length) {
    let ring = segs.shift();
    let closed = eq(ring[0], ring[ring.length - 1]);
    let guard = segs.length + 2;
    while (!closed && guard-- > 0) {
      const tail = ring[ring.length - 1];
      let found = -1, rev = false;
      for (let i = 0; i < segs.length; i++) {
        if (eq(segs[i][0], tail)) { found = i; rev = false; break; }
        if (eq(segs[i][segs[i].length - 1], tail)) { found = i; rev = true; break; }
      }
      if (found < 0) break;
      let nxt = segs.splice(found, 1)[0];
      if (rev) nxt = nxt.slice().reverse();
      ring = ring.concat(nxt.slice(1));
      closed = eq(ring[0], ring[ring.length - 1]);
    }
    if (ring.length > 3) rings.push(ring);
  }
  return rings;
}

// A bounding box per shape turns 220 full polygon scans per point into two or
// three. Without it this script runs for minutes instead of a second.
function withBBox(shapes) {
  return shapes.map((s) => {
    let latMin = 90, latMax = -90, lonMin = 180, lonMax = -180;
    for (const ring of s.rings) {
      for (const p of ring) {
        if (p[0] < latMin) latMin = p[0];
        if (p[0] > latMax) latMax = p[0];
        if (p[1] < lonMin) lonMin = p[1];
        if (p[1] > lonMax) lonMax = p[1];
      }
    }
    return { name: s.name, rings: s.rings, bb: [latMin, latMax, lonMin, lonMax] };
  });
}

function locate(shapes, lat, lon) {
  for (const s of shapes) {
    const b = s.bb;
    if (lat < b[0] || lat > b[1] || lon < b[2] || lon > b[3]) continue;
    for (const ring of s.rings) if (inRing([lat, lon], ring)) return s.name;
  }
  return '';
}

// ── sources ─────────────────────────────────────────────────────────────────

function loadRegions() {
  const sandbox = {};
  const prevWindow = global.window;
  global.window = sandbox;
  try {
    // eslint-disable-next-line no-eval
    eval(fs.readFileSync(DATA_JS, 'utf8'));
  } finally {
    global.window = prevWindow;
  }
  const els = (sandbox.LOCAL_DATA && sandbox.LOCAL_DATA.regions && sandbox.LOCAL_DATA.regions.elements) || [];
  const regions = els.map((e) => ({
    name: String((e.tags && (e.tags['name:uz'] || e.tags.name)) || '').trim(),
    rings: stitchRings((e.members || []).filter((m) => m.role === 'outer' && m.geometry).map((m) => m.geometry)),
  })).filter((r) => r.name && r.rings.length);

  // Toshkent city sits inside the Toshkent viloyati outline, so whichever is
  // tested first wins. The city has to win — a point in Bektemir belongs to
  // "Toshkent", not to "Toshkent viloyati".
  const isCity = (n) => !/viloyat/i.test(n) && !/respublika/i.test(n);
  return [...regions.filter((r) => isCity(r.name)), ...regions.filter((r) => !isCity(r.name))];
}

function loadDistricts() {
  const raw = JSON.parse(fs.readFileSync(DISTRICTS_JSON, 'utf8'));
  return (raw.p || [])
    .map((d) => ({ name: String(d.n || '').trim(), rings: d.r || [] }))
    .filter((d) => d.name && d.rings.length);
}

// ── main ────────────────────────────────────────────────────────────────────

function main() {
  const t0 = Date.now();
  const regions = withBBox(loadRegions());
  const districts = withBBox(loadDistricts());
  console.log(`[areas] ${regions.length} regions, ${districts.length} districts loaded`);

  const index = JSON.parse(fs.readFileSync(SEARCH_JSON, 'utf8'));
  const points = index.p || [];
  console.log(`[areas] ${points.length} search entries`);

  const areas = [];              // "Region / District"
  const areaIdx = new Map();
  let stamped = 0, noRegion = 0, noDistrict = 0;

  for (const e of points) {
    const lat = e[0], lon = e[1];
    const region = locate(regions, lat, lon);
    const district = locate(districts, lat, lon);
    if (!region) noRegion++;
    if (!district) noDistrict++;
    // Both missing means the point is outside the country outline (a handful of
    // border artefacts). Leave the entry untouched — 4 elements, as before.
    if (!region && !district) { if (e.length > 4) e.length = 4; continue; }
    const label = region && district ? `${region} / ${district}` : (region || district);
    let idx = areaIdx.get(label);
    if (idx === undefined) { idx = areas.length; areas.push(label); areaIdx.set(label, idx); }
    e[4] = idx;
    stamped++;
  }

  index.a = areas;
  fs.writeFileSync(SEARCH_JSON, JSON.stringify(index));

  const pct = (n) => ((100 * n) / points.length).toFixed(1) + '%';
  console.log(`[areas] stamped ${stamped} (${pct(stamped)}), ${areas.length} distinct areas`);
  console.log(`[areas] without region ${noRegion} (${pct(noRegion)}), without district ${noDistrict} (${pct(noDistrict)})`);
  console.log(`[areas] done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main();
