const fs = require("fs");
const test = false;
const {Grid} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_17${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

const pattern = /(x|y)=(\d+), (?:x|y)=(\d+)\.\.(\d+)/
const scan = new Grid().setDefault(" ");
const boundaries = {
  xMin: null, xMax: null,
  yMin: null, yMax: null
};
for (let i = 0; i < input.length; i++) {
  let match = pattern.exec(input[i]);
  let steady = parseInt(match[2], 10);
  let min = parseInt(match[3], 10);
  let max = parseInt(match[4], 10);
  for (let j = min; j <= max; j++) {
    let x = (match[1] == "x" ? steady : j);
    let y = (match[1] == "y" ? steady : j);
    scan.set("#", x, y);
    if (boundaries.xMin == null || x < boundaries.xMin) boundaries.xMin = x;
    if (boundaries.xMax == null || x > boundaries.xMax) boundaries.xMax = x;
    if (boundaries.yMin == null || y < boundaries.yMin) boundaries.yMin = y;
    if (boundaries.yMax == null || y > boundaries.yMax) boundaries.yMax = y;
  }
}
boundaries.xMin--; boundaries.xMax++;
scan.setBoundaries(boundaries);

class Source {
  constructor(grid, x, y) {
    this.x = x;
    this.y = y;
    this.value = "|";
    this.grid = grid.set("|", x, y);
    return this;
  }

  canSettle(sourceX, y) {
    let settleable = true;
    for (let x = sourceX; settleable; x--) {
      let floor = this.grid.get(x, y + 1);
      if (!(floor == "#" || floor == "~")) settleable = false;
      if (this.grid.get(x - 1, y) == "#") break;
    }
    for (let x = sourceX; settleable; x++) {
      let floor = this.grid.get(x, y + 1);
      if (!(floor == "#" || floor == "~")) settleable = false;
      if (this.grid.get(x + 1, y) == "#") break;
    }
    return settleable;
  }

  fill() {
    let x = this.x;
    let y = this.y;
    while (this.grid.get(x, y) != "#" && this.grid.get(x, y) != "~" && y <= this.grid.boundaries.yMax) {
      this.grid.set("|", x, y);
      let floor = this.grid.get(x, y + 1);
      if (floor == "#" || floor == "~") {
        if (this.canSettle(x, y)) this.settle(x, y--);
        else {
          this.flow(x, y);
          break;
        }
      } else y++;
    }

    return this;
  }

  flow(sourceX, y) {
    let x = sourceX;
    while (this.grid.get(--x, y) != "#" && x >= this.grid.boundaries.xMin) {
      let floor = this.grid.get(x, y + 1);
      if (floor != "#" && floor != "~") {
        if (floor == " ") {
          let source = new Source(this.grid, x, y).fill();
        }
        break;
      } else if (this.grid.get(x, y) == " ") this.grid.set("|", x, y);
    }
    x = sourceX;
    while (this.grid.get(++x, y) != "#" && x <= this.grid.boundaries.xMax) {
      let floor = this.grid.get(x, y + 1);
      if (floor != "#" && floor != "~") {
        if (floor == " ") {
          let source = new Source(this.grid, x, y).fill();
        }
        break;
      } else if (this.grid.get(x, y) == " ") this.grid.set("|", x, y);
    }
    return this;
  }

  print() {
    for (let y = this.grid.boundaries.yMin; y <= this.grid.boundaries.yMax; y++) {
      let line = "";
      for (let x = this.grid.boundaries.xMin; x <= this.grid.boundaries.xMax; x++) {
        line += this.grid.get(x, y);
      }
      console.log(line);
    }
    return this;
  }

  settle(sourceX, y) {
    if (this.canSettle(sourceX, y)) {
      let x = sourceX;
      while (this.grid.get(x, y) != "#") {
        this.grid.set("~", x--, y);
      }
      x = sourceX;
      while (this.grid.get(x, y) != "#") {
        this.grid.set("~", x++, y);
      }
    }
    return this;
  }

  get wet() {
    let wet = 0;
    for (let x = this.grid.boundaries.xMin; x <= this.grid.boundaries.xMax; x++) {
      for (let y = this.grid.boundaries.yMin; y <= this.grid.boundaries.yMax; y++) {
        if (this.grid.get(x, y) == "~" || this.grid.get(x, y) == "|") wet++;
      }
    }
    return wet;
  }

  get stable() {
    let stable = 0;
    for (let x = this.grid.boundaries.xMin; x <= this.grid.boundaries.xMax; x++) {
      for (let y = this.grid.boundaries.yMin; y <= this.grid.boundaries.yMax; y++) {
        if (this.grid.get(x, y) == "~") stable++;
      }
    }
    return stable;
  }
}

const spring = new Source(scan, 500, 0);

// Part 1
function part1() {
  return spring.fill().wet;
}

// Part 2
function part2() {
  return spring.stable;
}

module.exports = { part1, part2 }
