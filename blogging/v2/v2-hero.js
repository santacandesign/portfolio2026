/* ============================================================
   HERO — "Santa writes to think"
   "writes" (Instrument Serif Italic, red) is typed out with a caret, with a
   fumble on the way: the reach from r to i is long, so it lands on u, backs
   out and types i. Meanwhile blue dots with red outlines swim around the
   words, then once "writes" is done they come together into "Santa" and
   "to think" (Jost Heavy). Plain 2D canvas on the poster-yellow page.
   ============================================================ */

(function () {
  "use strict";

  // ───────────────── TWEAK ─────────────────
  var UP = '"Jost"'; // what the shapes gather into
  var UP_WEIGHT = 800;
  var IT = '"Instrument Serif"'; // the wet ink
  var IT_WEIGHT = 400;
  var IT_SCALE = 1; // set in layout(): scales Instrument Serif so its x-height matches Jost Heavy's

  var GAP = 72; // px: window top → top of the word, and bottom of the word → top of the two columns (desktop)
  var HERO_VH = 0.62; // desktop hero height, as a fraction of the viewport

  var T = {
    fadeIn: 0.6, // s for the roaming dots to appear
    penAt: 0.6, // s before the first key
    fly: 1.6, // s each dot takes to reach its spot (they start leaving at the first key and all land with the last)
    shuffle: 0.4, // s the dots take to scatter when the wrong letter is erased
  };
  var CARET_LINGER = 1.6; // s the caret keeps blinking after the last key

  var RED = "#e7402a"; // "writes", and the dots' outline (same red as the traits page)
  var BLUE = "#9cb5e8"; // the dots' fill

  var DENSITY = 19; // grid cells per font size: higher = smaller, tighter shapes
  var SIZE = 1.18; // dot diameter, in grid cells: >1 so neighbours overlap into one blob, like beads
  var RING = 0.16; // red outline width, in grid cells
  var ROAM = 1; // how far the shapes wander around the words before settling
  // ─────────────────────────────────────────

  var host = document.getElementById("hero");
  var replayBtn = document.getElementById("replay");
  if (!host) return;

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  function mk(w, h) {
    var c = document.createElement("canvas");
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    return c;
  }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function ease(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function easeOut(t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function upFont(size) { return UP_WEIGHT + " " + size + "px " + UP; }
  function itFont(size) { return "italic " + IT_WEIGHT + " " + size + "px " + IT; }

  // ───────────── layout: where each word sits ─────────────
  function layout(W) {
    var m = mk(1, 1).getContext("2d");
    m.font = upFont(100);
    var xUp = m.measureText("x").actualBoundingBoxAscent;
    m.font = itFont(100);
    IT_SCALE = xUp / m.measureText("x").actualBoundingBoxAscent;
    m.font = upFont(100);
    var eS = m.measureText("Santa").width / 100;
    var eT = m.measureText("to think").width / 100;
    m.font = itFont(100 * IT_SCALE);
    var eW = m.measureText("writes").width / 100;
    var L = { W: W, items: [] };
    var fs, H;

    if (W >= 640) {
      // desktop: one line, as wide as the viewport allows (the hero breaks out of the page column)
      var gap = 0.28;
      var total = eS + eW + eT + gap * 2;
      // span the two columns below: from the left edge of the intro to the right edge of the post list
      var land = document.querySelector(".landing");
      var hr = host.getBoundingClientRect();
      var lr = land ? land.getBoundingClientRect() : null;
      var colL = lr ? lr.left - hr.left : W * 0.06;
      var colW = lr ? lr.width : W * 0.88;
      // trim the side bearings so the ink itself (S ... k) lines up with the columns
      m.font = upFont(100);
      var bearL = -m.measureText("Santa").actualBoundingBoxLeft / 100;
      var tt = m.measureText("to think");
      var bearR = tt.width / 100 - tt.actualBoundingBoxRight / 100;
      var ink = total - bearL - bearR;
      fs = Math.min(240, colW / ink);
      H = Math.round(Math.max(fs * 3.4, Math.min(window.innerHeight * HERO_VH, 720)));
      var base = H / 2 + fs * 0.33;
      var x = colL + (colW - ink * fs) / 2 - bearL * fs;
      // ink extent of the word, for the gap above/below it
      m.font = upFont(100);
      var asc = Math.max(m.measureText("Santa").actualBoundingBoxAscent, m.measureText("to think").actualBoundingBoxAscent);
      m.font = itFont(100 * IT_SCALE);
      asc = Math.max(asc, m.measureText("writes").actualBoundingBoxAscent);
      L.inkTop = base - (asc / 100) * fs;
      L.inkBottom = base;
      L.items.push({ k: "santa", text: "Santa", x: x, base: base, w: eS * fs });
      x += (eS + gap) * fs;
      L.items.push({ k: "writes", text: "writes", x: x, base: base, w: eW * fs });
      x += (eW + gap) * fs;
      L.items.push({ k: "think", text: "to think", x: x, base: base, w: eT * fs });
    } else {
      fs = Math.min(84, (W * 0.84) / Math.max(eS, eW, eT));
      var lh = fs * 1.25;
      var top = fs * 0.45 + fs * 0.8 + fs * 0.9;
      H = Math.round(top + lh * 2 + fs * 0.5 + fs * 0.9);
      var rows = [
        { k: "santa", text: "Santa", w: eS * fs },
        { k: "writes", text: "writes", w: eW * fs },
        { k: "think", text: "to think", w: eT * fs },
      ];
      rows.forEach(function (r, i) {
        r.x = (W - r.w) / 2;
        r.base = top + lh * i;
        L.items.push(r);
      });
    }
    L.fs = fs;
    L.H = H;
    return L;
  }

  // ───────────── shape targets: sample the upright words ─────────────
  function sampleTargets(L) {
    var c = mk(L.W * dpr, L.H * dpr);
    var g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.fillStyle = "#000";
    g.font = upFont(L.fs);
    L.items.forEach(function (it) {
      if (it.k !== "writes") g.fillText(it.text, it.x, it.base);
    });
    var data = g.getImageData(0, 0, c.width, c.height).data;
    var step = Math.max(4, L.fs / DENSITY);
    var out = [];
    // a square grid, no jitter: every shape has the same gutter around it
    for (var y = step / 2; y < L.H; y += step) {
      for (var x = step / 2; x < L.W; x += step) {
        var px = Math.floor(x * dpr);
        var py = Math.floor(y * dpr);
        if (data[(py * c.width + px) * 4 + 3] > 110) out.push(x, y);
      }
    }
    return { pts: out, step: step };
  }

  // ───────────── "writes", typed ─────────────
  // [delay since the previous keystroke in s, what the keystroke does]. The r → i reach is long,
  // and the first try lands on the u next to the i: pause, notice, backspace, retype.
  var KEYS = [
    [0, "w"], [0.17, "r"], [0.78, "u"], [0.62, "<"], [0.24, "i"], [0.16, "t"], [0.15, "e"], [0.13, "s"],
  ];
  function keyTimeline() {
    var t = T.penAt, out = [], text = "";
    KEYS.forEach(function (k) {
      t += k[0];
      if (k[1] === "<") BACK_AT = t;
      text = k[1] === "<" ? text.slice(0, -1) : text + k[1];
      out.push({ at: t, text: text });
    });
    return out;
  }
  var BACK_AT = 0; // when the u is erased
  var TYPED = keyTimeline();
  var TYPE_END = TYPED[TYPED.length - 1].at;

  function typedAt(tau) {
    var s = "", last = -1;
    for (var i = 0; i < TYPED.length; i++) if (tau >= TYPED[i].at) { s = TYPED[i].text; last = TYPED[i].at; }
    return { text: s, since: last < 0 ? 1e9 : tau - last };
  }

  function drawTyped(g, s, tau, done) {
    var it = s.L.items.filter(function (i) { return i.k === "writes"; })[0];
    var fs = s.L.fs * IT_SCALE;
    g.font = itFont(fs);
    g.textBaseline = "alphabetic";
    var st = done ? { text: it.text, since: 1e9 } : typedAt(tau);
    g.fillStyle = RED;
    g.fillText(st.text, it.x, it.base);
    // the caret: solid while keys are landing, then blinks and leaves once the word is finished
    var typing = tau < TYPE_END + 0.05;
    var blinkOn = typing || st.since < 0.35 || Math.floor((tau - TYPE_END) / 0.5) % 2 === 0;
    var show = !done && tau >= T.penAt - 0.4 && tau < TYPE_END + CARET_LINGER && blinkOn;
    if (show) {
      var x = it.x + g.measureText(st.text).width + fs * 0.04;
      g.fillRect(x, it.base - fs * 0.72, Math.max(2, fs * 0.045), fs * 0.9);
    }
  }


  // ───────────── the sketch ─────────────
  var canvas, ctx, state, raf = 0, t0 = 0;

  // every shape gets somewhere to roam from, a tumble, and a time to leave for its letter
  function reroll(s) {
    for (var i = 0; i < s.n; i++) {
      // hover in a loose cloud around the words rather than across the whole hero
      var f = s.L.fs * ROAM;
      s.hx[i] = clamp(s.tx[i] + (Math.random() + Math.random() - 1) * f * 1.1, 0, s.W);
      s.hy[i] = clamp(s.ty[i] + (Math.random() + Math.random() - 1) * f * 0.6, 0, s.H);
      s.ph[i] = Math.random() * 6.283;
      s.f1[i] = 0.35 + Math.random() * 0.5;
      s.f2[i] = 0.8 + Math.random() * 0.9;
      s.spin[i] = (Math.random() - 0.5) * 3;
      // roughly left to right, so the words assemble in reading order alongside the ink
      s.go[i] = (TYPE_END - T.penAt - T.fly) * (0.65 * (s.tx[i] / s.W) + 0.35 * Math.random());
      s.hx2[i] = clamp(s.tx[i] + (Math.random() + Math.random() - 1) * f * 1.1, 0, s.W);
      s.hy2[i] = clamp(s.ty[i] + (Math.random() + Math.random() - 1) * f * 0.6, 0, s.H);
    }
  }

  function build(W) {
    var L = layout(W);
    var tg = sampleTargets(L);
    var n = tg.pts.length / 2;
    var s = {
      L: L, W: W, H: L.H, n: n, step: tg.step,
      tx: new Float32Array(n), ty: new Float32Array(n),
      hx: new Float32Array(n), hy: new Float32Array(n), hx2: new Float32Array(n), hy2: new Float32Array(n),
      ph: new Float32Array(n), f1: new Float32Array(n), f2: new Float32Array(n),
      spin: new Float32Array(n), go: new Float32Array(n),
      size: new Float32Array(n), a: new Float32Array(n),
    };
    for (var i = 0; i < n; i++) {
      s.tx[i] = tg.pts[i * 2];
      s.ty[i] = tg.pts[i * 2 + 1];
      s.size[i] = tg.step * SIZE;
      s.a[i] = 1;
    }
    reroll(s);
    return s;
  }

  function drawShapes(g, s, tau, done) {
    var ax = s.L.fs * 0.14 * ROAM, ay = s.L.fs * 0.1 * ROAM;
    var fade = done ? 1 : clamp(tau / T.fadeIn, 0, 1);
    // the u → i correction: scatter to fresh spots and lose ground, then re-converge by the last key
    var m = done ? 0 : ease((tau - BACK_AT) / T.shuffle);
    var back = done || tau < BACK_AT ? 0 : 0.6 * ease((tau - BACK_AT) / 0.2) * (1 - ease((tau - BACK_AT) / (TYPE_END - BACK_AT)));
    var X = new Float32Array(s.n), Y = new Float32Array(s.n);
    for (var i = 0; i < s.n; i++) {
      var w = done ? 1 : easeInOut((tau - T.penAt - s.go[i]) / T.fly) * (1 - back);
      var x = s.tx[i], y = s.ty[i];
      if (w < 1) {
        var ph = s.ph[i];
        var hx = s.hx[i] + (s.hx2[i] - s.hx[i]) * m, hy = s.hy[i] + (s.hy2[i] - s.hy[i]) * m;
        var rx = hx + (Math.sin(tau * s.f1[i] + ph) + 0.5 * Math.sin(tau * s.f2[i] + ph * 2.1)) * ax;
        var ry = hy + (Math.cos(tau * s.f1[i] * 0.9 + ph * 1.7) + 0.5 * Math.cos(tau * s.f2[i] * 1.1 + ph * 2.3)) * ay;
        x = rx + (x - rx) * w;
        y = ry + (y - ry) * w;
      }
      X[i] = x;
      Y[i] = y;
    }
    g.globalAlpha = fade;
    // outline pass, then fill pass
    for (var pass = 0; pass < 2; pass++) {
      g.fillStyle = pass ? BLUE : RED;
      g.beginPath();
      for (i = 0; i < s.n; i++) {
        var r = s.size[i] / 2, ring = s.size[i] * RING / SIZE;
        var rad = pass ? r : r + ring;
        g.moveTo(X[i] + rad, Y[i]);
        g.arc(X[i], Y[i], rad, 0, 6.283);
      }
      g.fill();
    }
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.globalAlpha = 1;
  }

  // done: draw the finished hero, whatever tau says
  function render(tau, done) {
    var s = state, g = ctx;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, s.W, s.H);

    drawShapes(g, s, tau, done);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawTyped(g, s, tau, done);

    var end = TYPE_END + CARET_LINGER;
    return done || tau >= end;
  }

  function tick(now) {
    raf = 0;
    // the frame's timestamp can be a hair earlier than the performance.now() taken in start()
    if (render(Math.max(0, (now - t0) / 1000), false)) {
      render(0, true);
      replayBtn.classList.add("is-ready");
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (raf) cancelAnimationFrame(raf);
    reroll(state);
    replayBtn.classList.remove("is-ready");
    t0 = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function finishInstantly() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    render(0, true);
    replayBtn.classList.add("is-ready");
  }

  function currentWidth() {
    return Math.max(280, Math.round(host.clientWidth));
  }

  function applyPad() {
    // desktop only; the stacked mobile hero is already tight. The page has 24px of top padding.
    var land = document.querySelector(".landing");
    var L = state && state.L;
    var on = host.clientWidth >= 640 && L && L.inkTop !== undefined;
    host.style.marginTop = on ? GAP - 24 - L.inkTop + "px" : "";
    host.style.marginBottom = on ? GAP - (L.H - L.inkBottom) + "px" : "";
    if (land) land.style.marginTop = on ? "0" : "";
  }

  function rebuild(play) {
    var W = currentWidth();
    state = build(W);
    host.style.height = state.H + "px";
    canvas.width = Math.ceil(W * dpr);
    canvas.height = Math.ceil(state.H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = state.H + "px";
    applyPad();
    if (play && !reduce) start();
    else finishInstantly();
  }

  function boot() {
    canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    host.insertBefore(canvas, replayBtn);
    ctx = canvas.getContext("2d");
    rebuild(true);

    replayBtn.addEventListener("click", function () {
      if (state) start();
    });

    // Watch the hero itself, not the window: scrollbars and late layout shifts change
    // its width without a window resize, which left the word off-centre.
    // Height-only changes (phone URL bar) are ignored.
    var lastW = currentWidth();
    var timer;
    function onWidth() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (currentWidth() === lastW) return;
        lastW = currentWidth();
        rebuild(false);
      }, 200);
    }
    if (window.ResizeObserver) new ResizeObserver(onWidth).observe(host);
    else window.addEventListener("resize", onWidth);
  }

  // Wait for both hero fonts, but never hang the page on them
  var ready = false;
  function go() {
    if (ready) return;
    ready = true;
    boot();
  }
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load(upFont(100), "Santa to think"), document.fonts.load(itFont(100), "writes")]).then(go, go);
    setTimeout(go, 3000);
  } else go();
})();
