let font;
let points = [];
let r = 9;
let angle = 0.4;
let circles = [];
let numCircles = 60;
let circleRadius = 4;
let grassBlades = [];
let butterflies = [];

// Screenshot mode: visiting index.html?og=1 freezes the canvas a few
// frames after load — same drawing, just a single settled instant
// instead of continuous motion — so a share-card screenshot doesn't
// catch the mouse-follower gimmick sitting at the (nonexistent) cursor.
let ogCapture = false;

new p5((sketch) => {
  let papertexture;
  let startX, nameY;
  if (sketch.windowWidth < 1000) {
    startX = 12;
    nameY = sketch.windowHeight / 2.5;
  } else {
    startX = 150;
    nameY = sketch.windowHeight / 4;
  }
  const subtextGap = 60; // distance below the name baseline

  // Mobile (≤ 900px): the name stacks as San / trup / ti and a vertical
  // "brain chaos" slider runs down the right. Desktop gets the same
  // 9 A.M.–9 P.M. scale as a ruler across the top, driven by the cursor.
  const isMobile = sketch.windowWidth <= 900;
  const mobileLeft = 24;
  let mobileSubtextY = 0;
  let chaosEased = 0.5; // 0 = 9 A.M. (most chaos) … 1 = 9 P.M. (calm)

  // Dusk, 6–9 P.M.
  //  sky — how far along the sky gradient we are (golden hour → sunset →
  //        dusk → night). It lingers on the pretty light and dark ends but
  //        rushes through the mid-tones, where neither dark nor light
  //        text has enough contrast.
  //  ink — text flips dark → light inside that rush.
  let sky = 0;
  let ink = 0;
  let bugs = 0; // fireflies + stars in, butterflies out
  let heroMood = "";
  let nightLayer; // navy sky + vignette, pre-rendered once
  const FADE_START = 0.93; // sky melts into the cream page below from here

  // Sky keyframes along `sky`: [top, low (72%), horizon (92%)] colours.
  const SKY_KEYS = [
    {
      at: 0,
      cols: [
        [255, 250, 235],
        [255, 250, 235],
        [255, 250, 235],
      ],
    },
    {
      at: 0.3,
      cols: [
        [248, 222, 208],
        [252, 200, 160],
        [255, 186, 118],
      ],
    }, // golden hour
    {
      at: 0.5,
      cols: [
        [84, 70, 138],
        [176, 92, 124],
        [244, 140, 88],
      ],
    }, // sunset
    {
      at: 0.75,
      cols: [
        [30, 32, 76],
        [84, 58, 108],
        [160, 88, 92],
      ],
    }, // dusk
    {
      at: 1,
      cols: [
        [10, 18, 44],
        [10, 18, 44],
        [10, 18, 44],
      ],
    }, // About-page night
  ];
  let fireflies = [];
  let stars = [];

  // Night palette lifted from the About page (night.css / fireflies-gutter.js)
  const NIGHT = {
    sky: [10, 18, 44], // --night-base
    vignette: 0.72,
    ink: [232, 227, 211], // --night-ink
    amber: [255, 214, 120], // firefly colorA / --night-amber
    glow: [196, 255, 140], // firefly colorB
    grass: [44, 70, 52],
  };

  sketch.preload = function () {
    font = sketch.loadFont("assets/Manrope/static/Manrope-ExtraLight.ttf");
    jostfont = sketch.loadFont(
      "assets/Libre_Baskerville/static/LibreBaskerville-Italic.ttf",
    );
    chaosArrow = sketch.loadImage("assets/chaosarrow.svg");
    papertexture = sketch.loadImage("assets/bgtexturefinal.jpg");
  };

  sketch.setup = function () {
    let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvas.parent("p5jsholder");
    sketch.imageMode(sketch.CENTER);

    ogCapture = new URLSearchParams(window.location.search).get("og") === "1";

    if (isMobile) {
      layoutMobileName();
    } else {
      points = font.textToPoints(
        "Santrupti ",
        startX,
        nameY,
        sketch.windowWidth / 6,
        {
          sampleFactor: 0.5,
        },
      );
    }

    sketch.angleMode(sketch.DEGREES);
    buildNight();
    if (!ogCapture && window.chaosSlider) {
      window.chaosSlider.show();
      chaosEased = (window.chaosSlider.hour - 9) / 12; // no glide on load
    }

    grassBlades = [];
    if (sketch.windowWidth < 470) {
      clumpCount = 20;
    }
    if (sketch.windowWidth < 700) {
      clumpCount = 15;
    } else {
      clumpCount = 60;
    }
    for (let i = 0; i < clumpCount; i++) {
      let cx = sketch.random(sketch.windowWidth);
      let cy = sketch.random(
        sketch.windowHeight * 0.9,
        sketch.windowHeight - 10,
      );
      // each clump has 2-3 blades
      let bladeCount = sketch.floor(sketch.random(4, 12));
      for (let j = 0; j < bladeCount; j++) {
        grassBlades.push({
          x: cx + sketch.random(-18, 18),
          y: cy + sketch.random(-6, 6),
          h: sketch.random(28, 35),
          w: sketch.random(8, 10), // leaf width
          lean: sketch.random(-0.2, 0.2), // resting angle
          speed: sketch.random(0.1, 0.8),
          offset: sketch.random(200),
          noiseScale: sketch.random(0.9, 4), // edge texture roughness
        });
      }
    }
    if (sketch.windowWidth < 700) {
      butterflyCount = 4;
    } else {
      butterflyCount = 10;
    }
    for (let i = 0; i < butterflyCount; i++) {
      butterflies.push({
        x: sketch.random(sketch.windowWidth),
        y: sketch.random(sketch.windowHeight * 0.6, sketch.windowHeight * 1),
        speed: sketch.random(2, 6), // flight speed
        offset: sketch.random(100), // noise offset for unique path
        flapOffset: sketch.random(300), // wing flap phase
        flapSpeed: sketch.random(60, 100), // how fast wings beat
        size: sketch.random(8, 16), // body + wing size
        col: sketch.color(
          // wing colour — earthy tones
          sketch.random([
            sketch.color(233, 108, 26), // yellow
            sketch.color(233, 26, 78), // purple
          ]),
        ),
      });
    }
  };

  // Size the three lines so the widest ("trup") fills the space left of
  // the slider.
  function layoutMobileName() {
    const lines = ["san", "tru", "pti"];
    const sliderRoom = 100;
    const avail = sketch.windowWidth - mobileLeft - sliderRoom;
    const widest = Math.max(
      ...lines.map((l) => font.textBounds(l, 0, 0, 100).w),
    );
    const size = Math.min((avail / widest) * 100, sketch.windowHeight * 0.15);
    const lineHeight = size * 1.0;
    // Top-align "san" with the slider's 9 am mark (chaos-slider's top
    // padding in style.css — keep the two in sync).
    const top = 112;
    const firstBaseline = top + size * 0.74;

    points = [];
    lines.forEach((line, i) => {
      points.push(
        ...font.textToPoints(
          line,
          mobileLeft,
          firstBaseline + i * lineHeight,
          size,
          {
            sampleFactor: 0.5,
          },
        ),
      );
    });

    const blockBottom = firstBaseline + 2 * lineHeight;
    mobileSubtextY = blockBottom + 56;
  }

  // Night sky drawn once: flat navy, the About page's vignette, and a fade
  // to transparent over the bottom of the hero so it melts into the cream
  // page below instead of ending on a hard edge.
  function buildNight() {
    const w = sketch.windowWidth;
    const h = sketch.windowHeight;
    nightLayer = sketch.createGraphics(w, h);
    const ctx = nightLayer.drawingContext;
    ctx.fillStyle = `rgb(${NIGHT.sky})`;
    ctx.fillRect(0, 0, w, h);

    const vig = ctx.createRadialGradient(
      w / 2,
      h * 0.45,
      0,
      w / 2,
      h * 0.45,
      Math.max(w, h) * 0.7,
    );
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, `rgba(0,0,0,${NIGHT.vignette})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "destination-out";
    const fade = ctx.createLinearGradient(0, h * FADE_START, 0, h);
    [1, 0.8, 0.45, 0.15, 0].forEach((f, i) =>
      fade.addColorStop(i / 4, `rgba(0,0,0,${1 - f})`),
    );
    ctx.fillStyle = fade;
    ctx.fillRect(0, h * FADE_START, w, h * (1 - FADE_START));

    stars = [];
    for (let i = 0; i < (isMobile ? 36 : 70); i++) {
      stars.push({
        x: sketch.random(w),
        y: Math.pow(sketch.random(), 1.7) * h * 0.7, // packed toward the top
        r:
          sketch.random(0.45, 0.95) +
          (sketch.random() < 0.14 ? sketch.random(0.5, 1.1) : 0),
        spd: sketch.random(0.012, 0.06),
        phase: sketch.random(360),
        base: sketch.random(0.3, 0.95),
      });
    }

    fireflies = [];
    const n = isMobile ? 16 : 34;
    for (let i = 0; i < n; i++) {
      const depth = sketch.random();
      const home = sketch.createVector(
        sketch.random(20, w - 20),
        h * 0.3 + ((i + 0.5) / n) * h * 0.62 + sketch.random(-18, 18),
      );
      fireflies.push({
        pos: home.copy(),
        vel: p5.Vector.random2D().mult(sketch.random(0.2, 0.8)),
        home,
        depth,
        size: sketch.lerp(1.4, 4.6, depth) * (isMobile ? 0.75 : 1),
        tint: sketch.random(),
        phase: sketch.random(360),
        driftSpd: sketch.random(0.2, 0.5),
        blinkSpd: sketch.random(0.7, 2.6),
        blinkPhase: sketch.random(360),
      });
    }
  }

  // Same drift (Perlin flow + spring to a wandering home) and pow() blink
  // as the About page gutters. angleMode is DEGREES in this sketch.
  function drawNightSky() {
    const ctx = sketch.drawingContext;

    const w = sketch.windowWidth;
    const h = sketch.windowHeight;

    // the sky: three-stop vertical gradient, blended between keyframes
    let k = 0;
    while (k < SKY_KEYS.length - 2 && sky > SKY_KEYS[k + 1].at) k++;
    const a = SKY_KEYS[k];
    const b = SKY_KEYS[k + 1];
    const t = sketch.constrain((sky - a.at) / (b.at - a.at), 0, 1);
    const cols = a.cols.map((c, i) =>
      c.map((v, j) => Math.round(sketch.lerp(v, b.cols[i][j], t))),
    );
    const alpha =
      smooth(sky / 0.3) * sketch.lerp(0.85, 1, smooth((sky - 0.3) / 0.2));

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `rgba(${cols[0]}, ${alpha})`);
    grad.addColorStop(0.72, `rgba(${cols[1]}, ${alpha})`);
    grad.addColorStop(0.92, `rgba(${cols[2]}, ${alpha})`);
    // eased fade (not linear) so the melt into the page has no visible edge
    [1, 0.8, 0.45, 0.15, 0].forEach((f, i) => {
      grad.addColorStop(
        FADE_START + (i / 4) * (1 - FADE_START),
        `rgba(${cols[2]}, ${alpha * f})`,
      );
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // low sun: a soft glow on the horizon that swells, then sinks and fades
    const sun = Math.sin(Math.PI * smooth((sky - 0.1) / 0.6));
    if (sun > 0.01) {
      const sx = w * 0.72;
      const sy = h * sketch.lerp(0.7, 1.0, smooth((sky - 0.15) / 0.55));
      const glow = ctx.createRadialGradient(
        sx,
        sy,
        0,
        sx,
        sy,
        Math.max(w, h) * 0.55,
      );
      glow.addColorStop(0, `rgba(255, 214, 150, ${0.55 * sun})`);
      glow.addColorStop(0.35, `rgba(255, 170, 120, ${0.25 * sun})`);
      glow.addColorStop(1, "rgba(255, 150, 120, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    // last stretch: the About page's exact night sky + vignette
    ctx.save();
    ctx.globalAlpha = smooth((sky - 0.7) / 0.3);
    sketch.image(nightLayer, 0, 0);

    ctx.globalAlpha = bugs;
    sketch.blendMode(sketch.ADD);
    sketch.noStroke();
    for (const st of stars) {
      const tw =
        0.45 + 0.55 * sketch.sin(sketch.frameCount * st.spd * 57 + st.phase);
      const a = 255 * st.base * Math.max(tw, 0.08) * 0.55;
      sketch.fill(255, 255, 255, a * 0.16);
      sketch.circle(st.x, st.y, st.r * 6);
      sketch.fill(255, 255, 255, a);
      sketch.circle(st.x, st.y, st.r * 2);
    }

    const zt = sketch.frameCount * 0.0025;
    for (const f of fireflies) {
      const ang = sketch.noise(f.pos.x * 0.0014, f.pos.y * 0.0014, zt) * 720;
      const acc = p5.Vector.fromAngle(sketch.radians(ang)).mult(0.2);
      const t = sketch.frameCount * f.driftSpd;
      const hx = f.home.x + sketch.cos(t + f.phase) * 14;
      const hy = f.home.y + sketch.sin(t * 0.8 + f.phase * 1.7) * 14;
      acc.add(sketch.createVector(hx - f.pos.x, hy - f.pos.y).mult(0.008));
      f.vel.add(acc).limit(1.5);
      f.pos.add(f.vel);
      f.vel.mult(0.95);

      const pulse = Math.pow(
        0.5 + 0.5 * sketch.sin(sketch.frameCount * f.blinkSpd + f.blinkPhase),
        3,
      );
      const glow = sketch.lerp(0.18, 1, pulse) * sketch.lerp(0.45, 1, f.depth);
      const c = NIGHT.amber.map((v, k) =>
        sketch.lerp(v, NIGHT.glow[k], f.tint),
      );
      sketch.fill(c[0], c[1], c[2], 26 * glow);
      sketch.circle(f.pos.x, f.pos.y, f.size * 9);
      sketch.fill(c[0], c[1], c[2], 70 * glow);
      sketch.circle(f.pos.x, f.pos.y, f.size * 4);
      sketch.fill(c[0], c[1], c[2], 235 * glow);
      sketch.circle(f.pos.x, f.pos.y, f.size);
    }
    sketch.blendMode(sketch.BLEND);
    ctx.restore();
  }

  // day colour → night colour. Scenery follows the sky; words pass
  // `ink` so they flip in one quick, readable step.
  function dusk(day, nightCol, a, amt = sky) {
    const c = day.map((v, k) => sketch.lerp(v, nightCol[k], amt));
    return a === undefined ? c : [...c, a];
  }

  const smooth = (x) => {
    x = sketch.constrain(x, 0, 1);
    return x * x * (3 - 2 * x);
  };

  function updateTime() {
    const hour = window.chaosSlider ? window.chaosSlider.hour : 15;
    chaosEased = sketch.lerp(chaosEased, (hour - 9) / 12, 0.12);
    const d = smooth(chaosEased * 12 + 9 - 18); // 0 at 6 P.M. … 1 at 7 P.M. — Bangalore's sunset is quick
    sky =
      d < 0.5
        ? 0.43 * (d / 0.5)
        : d < 0.58
          ? 0.43 + 0.15 * ((d - 0.5) / 0.08)
          : 0.58 + 0.42 * ((d - 0.58) / 0.42);
    ink = smooth((sky - 0.46) / 0.08);
    bugs = smooth((sky - 0.45) / 0.35);

    // The contact bar and the slider follow along — but only while the
    // hero is on screen, since the contact bar is fixed over the cream page.
    const onHero = window.scrollY < sketch.windowHeight * 0.6;
    const mood = !onHero ? "" : ink > 0.5 ? "night" : sky > 0.08 ? "dusk" : "";
    if (mood !== heroMood) {
      document.body.classList.toggle("hero-night", mood === "night");
      document.body.classList.toggle("hero-dusk", mood === "dusk");
      heroMood = mood;
    }
  }

  // Soft halo behind words during dusk: cream behind dark type in the
  // golden hour, navy behind light type once it flips.
  function textHalo(on) {
    const ctx = sketch.drawingContext;
    if (!on || sky < 0.02 || sky > 0.98) {
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      return;
    }
    const strength = sketch.sin(sky * 180);
    ctx.shadowBlur = 10;
    ctx.shadowColor =
      ink < 0.5
        ? `rgba(255, 246, 228, ${0.85 * strength})`
        : `rgba(10, 18, 44, ${0.75 * strength})`;
  }

  sketch.draw = function () {
    r = sketch.lerp((sketch.windowWidth + 7) / 80, 0.09, chaosEased);
    // Draw paper texture as background instead of clear()
    sketch.clear();
    sketch.push();
    sketch.imageMode(sketch.CORNER);
    sketch.blendMode(sketch.MULTIPLY);
    sketch.image(papertexture, 0, 0, sketch.windowWidth, sketch.windowHeight);
    sketch.background(255, 252, 237);

    // slider hour → chaos: morning is wild, evening settles down, and
    // 6–9 P.M. fades into night. Eased so a flick of the thumb glides.
    if (!ogCapture) updateTime();
    sketch.blendMode(sketch.BLEND);
    if (sky > 0.001) drawNightSky();
    sketch.pop();

    for (let b of grassBlades) {
      let t = sketch.frameCount * 0.007 * b.speed;
      let sway = (sketch.noise(b.offset + t) - 0.5) * 22;
      let totalLean = b.lean + sway / b.h;

      let rootX = b.x;
      let rootY = b.y;
      let tipX = rootX - totalLean * b.h;
      let tipY = rootY - b.h;

      // perpendicular offset for leaf width
      let dx = tipX - rootX;
      let dy = tipY - rootY;
      let len = sketch.sqrt(dx * dx + dy * dy);
      let px = (-dy / len) * b.w * 0.5; // perpendicular x
      let py = (dx / len) * b.w * 0.5; // perpendicular y

      sketch.noStroke();
      // sketch.stroke(121, 146, 66);
      sketch.strokeWeight(0.3);
      sketch.fill(...dusk([207, 218, 170], NIGHT.grass));
      // sketch.noFill();
      sketch.beginShape();

      // left edge — root to tip with noise texture
      sketch.vertex(rootX - px * 0.3, rootY);
      let steps = 100;
      for (let s = 1; s <= steps; s++) {
        let frac = (s * 4) / steps;
        let taper = 0.2 - frac;
        let ex = rootX + dx * frac + px * taper;
        let ey = rootY + dy * frac + py * taper;

        // static noise — no t, so texture is frozen to the blade shape
        let grain =
          (sketch.noise(b.offset + s * 0.55, b.offset * 0.3) - 0.5) * 4 * taper;

        sketch.vertex(ex + grain, ey + grain * 0.4);
      }

      // sharp tip
      sketch.vertex(tipX, tipY);

      // right edge
      for (let s = steps; s >= 1; s--) {
        let frac = s / steps;
        let taper = frac;
        let ex = rootX + dx * frac - px * taper;
        let ey = rootY + dy * frac - py * taper;

        // different offset so left/right edges are independently textured
        let grain =
          (sketch.noise(b.offset + 200 + s * 0.55, b.offset * 0.3) - 0.5) *
          4 *
          taper;

        sketch.vertex(ex + grain, ey + grain * 0.4);
      }
      sketch.vertex(rootX + px * 0.3, rootY);
      sketch.endShape(sketch.CLOSE);

      // white dots along the blade center line
      let dotCount = 5;
      for (let d = 1; d <= dotCount; d++) {
        let frac = d - 2 / dotCount;

        // same quadratic lerp as the bow curve — follow the blade center
        let bx = sketch.lerp(
          sketch.lerp(rootX, rootX + dx * 0.35, frac),
          sketch.lerp(rootX + dx * 0.5, tipX, frac),
          frac,
        );
        let by = sketch.lerp(
          sketch.lerp(rootY, rootY + dy * 0.5, frac),
          sketch.lerp(rootY + dy * 0.5, tipY, frac),
          frac,
        );

        let taper = frac; // dots shrink toward tip
        let dotSize = b.w * 0.14 * taper; // scale dot to blade width

        sketch.noStroke();
        sketch.fill(...dusk([227, 27, 27], NIGHT.amber, 80)); // red, slightly transparent — amber seeds at night
        sketch.ellipse(bx, by, dotSize, dotSize);
      }
    }

    // butterflies — they fade out as night comes in; fireflies take over
    sketch.drawingContext.save();
    sketch.drawingContext.globalAlpha = 1 - bugs;
    for (let bf of butterflies) {
      if (bugs > 0.999) break;
      let t = sketch.frameCount * 0.006 * bf.speed;

      // wander path — noise drives x and y independently
      bf.x += (sketch.noise(bf.offset + t) - 0.5) * 3;
      bf.y += (sketch.noise(bf.offset + t + 50) - 0.5) * 1.5;

      // wrap around edges
      if (bf.x < -20) bf.x = sketch.windowWidth + 20;
      if (bf.x > sketch.windowWidth + 20) bf.x = -20;
      if (bf.y < 0) bf.y = sketch.windowHeight * 0.8;
      if (bf.y > sketch.windowHeight) bf.y = 10;

      // flap angle — cosine gives natural easing at top/bottom
      let flap = sketch.cos(
        (sketch.frameCount * bf.flapSpeed + bf.flapOffset) * 0.08,
      );
      let wingOpen = sketch.abs(flap); // 0 = closed, 1 = fully open

      sketch.push();
      sketch.translate(bf.x, bf.y);

      // tilt body slightly in direction of travel
      let drift = sketch.noise(bf.offset + t) - 0.5;
      sketch.rotate(drift * 0.4);

      // upper wings — larger, main colour
      for (let side of [-1, 1]) {
        sketch.push();
        sketch.scale(side, 1);

        let wx = bf.size * wingOpen * 1.2; // wing spread
        let wy = bf.size * 0.4;

        sketch.noStroke();
        sketch.fill(bf.col);
        sketch.beginShape();
        sketch.vertex(0, 0);
        sketch.bezierVertex(
          wx * 0.2,
          -wy * 1, // pull hard upward
          wx * 0.8,
          -wy * 1.2, // tip control
          wx * 0.7,
          -wy * 1.3,
        );
        sketch.bezierVertex(wx * 0.6, wy * 0.5, wx * 0.2, wy * 0.2, 0, 0);
        sketch.endShape(sketch.CLOSE);

        // lower wings — smaller
        sketch.fill(
          sketch.red(bf.col),
          sketch.green(bf.col),
          sketch.blue(bf.col),
          180,
        );
        sketch.beginShape();
        sketch.vertex(0, 0);
        sketch.bezierVertex(
          wx * 0.3,
          wy * 0.3,
          wx * 0.7,
          wy * 1,
          wx * 0.5,
          wy * 0.9,
        );
        sketch.bezierVertex(wx * 0.2, wy * 0.8, wx * 0.05, wy * 0.5, 0, 0);
        sketch.endShape(sketch.CLOSE);
        sketch.strokeWeight(0.5);
        sketch.noFill();
        sketch.line(0, 0, wx * 0.7, -wy * 0.1);
        sketch.line(0, 0, wx * 0.5, wy * 0.6);
        sketch.pop();
      }

      // body
      sketch.noStroke();
      sketch.fill(40, 28, 15);
      sketch.ellipse(0, bf.size * 0.2, bf.size * 0.18, bf.size * 0.35);

      sketch.pop();
    }
    sketch.drawingContext.restore();

    // 3. A wobbly vertical line hangs from the mood pill on the top ruler.
    const ruler = !isMobile && window.chaosSlider && window.chaosSlider.geom();
    if (ruler && !ogCapture) {
      const seekX = sketch.lerp(ruler.left, ruler.right, chaosEased);
      sketch.push();
      sketch.stroke(
        ...dusk([204, 218, 165], [255, 214, 120], 150 - 60 * ink, ink),
      );
      sketch.strokeWeight(1);
      for (let y = ruler.bottom + 8; y < sketch.windowHeight; y += 2) {
        let wobble = sketch.noise(y * 0.5, sketch.frameCount * 0.001) * 4 - 2; // ±2px jitter
        sketch.point(seekX + wobble, y);
      }
      sketch.line(seekX, ruler.bottom + 8, seekX, sketch.windowHeight);
      sketch.pop();
    }
    // -------------------------------------------------------

    sketch.stroke(17, 17, 17);
    sketch.fill(...dusk([17, 17, 17], NIGHT.ink, undefined, ink));
    sketch.noStroke();
    sketch.textFont(jostfont);
    textHalo(true);
    if (isMobile) {
      sketch.textSize(16);
      sketch.textLeading(24);
      sketch.text(
        sketch.windowWidth < 432
          ? "\nproduct designer, \ncoder, systems thinker"
          : "product designer, coder, systems thinker",
        mobileLeft,
        mobileSubtextY,
      );
    } else if (sketch.windowWidth < 432) {
      sketch.textSize(16);
      sketch.text(
        " is a product designer that loves \n data, systems & people",
        startX + 40,
        nameY + 32 + subtextGap,
      );
    } else if (sketch.windowWidth < 900 && sketch.windowWidth > 432) {
      sketch.textSize(16);
      sketch.text(
        " product designer, coder, systems thinker",
        startX + 40,
        nameY + 32 + subtextGap,
      );
    } else {
      sketch.textSize(24);
      sketch.text(
        " product designer, coder, systems thinker",
        startX + 40,
        nameY + 240 + subtextGap,
      );
    }

    textHalo(false);
    sketch.stroke(20, 52, 17);
    sketch.strokeWeight(0.2);

    // name dots: green that deepens through the golden hour for contrast
    // against the warm sky, then flips to firefly amber with the other words
    const nameDay = dusk(
      [35, 90, 30],
      [22, 56, 20],
      undefined,
      smooth(sky / 0.4),
    );
    const nameCol = dusk(nameDay, NIGHT.amber, undefined, ink);

    if (!isMobile) {
      let sizeJitter;

      for (let i = 0; i < points.length; i++) {
        // existing wiggle
        let x = points[i].x + 50 + r * sketch.sin(angle + i * 0.4);
        let y = points[i].y + 220 + r * sketch.cos(angle + i * 0.4);

        // noise-based texture layer
        let n = sketch.noise(i * 10, sketch.frameCount * 0.0008); // slow, per-point noise
        sizeJitter = sketch.map(n, 0, 1, 1, 25);
        let xJitter = sketch.map(sketch.noise(i * 0.15, 99), 0, 1, -2, 2); // x scatter
        let yJitter = sketch.map(sketch.noise(i * 0.15, 77), 0, 1, -2, 2); // y scatter
        let alphaJitter = sketch.map(n, 0, 1, 160, 255); // vary opacity

        sketch.fill(...nameCol, alphaJitter);
        sketch.ellipse(x + xJitter, y + yJitter, sizeJitter, sizeJitter);
      }
      angle += 20;
    } else {
      let wiggle = sketch.lerp(11, 0.6, chaosEased);
      let maxDot = sketch.lerp(15, 9, chaosEased);

      for (let i = 0; i < points.length; i++) {
        let x = points[i].x + wiggle * sketch.sin(angle + i * 1);
        let y = points[i].y + wiggle * sketch.cos(angle + i * 3);

        // noise-based texture layer
        let n = sketch.noise(i * 10, sketch.frameCount * 0.0008); // slow, per-point noise
        let sizeJitter = sketch.map(n, 0, 1, 1, maxDot);
        let xJitter = sketch.map(sketch.noise(i * 0.15, 99), 0, 1, -2, 2); // x scatter
        let yJitter = sketch.map(sketch.noise(i * 0.15, 77), 0, 1, -2, 2); // y scatter
        let alphaJitter = sketch.map(n, 0, 1, 160, 255); // vary opacity

        sketch.fill(...nameCol, alphaJitter);
        sketch.ellipse(x + xJitter, y + yJitter, sizeJitter, sizeJitter);
      }
      angle += sketch.lerp(14, 3, chaosEased);
    }

    // og=1 capture mode: let a few frames of setup settle — fonts, the
    // background texture, grass and butterflies all in their drawn state —
    // then stop. One clean instant instead of continuous motion.
    if (ogCapture && sketch.frameCount >= 25) {
      sketch.noLoop();
    }
  };
});
