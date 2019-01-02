const fs = require("fs");
const test = false;
const {UMap, USet} = require("./utils");
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
    let source = this.pt(0, 0);
    source.state[1].cost = 0;
    let i = 0;
    while (source && !source.isTarget) {
      let state = source.state.toMap;
if (++i % 1000 == 0) console.log(i, source.label, state.equipped);
      for (let neighbor of source.neighbors) {
        neighbor = this.pt(neighbor);
        let cost = state.cost + 1;
        let equip = state.equipped;
        if (neighbor.type == state.equipped) {
          cost += 7;
          equip = 3 - source.type - neighbor.type;
        }
        if (neighbor.isTarget && equip != 1) cost += 7;
        if (neighbor.isTarget) console.log("CHECKING TARGET", equip);
        if ((neighbor.state[equip].cost === null) || (neighbor.state[equip].cost > cost)) {
          neighbor.state[equip].cost = cost;
          neighbor.state[equip].parent = source;
          neighbor.state[equip].mapped = false;
        }
      }
      state.mapped = true;

      source = this.locations
        .filter(pt => pt.state.cost !== null)
        .sort((a, b) => (a.state.cost != b.state.cost ? a.state.cost - b.state.cost : a.h - b.h))
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

    let path = new Set();
    if (step) {
      do path.add(step.label);
      while (step = step.parent);
    }
    for (let y = 0; y <= this.target[Y] * 1.01 + 2; y++) {
      let line = "";
      for (let x = 0; x <= this.target[X] * 5; x++) {
        let pt = this.pt(`${x},${y}`);
        let color = null;
        if (path.has(pt.label) && pt.parent && pt.equipped != pt.parent.equipped) color = colors.Yellow;
        else if (path.has(pt.label)) color = colors.Green;
        else if (pt.mapped) color = colors.Red;
        else if (pt.cost !== null) color = colors.Blue;
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

class State extends Array {
  constructor(type) {
    super(3);
    //this.point = pt;
    for (let i = 0; i < 3; i++) {
      if (i == type) this[i] = null;
      else this[i] = {
        cost: null,
        equipped: i,
        mapped: false,
        parent: null
      };
    }
    return this;
  }

  get cost() {
    let state = this.toMap;
    let cost = (state ? state.cost : null);
    return (state ? state.cost : null);
  }

  get toMap() {
    let state = null;
    for (let i = 0; i < 3; i++) {
      if (this[i] && this[i].cost !== null && !this[i].mapped && (state === null || this[i].cost < state.cost)) state = this[i];
    }
    return state;
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
    this.isTarget = (this.h === 0);

    if (x == target[X] && y == target[Y]) this.geo_index = 0;
    else if (y == 0) this.geo_index = x * 16807;
    else if (x == 0) this.geo_index = y * 48271;
    else this.geo_index = cave.pt(x - 1, y).erosion * cave.pt(x, y - 1).erosion;

    this.erosion = (this.geo_index + depth) % 20183;
    this.type = this.erosion % 3;

    this.state = new State(this.type);

    this.neighbors = new USet();
    if (x > 0) this.neighbors.add(`${x - 1},${y}`);
    if (x < border) this.neighbors.add(`${x + 1},${y}`);
    if (y > 0) this.neighbors.add(`${x},${y - 1}`);
    this.neighbors.add(`${x},${y + 1}`);

    return this;
  }

  distance(pt) {
    return Math.abs(this.x - pt.x) + Math.abs(this.y - pt.y);
  }

  get path() {
    let step = this;
    do {
      console.log(step.label, step.equipped, step.cost);
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
  let path = cave.findPath();
  //cave.print(path);
  return path.state.cost;
}

module.exports = { part1, part2, Cave, Point };
