let font;
let points = [];
let r = 9;
let angle = 0.4;
let circles = [];
let numCircles = 60;
let circleRadius = 4;
let grassBlades = [];

new p5((sketch) => {
  let papertexture;
  let startX, nameY;
  if (sketch.windowWidth < 1000) {
    startX = 12;
    nameY = sketch.windowHeight / 2.5;
  } else {
    startX = 150;
    nameY = sketch.windowHeight / 3;
  }
  const subtextGap = 60; // distance below the name baseline

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

    points = font.textToPoints(
      "Santrupti ",
      startX,
      nameY,
      sketch.windowWidth / 8,
      {
        sampleFactor: 0.5,
      },
    );

    sketch.angleMode(sketch.DEGREES);

    grassBlades = [];
    if (sketch.windowWidth < 470) {
      clumpCount = 50;
    } else {
      clumpCount = 100;
    }
    for (let i = 0; i < clumpCount; i++) {
      let cx = sketch.random(sketch.windowWidth);
      let cy = sketch.random(
        sketch.windowHeight * 0.05,
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
          lean: sketch.random(-0.6, 0.6), // resting angle
          speed: sketch.random(1, 2),
          offset: sketch.random(200),
          noiseScale: sketch.random(0.9, 4), // edge texture roughness
        });
      }
    }
  };

  sketch.draw = function () {
    r = (sketch.windowWidth - sketch.mouseX + 7) / 80;
    // Draw paper texture as background instead of clear()
    sketch.clear();
    sketch.push();
    sketch.imageMode(sketch.CORNER);
    sketch.blendMode(sketch.MULTIPLY);
    sketch.image(papertexture, 0, 0, sketch.windowWidth, sketch.windowHeight);
    sketch.background(255, 252, 237);
    sketch.pop();

    let hourVal = sketch.map(sketch.mouseX, 0, sketch.windowWidth, 9, 21);
    let floorHour = sketch.floor(hourVal);

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
      sketch.fill(207, 218, 170);
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
        sketch.fill(227, 27, 27, 80); // red, slightly transparent
        sketch.ellipse(bx, by, dotSize, dotSize);
      }
    }

    // 2. Format the time string (converting 24h to 12h format)
    let suffix = floorHour >= 12 ? " P.M." : " A.M.";
    let displayHour = floorHour > 12 ? floorHour - 12 : floorHour;
    let timeString = displayHour + suffix;

    // 3. Draw the Label and Background
    // Draw a vertical line at the cursor's Y position
    sketch.push();
    sketch.stroke(82, 43, 18);
    sketch.strokeWeight(2);

    if (sketch.windowWidth > 1000) {
      for (let y = 0; y < sketch.windowHeight; y += 2) {
        let wobble = sketch.noise(y * 0.5, sketch.frameCount * 0.001) * 4 - 2; // ±2px jitter
        sketch.point(sketch.mouseX + wobble, y);
      }

      sketch.line(sketch.mouseX, 0, sketch.mouseX, sketch.windowHeight);
    }

    // Combine your text with the new time string
    let label = "move your cursor for some fun";
    let labelWidth = sketch.textWidth(label) - 100;
    let labelHeight = 30;
    let labelY = sketch.windowHeight / 2.8;
    let labelX = sketch.constrain(
      sketch.mouseX,
      labelWidth / 2,
      sketch.windowWidth - labelWidth / 2,
    );

    // Draw background rectangle
    sketch.noStroke();
    sketch.fill(82, 43, 18);
    sketch.rectMode(sketch.CENTER);

    if (sketch.windowWidth > 1000) {
      sketch.rect(labelX, labelY, labelWidth, labelHeight, 100);
    }

    // Draw text
    sketch.noStroke();
    sketch.fill(255);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textSize(14);
    sketch.textFont(jostfont); // Using your loaded jostfont
    if (sketch.windowWidth > 1000) {
      sketch.text(label, labelX, labelY);
    }
    sketch.pop();
    // -------------------------------------------------------

    sketch.stroke(17, 17, 17);
    sketch.fill(17, 17, 17);
    sketch.noStroke();
    sketch.textFont(jostfont);
    if (sketch.windowWidth < 900) {
      sketch.textSize(16);
      sketch.text(
        " is a product designer that loves \n data, systems & people",
        startX + 40,
        nameY + 32 + subtextGap,
      );
    } else {
      sketch.textSize(24);
      sketch.text(
        " is a product designer that loves data, systems & people",
        startX + 40,
        nameY + 240 + subtextGap,
      );
    }

    sketch.stroke(20, 52, 17);
    sketch.strokeWeight(0.2);

    if (sketch.windowWidth > 900) {
      let sizeJitter;

      for (let i = 0; i < points.length; i++) {
        // existing wiggle
        let x = points[i].x + 50 + r * sketch.sin(angle + i * 2);
        let y = points[i].y + 220 + r * sketch.cos(angle + i * 2);

        // noise-based texture layer
        let n = sketch.noise(i * 10, sketch.frameCount * 0.0008); // slow, per-point noise
        sizeJitter = sketch.map(n, 0, 1, 1, 25);
        let xJitter = sketch.map(sketch.noise(i * 0.15, 99), 0, 1, -2, 2); // x scatter
        let yJitter = sketch.map(sketch.noise(i * 0.15, 77), 0, 1, -2, 2); // y scatter
        let alphaJitter = sketch.map(n, 0, 1, 160, 255); // vary opacity

        sketch.fill(35, 90, 30, alphaJitter);
        sketch.ellipse(x + xJitter, y + yJitter, sizeJitter, sizeJitter);
      }
      angle += 40;
    } else {
      sketch.stroke(17, 17, 17);
      sketch.fill(17, 17, 17);
      sketch.noStroke();
      sketch.textFont(jostfont);
      sketch.textSize(56);
      // sketch.textStyle(sketch.BOLD);
      sketch.text("Santrupti", startX + 40, nameY + subtextGap);
    }
  };
});
