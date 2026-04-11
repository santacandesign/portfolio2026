var tick = 0;
var pollen = [];

function setup() {
  var flowercanvas = createCanvas(400, 400);
  flowercanvas.parent("flower-sketch-container");
}

function draw() {
  clear();
  tick += 0.05;
  var wind = windAt(tick);

  // --- stem 1 (main, center) ---
  push();
  translate(width / 2, height - 20);
  var s1 = windAt(tick) * 16;
  var s1b = windAt(tick + 0.5) * 8;
  stroke(38, 82, 28);
  strokeWeight(4);
  noFill();
  beginShape();
  curveVertex(0, 0);
  curveVertex(0, 0);
  curveVertex(s1b * 0.3, -90);
  curveVertex(s1 * 0.6, -180);
  curveVertex(s1, -280);
  curveVertex(s1, -280);
  endShape();

  // leaf 1
  var la = windAt(tick + 0.8) * 0.4;
  push();
  translate(s1 * 0.3, -130);
  rotate(la - 0.5);
  fill(38, 82, 28);
  stroke(28, 64, 20);
  strokeWeight(0.6);
  beginShape();
  vertex(0, 0);
  bezierVertex(-8, -12, -28, -18, -44, -10);
  bezierVertex(-28, -4, -10, 2, 0, 0);
  endShape(CLOSE);
  stroke(28, 64, 20);
  strokeWeight(0.5);
  noFill();
  line(0, 0, -42, -10);
  pop();

  // leaf 2
  var la2 = windAt(tick + 1.3) * 0.35;
  push();
  translate(s1 * 0.55, -195);
  rotate(la2 + 0.45);
  fill(38, 82, 28);
  stroke(28, 64, 20);
  strokeWeight(0.6);
  beginShape();
  vertex(0, 0);
  bezierVertex(6, -10, 26, -15, 40, -8);
  bezierVertex(26, -2, 8, 2, 0, 0);
  endShape(CLOSE);
  stroke(28, 64, 20);
  strokeWeight(0.5);
  noFill();
  line(0, 0, 38, -8);
  pop();

  // flower head
  push();
  translate(s1, -288);
  drawLily(s1, 1.0);

  if (frameCount % 4 === 0 && abs(wind) > 0.15 && pollen.length < 80) {
    pollen.push({
      x: width / 2 + s1,
      y: height - 20 - 288,
      vx: wind * 20 + random(1, 5),
      vy: random(-4, 0),
      life: 1,
      sz: random(2, 4),
      g: random(140, 200),
    });
  }
  pop();
  pop();

  // --- stem 2 (left, shorter) ---
  push();
  translate(width / 2 - 80, height - 20);
  var s2 = windAt(tick + 0.3) * 14;
  stroke(38, 82, 28);
  strokeWeight(3.2);
  noFill();
  beginShape();
  curveVertex(0, 0);
  curveVertex(0, 0);
  curveVertex(s2 * 0.4, -75);
  curveVertex(s2 * 0.7, -155);
  curveVertex(s2, -230);
  curveVertex(s2, -230);
  endShape();

  // leaf
  var la3 = windAt(tick + 1.8) * 0.38;
  push();
  translate(s2 * 0.4, -110);
  rotate(la3 - 0.4);
  fill(38, 82, 28);
  stroke(28, 64, 20);
  strokeWeight(0.5);
  beginShape();
  vertex(0, 0);
  bezierVertex(-6, -10, -22, -15, -36, -8);
  bezierVertex(-22, -2, -8, 2, 0, 0);
  endShape(CLOSE);
  pop();

  push();
  translate(s2, -238);
  drawLily(s2, 0.82);
  pop();
  pop();

  // --- stem 3 (right, tallest) ---
  push();
  translate(width / 2 + 88, height - 20);
  var s3 = windAt(tick + 0.7) * 18;
  stroke(38, 82, 28);
  strokeWeight(3.5);
  noFill();
  beginShape();
  curveVertex(0, 0);
  curveVertex(0, 0);
  curveVertex(s3 * 0.3, -100);
  curveVertex(s3 * 0.65, -200);
  curveVertex(s3, -305);
  curveVertex(s3, -305);
  endShape();

  var la4 = windAt(tick + 2.1) * 0.42;
  push();
  translate(s3 * 0.45, -160);
  rotate(la4 + 0.5);
  fill(38, 82, 28);
  stroke(28, 64, 20);
  strokeWeight(0.6);
  beginShape();
  vertex(0, 0);
  bezierVertex(8, -11, 28, -17, 44, -9);
  bezierVertex(28, -2, 9, 3, 0, 0);
  endShape(CLOSE);
  pop();

  push();
  translate(s3, -313);
  drawLily(s3, 0.9);
  pop();
  pop();

  // wind label
  var ws = abs(wind);
  noStroke();
  textFont("monospace");
  textSize(8);
  fill(38, 58, 28);
  textAlign(LEFT);
  text(
    "WIND  " + (ws < 0.3 ? "calm" : ws < 0.7 ? "breeze" : "gust"),
    10,
    height - 10,
  );
  for (var wi = 0; wi < floor(ws * 10); wi++) {
    fill(44, 70, 30, map(wi, 0, 10, 160, 15));
    text("›", 68 + wi * 7, height - 10);
  }
}

function windAt(t) {
  return (
    sin(t * 0.41) * 0.6 + sin(t * 0.97 + 1.2) * 0.3 + sin(t * 0.19 + 0.5) * 0.22
  );
}

function drawLily(sway, sz) {
  push();
  rotate(windAt(tick + 0.2) * 0.22);
  scale(sz);

  var np = 6;
  for (var i = 0; i < np; i++) {
    var ang = (i / np) * TWO_PI + PI / 6;
    var drift = windAt(tick + i * 0.5) * 0.12;
    var curl = sin(tick * 1.2 + i) * 0.06;

    push();
    rotate(ang + drift);
    // main petal — long, curving back
    noStroke();
    fill(220, 80, 60, 240);
    beginShape();
    vertex(0, 0);
    bezierVertex(-10, -18 - curl * 8, -9, -44, 0, -52);
    bezierVertex(9, -44, 10, -18 - curl * 8, 0, 0);
    endShape(CLOSE);

    // petal highlight stripe
    stroke(245, 130, 80, 120);
    strokeWeight(0.8);
    noFill();
    line(0, -4, 0, -46);

    // spots on petal
    noStroke();
    fill(140, 30, 20, 160);
    for (var sp = 0; sp < 5; sp++) {
      var sx = sin(sp * 2.1) * 4.5;
      var sy = -14 - sp * 6;
      ellipse(sx, sy, 2.5, 2.5);
    }
    pop();
  }

  // stamens — 6 long ones + 1 pistil
  for (var st = 0; st < 6; st++) {
    var sang = (st / 6) * TWO_PI + windAt(tick + st * 0.3) * 0.15;
    var slen = 30 + sin(tick * 1.5 + st) * 3;
    stroke(240, 200, 60);
    strokeWeight(1);
    var sx2 = cos(sang) * 5;
    var sy2 = sin(sang) * 5;
    line(sx2, sy2, sx2 + cos(sang) * slen, sy2 + sin(sang) * slen);
    noStroke();
    fill(180, 120, 20);
    ellipse(sx2 + cos(sang) * slen, sy2 + sin(sang) * slen, 5, 3.5);
  }
  // pistil
  stroke(200, 220, 80);
  strokeWeight(1.5);
  line(0, 0, 0, -34);
  noStroke();
  fill(120, 180, 60);
  ellipse(0, -35, 6, 4);

  pop();
}
