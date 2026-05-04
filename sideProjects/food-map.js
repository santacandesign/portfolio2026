/* ================================================================
   Safe Food Guide · Bengaluru
   ================================================================ */

/* ----------------------------------------------------------------
   AIRTABLE CONFIG — replace YOUR_AIRTABLE_TOKEN
   ---------------------------------------------------------------- */
const AIRTABLE_TOKEN =
  "pat8SgfGwKu0vF1Z2.c55659f350852c8d7d29b633905f3b8bfc5bac013cc42bbb0698270d67262104";
const AIRTABLE_BASE = "appwOd745ejdnIRig";
const AIRTABLE_TABLE = "tblLWu7rFNaDhbbFW";

/* ----------------------------------------------------------------
   MAP COLOURS
   ---------------------------------------------------------------- */
const COLOURS = {
  land: "#FAF8F4",
  water: "#99DAF6",
  waterway: "#ABDCF0",
  park: "#B7E28D",
  forest: "#B7E28D",
  grass: "#B7E28D",
  cemetery: "#FAF8F4",
  sand: "#FAF8F4",
  building: "#FAF8F4",
  building_outline: "#F3E7CD",
  road_motorway: "#E5E9E8",
  road_trunk: "#B2B8C3",
  road_primary: "#E5E9E8",
  road_secondary: "#E5E9E8",
  road_minor: "#E5E9E8",
  road_path: "#FAF8F4",
  road_casing: "#BEBDB7",
  label_city: "#2A1A08",
  label_place: "#4A3020",
  label_road: "#7A6858",
  label_water: "#4A7890",
};

/* ----------------------------------------------------------------
   FALLBACK DATA
   ---------------------------------------------------------------- */
const FALLBACK_DATA = [
  {
    place: "boba bhai churchstreet",
    dish: "carribean boba",
    type: "Snack",
    sensory: "Sensory avoiding",
    seating: "yes",
    lat: 12.9732,
    lng: 77.607,
    image: null,
  },
  {
    place: "nagarjuna",
    dish: "veg meal",
    type: "Dinner",
    sensory: "Sensory avoiding",
    seating: "yes",
    lat: 12.9734,
    lng: 77.6092,
    image: null,
  },
  {
    place: "kumarapark",
    dish: "mulbagal dosa",
    type: "Breakfast",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.9965,
    lng: 77.5838,
    image: null,
  },
  {
    place: "YDH",
    dish: "masala dosa",
    type: "Breakfast",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.9608,
    lng: 77.5958,
    image: null,
  },
  {
    place: "sagar fast food vijaynagar",
    dish: "dahi puri",
    type: "Snack",
    sensory: "Sensory seeking",
    seating: "no",
    lat: 12.99,
    lng: 77.5526,
    image: null,
  },
  {
    place: "davangere benne dose",
    dish: "benne dose",
    type: "Breakfast",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.9738,
    lng: 77.5428,
    image: null,
  },
  {
    place: "cafe amudham",
    dish: "onion dosa",
    type: "Breakfast",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.9347,
    lng: 77.6197,
    image: null,
  },
  {
    place: "Mavalli tiffin room",
    dish: "Rave dose",
    type: "Breakfast",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.956,
    lng: 77.5851,
    image: null,
  },
  {
    place: "dyu art cafe",
    dish: "cottage cheese fritters",
    type: "Snack",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.938,
    lng: 77.6178,
    image: null,
  },
  {
    place: "karnataka bhel house",
    dish: "bhel puri",
    type: "Snack",
    sensory: "Sensory seeking",
    seating: "no",
    lat: 12.9604,
    lng: 77.5672,
    image: null,
  },
  {
    place: "sangam",
    dish: "masala puri",
    type: "Snack",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.9129,
    lng: 77.6412,
    image: null,
  },
  {
    place: "hae kum gang",
    dish: "tofu jeon",
    type: "Dinner",
    sensory: "Sensory avoiding",
    seating: "yes",
    lat: 12.9688,
    lng: 77.6075,
    image: null,
  },
  {
    place: "23rd street pizza",
    dish: "margherita pizza",
    type: "Dinner",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.969,
    lng: 77.607,
    image: null,
  },
  {
    place: "paris panini",
    dish: "tiramisu",
    type: "Snack",
    sensory: "Sensory avoiding",
    seating: "yes",
    lat: 12.9755,
    lng: 77.6052,
    image: null,
  },
  {
    place: "baskin robin",
    dish: "mint choco chip",
    type: "Snack",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.973,
    lng: 77.6092,
    image: null,
  },
  {
    place: "Bhojana shale",
    dish: "veg meal",
    type: "Dinner",
    sensory: "Sensory avoiding",
    seating: "yes",
    lat: 12.9649,
    lng: 77.5388,
    image: null,
  },
  {
    place: "Shangrila",
    dish: "Schezwan noodles",
    type: "Dinner",
    sensory: "Sensory seeking",
    seating: "yes",
    lat: 12.973,
    lng: 77.6071,
    image: null,
  },
];

const MEAL_EMOJI = { Breakfast: "🍳", Snack: "🍜", Dinner: "🍽️" };

/* ----------------------------------------------------------------
   STATE
   ---------------------------------------------------------------- */
let allData = FALLBACK_DATA.slice();
let filtered = [];
let activeIdx = 0;
let userLoc = null;
let userMarker = null;
let markers = {};
let mapLoaded = false;
let filters = { type: "all", sensory: "all", seating: "all" };

/* ----------------------------------------------------------------
   MAP STYLE
   ---------------------------------------------------------------- */
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
          "line-width": ramp(13, 0.6, 16, 4),
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
        id: "label-water",
        type: "symbol",
        source: "ofm",
        "source-layer": "water_name",
        layout: {
          "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
          "text-font": ["Noto Sans Italic"],
          "text-size": 11,
        },
        paint: {
          "text-color": c.label_water,
          "text-halo-color": "rgba(255,255,255,0.6)",
          "text-halo-width": 1,
        },
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
          "text-halo-color": "rgba(255,255,255,0.8)",
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
          "text-halo-color": "rgba(255,255,255,0.8)",
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
   INIT MAP
   ---------------------------------------------------------------- */
const map = new maplibregl.Map({
  container: "map",
  style: buildStyle(COLOURS),
  center: [77.59, 12.97],
  zoom: 13,
  attributionControl: { compact: true },
});

map.on("load", () => {
  mapLoaded = true;

  // Dashed route source + layer
  map.addSource("route", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  map.addLayer({
    id: "route-shadow",
    type: "line",
    source: "route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#8616abff",
      "line-opacity": 1,
      "line-width": 10,
      // "line-blur": 2,
      // "line-dasharray": [2, 2],
    },
  });

  map.addLayer({
    id: "route-line",
    type: "line",
    source: "route",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#C51FFC",
      "line-opacity": 1,
      "line-width": 6,
      // "line-dasharray": [2, 2],
    },
  });

  renderMarkers();

  // Request user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        console.log("✓ Got user location:", userLoc);
        if (userMarker) userMarker.remove();
        const el = document.createElement("div");
        el.className = "user-dot";
        userMarker = new maplibregl.Marker({ element: el })
          .setLngLat([userLoc.lng, userLoc.lat])
          .addTo(map);
        // Re-run onActiveChange so the map refits to include the user dot
        // and the distance + route pick up the now-known userLoc.
        if (filtered[activeIdx]) onActiveChange();
      },
      (err) => {
        const codeName =
          ["", "PERMISSION_DENIED", "POSITION_UNAVAILABLE", "TIMEOUT"][
            err.code
          ] || "UNKNOWN";
        console.warn("✗ Geolocation failed —", codeName, "—", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  } else {
    console.warn("✗ navigator.geolocation is not available in this browser");
  }
});

/* ----------------------------------------------------------------
   AIRTABLE FETCH
   ---------------------------------------------------------------- */
async function fetchAirtable() {
  if (AIRTABLE_TOKEN === "YOUR_AIRTABLE_TOKEN") {
    console.log("ℹ Add your Airtable Personal Access Token to load live data.");
    return;
  }
  try {
    let records = [],
      offset = null;
    do {
      const url =
        `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}` +
        (offset ? `?offset=${encodeURIComponent(offset)}` : "");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      });
      if (!res.ok) throw new Error(`Airtable ${res.status}`);
      const json = await res.json();
      records = records.concat(json.records);
      offset = json.offset;
    } while (offset);

    // Log actual field names to help debug image issues.
    // Scan ALL records (not just records[0]) because the first row may be empty,
    // and show a sample value per field so attachment vs. URL-string fields
    // are distinguishable.
    if (records.length > 0) {
      const fieldSamples = {};
      for (const r of records) {
        for (const [k, v] of Object.entries(r.fields)) {
          if (!(k in fieldSamples)) fieldSamples[k] = v;
        }
      }
      console.log("Airtable fields found:", Object.keys(fieldSamples));
      console.log("Sample values per field:", fieldSamples);
    }

    allData = records
      .map((r) => {
        const f = r.fields;
        // Try every common image field name
        const image =
          f["Image"]?.[0]?.url ||
          f["image"]?.[0]?.url ||
          f["Photo"]?.[0]?.url ||
          f["photo"]?.[0]?.url ||
          f["Images"]?.[0]?.url ||
          f["Photos"]?.[0]?.url ||
          f["Picture"]?.[0]?.url ||
          f["Attachment"]?.[0]?.url ||
          f["Food Image"]?.[0]?.url ||
          f["Food Photo"]?.[0]?.url ||
          f["food image"]?.[0]?.url ||
          null;

        return {
          place: f["Place"] || f["Name"] || f["Restaurant"] || "",
          dish: f["Dish"] || f["Food"] || f["Item"] || "",
          area:
            f["Area"] ||
            f["area"] ||
            f["Neighbourhood"] ||
            f["Neighborhood"] ||
            f["Location"] ||
            "",
          type: f["Type"] || f["Meal"] || f["Meal Type"] || "Snack",
          sensory:
            f["Sensory"] ||
            f["Sensory Experience"] ||
            f["Sensory experience"] ||
            f["Sensory Profile"] ||
            "",
          seating: (() => {
            const val = f["Seating"] ?? f["seating"] ?? f["Has Seating"] ?? "";
            if (val === true) return "yes";
            if (val === false) return "no";
            return val.toString().toLowerCase().trim();
          })(),
          lat: parseFloat(f["Lat"] || f["Latitude"] || 0) || null,
          lng: parseFloat(f["Lng"] || f["Longitude"] || 0) || null,
          image,
        };
      })
      .filter((e) => e.place);

    const withImages = allData.filter((e) => e.image).length;
    console.log(
      `✓ Loaded ${allData.length} dishes (${withImages} with images)`,
    );
    console.log(
      "Seating values from Airtable:",
      allData.map((e) => `${e.place}: "${e.seating}"`),
    );
    render();
  } catch (e) {
    console.warn("Airtable fetch failed:", e.message, "— using fallback data.");
  }
}

/* ----------------------------------------------------------------
   HELPERS
   ---------------------------------------------------------------- */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180,
    dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function gmapsUrl(e) {
  return e.lat
    ? `https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(e.place + " bangalore")}`;
}
function matchesFilter(e) {
  if (filters.type !== "all" && e.type !== filters.type) return false;
  if (filters.sensory !== "all" && e.sensory !== filters.sensory) return false;
  if (filters.seating !== "all" && e.seating !== filters.seating) return false;
  return true;
}

/* ----------------------------------------------------------------
   ROUTE — road-following dashed path via OSRM
   ---------------------------------------------------------------- */
async function updateRoute(e) {
  if (!mapLoaded || !map.getSource("route")) return;
  if (!userLoc || !e || !e.lat) {
    map.getSource("route").setData({ type: "FeatureCollection", features: [] });
    return;
  }
  let coords;
  try {
    const km = haversine(userLoc.lat, userLoc.lng, e.lat, e.lng);
    // Use foot profile for walking, car for driving distances
    const profile = km >= 1 ? "driving" : "foot";
    const url =
      `https://router.project-osrm.org/route/v1/${profile}/` +
      `${userLoc.lng},${userLoc.lat};${e.lng},${e.lat}?geometries=geojson&overview=full`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.routes?.[0]) coords = data.routes[0].geometry.coordinates;
    }
  } catch (_) {}
  if (!coords)
    coords = [
      [userLoc.lng, userLoc.lat],
      [e.lng, e.lat],
    ];
  map.getSource("route").setData({
    type: "Feature",
    geometry: { type: "LineString", coordinates: coords },
  });
}

/* ----------------------------------------------------------------
   CAROUSEL — uses .card-wrap as the snap/transform unit
   so .card-distance sits OUTSIDE food-card's overflow:hidden
   ---------------------------------------------------------------- */
const carousel = document.getElementById("carousel");
let scrollRAF = null,
  snapTimeout = null;

function buildCarousel() {
  filtered = allData.filter(matchesFilter);
  carousel.innerHTML = "";
  // Remove old listener to avoid stacking
  carousel.removeEventListener("scroll", onCarouselScroll);

  if (filtered.length === 0) {
    carousel.innerHTML =
      '<div style="padding:40px 20px;color:#999;font-size:14px;font-family:Manrope,sans-serif">No dishes match these filters</div>';
    updateDishInfo(null);
    return;
  }

  filtered.forEach((e, i) => {
    // Wrapper — holds card + distance overlay, is the snap unit
    const wrap = document.createElement("div");
    wrap.className = "card-wrap";
    wrap.dataset.idx = i;

    // Food card — overflow:hidden for image rounding
    const card = document.createElement("div");
    card.className = "food-card";

    if (e.image) {
      const img = document.createElement("img");
      img.src = e.image;
      img.alt = e.dish;
      img.loading = "lazy";
      card.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "card-placeholder";
      ph.textContent = MEAL_EMOJI[e.type] || "🍴";
      card.appendChild(ph);
    }

    wrap.appendChild(card);

    wrap.addEventListener("click", () => scrollToCard(i));
    carousel.appendChild(wrap);
  });

  carousel.addEventListener("scroll", onCarouselScroll, { passive: true });

  activeIdx = 0;
  requestAnimationFrame(() => {
    scrollToCard(0, false);
    applyFanEffect();
  });
}

function onCarouselScroll() {
  if (scrollRAF) cancelAnimationFrame(scrollRAF);
  scrollRAF = requestAnimationFrame(applyFanEffect);
  clearTimeout(snapTimeout);
  snapTimeout = setTimeout(detectSnapCard, 180);
}

function applyFanEffect() {
  const wraps = carousel.querySelectorAll(".card-wrap");
  const centerX = carousel.scrollLeft + carousel.offsetWidth / 2;
  wraps.forEach((wrap) => {
    const card = wrap.querySelector(".food-card");
    const wrapCenter = wrap.offsetLeft + wrap.offsetWidth / 2;
    const dist = (wrapCenter - centerX) / (wrap.offsetWidth + 20);
    const absD = Math.abs(dist);
    const proximity = Math.max(0, 1 - absD * 2); // 1 at center, 0 at edges

    wrap.style.transform = `rotate(${dist * 22}deg) scale(${Math.max(0.72, 1 - absD * 0.28)}) translateY(${absD * 12}px)`;
    wrap.style.opacity = Math.max(0.45, 1 - absD * 0.45);

    // Smoothly grow/shrink card size based on proximity to center
    if (card) {
      const size = Math.round(130 + proximity * 16); // 130 → 146
      const border = 4 + proximity; // 4 → 5
      card.style.width = `${size}px`;
      card.style.height = `${size}px`;
      card.style.borderWidth = `${border}px`;
    }
  });
}

function detectSnapCard() {
  const wraps = [...carousel.querySelectorAll(".card-wrap")];
  if (!wraps.length) return;
  const centerX = carousel.scrollLeft + carousel.offsetWidth / 2;
  let bestIdx = 0,
    bestDist = Infinity;
  wraps.forEach((wrap, i) => {
    const d = Math.abs(wrap.offsetLeft + wrap.offsetWidth / 2 - centerX);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  });
  if (bestIdx !== activeIdx) {
    activeIdx = bestIdx;
    if (navigator.vibrate) navigator.vibrate(8);
    onActiveChange();
  }
}

function scrollToCard(i, animate = true) {
  const wraps = [...carousel.querySelectorAll(".card-wrap")];
  if (!wraps[i]) return;
  const wrap = wraps[i];
  const targetScroll =
    wrap.offsetLeft - (carousel.offsetWidth - wrap.offsetWidth) / 2;
  carousel.scrollTo({
    left: targetScroll,
    behavior: animate ? "smooth" : "instant",
  });
  activeIdx = i;
  onActiveChange();
}

function onActiveChange() {
  const e = filtered[activeIdx];
  if (!e) return;
  updateDishInfo(e);
  updateDistance(e);
  updateRoute(e);
  highlightMarker(activeIdx);
  if (e.lat) {
    if (userLoc) {
      map.fitBounds(
        [
          [Math.min(userLoc.lng, e.lng), Math.min(userLoc.lat, e.lat)],
          [Math.max(userLoc.lng, e.lng), Math.max(userLoc.lat, e.lat)],
        ],
        { padding: 120, maxZoom: 16, speed: 1.2 },
      );
    } else {
      map.flyTo({ center: [e.lng, e.lat], zoom: 15, speed: 1.2 });
    }
  }
  carousel.querySelectorAll(".card-wrap").forEach((wrap, i) => {
    const card = wrap.querySelector(".food-card");
    const isActive = i === activeIdx;
    if (card) card.classList.toggle("active", isActive);
    wrap.classList.toggle("active-wrap", isActive);
  });
}

/* ----------------------------------------------------------------
   DISH INFO
   ---------------------------------------------------------------- */
function updateDishInfo(e) {
  const nameEl = document.getElementById("activeDish");
  const locEl = document.getElementById("activeLocation");
  const arrow = document.getElementById("dishArrow");
  if (!e) {
    nameEl.textContent = "—";
    locEl.textContent = "—";
    return;
  }
  nameEl.textContent = e.dish;
  locEl.textContent = e.place;
  if (arrow) arrow.onclick = () => window.open(gmapsUrl(e), "_blank");
}

/* ----------------------------------------------------------------
   DISTANCE — pill badge floating above the active card image
   Walk if < 1 km, drive if ≥ 1 km
   ---------------------------------------------------------------- */
function updateDistance(e) {
  const badge = document.getElementById("distanceBadge");
  if (!badge) return;
  badge.innerHTML = "";
  badge.classList.remove("visible");
  if (!userLoc || !e || !e.lat) return;

  const km = haversine(userLoc.lat, userLoc.lng, e.lat, e.lng);
  const dist = km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
  const icon = km < 1 ? "🚶" : "🚗";
  const mins = km < 1 ? Math.round(km * 12) : Math.round(km * 3);
  const mode = km < 1 ? "walk from you" : "drive from you";

  badge.innerHTML = `<span class="dist-main">${icon}&nbsp;&nbsp;&nbsp;&nbsp;${mins} mins · ${dist}</span><span class="dist-sub">${mode}</span>`;
  badge.classList.add("visible");
}

/* ----------------------------------------------------------------
   MAP MARKERS — location pin SVG, name label when active
   ---------------------------------------------------------------- */
function pinSVG(color) {
  return `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.22))">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.2 12.6 21.1 13.13 21.6a1.3 1.3 0 001.74 0C15.4 35.1 28 23.2 28 14 28 6.268 21.732 0 14 0z" fill="${color}"/>
    <circle cx="14" cy="13.5" r="5.5" fill="white"/>
  </svg>`;
}

function pinLabelHTML(place, dish) {
  return `
    <div class="pin-label-box">
      <span class="pin-label-name">${place}</span>
      <span class="pin-label-dish">${dish}</span>
    </div>`;
}

function renderMarkers() {
  if (!mapLoaded) return;
  Object.values(markers).forEach((m) => m.remove());
  markers = {};

  filtered.forEach((e, i) => {
    if (!e.lat) return;

    const isSeeking = e.sensory === "Sensory seeking";
    const color = "#C51FFC";

    const el = document.createElement("div");
    el.className = "pin-marker" + (isSeeking ? " seeking" : "");
    el.innerHTML = pinSVG(color);
    el.dataset.place = e.place;
    el.dataset.area = e.area;
    el.dataset.color = color;
    el.addEventListener("click", () => scrollToCard(i));

    markers[i] = new maplibregl.Marker({ element: el, anchor: "bottom" })
      .setLngLat([e.lng, e.lat])
      .addTo(map);
  });

  highlightMarker(activeIdx);
}

async function fetchArea(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } },
    );
    const data = await res.json();
    return (
      data.address?.suburb ||
      data.address?.neighbourhood ||
      data.address?.quarter ||
      data.address?.city_district ||
      ""
    );
  } catch (_) {
    return "";
  }
}

function highlightMarker(idx) {
  Object.entries(markers).forEach(([i, m]) => {
    const active = parseInt(i) === idx;
    const el = m.getElement();
    el.classList.toggle("active", active);
    el.style.zIndex = active ? "10" : "1";
    if (active) {
      const lngLat = m.getLngLat();
      el.innerHTML = pinLabelHTML(el.dataset.place, el.dataset.area || "…");
      if (!el.dataset.area) {
        fetchArea(lngLat.lat, lngLat.lng).then((area) => {
          el.dataset.area = area;
          if (el.classList.contains("active")) {
            el.innerHTML = pinLabelHTML(el.dataset.place, area);
          }
        });
      }
    } else {
      el.innerHTML = pinSVG(el.dataset.color);
    }
  });
}

/* ----------------------------------------------------------------
   RENDER
   ---------------------------------------------------------------- */
function render() {
  buildCarousel();
  renderMarkers();
  if (filtered.length > 0) onActiveChange();
}

/* ----------------------------------------------------------------
   FILTERS
   ---------------------------------------------------------------- */
function setMealType(type, el) {
  filters.type = type;
  document
    .querySelectorAll(".meal-type-pill")
    .forEach((btn) => btn.classList.remove("active"));
  el.classList.add("active");
  render();
}
function setSensory(val) {
  if (filters.sensory === val) {
    filters.sensory = "all";
    document.getElementById("seekingBtn").classList.remove("active");
    document.getElementById("avoidingBtn").classList.remove("active");
  } else {
    filters.sensory = val;
    document
      .getElementById("seekingBtn")
      .classList.toggle("active", val === "Sensory seeking");
    document
      .getElementById("avoidingBtn")
      .classList.toggle("active", val === "Sensory avoiding");
  }
  render();
}
document.getElementById("seatToggle").addEventListener("change", (e) => {
  filters.seating = e.target.checked ? "yes" : "all";
  render();
});

/* ----------------------------------------------------------------
   BOOT
   ---------------------------------------------------------------- */
render();
fetchAirtable();
