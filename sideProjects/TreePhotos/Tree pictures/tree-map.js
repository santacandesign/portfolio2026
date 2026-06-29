/* ================================================================
   Santa's Trees · photo map + timeline
   Map style reused from the Safe Food Guide (MapLibre + OpenFreeMap)
   ================================================================ */

/* ----------------------------------------------------------------
   MAP COLOURS  (same warm palette as the food guide,
   trees lean a touch greener)
   ---------------------------------------------------------------- */
const COLOURS = {
  land: "#A8D88E",
  water: "#21aaffff",
  waterway: "#21aaffff",
  park: "#6CBB50",
  forest: "#008000",
  grass: "#6CBB50",
  building: "#A8D88E",
  building_outline: "#A8D88E",
  road_motorway: "#FFFFFD",
  road_trunk: "#FFFFFD",
  road_primary: "#FFFFFD",
  road_secondary: "#FFFFFD",
  road_minor: "#FFFFFD",
  road_casing: "#A8D88E",
  label_city: "#041105",
  label_place: "#041105",
  label_road: "#041105",
  label_water: "#041105",
};

function buildStyle(c) {
  const ramp = (z1, w1, z2, w2) => [
    "interpolate",
    ["linear"],
    ["zoom"],
    z1,
    w1,
    z2,
    w2,
  ];
  return {
    version: 8,
    sources: {
      ofm: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
    },
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": c.land },
      },
      {
        id: "water",
        type: "fill",
        source: "ofm",
        "source-layer": "water",
        paint: { "fill-color": c.water },
      },
      {
        id: "waterway",
        type: "line",
        source: "ofm",
        "source-layer": "waterway",
        paint: { "line-color": c.waterway, "line-width": ramp(8, 0.5, 14, 3) },
      },
      {
        id: "landuse-park",
        type: "fill",
        source: "ofm",
        "source-layer": "landuse",
        filter: [
          "match",
          ["get", "class"],
          ["park", "pitch", "garden", "recreation_ground", "playground"],
          true,
          false,
        ],
        paint: { "fill-color": c.park },
      },
      {
        id: "landuse-grass",
        type: "fill",
        source: "ofm",
        "source-layer": "landuse",
        filter: [
          "match",
          ["get", "class"],
          ["grass", "meadow", "village_green"],
          true,
          false,
        ],
        paint: { "fill-color": c.grass },
      },
      {
        id: "landuse-forest",
        type: "fill",
        source: "ofm",
        "source-layer": "landuse",
        filter: ["match", ["get", "class"], ["wood", "forest"], true, false],
        paint: { "fill-color": c.forest },
      },
      {
        id: "landcover-grass",
        type: "fill",
        source: "ofm",
        "source-layer": "landcover",
        filter: ["match", ["get", "class"], ["grass", "scrub"], true, false],
        paint: { "fill-color": c.grass, "fill-opacity": 0.7 },
      },
      {
        id: "landcover-wood",
        type: "fill",
        source: "ofm",
        "source-layer": "landcover",
        filter: ["match", ["get", "class"], ["wood", "forest"], true, false],
        paint: { "fill-color": c.forest, "fill-opacity": 0.8 },
      },
      {
        id: "casing-motorway",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: ["==", ["get", "class"], "motorway"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_casing,
          "line-width": ramp(10, 5, 16, 14),
        },
      },
      {
        id: "casing-primary",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: ["==", ["get", "class"], "primary"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_casing,
          "line-width": ramp(10, 3, 16, 10),
        },
      },
      {
        id: "casing-secondary",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: [
          "match",
          ["get", "class"],
          ["secondary", "tertiary"],
          true,
          false,
        ],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_casing,
          "line-width": ramp(11, 2.5, 16, 8),
        },
      },
      {
        id: "casing-minor",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: [
          "match",
          ["get", "class"],
          ["minor", "service", "residential"],
          true,
          false,
        ],
        minzoom: 13,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_casing,
          "line-width": ramp(13, 2, 16, 6),
        },
      },
      {
        id: "road-motorway",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: ["==", ["get", "class"], "motorway"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_motorway,
          "line-width": ramp(10, 2.5, 16, 9),
        },
      },
      {
        id: "road-trunk",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: ["==", ["get", "class"], "trunk"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": c.road_trunk, "line-width": ramp(10, 2, 16, 8) },
      },
      {
        id: "road-primary",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: ["==", ["get", "class"], "primary"],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_primary,
          "line-width": ramp(10, 1.5, 16, 7),
        },
      },
      {
        id: "road-secondary",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: [
          "match",
          ["get", "class"],
          ["secondary", "tertiary"],
          true,
          false,
        ],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_secondary,
          "line-width": ramp(11, 1, 16, 5),
        },
      },
      {
        id: "road-minor",
        type: "line",
        source: "ofm",
        "source-layer": "transportation",
        filter: [
          "match",
          ["get", "class"],
          ["minor", "service", "residential"],
          true,
          false,
        ],
        minzoom: 13,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": c.road_minor,
          "line-width": ramp(13, 0.6, 16, 0.4),
        },
      },
      {
        id: "building-fill",
        type: "fill",
        source: "ofm",
        "source-layer": "building",
        minzoom: 13,
        paint: { "fill-color": c.building, "fill-antialias": true },
      },
      {
        id: "building-outline",
        type: "line",
        source: "ofm",
        "source-layer": "building",
        minzoom: 14,
        paint: { "line-color": c.building_outline, "line-width": 0.5 },
      },
      {
        id: "label-road",
        type: "symbol",
        source: "ofm",
        "source-layer": "transportation_name",
        minzoom: 13,
        layout: {
          "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": 10,
          "symbol-placement": "line",
        },
        paint: {
          "text-color": c.label_road,
          "text-halo-color": "rgba(255,255,255,0.9)",
          "text-halo-width": 1,
        },
      },
      {
        id: "label-neighbourhood",
        type: "symbol",
        source: "ofm",
        "source-layer": "place",
        filter: [
          "match",
          ["get", "class"],
          ["neighbourhood", "suburb", "quarter"],
          true,
          false,
        ],
        minzoom: 12,
        layout: {
          "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
          "text-font": ["Noto Sans Regular"],
          "text-size": ramp(12, 9, 16, 12),
          "text-transform": "uppercase",
          "text-letter-spacing": 0.08,
        },
        paint: {
          "text-color": c.label_place,
          "text-halo-color": "rgba(255,255,255,0.9)",
          "text-halo-width": 1,
        },
      },
      {
        id: "label-city",
        type: "symbol",
        source: "ofm",
        "source-layer": "place",
        filter: ["match", ["get", "class"], ["city", "town"], true, false],
        layout: {
          "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
          "text-font": ["Noto Sans Bold"],
          "text-size": ramp(8, 11, 14, 18),
        },
        paint: {
          "text-color": c.label_city,
          "text-halo-color": "rgba(255,255,255,0.9)",
          "text-halo-width": 2,
        },
      },
    ],
  };
}

/* ----------------------------------------------------------------
   STATE
   ---------------------------------------------------------------- */
let photos = []; // all, date-sorted
let activeIdx = 0;
let mapLoaded = false;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/* ----------------------------------------------------------------
   DATA LOADING — prefer photos.json (when served), fall back to the
   embedded window.TREE_PHOTOS so the page also works on file://
   ---------------------------------------------------------------- */
async function loadData() {
  let data = null;
  try {
    const res = await fetch("photos.json", { cache: "no-store" });
    if (res.ok) data = await res.json();
  } catch (_) {}
  if (!data && window.TREE_PHOTOS) data = window.TREE_PHOTOS;
  if (!data) {
    document.getElementById("countPill").textContent = "⚠ no photo data found";
    return;
  }
  photos = data
    .filter((p) => p.date)
    .map((p) => ({ ...p, _t: parseDate(p.date) }))
    .filter((p) => p.isFinite || p._t)
    .sort((a, b) => b._t - a._t); // newest first (2026 → oldest)

  initMap();
  buildVerticalTimeline();
  buildCardStack(); // card stack doesn't need the map — show immediately
  buildGalleryGrid();
  buildWaffleChart();
  const countPill = document.getElementById("countPill");
  if (countPill)
    countPill.textContent = `🌳 ${photos.length} trees · ${photos.filter((p) => p.lat != null).length} on the map`;
}

function parseDate(s) {
  // "YYYY-MM-DD HH:MM:SS"
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2}))?/);
  if (!m) return new Date(s).getTime() || 0;
  return new Date(
    +m[1],
    +m[2] - 1,
    +m[3],
    +(m[4] || 0),
    +(m[5] || 0),
    +(m[6] || 0),
  ).getTime();
}
function fmtDate(t) {
  const d = new Date(t);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/* ----------------------------------------------------------------
   MAP
   ---------------------------------------------------------------- */
let map;
function initMap() {
  const geo = photos.filter((p) => p.lat != null && p.lon != null);
  let center = [77.59, 12.97];
  if (geo.length) {
    center = [
      geo.reduce((s, p) => s + p.lon, 0) / geo.length,
      geo.reduce((s, p) => s + p.lat, 0) / geo.length,
    ];
  }

  map = new maplibregl.Map({
    container: "map",
    style: buildStyle(COLOURS),
    center,
    zoom: 11,
    attributionControl: { compact: true },
  });

  // Don't set overflow:visible on the map container — it offsets
  // MapLibre's internal bounds calculations and causes marker lag.

  map.on("load", () => {
    mapLoaded = true;
    renderMarkers();
    fitToAll();
    // Small delay so fitToAll finishes before we fly to the first photo
    if (photos.length) setTimeout(() => setActive(0, { fly: true }), 800);
    // buildCardStack already called in loadData; no-op here
  });

  // Pause p5 leaf sketch during map movement to avoid fighting the GPU
  map.on("movestart", () => {
    window.__mapMoving = true;
  });
  map.on("moveend", () => {
    window.__mapMoving = false;
  });
}

function fitToAll() {
  const geo = photos.filter((p) => p.lat != null && p.lon != null);
  if (geo.length < 2) return;
  const lons = geo.map((p) => p.lon);
  const lats = geo.map((p) => p.lat);
  map.fitBounds(
    [
      [Math.min(...lons), Math.min(...lats)],
      [Math.max(...lons), Math.max(...lats)],
    ],
    {
      padding: { top: 140, bottom: 140, left: 80, right: 80 },
      maxZoom: 14,
      duration: 0,
    },
  );
}

/* ----------------------------------------------------------------
   Draw the treepin design via Path2D (vector, stays sharp at any
   size/DPR). SVG viewBox is 145×145; we scale to fill `size` px.
   ---------------------------------------------------------------- */
function makeTreePinImage(size) {
  const dpr = window.devicePixelRatio || 1;
  const px  = Math.round(size * dpr);
  const canvas = document.createElement("canvas");
  canvas.width  = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  const sc = px / 145;
  ctx.scale(sc, sc);

  // Path2D shapes — defined once, reused for stroke + fill
  const pLeft  = new Path2D("M65.8392 51.0713C65.8392 59.3248 61.775 67.6694 45.3859 66.0156C28.5389 64.3156 25.375 59.3248 25.375 51.0713C26.804 42.2945 34.7337 36.127 45.3859 36.127C56.0382 36.127 65.8392 42.8178 65.8392 51.0713Z");
  const pRight = new Path2D("M119.628 65.8447C119.628 74.0982 115.564 82.4429 99.175 80.789C82.3279 79.089 79.1641 74.0982 79.1641 65.8447C80.5931 57.0679 88.5227 50.9004 99.175 50.9004C109.827 50.9004 119.628 57.5912 119.628 65.8447Z");
  const pTop   = new Path2D("M102.643 31.1318C102.643 42.7196 98.6464 50.4481 75.6728 52.1133C56.6835 53.4897 47.6914 42.7196 47.6914 31.1318C49.6896 18.8094 60.7777 10.1504 75.6728 10.1504C90.5679 10.1504 102.643 19.5441 102.643 31.1318Z");

  // trunk + branch connectors
  ctx.fillStyle = "#4C331D";
  ctx.fill(new Path2D("M70.672 134.037C69.5619 133.148 70.6694 34.7945 73.6694 34.791C76.6693 34.7875 78.3288 129.045 77.6659 134.037C75.6792 136.384 71.7822 134.925 70.672 134.037Z"));
  ctx.fill(new Path2D("M97.6445 85.0837C102.973 81.4202 99.9758 67.4319 99.3097 67.7656C98.6436 68.0993 99.9413 79.3583 96.9784 81.7533C90.9666 86.6127 78.7808 83.9682 76.9961 85.0837V87.748C76.9961 87.748 92.3159 88.7471 97.6445 85.0837Z"));
  ctx.fill(new Path2D("M51.7969 72.7672C46.4683 69.1038 49.4656 55.1155 50.1317 55.4492C50.7978 55.7829 49.5001 67.0419 52.463 69.4369C58.4748 74.2963 70.6606 71.6518 72.4453 72.7672V75.4316C72.4453 75.4316 57.1255 76.4307 51.7969 72.7672Z"));

  // left canopy
  const g0 = ctx.createLinearGradient(45.6, 36.1, 45.6, 66.2);
  g0.addColorStop(0, "#09310E"); g0.addColorStop(1, "#478765");
  ctx.fillStyle = g0;
  ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 3; ctx.shadowOffsetY = 2;
  ctx.fill(pLeft);
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // right canopy
  const g1 = ctx.createLinearGradient(99.4, 50.9, 99.4, 81.0);
  g1.addColorStop(0, "#09310E"); g1.addColorStop(1, "#478765");
  ctx.fillStyle = g1;
  ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 3; ctx.shadowOffsetY = 2;
  ctx.fill(pRight);
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // top canopy (largest)
  const g2 = ctx.createLinearGradient(75.2, 10.2, 75.2, 52.2);
  g2.addColorStop(0, "#09310E"); g2.addColorStop(1, "#478765");
  ctx.fillStyle = g2;
  ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
  ctx.fill(pTop);
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  return {
    imageData: { width: px, height: px, data: new Uint8ClampedArray(ctx.getImageData(0, 0, px, px).data) },
    pixelRatio: dpr,
  };
}

function renderMarkers() {
  if (!mapLoaded) return;

  const normalImg = makeTreePinImage(40);
  const activeImg = makeTreePinImage(120);
  map.addImage("tree-normal", normalImg.imageData, { pixelRatio: normalImg.pixelRatio });
  map.addImage("tree-active", activeImg.imageData, { pixelRatio: activeImg.pixelRatio });

  // IMPORTANT: use forEach so `i` is the index into the full photos array,
  // not a re-numbered index into the filtered geo-only subset.
  const features = [];
  photos.forEach((p, i) => {
    if (p.lat == null || p.lon == null) return;
    features.push({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lon, p.lat] },
      properties: { idx: i, dateStr: fmtDate(p._t) },
    });
  });

  map.addSource("tree-points", {
    type: "geojson",
    data: { type: "FeatureCollection", features },
  });

  map.addLayer({
    id: "tree-pins",
    type: "symbol",
    source: "tree-points",
    layout: {
      "icon-image": [
        "case",
        ["==", ["get", "idx"], activeIdx],
        "tree-active",
        "tree-normal",
      ],
      "icon-anchor": "bottom",
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "text-field": [
        "case",
        ["==", ["get", "idx"], activeIdx],
        ["get", "dateStr"],
        "",
      ],
      "text-anchor": "top",
      "text-offset": [0, 0.2],
      "text-size": 11,
      "text-font": ["Noto Sans Bold"],
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "#006303",
      "text-halo-width": 2,
    },
  });

  // click a pin → jump to that photo
  map.on("click", "tree-pins", (e) => {
    if (!e.features.length) return;
    const idx = e.features[0].properties.idx;
    clearTimeout(previewHideTimer);
    document.getElementById("previewCard").classList.remove("visible");
    previewIdx = -1;
    activeIdx = idx;
    renderCardStack();
    setActive(idx, { fly: true });
  });
  map.on("mouseenter", "tree-pins", (e) => {
    map.getCanvas().style.cursor = "pointer";
    if (e.features.length) showPreview(e.features[0].properties.idx);
  });
  map.on("mouseleave", "tree-pins", () => {
    map.getCanvas().style.cursor = "";
    hidePreview();
  });
}

function highlightMarker(i) {
  if (!mapLoaded || !map.getLayer("tree-pins")) return;
  const expr = [
    "case",
    ["==", ["get", "idx"], i],
    "tree-active",
    "tree-normal",
  ];
  map.setLayoutProperty("tree-pins", "icon-image", expr);
  const dateExpr = ["case", ["==", ["get", "idx"], i], ["get", "dateStr"], ""];
  map.setLayoutProperty("tree-pins", "text-field", dateExpr);
}

/* ----------------------------------------------------------------
   PREVIEW CARD — hover peek from map pins and timeline dots
   ---------------------------------------------------------------- */
let previewIdx = -1;
let previewHideTimer = null;

function showPreview(idx) {
  if (idx === activeIdx) return; // already on top of stack
  clearTimeout(previewHideTimer);
  previewIdx = idx;
  const p = photos[idx];
  const card = document.getElementById("previewCard");
  card.innerHTML = `
    <span class="preview-date">${fmtDate(p._t)}</span>
    <img loading="lazy" src="${p.thumb}" alt="">
    <div class="preview-hint">click to jump</div>
  `;
  card.classList.add("visible");
}

function hidePreview(delay = 120) {
  previewHideTimer = setTimeout(() => {
    document.getElementById("previewCard").classList.remove("visible");
    previewIdx = -1;
  }, delay);
}

// Set up preview card interactions once DOM is ready
(function initPreviewCard() {
  const card = document.getElementById("previewCard");
  // keep visible while mouse is over the card itself
  card.addEventListener("mouseenter", () => clearTimeout(previewHideTimer));
  card.addEventListener("mouseleave", () => hidePreview());
  // click → jump to that photo
  card.addEventListener("click", () => {
    if (previewIdx < 0) return;
    const idx = previewIdx;
    clearTimeout(previewHideTimer);
    card.classList.remove("visible");
    previewIdx = -1;
    activeIdx = idx;
    renderCardStack();
    setActive(idx, { fly: true });
  });
})();

/* ----------------------------------------------------------------
   CARD STACK — centered polaroid pile
   ---------------------------------------------------------------- */
let stackAnimating = false;
const STACK_DEPTH = 5; // how many cards visible in pile

function buildCardStack() {
  renderCardStack();

  const wrap = document.getElementById("cardStackWrap");

  // scroll wheel advances the stack
  wrap.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (e.deltaY > 0) advanceStack(1);
      else advanceStack(-1);
    },
    { passive: false },
  );
}

function renderCardStack() {
  const wrap = document.getElementById("cardStackWrap");
  // clear existing cards (keep the hint span)
  wrap.querySelectorAll(".stack-card").forEach((c) => c.remove());

  // render back→front so front card is last in DOM (highest paint order)
  for (let pos = STACK_DEPTH - 1; pos >= 0; pos--) {
    const idx = (activeIdx + pos) % photos.length;
    const p = photos[idx];
    const card = document.createElement("div");
    card.className = "stack-card";
    card.dataset.pos = pos;
    card.dataset.idx = idx;
    card.innerHTML = `
      ${pos === 0 ? `<span class="stack-card-date">${fmtDate(p._t)}</span>` : ""}
      <img class="stack-card-img" loading="lazy" src="${p.thumb}" alt="">
      ${pos === 0 ? `<div class="stack-card-footer"><span class="stack-card-hint">tap for next</span></div>` : ""}
    `;
    if (pos === 0) {
      card.addEventListener("click", () => advanceStack(1));
    }
    wrap.appendChild(card);
  }
}

function advanceStack(dir) {
  if (stackAnimating || !photos.length) return;
  const newIdx =
    (((activeIdx + dir) % photos.length) + photos.length) % photos.length;

  const topCard = document.querySelector(".stack-card[data-pos='0']");
  if (topCard) {
    stackAnimating = true;
    topCard.classList.add("exiting");
    setTimeout(() => {
      activeIdx = newIdx;
      renderCardStack();
      setActive(activeIdx, { fly: true });
      stackAnimating = false;
    }, 420);
  } else {
    // fallback if card element not found
    activeIdx = newIdx;
    renderCardStack();
    setActive(activeIdx, { fly: true });
  }
}

function setActive(i, { fly } = { fly: true }) {
  activeIdx = i;
  highlightMarker(i);
  highlightVtDot(i);
  const p = photos[i];
  if (p && p.lat != null) updateCityFilter(detectCity(p.lat, p.lon));
  if (fly && p && p.lat != null && map) {
    // Pad the right side so the pin centres in the visible map area,
    // not behind the card stack (220px wide at right:110px) + vtimeline.
    map.flyTo({
      center: [p.lon, p.lat],
      zoom: 15,
      speed: 1.2,
      essential: true,
      padding: { top: 120, bottom: 80, left: 60, right: 380 },
    });
  }
}

/* ----------------------------------------------------------------
   VERTICAL TIMELINE — right dot rail
   ---------------------------------------------------------------- */
function buildVerticalTimeline() {
  const rail = document.getElementById("vtimeline");
  // clear everything except the line
  rail
    .querySelectorAll(".vt-section, .vt-year-label")
    .forEach((n) => n.remove());

  // group by year
  const byYear = {};
  photos.forEach((p, i) => {
    const y = new Date(p._t).getFullYear();
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(i);
  });

  Object.keys(byYear)
    .sort()
    .forEach((y) => {
      const section = document.createElement("div");
      section.className = "vt-section";

      const label = document.createElement("div");
      label.className = "vt-year-label";
      label.textContent = y;
      section.appendChild(label);

      byYear[y].forEach((idx) => {
        const p = photos[idx];
        const dot = document.createElement("div");
        dot.className = "vt-dot";
        dot.dataset.idx = idx;

        dot.addEventListener("mouseenter", () => showPreview(idx));
        dot.addEventListener("mouseleave", () => hidePreview());
        dot.addEventListener("click", () => {
          clearTimeout(previewHideTimer);
          document.getElementById("previewCard").classList.remove("visible");
          previewIdx = -1;
          activeIdx = idx;
          renderCardStack();
          setActive(idx, { fly: true });
        });

        section.appendChild(dot);
      });

      rail.appendChild(section);
    });
}

function highlightVtDot(i) {
  document.querySelectorAll(".vt-dot").forEach((d) => {
    d.classList.toggle("active", +d.dataset.idx === i);
  });
}

/* ----------------------------------------------------------------
   GALLERY GRID — all polaroids with drop-in animation
   ---------------------------------------------------------------- */
/* ----------------------------------------------------------------
   COLOUR EXTRACTION — dominant colours from an <img> element
   ---------------------------------------------------------------- */
const photoColors = []; // photoColors[i] = string[] once extracted

/* ----------------------------------------------------------------
   MASTER PALETTE — aggregate all photo colours with frequency
   Clustered by perceptual distance, then sent to the p5 tree.
   ---------------------------------------------------------------- */
let masterPaletteTimer = null;

function scheduleMasterPalette() {
  clearTimeout(masterPaletteTimer);
  masterPaletteTimer = setTimeout(buildMasterPalette, 350);
}

function parseRGB(str) {
  const m = str.match(/\d+/g);
  return m ? m.slice(0, 3).map(Number) : [128, 128, 128];
}

function colorDistance([r1, g1, b1], [r2, g2, b2]) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

function buildMasterPalette() {
  // Gather all extracted colour arrays
  const allColors = photoColors.filter(Boolean).flat();
  if (!allColors.length) return;

  // Merge colours within perceptual distance 44 into clusters
  const clusters = [];
  for (const colorStr of allColors) {
    const rgb = parseRGB(colorStr);
    let nearest = null,
      nearestDist = Infinity;
    for (const c of clusters) {
      const d = colorDistance(c.rgb, rgb);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = c;
      }
    }
    if (nearest && nearestDist < 44) {
      // Running average keeps cluster centroid accurate
      nearest.count++;
      nearest.rgb[0] += (rgb[0] - nearest.rgb[0]) / nearest.count;
      nearest.rgb[1] += (rgb[1] - nearest.rgb[1]) / nearest.count;
      nearest.rgb[2] += (rgb[2] - nearest.rgb[2]) / nearest.count;
    } else {
      clusters.push({ rgb: [...rgb], count: 1 });
    }
  }

  if (!clusters.length) return;

  const total = clusters.reduce((s, c) => s + c.count, 0);
  const weighted = clusters
    .sort((a, b) => b.count - a.count)
    .slice(0, 24) // top 24 colour clusters is plenty
    .map((c) => ({
      color: `rgb(${c.rgb.map(Math.round).join(",")})`,
      weight: c.count / total,
    }));

  if (typeof window.__setMasterPalette === "function") {
    window.__setMasterPalette(weighted);
  }
  // Pass per-photo colour arrays to the flower garden sketch
  if (typeof window.__setPhotoColors === "function") {
    window.__setPhotoColors(photoColors.slice());
  }
}

function extractDominantColors(imgEl, count = 6) {
  const SIZE = 80;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  try {
    ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);
  } catch (_) {
    return null; // tainted / CORS
  }

  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const freq = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];
    if (a < 180) continue;
    // Skip near-white (paper border) and near-black
    const lum = r * 0.299 + g * 0.587 + b * 0.114;
    if (lum > 232 || lum < 16) continue;
    // Skip near-greys (low saturation)
    const mx = Math.max(r, g, b),
      mn = Math.min(r, g, b);
    if (mx === 0 || (mx - mn) / mx < 0.07) continue;
    // Quantize to 32-step buckets
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = (qr << 16) | (qg << 8) | qb;
    const e = freq.get(key) || { r: 0, g: 0, b: 0, n: 0 };
    e.r += r;
    e.g += g;
    e.b += b;
    e.n++;
    freq.set(key, e);
  }

  if (!freq.size) return null;

  // Sort by frequency, compute averages
  const sorted = [...freq.values()]
    .sort((a, b) => b.n - a.n)
    .map((e) => [
      Math.round(e.r / e.n),
      Math.round(e.g / e.n),
      Math.round(e.b / e.n),
    ]);

  // Pick N visually diverse colours
  const result = [];
  for (const [r, g, b] of sorted) {
    const tooClose = result.some(
      ([pr, pg, pb]) =>
        Math.sqrt((pr - r) ** 2 + (pg - g) ** 2 + (pb - b) ** 2) < 52,
    );
    if (!tooClose) result.push([r, g, b]);
    if (result.length >= count) break;
  }
  while (result.length < count) result.push([80 + result.length * 18, 120, 55]);

  return result.map(([r, g, b]) => `rgb(${r},${g},${b})`);
}

/* ----------------------------------------------------------------
   GALLERY GRID — all polaroids with drop-in animation + colour swatches
   ---------------------------------------------------------------- */
function buildGalleryGrid() {
  const grid = document.getElementById("polaroidGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const rots = [-3.2, 1.8, -1.1, 2.6, -2.4, 0.7, -0.5, 3.1, -1.7, 2.2];

  photos.forEach((p, i) => {
    /* outer wrapper — carries rotation + drop animation */
    const item = document.createElement("div");
    item.className = "grid-item";
    const rot = rots[i % rots.length];
    const delay = Math.min(i * 38, 58) + "ms";
    item.style.setProperty("--rot", rot + "deg");
    item.style.setProperty("--delay", delay);

    /* polaroid card */
    const card = document.createElement("div");
    card.className = "grid-polaroid";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.crossOrigin = "anonymous"; // needed for canvas color extraction
    img.alt = fmtDate(p._t);

    const dateEl = document.createElement("div");
    dateEl.className = "grid-polaroid-date";
    dateEl.textContent = fmtDate(p._t);

    card.appendChild(img);
    card.appendChild(dateEl);

    /* swatch strip (filled after image loads) */
    const swatches = document.createElement("div");
    swatches.className = "color-swatches";

    /* assemble */
    item.appendChild(card);
    item.appendChild(swatches);

    /* extract colours once image has loaded, then feed the master palette */
    img.onload = function () {
      const colors = extractDominantColors(this);
      if (colors) {
        photoColors[i] = colors;
        colors.forEach((col) => {
          const sq = document.createElement("div");
          sq.className = "color-swatch";
          sq.style.background = col;
          swatches.appendChild(sq);
        });
        // Debounced — batches rapid successive extractions into one palette update
        scheduleMasterPalette();
      }
    };
    // Set src after onload is attached
    img.src = p.thumb;

    /* click → jump to photo on map */
    item.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        activeIdx = i;
        renderCardStack();
        setActive(i, { fly: true });
      }, 400);
    });

    grid.appendChild(item);
  });

  /* trigger a fresh palette render when the tree section enters view */
  const treeSection = document.getElementById("treeCanvasWrap");
  if (treeSection) {
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) buildMasterPalette();
        });
      },
      { threshold: 0.1 },
    ).observe(treeSection);
  }

  /* drop-in animation — fires once when the gallery section scrolls into view */
  const section = document.getElementById("gallerySection");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        grid.querySelectorAll(".grid-item").forEach((item) => {
          item.classList.add("dropped");
          const del = parseFloat(item.style.getPropertyValue("--delay")) || 0;
          setTimeout(() => item.classList.add("settled"), 680 + del);
        });
      });
    },
    { threshold: 0.05 },
  );
  observer.observe(section);
}

/* ----------------------------------------------------------------
   COLOUR WAFFLE — every colour from every polaroid, grouped by hue
   so identical tones stack together and similar ones form bands.
   Builds with a staggered "construction" pop-in when scrolled into view.
   ---------------------------------------------------------------- */
/* Bidirectional waffle state: colours live either under the polaroids
   ("dispersed") or in the chart ("assembled"), and animate between the two. */
let waffleCells   = null;   // persistent array of .waffle-cell elements
let waffleMeta    = null;   // parallel array: { str, pi, ci, … } per cell
let waffleState   = "idle"; // "idle" | "dispersed" | "assembled"
let waffleBusy    = false;  // an animation is currently running
let waffleQueued  = false;  // a forward run is waiting on colour extraction

const FLY_DUR     = 500;  // ms each colour spends travelling (matches CSS)
const CASCADE_MS  = 550;  // total time across which all colours launch
const FLY_STEP_MAX = 6;   // cap per-colour delay so few colours still cascade

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  const d = mx - mn;
  let h = 0,
    s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    switch (mx) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h *= 60;
  }
  return [h, s, l];
}

/* Load any thumbnails whose colours haven't been extracted yet, so the
   waffle reflects every photo regardless of how far the user scrolled. */
function ensureAllColors() {
  const jobs = photos.map((p, i) => {
    if (photoColors[i]) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const cols = extractDominantColors(img);
        if (cols) photoColors[i] = cols;
        resolve();
      };
      img.onerror = resolve;
      img.src = p.thumb;
    });
  });
  return Promise.all(jobs);
}

function waffleColumnCount(chart) {
  return Math.max(8, Math.min(48, Math.floor((chart.offsetWidth || 900) / 26)));
}

/* Build the waffle cells once (hidden), and remember each cell's colour
   plus which polaroid swatch it belongs to. No animation here. */
function buildWaffleCells() {
  const chart = document.getElementById("waffleChart");
  if (!chart) return false;

  /* Gather every extracted colour, tagged with hue/sat/lightness AND the
     polaroid + slot it came from, so each waffle cell knows which swatch
     it should travel to and from. */
  const all = [];
  photoColors.forEach((arr, pi) => {
    if (!arr) return;
    arr.forEach((str, ci) => {
      const [r, g, b] = parseRGB(str);
      const [h, s, l] = rgbToHsl(r, g, b);
      all.push({ str, h, s, l, pi, ci });
    });
  });
  if (!all.length) return false;

  /* Chromatic colours: rotate hue so greens (≈105°) come first, then
     sort within 12° hue bands by lightness for smooth gradient bands.
     Near-grey neutrals (low saturation) are placed last, light→dark. */
  const GREEN_START = 105;
  const BAND = 12;
  const rotH = (h) => (h - GREEN_START + 360) % 360;

  const chroma = all.filter((c) => c.s >= 0.12);
  const neutral = all.filter((c) => c.s < 0.12);
  chroma.sort((a, b) => {
    const bandA = Math.floor(rotH(a.h) / BAND);
    const bandB = Math.floor(rotH(b.h) / BAND);
    if (bandA !== bandB) return bandA - bandB;
    return a.l - b.l; // within a band: dark → light for gradient effect
  });
  neutral.sort((a, b) => a.l - b.l);
  const sorted = chroma.concat(neutral);

  chart.style.setProperty("--waffle-cols", waffleColumnCount(chart));
  chart.innerHTML = "";

  waffleCells = sorted.map((c) => {
    const cell = document.createElement("div");
    cell.className = "waffle-cell"; // starts hidden (opacity 0)
    cell.style.background = c.str;
    cell.title = c.str;
    chart.appendChild(cell);
    return cell;
  });
  waffleMeta = sorted;

  const countEl = document.getElementById("waffleCount");
  if (countEl) {
    const trees = photoColors.filter(Boolean).length;
    countEl.textContent = `${sorted.length} colours · drawn from ${trees} trees`;
  }

  waffleState = "dispersed";
  return true;
}

/* Find the live colour-swatch element under polaroid `pi`, slot `ci` */
function getSourceSwatch(pi, ci) {
  const grid = document.getElementById("polaroidGrid");
  if (!grid) return null;
  const item = grid.children[pi];
  if (!item) return null;
  const strip = item.querySelector(".color-swatches");
  if (!strip) return null;
  return strip.children[ci] || null;
}

/* FLIP animation in either direction:
   "forward"  — colours travel DOWN from the polaroid swatches into the waffle
   "reverse"  — colours travel back UP from the waffle into the polaroids   */
function animateColours(direction) {
  if (!waffleCells || waffleBusy) return;
  const assembling = direction === "forward";
  waffleBusy = true;

  /* Overlay glued to the document, so scrolling can't shift the clones */
  const overlay = document.createElement("div");
  overlay.className = "waffle-fly-layer";
  overlay.style.height = document.documentElement.scrollHeight + "px";
  document.body.appendChild(overlay);

  const sx = window.scrollX, sy = window.scrollY;
  const flights = [];

  waffleCells.forEach((cell, i) => {
    const meta   = waffleMeta[i];
    const swatch = getSourceSwatch(meta.pi, meta.ci);

    // No live swatch (rare) -> just toggle the cell with no flight
    if (!swatch) {
      cell.classList.toggle("filled", assembling);
      return;
    }

    const cellRect = cell.getBoundingClientRect();
    const swRect   = swatch.getBoundingClientRect();
    if (!cellRect.width || !swRect.width) {
      cell.classList.toggle("filled", assembling);
      if (!assembling) swatch.style.visibility = "";
      return;
    }

    const from = assembling ? swRect : cellRect;
    const to   = assembling ? cellRect : swRect;

    const clone = document.createElement("div");
    clone.className = "waffle-fly";
    clone.style.left       = (from.left + sx) + "px";
    clone.style.top        = (from.top  + sy) + "px";
    clone.style.width      = from.width  + "px";
    clone.style.height     = from.height + "px";
    clone.style.background = meta.str;
    overlay.appendChild(clone);

    // Hide whichever home the colour is leaving
    if (assembling) swatch.style.visibility = "hidden";
    else            cell.classList.remove("filled");

    flights.push({
      clone, cell, swatch, assembling,
      dx: to.left - from.left,
      dy: to.top  - from.top,
      sxScale: to.width  / from.width,
      syScale: to.height / from.height,
    });
  });

  /* Cascade step: spread all launches across CASCADE_MS so the whole build
     stays under ~1s no matter how many colours there are — fast enough that
     you can't scroll through clones mid-flight. */
  const step = Math.min(FLY_STEP_MAX, CASCADE_MS / Math.max(1, flights.length));

  /* Launch on the next frame so the start transforms are committed first */
  requestAnimationFrame(() => {
    flights.forEach((f, i) => {
      const delay = i * step;
      f.clone.style.transitionDelay = delay + "ms";
      f.clone.style.transform =
        `translate(${f.dx}px, ${f.dy}px) scale(${f.sxScale}, ${f.syScale})`;

      // As the clone lands, reveal its destination home, then fade it out
      setTimeout(() => {
        if (f.assembling) f.cell.classList.add("filled");
        else              f.swatch.style.visibility = "";
        f.clone.style.opacity = "0";
        setTimeout(() => f.clone.remove(), 160);
      }, delay + FLY_DUR - 30);
    });

    const total = (flights.length ? (flights.length - 1) * step : 0) + FLY_DUR + 220;
    setTimeout(() => {
      overlay.remove();
      waffleState = assembling ? "assembled" : "dispersed";
      waffleBusy = false;
    }, total);
  });
}

function buildWaffleChart() {
  const section = document.getElementById("waffleSection");
  if (!section) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          // Scrolled into the waffle -> assemble (if not already / busy)
          if (waffleState === "assembled" || waffleBusy || waffleQueued) return;
          waffleQueued = true;
          ensureAllColors().then(() => {
            waffleQueued = false;
            if (waffleState === "idle" && !buildWaffleCells()) return;
            if (waffleState !== "assembled") animateColours("forward");
          });
        } else {
          // Scrolled back UP past the waffle (section now below) -> disperse
          if (
            waffleState === "assembled" &&
            !waffleBusy &&
            e.boundingClientRect.top > 0
          ) {
            animateColours("reverse");
          }
        }
      });
    },
    { threshold: 0.08 },
  );
  obs.observe(section);

  /* Re-flow columns on resize without re-running the animation */
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    const chart = document.getElementById("waffleChart");
    if (!chart || !chart.children.length) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      chart.style.setProperty("--waffle-cols", waffleColumnCount(chart));
    }, 120);
  });
}

/* ----------------------------------------------------------------
   CITY FILTER — sliding pill + auto-detect
   ---------------------------------------------------------------- */
const CITIES = [
  {
    key: "bangalore",
    label: "Bangalore",
    center: [77.59, 12.97],
    bounds: { minLat: 12.7, maxLat: 13.2, minLon: 77.3, maxLon: 77.9 },
  },
  {
    key: "kochi",
    label: "Kochi",
    center: [76.26, 10.0],
    bounds: { minLat: 9.8, maxLat: 10.2, minLon: 76.0, maxLon: 76.5 },
  },
  {
    key: "delhi",
    label: "Delhi",
    center: [77.2, 28.6],
    bounds: { minLat: 28.3, maxLat: 28.9, minLon: 76.7, maxLon: 77.5 },
  },
  {
    key: "dharamshala",
    label: "Dharamshala",
    center: [76.32, 32.22],
    bounds: { minLat: 32.0, maxLat: 32.5, minLon: 76.1, maxLon: 76.6 },
  },
];

function detectCity(lat, lon) {
  for (const c of CITIES) {
    const b = c.bounds;
    if (
      lat >= b.minLat &&
      lat <= b.maxLat &&
      lon >= b.minLon &&
      lon <= b.maxLon
    ) {
      return c.key;
    }
  }
  return null;
}

let _activeCityKey = null;
function updateCityFilter(cityKey) {
  if (cityKey === _activeCityKey) return;
  _activeCityKey = cityKey;

  const btns = document.querySelectorAll(".city-btn");
  const pill = document.getElementById("cityPill");
  btns.forEach((btn) => btn.classList.remove("active"));

  if (!cityKey) {
    pill.style.opacity = "0";
    pill.style.pointerEvents = "none";
    return;
  }

  const activeBtn = document.querySelector(`.city-btn[data-city="${cityKey}"]`);
  if (!activeBtn) return;

  activeBtn.classList.add("active");
  pill.style.opacity = "1";
  pill.style.pointerEvents = "none";

  // Defer measurement so it runs after the browser has painted
  requestAnimationFrame(() => {
    const container = document.getElementById("cityFilter");
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    pill.style.left = btnRect.left - containerRect.left + "px";
    pill.style.width = btnRect.width + "px";
  });
}

// City button click → fly to first photo in that city (or city center)
document.querySelectorAll(".city-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cityKey = btn.dataset.city;
    const city = CITIES.find((c) => c.key === cityKey);
    if (!city) return;

    // Find first photo in that city
    const firstIdx = photos.findIndex((ph) => {
      if (ph.lat == null) return false;
      return detectCity(ph.lat, ph.lon) === cityKey;
    });

    if (firstIdx !== -1) {
      activeIdx = firstIdx;
      renderCardStack();
      setActive(firstIdx, { fly: true });
    } else {
      // No photos yet — just fly to city center
      if (map) {
        map.flyTo({
          center: city.center,
          zoom: 12,
          speed: 1.2,
          essential: true,
        });
      }
      updateCityFilter(cityKey);
    }
  });
});

/* ----------------------------------------------------------------
   LIGHTBOX
   ---------------------------------------------------------------- */
function openLightbox(i) {
  activeIdx = i;
  const p = photos[i];
  document.getElementById("lightboxImg").src = p.full;
  document.getElementById("lbDate").textContent = fmtDate(p._t);
  document.getElementById("lbSub").textContent =
    p.name ||
    (p.lat == null
      ? "location unknown"
      : `${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`);
  document.getElementById("lightbox").classList.add("open");
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}
function lightboxStep(d) {
  let i = activeIdx + d;
  if (i < 0) i = photos.length - 1;
  if (i >= photos.length) i = 0;
  activeIdx = i;
  renderCardStack();
  setActive(i, { fly: true });
  openLightbox(i);
}
document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") closeLightbox();
});
document.addEventListener("keydown", (e) => {
  const lbOpen = document.getElementById("lightbox").classList.contains("open");
  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowRight") lbOpen ? lightboxStep(1) : advanceStack(1);
  else if (e.key === "ArrowLeft") lbOpen ? lightboxStep(-1) : advanceStack(-1);
});

/* ----------------------------------------------------------------
   BOOT
   ---------------------------------------------------------------- */
loadData();
