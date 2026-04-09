let cols;
let rows;
let distMouse = 50;
let size = 10;
let blocks = [];
let padding = 4;

function preload() {
  font = loadFont("assets/Open_Sans/static/OpenSans-Bold.ttf");
}

class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.ang = 0;
    this.c = 0;
  }

  display(sketch) {
    sketch.fill(255, this.c);
    // sketch.stroke(this.c);
    sketch.push();
    sketch.translate(this.x, this.y);
    sketch.rotate(this.ang);
    sketch.rect(0, 0, size - padding, size - padding);
    sketch.pop();
  }

  move(sketch) {
    let distance = sketch.dist(sketch.mouseX, sketch.mouseY, this.x, this.y);
    if (distance < distMouse) {
      this.ang += 1;
      this.c = 255;
    }

    if (this.ang > 0 && this.ang < 90) {
      this.ang += 1;
      this.c = Math.max(70, this.c - 3);
    } else {
      this.ang = 0;
      this.c = 8;
    }
  }
}

new p5((sketch) => {
  sketch.preload = function () {
    font = sketch.loadFont("assets/Open_Sans/static/OpenSans-Bold.ttf");
  };
  sketch.setup = function () {
    let canvas = sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    canvas.parent("p5jsholder2");
    sketch.rectMode(sketch.CENTER);
    sketch.angleMode(sketch.DEGREES);

    cols = Math.floor(sketch.width / size);
    rows = Math.floor(sketch.height / size);

    for (let i = 0; i < cols; i++) {
      blocks[i] = [];
      for (let j = 0; j < rows; j++) {
        blocks[i][j] = new Block(size / 2 + i * size, size / 2 + j * size);
      }
    }
  };

  sketch.draw = function () {
    sketch.background(42, 90, 235);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        blocks[i][j].move(sketch);
        blocks[i][j].display(sketch);
      }
    }

    sketch.fill(255, 69, 69);
    // sketch.noStroke();
    sketch.rect(sketch.width / 2 + 10, sketch.height / 2 + 10, 300, 200);

    sketch.fill(255);
    sketch.stroke(255, 69, 69);
    sketch.strokeWeight(4);
    // sketch.noStroke();
    sketch.rect(sketch.width / 2, sketch.height / 2, 300, 200);

    // Draw a straight line (horizontal)
    sketch.stroke(255, 69, 69); // Black color
    sketch.strokeWeight(3); // Line thickness
    sketch.line(
      sketch.width / 2 + 90,
      sketch.height / 2 - 80,
      sketch.width / 2 + 100,
      sketch.height / 2 - 80
    ); // x1, y1, x2, y2

    sketch.line(
      sketch.width / 2 + 120,
      sketch.height / 2 - 75,
      sketch.width / 2 + 130,
      sketch.height / 2 - 85
    ); // First diagonal line
    sketch.line(
      sketch.width / 2 + 130,
      sketch.height / 2 - 75,
      sketch.width / 2 + 120,
      sketch.height / 2 - 85
    ); // Second diagonal line

    sketch.fill(255, 69, 69);
    sketch.noStroke();
    sketch.textSize(20);
    sketch.textFont(font);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.text(
      "After work, I'm always on the hunt to do cool stuff on my computer",
      sketch.width / 2,
      sketch.height / 2 - 20,
      250
    );
  };
});
