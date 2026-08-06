// Playground banner sketch — a paper meadow that blooms under the cursor.
// Palette comes straight from the site: cream paper, walnut ink, the greens
// from the contact badge and the warm reds/marigolds from the homepage.

const PAPER = [255, 252, 237]; // #fffced
const INK = [75, 45, 21]; // #4b2d15
const MOSS = [50, 88, 37]; // #325825

// autumn bouquet palette — warm golds, terracottas, cornflower blue, maroon
const PETAL_COLOURS = [
  [229, 168, 96], // warm gold
  [217, 129, 78], // soft orange
  [198, 100, 80], // terracotta rose
  [124, 159, 212], // cornflower blue
  [107, 38, 38], // deep maroon
];

const CENTRE_COLOURS = [
  [255, 252, 237], // cream
  [229, 168, 96], // warm gold
  [107, 38, 38], // deep maroon
];

let playFont;
let playPaper;
let cols;
let rows;
let flowers = [];
let cellSize = 26;
let distMouse = 78;

class Flower {
  constructor(sketch, x, y) {
    this.x = x;
    this.y = y;
    this.ang = sketch.random(360);
    this.bloom = 0;
    this.petals = sketch.floor(sketch.random(5, 8));
    this.col = PETAL_COLOURS[sketch.floor(sketch.random(PETAL_COLOURS.length))];
    this.centre =
      CENTRE_COLOURS[sketch.floor(sketch.random(CENTRE_COLOURS.length))];
    this.spin = sketch.random(0.6, 2.4) * (sketch.random() < 0.5 ? -1 : 1);
    this.scale = sketch.random(0.75, 1.15);
    // a scattering of flowers that stay open, so the field still reads as a
    // meadow before anyone moves their cursor over it
    this.resting = sketch.random() < 0.014 ? sketch.random(0.35, 0.6) : 0;
  }

  move(sketch, pointerLive) {
    if (pointerLive) {
      let distance = sketch.dist(sketch.mouseX, sketch.mouseY, this.x, this.y);
      if (distance < distMouse) {
        this.bloom = 1;
      }
    }

    if (this.bloom > this.resting) {
      // fade slows down as the flower shrinks, so the tail of the trail
      // lingers a little before disappearing
      let fade = this.bloom < 0.45 ? 0.0035 : 0.011;
      this.bloom = Math.max(this.resting, this.bloom - fade);
      this.ang += this.spin;
    } else {
      this.bloom = this.resting;
      this.ang += this.spin * 0.08;
    }
  }

  display(sketch) {
    if (this.bloom <= 0.01) {
      // dormant seed
      sketch.noStroke();
      sketch.fill(INK[0], INK[1], INK[2], 34);
      sketch.circle(this.x, this.y, 2.2);
      return;
    }

    let t = this.bloom * this.bloom * (3 - 2 * this.bloom); // smoothstep
    let r = cellSize * 0.5 * this.scale * t;
    let alpha = 255 * Math.min(1, t * 1.25);

    sketch.push();
    sketch.translate(this.x, this.y);
    sketch.rotate(this.ang);
    sketch.noStroke();

    sketch.fill(this.col[0], this.col[1], this.col[2], alpha);
    let step = 360 / this.petals;
    for (let k = 0; k < this.petals; k++) {
      sketch.push();
      sketch.rotate(step * k);
      sketch.ellipse(0, -r * 0.46, r * 0.62, r * 1.02);
      sketch.pop();
    }

    sketch.fill(this.centre[0], this.centre[1], this.centre[2], alpha);
    sketch.circle(0, 0, r * 0.46);
    sketch.pop();
  }
}

new p5((sketch) => {
  let holder;
  let pointerLive = false;
  let cardW = 300;
  let cardH = 200;

  function measure() {
    holder = holder || document.getElementById("p5jsholder2");
    let w =
      holder && holder.offsetWidth ? holder.offsetWidth : sketch.windowWidth;
    let h = w < 700 ? 420 : 520;
    return { w: w, h: h };
  }

  function buildField() {
    cellSize = sketch.width < 700 ? 22 : 26;
    // small radius = a tight bundle of blooms hugging the cursor
    distMouse = sketch.width < 700 ? 34 : 42;
    cardW = Math.min(300, sketch.width * 0.72);
    cardH = cardW * 0.66;

    cols = Math.floor(sketch.width / cellSize);
    rows = Math.floor(sketch.height / cellSize);

    flowers = [];
    for (let i = 0; i < cols; i++) {
      flowers[i] = [];
      for (let j = 0; j < rows; j++) {
        flowers[i][j] = new Flower(
          sketch,
          cellSize / 2 + i * cellSize,
          cellSize / 2 + j * cellSize,
        );
      }
    }
  }

  sketch.preload = function () {
    playFont = sketch.loadFont(
      "assets/Libre_Baskerville/static/LibreBaskerville-Italic.ttf",
    );
    playPaper = sketch.loadImage("assets/bgtexturefinal.jpg");
  };

  sketch.setup = function () {
    let size = measure();
    let canvas = sketch.createCanvas(size.w, size.h);
    canvas.parent("p5jsholder2");
    canvas.style("display", "block");

    sketch.rectMode(sketch.CENTER);
    sketch.ellipseMode(sketch.CENTER);
    sketch.angleMode(sketch.DEGREES);

    buildField();
  };

  sketch.windowResized = function () {
    let size = measure();
    sketch.resizeCanvas(size.w, size.h);
    buildField();
  };

  sketch.draw = function () {
    // paper background, same treatment as the homepage sketch
    sketch.background(PAPER[0], PAPER[1], PAPER[2]);
    if (playPaper) {
      sketch.push();
      sketch.imageMode(sketch.CORNER);
      sketch.blendMode(sketch.MULTIPLY);
      sketch.image(playPaper, 0, 0, sketch.width, sketch.height);
      sketch.pop();
    }

    let inside =
      sketch.mouseX > 0 &&
      sketch.mouseX < sketch.width &&
      sketch.mouseY > 0 &&
      sketch.mouseY < sketch.height;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        flowers[i][j].move(sketch, pointerLive && inside);
        flowers[i][j].display(sketch);
      }
    }

    let cx = sketch.width / 2;
    let cy = sketch.height / 2;

    // offset shadow card
    sketch.noStroke();
    sketch.fill(INK[0], INK[1], INK[2], 50);
    sketch.rect(cx + 10, cy + 10, cardW, cardH, 10);

    // note card
    sketch.fill(PAPER[0], PAPER[1], PAPER[2]);
    sketch.stroke(INK[0], INK[1], INK[2]);
    sketch.strokeWeight(3);
    sketch.rect(cx, cy, cardW, cardH, 10);

    // little window marks in the top-right corner of the card
    let mx = cx + cardW / 2;
    let my = cy - cardH / 2;
    sketch.strokeWeight(3);
    sketch.line(mx - 62, my + 20, mx - 52, my + 20);
    sketch.line(mx - 32, my + 25, mx - 22, my + 15);
    sketch.line(mx - 22, my + 25, mx - 32, my + 15);

    sketch.noStroke();
    sketch.fill(INK[0], INK[1], INK[2]);
    sketch.textFont(playFont);
    sketch.textSize(sketch.width < 700 ? 15 : 18);
    let leading = sketch.width < 700 ? 22 : 26;
    sketch.textLeading(leading);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);

    let message =
      "After work, I'm always on the hunt to do cool stuff on my computer";
    let boxW = cardW - 56;
    // p5 anchors the first wrapped line at y, so count the wrapped lines and
    // shift up half the block height to truly centre the text in the card
    let lines = 1;
    let lineStr = "";
    for (let word of message.split(" ")) {
      let test = lineStr ? lineStr + " " + word : word;
      if (sketch.textWidth(test) > boxW && lineStr) {
        lines++;
        lineStr = word;
      } else {
        lineStr = test;
      }
    }
    sketch.text(message, cx, cy - ((lines - 1) * leading) / 2, boxW);
  };

  sketch.mouseMoved = function () {
    pointerLive = true;
  };

  sketch.touchMoved = function () {
    pointerLive = true;
  };
});
