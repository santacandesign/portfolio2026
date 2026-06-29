// leaf-sketch.js — p5.js wind-blown leaves
// Uses instance mode to avoid polluting the global namespace (keeps MapLibre happy)

new p5(function (p) {
  const LEAF_COUNT = 28;
  const leaves = [];
  let windT = 0; // Perlin noise time for wind
  let gustT = 0;
  let gustAmt = 0;

  // ─── setup ─────────────────────────────────────────────────────
  p.setup = function () {
    const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.position(0, 0);
    cnv.style("pointer-events", "none");
    cnv.style("position", "fixed");
    cnv.style("z-index", "5");
    // Fade leaves out toward the centre — only visible along edges
    const mask =
      "radial-gradient(ellipse 58% 52% at 50% 50%, transparent 22%, black 72%)";
    cnv.style("mask-image", mask);
    cnv.style("-webkit-mask-image", mask);
    p.frameRate(30);

    for (let i = 0; i < LEAF_COUNT; i++) {
      leaves.push(new Leaf(true)); // true = scatter across screen on init
    }
  };

  // ─── draw ──────────────────────────────────────────────────────
  p.draw = function () {
    if (window.__mapMoving) return; // yield completely during map pan/fly
    p.clear();

    windT += 0.05;
    gustT += 0.011;

    // Gust system — occasional bursts of stronger wind
    if (p.noise(gustT * 0.22) > 0.67) {
      gustAmt = p.lerp(gustAmt, p.noise(gustT) * 8, 0.055);
    } else {
      gustAmt = p.lerp(gustAmt, 0, 0.028);
    }

    const windStr = p.map(p.noise(windT), 0, 1, 1, 3) + gustAmt;
    const windDrift = p.map(p.noise(windT + 77), 0, 1, -0.24, 0.24);

    // Shared sway signal — all leaves feel the same wind pulse at the same time
    const windSway = p.sin(windT * 4.5) * windStr;

    for (const leaf of leaves) {
      leaf.update(windStr, windDrift, windSway);
      leaf.render();
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  // ─── Leaf ──────────────────────────────────────────────────────
  class Leaf {
    constructor(scatter = false) {
      this.nOff = p.random(10000); // unique Perlin offset per leaf
      this.reset(scatter);
    }

    reset(scatter = false) {
      // scatter=true: anywhere on screen (initial seed)
      // scatter=false: enter from left edge carried by wind
      if (scatter) {
        this.x = p.random(-60, p.width + 60);
        this.y = p.random(-30, p.height + 30);
      } else {
        this.x = p.random(-110, -12);
        this.y = p.random(-20, p.height + 20);
      }

      this.sz = p.random(15, 35); // half-height of leaf blade

      // Three shape types: narrow / typical / broad
      const t = p.floor(p.random(3));
      this.asp =
        t === 0
          ? p.random(0.26, 0.36) // narrow (like willow)
          : t === 1
            ? p.random(0.4, 0.55) // typical ovate
            : p.random(0.58, 0.74); // broad / rounded

      this.rot = p.random(p.TWO_PI);
      this.rotV = p.random(-0.003, 0.003); // very slow base drift
      this.swayAmp = p.random(0.1, 0.26); // how far it rocks in wind
      this.flutPh = p.random(p.TWO_PI); // flutter / sway phase
      this.flutSpd = p.random(0.032, 0.075); // sway oscillation speed
      this.flutAmp = p.random(0.02, 0.14); // subtle shading wobble
      this.crimp = p.random(-0.14, 0.14); // permanent crinkle / pre-bend

      this.vx = p.random(0.35, 1.05);
      this.vy = p.random(-0.28, 0.28);

      // ── Colour: rich forest greens, a touch of variation ──
      p.colorMode(p.HSB, 360, 100, 100, 255);
      const hue = p.random(88, 150); // green hue band
      const sat = p.random(35, 78);
      const bri = p.random(20, 58);
      const alph = p.random(150, 210);
      // colA = lit side, colB = shadow side (darker/more saturated)
      this.colA = p.color(hue, sat, bri, alph);
      this.colB = p.color(hue - 12, sat + 14, bri - 15, alph);
      this.colV = p.color(hue - 18, sat + 8, bri - 24, 165); // vein colour
      p.colorMode(p.RGB, 255);
    }

    update(wind, drift, windSway) {
      this.flutPh += this.flutSpd;
      // Shared wind sway: all leaves tilt together with the same pulse
      // Small personal flutter on top so they don't look mechanical
      const sharedSway = windSway * this.swayAmp * 0.09;
      const personalVar = p.sin(this.flutPh) * this.swayAmp * 0.02;
      this.rot += this.rotV + sharedSway + personalVar;

      // Organic drift via Perlin noise
      const nx = p.noise(this.nOff, windT * 0.85);
      const ny = p.noise(this.nOff + 888, windT * 0.85);
      this.vx += p.map(nx, 0, 1, -0.035, 0.12) * wind;
      this.vy += p.map(ny, 0, 1, -0.07, 0.07);
      this.vy += 0.017; // soft gravity pulls down gently
      this.vx += drift * 0.075;

      this.vx *= 0.974;
      this.vy *= 0.974;

      this.x += this.vx * wind;
      this.y += this.vy;

      // Off screen → re-enter from left
      if (this.x > p.width + 90 || this.y > p.height + 90 || this.y < -90) {
        this.reset(false);
      }
    }

    render() {
      const s = this.sz;
      const w = s * this.asp;
      const bend = this.crimp + p.sin(this.flutPh) * this.flutAmp;

      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.rot);

      // ── Full leaf blade — single unified shape ─────────────
      p.fill(this.colA);
      p.noStroke();
      p.beginShape();
      p.vertex(0, -s); // tip
      // left side tip → base
      p.bezierVertex(-w * 0.28, -s * 0.52, -w, -s * 0.04, -w * 0.88, s * 0.24);
      p.bezierVertex(-w * 0.72, s * 0.64, -w * 0.13, s * 0.93, 0, s);
      // right side base → tip
      p.bezierVertex(
        w * 0.13,
        s * 0.93,
        w * 0.72,
        s * 0.64,
        w * 0.88,
        s * 0.24,
      );
      p.bezierVertex(w, -s * 0.04, w * 0.28, -s * 0.52, 0, -s);
      p.endShape(p.CLOSE);

      // ── Shadow half — gives fold depth without splitting the shape ──
      // Which half is darker depends on crimp direction
      const shadeSide = bend >= 0 ? 1 : -1;
      const shadowAlpha = p.map(p.abs(bend), 0, 0.3, 8, 45);
      p.fill(0, 0, 0, shadowAlpha);
      p.noStroke();
      p.beginShape();
      p.vertex(0, -s);
      p.bezierVertex(
        shadeSide * w * 0.28,
        -s * 0.52,
        shadeSide * w,
        -s * 0.04,
        shadeSide * w * 0.88,
        s * 0.24,
      );
      p.bezierVertex(
        shadeSide * w * 0.72,
        s * 0.64,
        shadeSide * w * 0.13,
        s * 0.93,
        0,
        s,
      );
      p.endShape(p.CLOSE); // closes straight back up the midrib

      // ── Midrib — gentle curve suggests the cup of the leaf ──
      p.noFill();
      p.stroke(this.colV);
      p.strokeWeight(0.85);
      p.beginShape();
      p.curveVertex(0, -s * 1.1);
      p.curveVertex(0, -s);
      p.curveVertex(bend * s * 0.18, 0);
      p.curveVertex(0, s);
      p.curveVertex(0, s * 1.1);
      p.endShape();

      // ── Lateral veins ──────────────────────────────────────
      p.strokeWeight(0.44);
      for (let i = 1; i <= 4; i++) {
        const t = i / 5;
        const vy = p.lerp(-s * 0.66, s * 0.52, t);
        const vl = p.sin(p.PI * t) * w * 0.8;
        p.line(0, vy, -vl, vy + vl * 0.3);
        p.line(0, vy, vl, vy + vl * 0.3);
      }

      p.pop();
    }
  }
});
