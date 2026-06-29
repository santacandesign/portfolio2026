/* ================================================================
   gallery-tree.js  —  flower garden
   One flower per polaroid. Petals and centre use Canvas 2D
   gradients drawn via ctx directly — p5's endShape() resets
   fillStyle before calling fill(), which kills gradients, so
   we skip p5's shape pipeline for anything gradient-filled.
   ================================================================ */

new p5(function (p) {

  /* ── state ─────────────────────────────────────────────────── */
  let flowers     = [];
  let photoColors = [];    // photoColors[i] = ["rgb(…)",…] per photo
  let N           = 0;

  let windT   = 0;
  let bloomT  = 0;
  let bloomed = false;

  const FALLBACK = [
    ['#d4956a','#f2c98b','#fff3c4'],
    ['#a8c97a','#d4e89a','#f5f5dc'],
    ['#8fb8d4','#b8d4e8','#e8f4f8'],
    ['#c97ab8','#e8a8d4','#fce4f5'],
  ];

  /* ── setup ─────────────────────────────────────────────────── */
  p.setup = function () {
    const wrap = document.getElementById('treeCanvasWrap');
    const W    = wrap ? wrap.offsetWidth : p.windowWidth;
    const H    = Math.round(Math.min(560, p.windowHeight * 0.60));
    const cnv  = p.createCanvas(W, H);
    if (wrap) cnv.parent('treeCanvasWrap');
    cnv.style('display', 'block');
    cnv.style('pointer-events', 'none');
    p.frameRate(30);
    p.colorMode(p.RGB, 255);
    N = window.TREE_PHOTOS ? window.TREE_PHOTOS.length : 66;
    buildLayout(W, H, N);
    watchSection();
  };

  /* ── layout ─────────────────────────────────────────────────── */
  function buildLayout(W, H, count) {
    flowers = [];
    const ground = H - 18;
    for (let i = 0; i < count; i++) {
      const h1 = fract(Math.sin(i * 127.1 + 1) * 43758.5);
      const h2 = fract(Math.sin(i * 251.3 + 2) * 31415.9);
      const h3 = fract(Math.sin(i * 317.1 + 3) * 88888.8);
      const h4 = fract(Math.sin(i * 419.2 + 4) * 12345.6);
      const h5 = fract(Math.sin(i * 571.3 + 5) * 56789.0);
      const h6 = fract(Math.sin(i * 631.7 + 6) * 99999.1);

      const slotW  = W / count;
      const x      = slotW * (i + 0.5) + (h1 - 0.5) * slotW * 0.7;
      const sz     = 0.55 + h3 * 0.65;                   // 0.55–1.20
      const stemH  = (0.12 + h2 * 0.28) * (H - 30);    // 12%–40% of height
      const nPetal = 5 + Math.floor(h4 * 3);
      const rot0   = h5 * p.TWO_PI;
      const phase  = h6 * p.TWO_PI;
      const delay  = (i / count) * 0.45;

      flowers.push({ x, ground, stemH, sz, nPetal, rot0, phase, delay, idx: i });
    }
  }

  /* ── bloom trigger ──────────────────────────────────────────── */
  function watchSection() {
    const sec = document.getElementById('treeSection');
    if (!sec) { bloomed = true; return; }
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !bloomed) {
        bloomed = true; obs.disconnect();
      }
    }, { threshold: 0.10 });
    obs.observe(sec);
  }

  /* ── draw ──────────────────────────────────────────────────── */
  p.draw = function () {
    p.clear();
    windT += 0.018;   // constant, always-on speed
    if (bloomed && bloomT < 1) bloomT = Math.min(1, bloomT + 0.006);

    // Taller stems drawn first so shorter ones sit in front
    const sorted = [...flowers].sort((a, b) => b.stemH - a.stemH);
    for (const fl of sorted) {
      const localBloom = easeOut(
        Math.max(0, Math.min(1, (bloomT - fl.delay) / (1 - fl.delay + 0.001)))
      );
      drawFlower(fl, localBloom);
    }
  };

  /* ── flower ─────────────────────────────────────────────────── */
  function drawFlower(fl, bloom) {
    if (bloom <= 0.005) return;

    // Constant layered sway — two sine waves at different frequencies
    // so every flower moves continuously with its own rhythm
    const sway = Math.sin(windT * 1.55 + fl.phase)       * 0.10
               + Math.sin(windT * 2.80 + fl.phase * 1.7) * 0.038;

    const tipX = fl.x      + Math.sin(sway) * fl.stemH * bloom;
    const tipY = fl.ground - fl.stemH * bloom;

    /* ── Stem — p5 is fine here, no gradient ───────────────── */
    p.noFill();
    p.stroke(52, 98, 34, 200);
    p.strokeWeight(Math.max(0.8, 1.5 * fl.sz));
    p.beginShape();
    p.vertex(fl.x, fl.ground);
    p.bezierVertex(
      fl.x  + Math.sin(sway) * fl.stemH * 0.25 * bloom,
      fl.ground - fl.stemH * 0.35 * bloom,
      tipX  - Math.sin(sway) * fl.stemH * 0.12 * bloom,
      tipY  + fl.stemH * 0.28 * bloom,
      tipX, tipY
    );
    p.endShape();

    /* ── Leaf ───────────────────────────────────────────────── */
    if (fl.stemH * bloom > 35) {
      const lx   = p.lerp(fl.x, tipX, 0.40);
      const ly   = fl.ground - fl.stemH * 0.40 * bloom;
      const side = fract(Math.sin(fl.idx * 631.1) * 11111.1) > 0.5 ? 1 : -1;
      drawLeaf(lx, ly, side, fl.sz * bloom * 0.85);
    }

    /* ── Colours ─────────────────────────────────────────────── */
    const cols    = photoColors[fl.idx];
    const hasCols = cols && cols.length >= 2;
    const fb      = FALLBACK[fl.idx % FALLBACK.length];
    const c0 = hasCols ? p.color(cols[0]) : p.color(fb[0]);
    const c1 = hasCols ? p.color(cols[1]) : p.color(fb[1]);
    const c2 = hasCols && cols[2] ? p.color(cols[2]) : p.color(fb[2]);

    const petalLen = 20 * fl.sz * bloom;
    const petalWid = 11 * fl.sz * bloom;
    const centreR  =  5 * fl.sz * bloom;

    /* ── All gradient drawing via raw ctx ────────────────────
       p5's endShape() resets drawingContext.fillStyle to its
       own stored colour just before fill(), killing any gradient
       set via drawingContext.fillStyle. Bypassing p5 entirely
       for these shapes lets gradients through correctly.      */
    const ctx = p.drawingContext;

    ctx.save();
    ctx.translate(tipX, tipY);
    ctx.rotate(sway);

    /* Petals */
    for (let j = 0; j < fl.nPetal; j++) {
      ctx.save();
      ctx.rotate(fl.rot0 + (j / fl.nPetal) * Math.PI * 2);

      // Tip colour: mix photo colour with a natural leaf-green
      // so the outer edge of every petal has a botanical feel
      const GREEN  = { r: 72, g: 130, b: 52 };
      const tipR   = Math.round(p.red(c2)   * 0.55 + GREEN.r * 0.45);
      const tipG   = Math.round(p.green(c2) * 0.55 + GREEN.g * 0.45);
      const tipB   = Math.round(p.blue(c2)  * 0.55 + GREEN.b * 0.45);

      const grad = ctx.createLinearGradient(0, 0, 0, -petalLen);
      grad.addColorStop(0.00, toRgba(c0, 0.93));
      grad.addColorStop(0.55, toRgba(c1, 0.88));
      grad.addColorStop(1.00, `rgba(${tipR},${tipG},${tipB},0.82)`);

      ctx.fillStyle   = grad;
      ctx.strokeStyle = toRgba(darken(c0, 0.62), 0.40);
      ctx.lineWidth   = 0.6 * fl.sz;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -petalWid * 0.50, -petalLen * 0.20,
        -petalWid * 0.55, -petalLen * 0.70,
         0,               -petalLen
      );
      ctx.bezierCurveTo(
         petalWid * 0.55, -petalLen * 0.70,
         petalWid * 0.50, -petalLen * 0.20,
         0,                0
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    /* Centre disc */
    const rg = ctx.createRadialGradient(
      -centreR * 0.28, -centreR * 0.28, 0,
       0, 0, centreR * 1.1
    );
    rg.addColorStop(0.0, toRgba(lighten(c2, 1.40), 1.0));
    rg.addColorStop(0.6, toRgba(c2,                1.0));
    rg.addColorStop(1.0, toRgba(darken(c2, 0.55),  1.0));

    ctx.fillStyle   = rg;
    ctx.strokeStyle = toRgba(darken(c2, 0.50), 0.80);
    ctx.lineWidth   = 0.8 * fl.sz;
    ctx.beginPath();
    ctx.arc(0, 0, centreR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /* ── stem leaf ──────────────────────────────────────────────── */
  function drawLeaf(x, y, dir, sz) {
    const len = 9 * sz, wid = 4.5 * sz;
    const ctx = p.drawingContext;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(dir * 0.65);
    ctx.fillStyle   = 'rgba(52,98,34,0.68)';
    ctx.strokeStyle = 'none';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(dir * wid, -len * 0.28, dir * wid * 0.7, -len * 0.78, 0, -len);
    ctx.bezierCurveTo(0, -len * 0.78, 0, -len * 0.28, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /* ── colour helpers ─────────────────────────────────────────── */
  function toRgba(col, a) {
    return `rgba(${Math.round(p.red(col))},${Math.round(p.green(col))},${Math.round(p.blue(col))},${a})`;
  }
  function darken(col, f) {
    return p.color(p.red(col) * f, p.green(col) * f, p.blue(col) * f);
  }
  function lighten(col, f) {
    return p.color(
      Math.min(255, p.red(col) * f),
      Math.min(255, p.green(col) * f),
      Math.min(255, p.blue(col) * f)
    );
  }
  function fract(n) { return n - Math.floor(n); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* ── external API ───────────────────────────────────────────── */
  window.__setPhotoColors = function (colsArr) {
    photoColors = colsArr || [];
    if (!bloomed) bloomed = true;
  };
  window.__setMasterPalette = function () {};

  /* ── resize ─────────────────────────────────────────────────── */
  p.windowResized = function () {
    const wrap = document.getElementById('treeCanvasWrap');
    const W    = wrap ? wrap.offsetWidth : p.windowWidth;
    const H    = Math.round(Math.min(560, p.windowHeight * 0.60));
    p.resizeCanvas(W, H);
    buildLayout(W, H, N);
  };
});
