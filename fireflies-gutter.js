/* ============================================================
   FIREFLY GUTTERS — About page
   Trimmed from the hireme "night forest" cut (fireflies/fireflies.js).
   Kept: the drift (Perlin flow + home-slot spring) and the blink.
   Dropped: MediaPipe hands, camera panel, windchimes, text formation.

   p5 INSTANCE mode on purpose — aboutmesketch.js owns global setup()/draw()
   for the flower, so these canvases must not touch the global namespace.
   ============================================================ */

(function () {
  // ───────────────── TWEAK ─────────────────
  // Constant at every screen size — how the drift and blink behave.
  var FF = {
    noiseScale: 0.0014,
    noiseSpeed: 0.0025,
    wanderStrength: 0.2,
    homePull: 0.008, // spring to its slot → even spread, no clumping
    maxSpeed: 1.5,

    blinkSpeedMin: 0.012,
    blinkSpeedMax: 0.045,
    blinkFloor: 0.18,

    colorA: [255, 214, 120], // warm amber
    colorB: [196, 255, 140], // glow-worm green

    starTwinkleMin: 0.012,
    starTwinkleMax: 0.06,
  };

  // How many fireflies, how big, and how much edge clearance they need —
  // keyed to the same breakpoints night.css uses for the gutter's CSS
  // width (`gutterW` here must match that width). A firefly's halo is
  // drawn at size*9 across, so edgePad is roughly the biggest halo's
  // radius plus a few px, or the glow gets sliced off at the canvas edge.
  var TIERS = [
    { maxWidth: 600, gutterW: 16, perSide: 6, starsPerSide: 8, edgePad: 8, homeDrift: 5, sizeScale: 0.4 },
    { maxWidth: 1180, gutterW: 64, perSide: 12, starsPerSide: 16, edgePad: 16, homeDrift: 14, sizeScale: 0.65 },
    { maxWidth: Infinity, gutterW: 240, perSide: 18, starsPerSide: 26, edgePad: 26, homeDrift: 34, sizeScale: 1 },
  ];
  function tierFor(w) {
    for (var i = 0; i < TIERS.length; i++) if (w <= TIERS[i].maxWidth) return TIERS[i];
    return TIERS[TIERS.length - 1];
  }
  // ─────────────────────────────────────────

  var instances = [];

  function gutterSketch(side) {
    return function (p) {
      var flies = [];
      var stars = [];
      var zt = 0;
      var prof = TIERS[TIERS.length - 1]; // recomputed in build()

      function slotFor(i, n) {
        // Jittered column of slots so coverage is even top-to-bottom.
        // Inset by edgePad + homeDrift so a slot's wander can't carry a
        // firefly into the edge in the first place.
        var pad = prof.edgePad + prof.homeDrift;
        var t = (i + 0.5) / n;
        return p.createVector(
          p.random(pad, Math.max(pad + 1, p.width - pad)),
          pad + t * Math.max(1, p.height - pad * 2) + p.random(-18, 18),
        );
      }

      function makeFly(i, n) {
        var home = slotFor(i, n);
        var depth = p.random();
        return {
          pos: p.createVector(home.x + p.random(-30, 30), home.y + p.random(-30, 30)),
          vel: p5.Vector.random2D().mult(p.random(0.2, 0.8)),
          home: home,
          depth: depth,
          size: p.lerp(1.4, 4.6, depth) * prof.sizeScale,
          tint: p.random(),
          phase: p.random(p.TWO_PI),
          driftSpd: p.random(0.003, 0.009),
          blinkSpd: p.random(FF.blinkSpeedMin, FF.blinkSpeedMax),
          blinkPhase: p.random(p.TWO_PI),
          bob: p.random(0.4, 1.1),
        };
      }

      function build() {
        prof = tierFor(window.innerWidth);

        flies = [];
        for (var i = 0; i < prof.perSide; i++) flies.push(makeFly(i, prof.perSide));

        stars = [];
        var starPad = Math.min(12, prof.gutterW * 0.5);
        for (var s = 0; s < prof.starsPerSide; s++) {
          var big = p.random() < 0.14;
          stars.push({
            x: p.random(starPad, Math.max(starPad + 1, p.width - starPad)),
            y:
              starPad +
              Math.pow(p.random(), 1.7) * Math.max(1, p.height - starPad * 2), // packed toward the top
            r: (p.random(0.45, 0.95) + (big ? p.random(0.5, 1.1) : 0)) * prof.sizeScale,
            spd: p.random(FF.starTwinkleMin, FF.starTwinkleMax),
            phase: p.random(p.TWO_PI),
            base: p.random(0.3, 0.95),
            cool: p.random(),
          });
        }
      }

      function gutterSize() {
        var el = document.querySelector(".firefly-gutter--" + side);
        return {
          w: el ? el.offsetWidth : 240,
          h: el ? el.offsetHeight : window.innerHeight,
        };
      }

      p.setup = function () {
        var d = gutterSize();
        var c = p.createCanvas(d.w, d.h);
        c.parent("fireflyGutter" + (side === "left" ? "Left" : "Right"));
        p.clear();
        build();
      };

      p.windowResized = function () {
        var d = gutterSize();
        p.resizeCanvas(d.w, d.h);
        build();
      };

      // The pow() is what makes it read as blinking rather than a sine wave
      function glowOf(f) {
        var pulse = Math.pow(
          0.5 + 0.5 * p.sin(p.frameCount * f.blinkSpd + f.blinkPhase),
          3,
        );
        return p.lerp(FF.blinkFloor, 1, pulse);
      }

      p.draw = function () {
        p.clear(); // transparent — the CSS night sky shows through
        zt += FF.noiseSpeed;

        // Stars first, additively, so fireflies read in front of them
        p.blendMode(p.ADD);
        p.noStroke();
        for (var s = 0; s < stars.length; s++) {
          var st = stars[s];
          var tw = 0.45 + 0.55 * p.sin(p.frameCount * st.spd + st.phase);
          var a = 255 * st.base * Math.max(tw, 0.08) * 0.55;
          var r = p.lerp(255, 208, st.cool);
          var g = p.lerp(255, 226, st.cool);
          p.fill(r, g, 255, a * 0.16);
          p.circle(st.x, st.y, st.r * 6);
          p.fill(r, g, 255, a);
          p.circle(st.x, st.y, st.r * 2);
        }

        for (var i = 0; i < flies.length; i++) {
          var f = flies[i];
          var acc = p.createVector(0, 0);

          // 1) Perlin flow gives the drift its wander
          var ang =
            p.noise(f.pos.x * FF.noiseScale, f.pos.y * FF.noiseScale, zt) *
            p.TWO_PI *
            2;
          acc.add(p5.Vector.fromAngle(ang).mult(FF.wanderStrength));

          // 2) Spring to its slowly drifting slot
          var t = p.frameCount * f.driftSpd;
          var hx = f.home.x + p.cos(t + f.phase) * prof.homeDrift;
          var hy =
            f.home.y +
            p.sin(t * 0.8 + f.phase * 1.7) * prof.homeDrift +
            p.sin(p.frameCount * 0.02 + f.phase) * f.bob * 6;
          acc.add(
            p.createVector(hx - f.pos.x, hy - f.pos.y).mult(FF.homePull),
          );

          f.vel.add(acc);
          f.vel.limit(FF.maxSpeed);
          f.pos.add(f.vel);
          f.vel.mult(0.95);

          // Bounce well before the edge, so the halo never gets clipped
          var m = prof.edgePad;
          if (f.pos.x < m) { f.pos.x = m; f.vel.x *= -0.9; }
          if (f.pos.x > p.width - m) { f.pos.x = p.width - m; f.vel.x *= -0.9; }
          if (f.pos.y < m) { f.pos.y = m; f.vel.y *= -0.9; }
          if (f.pos.y > p.height - m) { f.pos.y = p.height - m; f.vel.y *= -0.9; }

          // Draw: soft halo + core, brightness from the blink and the depth
          var glow = glowOf(f) * p.lerp(0.45, 1, f.depth);
          var cr = p.lerp(FF.colorA[0], FF.colorB[0], f.tint);
          var cg = p.lerp(FF.colorA[1], FF.colorB[1], f.tint);
          var cb = p.lerp(FF.colorA[2], FF.colorB[2], f.tint);

          p.noStroke();
          p.fill(cr, cg, cb, 26 * glow);
          p.circle(f.pos.x, f.pos.y, f.size * 9);
          p.fill(cr, cg, cb, 70 * glow);
          p.circle(f.pos.x, f.pos.y, f.size * 4);
          p.fill(cr, cg, cb, 235 * glow);
          p.circle(f.pos.x, f.pos.y, f.size);
        }

        p.blendMode(p.BLEND);
      };
    };
  }

  function start() {
    // Always on now — the gutter shrinks (and so does the tier's firefly
    // count/size/clearance) rather than disappearing below 1180px.
    if (instances.length) return;
    instances.push(new p5(gutterSketch("left")));
    instances.push(new p5(gutterSketch("right")));
    var gutters = document.querySelectorAll(".firefly-gutter");
    // Next frame, so the fade-in transition actually runs
    requestAnimationFrame(function () {
      for (var i = 0; i < gutters.length; i++) gutters[i].classList.add("is-lit");
    });
  }

  // The loader calls this when the bulb goes out; if there's no loader
  // (already seen this session) it fires on load instead.
  window.startFireflies = start;
})();
