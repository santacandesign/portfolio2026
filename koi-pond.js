/**
 * koi-pond.js — the animated koi pond footer, extracted into its own
 * component so it can be dropped into any page with a single mount point:
 *   <div id="koi-pond-mount"></div>
 *   <script src="koi-pond.js" defer></script>
 * Styles live in koi-pond.css.
 *
 * Fish are driven from JS (not SMIL animateMotion) so they can be
 * redirected on click: each fish patrols a fixed elliptical loop by
 * default, but the two fish nearest a click will break off, swim to the
 * dropped food, pause to eat, then rejoin their patrol loop.
 */
(function () {
  var SVG_NS = "http://www.w3.org/2000/svg";
  var TWO_PI = Math.PI * 2;

  // ellipse patrol loops, extracted from the original hand-tuned SVG arc
  // paths (each pair of arc endpoints shared the same y, so cx/cy/rx fall
  // straight out of them) — sized and spaced so the loops never overlap.
  // koi-7..koi-10 are desktopOnly: mobile keeps the original 6 fish so the
  // smaller footer doesn't get crowded.
  var FISH_CONFIGS = [
    { cls: "koi-1", scale: 1.5, cx: 420, cy: 150, rx: 190, ry: 75, rot: 6, dur: 52000 },
    { cls: "koi-2", scale: 1.15, cx: 1080, cy: 140, rx: 170, ry: 70, rot: -5, dur: 38000 },
    { cls: "koi-3", scale: 0.9, cx: 740, cy: 290, rx: 130, ry: 55, rot: -8, dur: 30000 },
    { cls: "koi-4", scale: 0.62, cx: 200, cy: 300, rx: 100, ry: 45, rot: 4, dur: 24000 },
    { cls: "koi-5", scale: 0.72, cx: 1250, cy: 300, rx: 110, ry: 50, rot: 7, dur: 28000 },
    { cls: "koi-6", scale: 0.48, cx: 710, cy: 70, rx: 75, ry: 32, rot: -6, dur: 20000 },
    { cls: "koi-7", scale: 0.58, cx: 110, cy: 90, rx: 85, ry: 38, rot: 5, dur: 22000, desktopOnly: true },
    { cls: "koi-8", scale: 0.66, cx: 1345, cy: 55, rx: 75, ry: 32, rot: -6, dur: 23000, desktopOnly: true },
    { cls: "koi-9", scale: 0.55, cx: 480, cy: 345, rx: 95, ry: 30, rot: -4, dur: 21000, desktopOnly: true },
    { cls: "koi-10", scale: 0.6, cx: 1370, cy: 340, rx: 55, ry: 30, rot: 8, dur: 19000, desktopOnly: true },
  ];

  // mobile (matches the koi-footer max-width: 800px breakpoint in
  // koi-pond.css) keeps only the original 6 fish
  var isMobile = typeof window.matchMedia === "function" && window.matchMedia("(max-width: 800px)").matches;
  if (isMobile) {
    FISH_CONFIGS = FISH_CONFIGS.filter(function (cfg) {
      return !cfg.desktopOnly;
    });
  }

  var KOI_POND_HTML = [
    '<footer class="koi-footer">',
    '<svg class="koi-scene" viewBox="0 0 1440 380" preserveAspectRatio="xMidYMid slice" aria-hidden="true">',
    "<defs>",
    '<filter id="koiNoise" x="0" y="0" width="100%" height="100%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7"/>',
    '<feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.95  0 0 0 0 0.88  0 0 0 0.5 0"/>',
    "</filter>",
    '<filter id="koiStreaks" x="0" y="0" width="100%" height="100%">',
    '<feTurbulence type="turbulence" baseFrequency="0.004 0.045" numOctaves="2" seed="3"/>',
    '<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/>',
    "</filter>",
    '<filter id="koiRough" x="-20%" y="-40%" width="140%" height="180%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="5" result="n"/>',
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G"/>',
    "</filter>",
    '<filter id="koiCausticNoise" x="-60%" y="-60%" width="220%" height="220%">',
    '<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="4" result="n">',
    '<animate attributeName="baseFrequency" values="0.01;0.02;0.01" dur="11s" repeatCount="indefinite"/>',
    "</feTurbulence>",
    '<feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G"/>',
    '<feGaussianBlur stdDeviation="14"/>',
    "</filter>",
    '<path id="koiBodyShape" d="M0 -1.0 C6 -2.6 16 -4.6 26 -5.4 C34.5 -6.1 43 -4.2 45.2 -1.6 C46.3 -0.5 46.3 0.5 45.2 1.6 C43 4.2 34.5 6.1 26 5.4 C16 4.6 6 2.6 0 1.0 Z"/>',
    '<path id="koiFinLobe" d="M0 0 Q-3.5 -6 -2.8 -11.5 A2.8 2.3 0 0 1 2.8 -11.5 Q3.5 -6 0 0 Z"/>',
    '<path id="koiTailShape" d="M1.5 0 Q-5.5 -5 -11 -0.6 Q-12.5 0 -11 0.6 Q-5.5 5 1.5 0 Z"/>',
    // clips the scale outlines to the body shape so none spill past the edge
    '<clipPath id="koiBodyClip"><use href="#koiBodyShape"/></clipPath>',
    // one half-circle arc, bulge pointing toward the tail (-x) — the
    // classic scalloped "fish scale" motif, repeated via <use> below
    // instead of a filled dot
    '<path id="koiScaleArc" d="M0 -2.1 A2.1 2.1 0 0 0 0 2.1"/>',
    // scale outlines laid out in three overlapping rows following the body
    // curve — shared by every fish since they're all drawn in the same
    // local 0-46 x / -6..6 y coordinate space, before each fish's own
    // scale(). Rows are offset by half a scale-width for the brick-like
    // overlap real fish scales have.
    '<g id="koiScales">',
    '<use href="#koiScaleArc" x="9" y="-3.1"/>',
    '<use href="#koiScaleArc" x="16.5" y="-3.6"/>',
    '<use href="#koiScaleArc" x="24" y="-3.9"/>',
    '<use href="#koiScaleArc" x="31.5" y="-3.6"/>',
    '<use href="#koiScaleArc" x="38.5" y="-2.8"/>',
    '<use href="#koiScaleArc" x="5" y="0"/>',
    '<use href="#koiScaleArc" x="12.5" y="0"/>',
    '<use href="#koiScaleArc" x="20" y="0"/>',
    '<use href="#koiScaleArc" x="27.5" y="0"/>',
    '<use href="#koiScaleArc" x="35" y="0"/>',
    '<use href="#koiScaleArc" x="41.5" y="0"/>',
    '<use href="#koiScaleArc" x="9" y="3.1"/>',
    '<use href="#koiScaleArc" x="16.5" y="3.6"/>',
    '<use href="#koiScaleArc" x="24" y="3.9"/>',
    '<use href="#koiScaleArc" x="31.5" y="3.6"/>',
    '<use href="#koiScaleArc" x="38.5" y="2.8"/>',
    "</g>",

    '<radialGradient id="padGrad" cx="38%" cy="35%" r="85%">',
    '<stop offset="0%" stop-color="#66b34c"/>',
    '<stop offset="100%" stop-color="#2f7a2a"/>',
    "</radialGradient>",
    '<radialGradient id="lotusGrad" cx="40%" cy="38%" r="85%">',
    '<stop offset="0%" stop-color="#4f9a3d"/>',
    '<stop offset="100%" stop-color="#1f5c1d"/>',
    "</radialGradient>",
    '<radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">',
    '<stop offset="0%" stop-color="#eafff2" stop-opacity="0.7"/>',
    '<stop offset="100%" stop-color="#eafff2" stop-opacity="0"/>',
    "</radialGradient>",
    "</defs>",

    '<g filter="url(#koiRough)">',
    '<g fill="#bfe8d2" opacity="0.3">',
    '<ellipse cx="200" cy="115" rx="90" ry="17"/>',
    '<ellipse cx="500" cy="85" rx="70" ry="14"/>',
    '<ellipse cx="850" cy="125" rx="100" ry="19"/>',
    '<ellipse cx="1150" cy="85" rx="80" ry="15"/>',
    '<ellipse cx="650" cy="165" rx="60" ry="12"/>',
    '<ellipse cx="1310" cy="160" rx="70" ry="13"/>',
    '<ellipse cx="80" cy="180" rx="65" ry="13"/>',
    '<ellipse cx="380" cy="140" rx="55" ry="11"/>',
    '<ellipse cx="730" cy="60" rx="75" ry="15"/>',
    '<ellipse cx="1000" cy="175" rx="60" ry="12"/>',
    '<ellipse cx="1250" cy="45" rx="85" ry="16"/>',
    '<ellipse cx="560" cy="45" rx="50" ry="10"/>',
    "</g>",
    '<g fill="#124a37" opacity="0.5">',
    '<ellipse cx="150" cy="315" rx="70" ry="15"/>',
    '<ellipse cx="330" cy="285" rx="55" ry="12"/>',
    '<ellipse cx="520" cy="335" rx="80" ry="17"/>',
    '<ellipse cx="700" cy="295" rx="60" ry="13"/>',
    '<ellipse cx="880" cy="330" rx="90" ry="19"/>',
    '<ellipse cx="1060" cy="285" rx="65" ry="14"/>',
    '<ellipse cx="1240" cy="325" rx="75" ry="16"/>',
    '<ellipse cx="420" cy="248" rx="45" ry="10"/>',
    '<ellipse cx="960" cy="245" rx="50" ry="10"/>',
    '<ellipse cx="1355" cy="278" rx="55" ry="11"/>',
    '<ellipse cx="240" cy="358" rx="60" ry="13"/>',
    '<ellipse cx="620" cy="262" rx="40" ry="9"/>',
    "</g>",
    '<g fill="#0a3324" opacity="0.5">',
    '<ellipse cx="450" cy="308" rx="50" ry="11"/>',
    '<ellipse cx="800" cy="350" rx="70" ry="14"/>',
    '<ellipse cx="1150" cy="358" rx="80" ry="15"/>',
    '<ellipse cx="90" cy="268" rx="40" ry="9"/>',
    "</g>",
    "</g>",

    '<ellipse class="koi-glow" cx="720" cy="170" rx="260" ry="150" fill="url(#sunGlow)"/>',
    '<ellipse cx="1340" cy="30" rx="300" ry="150" fill="url(#sunGlow)"/>',

    '<g class="koi-caustics" filter="url(#koiCausticNoise)">',
    '<ellipse class="koi-caustic kc-1" cx="300" cy="120" rx="170" ry="60" fill="#eafff2"/>',
    '<ellipse class="koi-caustic kc-2" cx="920" cy="270" rx="210" ry="70" fill="#eafff2"/>',
    '<ellipse class="koi-caustic kc-3" cx="1250" cy="110" rx="150" ry="55" fill="#eafff2"/>',
    "</g>",

    // noise sits above the background/caustics/ripples so those pick up
    // visible grain, but below the fish + lily pads so those stay crisp
    '<rect class="koi-streaks" x="0" y="0" width="1440" height="380" filter="url(#koiStreaks)"/>',
    '<rect class="koi-grain" x="0" y="0" width="1440" height="380" filter="url(#koiNoise)"/>',

    // fish sit under a faint water-colour film so they read as submerged;
    // specular highlights (see koiFish()) simulate light glinting off each
    // fish's back instead of a refraction/displacement distortion.
    // Markup is generated from FISH_CONFIGS (already filtered for mobile
    // above) so the fish list and their patrol physics can't drift apart.
    '<g class="koi-fish-layer">',
    FISH_CONFIGS.map(function (cfg) {
      return koiFish({ cls: cfg.cls, scale: cfg.scale });
    }).join("\n"),
    "</g>",
    '<rect class="koi-water-film" x="0" y="0" width="1440" height="380"/>',

    // food dropped on click lives above the water-film so pellets read
    // clearly on the surface
    '<g class="koi-food-layer"></g>',

    '<g transform="translate(1090,125)"><g class="koi-lily lily-1">',
    '<path d="M0 0 L38 -14 A40 40 0 1 0 38 14 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-33 -8 M0 0 L-28 -20 M0 0 L-15 -30 M0 0 L5 -33 M0 0 L-34 6 M0 0 L-24 24 M0 0 L-8 32 M0 0 L12 30" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
    '<circle cx="-14" cy="-12" r="2.6" fill="#ffffff" opacity="0.85"/>',
    "</g></g>",
    '<g transform="translate(1160,170)"><g class="koi-lily lily-2">',
    '<path d="M0 0 L24 -9 A26 26 0 1 0 24 9 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-21 -6 M0 0 L-14 -16 M0 0 L-2 -21 M0 0 L-20 10 M0 0 L-7 20" stroke="#245c1d" stroke-width="1" stroke-opacity="0.65" fill="none"/>',
    "</g></g>",
    '<g transform="translate(255,150)"><g class="koi-lily lily-3">',
    '<path d="M0 0 L30 -11 A32 32 0 1 0 30 11 Z" fill="url(#padGrad)"/>',
    '<path d="M0 0 L-26 -8 M0 0 L-18 -20 M0 0 L-4 -26 M0 0 L-27 8 M0 0 L-16 22 M0 0 L0 26" stroke="#245c1d" stroke-width="1.2" stroke-opacity="0.65" fill="none"/>',
    '<circle cx="10" cy="14" r="2.2" fill="#ffffff" opacity="0.85"/>',
    "</g></g>",
    '<g transform="translate(300,115)"><g class="koi-lily lily-4">',
    '<g fill="#fffced">',
    '<ellipse rx="4.5" ry="12" transform="rotate(0)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(45)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(90)"/>',
    '<ellipse rx="4.5" ry="12" transform="rotate(135)"/>',
    "</g>",
    '<circle r="3.5" fill="#ff4545" opacity="0.85"/>',
    "</g></g>",

    '<g transform="translate(660,100) rotate(80)"><g class="koi-lily lotus-3">',
    '<path d="M0 0 L42 -16 A46 46 0 1 0 42 16 Z" fill="url(#lotusGrad)" stroke="#1c4a16" stroke-width="1.8" stroke-opacity="0.45"/>',
    '<path d="M0 0 L-38 -9 M0 0 L-30 -24 M0 0 L-16 -35 M0 0 L-38 8 M0 0 L-26 27 M0 0 L-10 36 M0 0 L30 -28" stroke="#1c4a16" stroke-width="1.2" stroke-opacity="0.55" fill="none"/>',
    '<circle cx="-14" cy="12" r="2.4" fill="#ffffff" opacity="0.8"/>',
    "</g></g>",
    "</svg>",

    "</footer>",
  ].join("\n");

  // builds one koi fish (slender top-view body + pectoral fin pair + a
  // whip-like tail) as an HTML string. Position/heading are no longer
  // driven by an <animateMotion> child — koiPondInit() below sets the
  // group's transform every frame instead, so a fish can be redirected
  // toward food and rejoin its patrol loop afterward.
  function koiFish(opts) {
    return [
      '<g class="koi ' + opts.cls + '" data-fish="' + opts.cls + '">',
      '<g transform="scale(' + opts.scale + ')">',
      '<ellipse class="koi-shadow" cx="18" cy="5" rx="26" ry="4.5"/>',
      '<g class="koi-tail"><use href="#koiTailShape" class="koi-tail-fill"/></g>',
      // both fins use the identical ray layout (no swapping based on the
      // mirror flip) so the long ray consistently sweeps toward the tail
      // on both the top and bottom fin, instead of one reading "longer on
      // top" and the other "longer on bottom"
      '<g transform="translate(35,-4.5) scale(1,-1)">',
      finFan(),
      "</g>",
      '<g transform="translate(35,4.5)">',
      finFan(),
      "</g>",
      // second, smaller pair of fins tucked closer to the tail (pelvic
      // fins) — same fan shape, scaled down and moved nearer x=0 (the
      // tail end) rather than x=35 (near the head)
      '<g class="koi-fin-rear" transform="translate(13,-3.3) scale(0.55,-0.55)">',
      finFan(),
      "</g>",
      '<g class="koi-fin-rear" transform="translate(13,3.3) scale(0.55,0.55)">',
      finFan(),
      "</g>",
      '<use href="#koiBodyShape" class="koi-body-fill"/>',
      // white scale outlines, clipped to the body outline so they read as
      // scalloped scale texture over the base colour rather than dots
      '<use href="#koiScales" class="koi-scale-outline" clip-path="url(#koiBodyClip)"/>',
      "</g>",
      "</g>",
    ].join("\n");
  }

  // a pectoral fin as a flowing 3-lobe fan (a short, a long and a medium
  // ray splaying out from the same point), instead of one solid paddle.
  // the same fixed ray-length layout is used for both the top and bottom
  // fin (no swap based on the mirror flip), so the long ray sweeps toward
  // the tail consistently on both fins rather than one being longer on
  // its top edge and the other longer on its bottom edge.
  function finFan() {
    return [
      // rotated 20° further back than before so every ray sweeps toward
      // the tail at less than 60° off the body's long axis, instead of
      // splaying out close to perpendicular (90°) to it
      '<g class="koi-fin">',
      '<g transform="rotate(-104) scale(0.55)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
      '<g transform="rotate(-126) scale(0.85)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
      '<g transform="rotate(-148) scale(0.95)"><use href="#koiFinLobe" class="koi-fin-fill"/></g>',
      "</g>",
    ].join("\n");
  }

  function ellipsePoint(cfg, theta) {
    var rot = (cfg.rot * Math.PI) / 180;
    var ex = cfg.rx * Math.cos(theta);
    var ey = cfg.ry * Math.sin(theta);
    var x = cfg.cx + ex * Math.cos(rot) - ey * Math.sin(rot);
    var y = cfg.cy + ex * Math.sin(rot) + ey * Math.cos(rot);
    // tangent direction, used to orient the fish along its swim path
    var dex = -cfg.rx * Math.sin(theta);
    var dey = cfg.ry * Math.cos(theta);
    var dx = dex * Math.cos(rot) - dey * Math.sin(rot);
    var dy = dex * Math.sin(rot) + dey * Math.cos(rot);
    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return { x: x, y: y, angle: angle };
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // Ramanujan's second approximation for ellipse circumference — used to
  // give each fish a cruising speed (px/ms) so a food-approach or
  // return-to-patrol trip covers ground at the same pace as normal
  // patrolling, instead of a fixed duration regardless of distance
  function ellipseCircumference(rx, ry) {
    var h = Math.pow(rx - ry, 2) / Math.pow(rx + ry, 2);
    return Math.PI * (rx + ry) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  }

  // distance from local x=0 (where the tail attaches — see koiFish()) out
  // to the tip of the head/mouth on koiBodyShape's longest point (x≈46.3)
  var KOI_HEAD_LEN = 46.3;

  // fish swim toward food/back to their loop a bit quicker than their
  // normal patrol cruise
  var FOOD_SPEED_MULTIPLIER = 1.35;

  function initKoiPond() {
    var footer = document.querySelector(".koi-footer");
    if (!footer) return;
    var svg = footer.querySelector(".koi-scene");
    var foodLayer = svg.querySelector(".koi-food-layer");

    FISH_CONFIGS.forEach(function (cfg) {
      cfg.el = svg.querySelector('[data-fish="' + cfg.cls + '"]');
      cfg.state = "patrol";
      cfg.theta0 = Math.PI;
      cfg.startTime = performance.now();
      // px per ms this fish covers on its patrol loop — reused below so
      // off-loop trips (to food and back) swim at the same (slightly
      // boosted) speed
      cfg.speed = ellipseCircumference(cfg.rx, cfg.ry) / cfg.dur;
      // how far the head/mouth sits from the fish's anchor point (the
      // tail-attach point at local x=0, which is what patrol/translate
      // positions actually track) — used to land the mouth, not the
      // tail, on the food
      cfg.headLen = KOI_HEAD_LEN * cfg.scale;
    });

    function patrolPos(cfg, now) {
      // theta must increase with time here — ellipsePoint()'s tangent/angle
      // math assumes increasing theta, so subtracting flipped the heading
      // 180° from the direction of actual travel (fish "swimming backwards")
      var theta = cfg.theta0 + ((now - cfg.startTime) / cfg.dur) * TWO_PI;
      return ellipsePoint(cfg, theta);
    }

    function tick(now) {
      FISH_CONFIGS.forEach(function (cfg) {
        var pos;
        if (cfg.state === "approach") {
          // constant-speed (no easing) so the trip to the food reads as
          // the same cruising swim as patrolling, just in a straight line —
          // lerp toward mouthTarget so the mouth (not the tail anchor)
          // ends up on the food
          var t = Math.min(1, (now - cfg.phaseStart) / cfg.approachDur);
          pos = {
            x: lerp(cfg.fromX, cfg.mouthTargetX, t),
            y: lerp(cfg.fromY, cfg.mouthTargetY, t),
            angle: cfg.travelAngle,
          };
          if (t >= 1) {
            cfg.state = "eating";
            cfg.phaseStart = now;
            cfg.el.classList.add("koi-nibble");
            // first of the two chosen fish to arrive nibbles away two of
            // the three pellets; whichever arrives last (or the only fish,
            // if just one was available) clears out what's left
            if (cfg.foodSession) {
              var session = cfg.foodSession;
              session.eatenCount++;
              if (session.eatenCount < session.totalFish) {
                var pellets = session.food.querySelectorAll(".koi-pellet:not(.koi-pellet-eaten)");
                for (var i = 0; i < 2 && i < pellets.length; i++) {
                  pellets[i].classList.add("koi-pellet-eaten");
                }
              } else {
                session.food.classList.add("koi-food-eaten");
                setTimeout(function () {
                  session.food.remove();
                }, 350);
              }
              cfg.foodSession = null;
            }
          }
        } else if (cfg.state === "eating") {
          var t2 = (now - cfg.phaseStart) / cfg.eatDur;
          pos = { x: cfg.mouthTargetX, y: cfg.mouthTargetY, angle: cfg.travelAngle };
          if (t2 >= 1) {
            cfg.state = "return";
            cfg.phaseStart = now;
            cfg.el.classList.remove("koi-nibble");
            // two-pass estimate: guess a return duration, find where the
            // patrol loop will be after that long, then refine the
            // duration from the actual distance at (boosted) cruising
            // speed (one more pass converges close enough for a smooth
            // hand-off)
            var guessDur = 1500;
            for (var pass = 0; pass < 2; pass++) {
              var t0 = patrolPos(cfg, now + guessDur);
              var d0 = Math.hypot(t0.x - cfg.mouthTargetX, t0.y - cfg.mouthTargetY);
              guessDur = Math.max(300, d0 / (cfg.speed * FOOD_SPEED_MULTIPLIER));
            }
            cfg.returnDur = guessDur;
            var target = patrolPos(cfg, now + cfg.returnDur);
            cfg.retFromX = cfg.mouthTargetX;
            cfg.retFromY = cfg.mouthTargetY;
            cfg.returnX = target.x;
            cfg.returnY = target.y;
          }
        } else if (cfg.state === "return") {
          // same constant-speed straight-line swim back as the approach
          var t3 = Math.min(1, (now - cfg.phaseStart) / cfg.returnDur);
          var ddx = cfg.returnX - cfg.retFromX;
          var ddy = cfg.returnY - cfg.retFromY;
          var travelAngle = (Math.atan2(ddy, ddx) * 180) / Math.PI;
          pos = {
            x: lerp(cfg.retFromX, cfg.returnX, t3),
            y: lerp(cfg.retFromY, cfg.returnY, t3),
            angle: travelAngle,
          };
          if (t3 >= 1) cfg.state = "patrol";
        } else {
          pos = patrolPos(cfg, now);
        }
        cfg.el.setAttribute(
          "transform",
          "translate(" + pos.x.toFixed(2) + "," + pos.y.toFixed(2) + ") rotate(" + pos.angle.toFixed(2) + ")"
        );
      });
      requestAnimationFrame(tick);
    }
    tick(performance.now());

    function dropFood(fx, fy) {
      var now = performance.now();

      var food = document.createElementNS(SVG_NS, "g");
      food.setAttribute("class", "koi-food");
      food.setAttribute("transform", "translate(" + fx.toFixed(1) + "," + fy.toFixed(1) + ")");
      food.innerHTML =
        '<circle class="koi-food-ripple" r="6"/>' +
        '<circle class="koi-pellet" cx="-3" cy="-2" r="2.1"/>' +
        '<circle class="koi-pellet" cx="3" cy="1" r="1.7"/>' +
        '<circle class="koi-pellet" cx="0" cy="3" r="1.9"/>';
      foodLayer.appendChild(food);

      var candidates = FISH_CONFIGS.filter(function (c) {
        return c.state === "patrol";
      });
      candidates.forEach(function (c) {
        var p = patrolPos(c, now);
        c._pos = p;
        c._d = Math.hypot(p.x - fx, p.y - fy);
      });
      candidates.sort(function (a, b) {
        return a._d - b._d;
      });
      var chosen = candidates.slice(0, 2);

      // shared per-drop state so the two chosen fish can coordinate how
      // much of the food is left when each of them arrives — see the
      // "approach" → "eating" handoff in tick()
      var foodSession = { food: food, eatenCount: 0, totalFish: chosen.length };

      chosen.forEach(function (cfg, idx) {
        cfg.fromX = cfg._pos.x;
        cfg.fromY = cfg._pos.y;
        cfg.foodX = fx + (idx === 0 ? -3 : 3);
        cfg.foodY = fy + (idx === 0 ? 2 : -2);
        cfg.travelAngle = (Math.atan2(cfg.foodY - cfg.fromY, cfg.foodX - cfg.fromX) * 180) / Math.PI;
        // the fish's anchor point (what translate/patrol actually track)
        // is the tail-attach point, not the head — pull the arrival spot
        // back along the travel line by the head length so the mouth,
        // not the tail, ends up at the food
        var angleRad = (cfg.travelAngle * Math.PI) / 180;
        cfg.mouthTargetX = cfg.foodX - cfg.headLen * Math.cos(angleRad);
        cfg.mouthTargetY = cfg.foodY - cfg.headLen * Math.sin(angleRad);
        // swim to the food a bit quicker than normal patrol cruise,
        // scaled by distance so further food still takes longer
        var approachDist = Math.hypot(cfg.mouthTargetX - cfg.fromX, cfg.mouthTargetY - cfg.fromY);
        cfg.approachDur = Math.max(350, approachDist / (cfg.speed * FOOD_SPEED_MULTIPLIER));
        cfg.eatDur = 750;
        // cfg.returnDur is computed once eating finishes (see the
        // "eating" branch in tick()), from the actual distance back to
        // the patrol loop at cruising speed
        cfg.phaseStart = now;
        cfg.state = "approach";
        cfg.foodSession = foodSession;
      });

      // no fish available to come eat it — clear it out on its own after
      // a while instead of leaving it floating forever
      if (chosen.length === 0) {
        setTimeout(function () {
          food.classList.add("koi-food-eaten");
          setTimeout(function () {
            food.remove();
          }, 350);
        }, 3000);
      }
    }

    footer.addEventListener("click", function (e) {
      var pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      var loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      dropFood(loc.x, loc.y);
    });
  }

  function mount() {
    var target = document.getElementById("koi-pond-mount");
    if (!target) return;
    target.outerHTML = KOI_POND_HTML;
    initKoiPond();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
