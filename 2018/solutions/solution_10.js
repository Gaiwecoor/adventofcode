const fs = require("fs");
const pattern = /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/;

function parse(line) {
  let match = pattern.exec(line);
  return ({
    x: parseInt(match[1], 10),
    y: parseInt(match[2], 10),
    vx: parseInt(match[3], 10),
    vy: parseInt(match[4], 10)
  });
}

const config = {
  test: false
}

const input = fs.readFileSync(`${__dirname}/../input/input_10${config.test ? "_sample" : ""}.txt`, "utf8").trim().split("\n").map(parse);

function alignment(points, t) {
  let img = new Set();
  let bound= {
    xmin: false, xminCount: 0, xmax: false, xmaxCount: 0,
    ymin: false, yminCount: 0, ymax: false, ymaxCount: 0
  };

  for (let i = 0; i < points.length; i++) {
    let pt = points[i];
    let x = pt.x + pt.vx * t;
    let y = pt.y + pt.vy * t;
    img.add(`${x},${y}`);
    if (bound.xmin === false || (x < bound.xmin)) {
      bound.xmin = x;
      bound.xminCount = 1;
    } else if (x == bound.xmin) {
      bound.xminCount++;
    }
    if (bound.xmax === false || (x > bound.xmax)) {
      bound.xmax = x;
      bound.xmaxCount = 1;
    } else if (x == bound.xmax) {
      bound.xmaxCount++;
    }
    if (bound.ymin === false || (y < bound.ymin)) {
      bound.ymin = y;
      bound.yminCount = 1;
    } else if (y == bound.ymin) {
      bound.yminCount++;
    }
    if (bound.ymax === false || (y > bound.ymax)) {
      bound.ymax = y;
      bound.ymaxCount = 1;
    } else if (y == bound.ymax) {
      bound.ymaxCount++;
    }
  }

  if (bound.ymaxCount > 4 && bound.yminCount > 4) {
    console.log(img);
    console.log("==========================", t);
    for (let j = bound.ymin; j <= bound.ymax; j++) {
      let row = "";
      for (let i = bound.xmin; i <= bound.xmax; i++) {
        row += (img.has(`${i},${j}`) ? "X": " ");
      }
      console.log(row);
    }
    console.log("==========================");
    return t;
  }
}

// Part 1
function part1() {
  return true;
}

// Part 2
function part2() {
  let i = 0;
  while (true) {
    let t = alignment(input, i);
    if (t) return t;
    i++;
  }
}

module.exports = { part1, part2 }
