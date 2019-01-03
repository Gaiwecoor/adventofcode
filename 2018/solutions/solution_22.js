const fs = require("fs");
const test = false;
const {UMap} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_22${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

const depth = parseInt(input[0].replace("depth: ", ""), 10);
const target = input[1].replace("target: ", "").split(",").map(i => parseInt(i, 10));
const [X, Y] = [0, 1];

const border = 150;

class Cave {
  constructor(depth, target) {
    this.locations = new UMap();
    this.depth = depth;
    this.target = target;
    return this;
  }

  findPath() {
    let open = new UMap();
    let closed = new UMap();
    let source = this.pt(0, 0).clone();
    source.equip(1).cost = 0;

    while (source && !source.isTarget) {
      for (let neighbor of source.neighbors) {
        neighbor = this.pt(neighbor).clone();
        let cost = source.cost + 1;
        let equip = source.equipped;
        if (neighbor.type == source.equipped) {
          cost += 7;
          equip = 3 - source.type - neighbor.type;
        }
        if (neighbor.isTarget && equip != 1) {
          cost += 7;
          equip = 1;
        };

        neighbor.equip(equip);
        neighbor.cost = cost;
        neighbor.parent = source;

        if (!closed.has(neighbor.label) && (!open.has(neighbor.label) || (open.get(neighbor.label).cost > cost))) {
          open.set(neighbor.label, neighbor);
        }
      }
      closed.set(source.label, source);
      open.delete(source.label);

      source = open
        .sort((a, b) => (a.cost != b.cost ? a.cost - b.cost : a.h - b.h))
        .first();
    }
    return source;
  }

  pt(x, y = null) {
    if (Array.isArray(x)) [x, y] = x;
    else if (x.x && x.y) [x, y] = [x.x, x.y];
    else if (typeof x == "string") [x, y] = x.split(",").map(i => parseInt(i, 10));

    if (this.locations.has(`${x},${y}`)) return this.locations.get(`${x},${y}`);

    let point = new Point(x, y);
    this.locations.set(point.label, point);

    return point;
  }

  print(step = null) {
    const colors = {
      Reset: "\x1b[0m",
      Black: "\x1b[30m",
      Red: "\x1b[31m",
      Green: "\x1b[32m",
      Yellow: "\x1b[33m",
      Blue: "\x1b[34m",
      Magenta: "\x1b[35m",
      Cyan: "\x1b[36m",
      White: "\x1b[37m"
    };

    let path = new Map();
    if (step) {
      do path.set(step.shortLabel, step);
      while (step = step.parent);
    }
    for (let y = 0; y <= this.target[Y] * 1.01 + 2; y++) {
      let line = "";
      for (let x = 0; x <= this.target[X] * 5; x++) {
        let pt = this.pt(`${x},${y}`);
        let color = null;
        if (path.has(pt.label)) color = [colors.Red, colors.Yellow, colors.Blue][path.get(pt.label).equipped];
        let symbol = (pt.isTarget ? "X" : [".", "=", "|"][pt.type]);

        line += (color ? color : "") + symbol + (color ? colors.Reset : "");
      }
      console.log(line);
    }
    console.log("==================");
    return this;
  }

  get risk() {
    let risk = 0;
    for (let x = 0; x <= this.target[X]; x++) {
      for (let y = 0; y <= this.target[Y]; y++) {
        risk += this.pt(x, y).type;
      }
    }
    return risk;
  }
}

class Point {
  constructor(x, y = null) {
    if (Array.isArray(x)) [x, y] = x;
    else if (x.x && x.y) [x, y] = [x.x, x.y];
    else if (typeof x == "string") [x, y] = x.split(",").map(i => parseInt(i, 10));

    this.x = x;
    this.y = y;
    this.h = Math.abs(this.x - target[X]) + Math.abs(this.y - target[Y]);
    this.label = `${x},${y}`;
    this.shortLabel = `${x},${y}`;
    this.isTarget = (this.h === 0);

    this.equipped = null;
    this.cost = null;

    if (x == target[X] && y == target[Y]) this.geo_index = 0;
    else if (y == 0) this.geo_index = x * 16807;
    else if (x == 0) this.geo_index = y * 48271;
    else this.geo_index = cave.pt(x - 1, y).erosion * cave.pt(x, y - 1).erosion;

    this.erosion = (this.geo_index + depth) % 20183;
    this.type = this.erosion % 3;

    this.neighbors = new Set();
    if (x > 0) this.neighbors.add(`${x - 1},${y}`);
    if (x < border) this.neighbors.add(`${x + 1},${y}`);
    if (y > 0) this.neighbors.add(`${x},${y - 1}`);
    this.neighbors.add(`${x},${y + 1}`);

    return this;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  distance(pt) {
    return Math.abs(this.x - pt.x) + Math.abs(this.y - pt.y);
  }

  equip(equipped) {
    this.equipped = equipped;
    this.label = `${this.x},${this.y}${(this.equipped !== null ? "," + this.equipped : "")}`;
    return this;
  }

  get path() {
    let step = this;
    do {
      console.log(step.label, step.cost);
    } while (step = step.parent);
    return this.cost;
  }
}

const cave = new Cave(depth, target);

// Part 1
function part1() {
  return cave.risk;
}

// Part 2
function part2() {
  return cave.findPath().cost;
}

module.exports = { part1, part2, Cave, Point };
