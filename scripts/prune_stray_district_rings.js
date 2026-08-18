/*
 * Removes small, geographically-suspect stray rings from districts_bound.json
 * (leftover isolated fragments or accidental "holes" in the source OSM
 * relation) while explicitly preserving known real exclaves (Sokh, Zarafshon
 * shahri) which must keep all their rings.
 *
 * Heuristic: for a district with multiple rings, keep the largest (by point
 * count) as the "main" ring. Any other ring is dropped as a stray fragment if
 * either:
 *   - it's small (<200 pts) and its bounding box doesn't overlap the main
 *     ring's bbox at all (a disconnected fragment), or
 *   - it's fully contained within the main ring's bbox and small relative to
 *     it (<10% of the area) — looks like an accidental "hole" bite, which no
 *     real Uzbek administrative district legitimately has.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DISTRICTS_JSON = path.join(ROOT, 'geodata', 'layers', 'districts_bound.json');

const KEEP_ALL_RINGS = [/so.?x tumani/i, /zarafshon shahri/i];

function bbox(ring) {
  let minLat = Infinity, maxLat = -Infinity, minLon = Infinity, maxLon = -Infinity;
  for (const [lat, lon] of ring) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
  }
  return { minLat, maxLat, minLon, maxLon };
}
function overlaps(a, b, pad) {
  return !(a.maxLat + pad < b.minLat || b.maxLat + pad < a.minLat ||
           a.maxLon + pad < b.minLon || b.maxLon + pad < a.minLon);
}
function bboxArea(bb) { return (bb.maxLat - bb.minLat) * (bb.maxLon - bb.minLon); }
function contains(outer, inner) {
  return outer.minLat <= inner.minLat && outer.maxLat >= inner.maxLat &&
         outer.minLon <= inner.minLon && outer.maxLon >= inner.maxLon;
}

const data = JSON.parse(fs.readFileSync(DISTRICTS_JSON, 'utf8'));
let prunedDistricts = 0, prunedRings = 0;

data.p.forEach(d => {
  if (d.r.length < 2) return;
  if (KEEP_ALL_RINGS.some(rx => rx.test(d.n))) return;

  const sorted = [...d.r].sort((a, b) => b.length - a.length);
  const main = bbox(sorted[0]);
  const kept = [sorted[0]];
  let removedHere = 0;
  const mainArea = bboxArea(main);
  for (let i = 1; i < sorted.length; i++) {
    const bb = bbox(sorted[i]);
    const isFarStray = !overlaps(main, bb, 0.02) && sorted[i].length < 200;
    const isHole = contains(main, bb) && bboxArea(bb) / mainArea < 0.1;
    if (isFarStray || isHole) {
      removedHere++;
    } else {
      kept.push(sorted[i]);
    }
  }
  if (removedHere > 0) {
    console.log(`  ${d.n}: removed ${removedHere} stray ring(s), kept ${kept.length}`);
    d.r = kept;
    prunedDistricts++;
    prunedRings += removedHere;
  }
});

console.log(`\nPruned ${prunedRings} stray ring(s) across ${prunedDistricts} district(s).`);
fs.writeFileSync(DISTRICTS_JSON, JSON.stringify(data));
console.log('Wrote', DISTRICTS_JSON);
