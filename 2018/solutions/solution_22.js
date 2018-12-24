const fs = require("fs");
const test = false;
const {UMap, USet} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_22${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

const depth = parseInt(input[0].replace("depth: ", ""), 10);
const target = input[1].replace("target: ", "").split(",").map(i => parseInt(i, 10));
const [X, Y] = [0, 1];
const hScale = [
  10/7,
  1,
  1070/1021,
  1064/1029,
  1074/1025,
  1062/1027,
][4];
function getNext(open, closed) {
  let list = open.toArray().sort((a, b) => {
    if (a.f != b.f) return a.f - b.f;
    if (a.h != b.h) return b.h - a.h;
    return b.cost - a.cost;
  });
  let next = list.shift();

  if (!next.isTarget) return next;
  else {
    let ready = 0;
    for (let adjacent of next.adjacent) {
      if (closed.has(adjacent)) ready++;
    }
    if (ready == 4) return next;
    else return list.shift();
  }
}

class PathPoint {
  constructor(state) {
    // state: {x*, y*, type*}
    this.x = state.x;
    this.y = state.y;
    this.type = state.type;
    this.equipped = state.equipped;
    this.cost = 0;
    this.h = null;
    if (state.parent) this.setParent(state.parent);
    else if (state.target) this.setTarget(state.target);

    this.adjacent = new USet([`${this.x+1},${this.y}`, `${this.x},${this.y+1}`]);
    if (this.y > 0) this.adjacent.add(`${this.x},${this.y-1}`);
    if (this.x > 0) this.adjacent.add(`${this.x-1},${this.y}`);
    return this;
  }

  equip(type) {
    this.equipped = type;
    return this;
  }

  get f() {
    return this.cost + this.h;
  }

  get path() {
    let step = this;
    let record = [step];
    while (step = step.parent) record.push(step);
    return record.reverse();
  }

  print() {
    console.log(this.label);
    let next = this;
    while (next = next.parent) console.log(next.label);
    return this;
  }

  get isTarget() {
    return (this.x == this.target[X] && this.y == this.target[Y]);
  }

  get label() {
    return `${this.x},${this.y}`;
  }

  setParent(ppt) {
    this.setTarget(ppt.target);
    this.parent = ppt;

    let cost = ppt.cost + 1;
    if (this.type === ppt.equipped) {
      cost += 7;
      this.equipped = 3 - ppt.type - this.type;
    } else this.equipped = ppt.equipped;
    if (this.x == this.target[X] && this.y == this.target[Y] && this.equipped != 1) cost += 7;
    this.cost = cost;
    return this;
  }

  setTarget(x, y = null) {
    if (Array.isArray(x)) [x, y] = x;
    this.target = [x, y];
    this.h = (Math.abs(this.x - this.target[X]) + Math.abs(this.y - this.target[Y])) * hScale;
    return this;
  }
}

class Cave {
  constructor(depth, target) {
    this.depth = depth;
    this.target = target;
    this.regions = new Map();
    this.reset();

    for (let y = 0; y <= this.target[Y]; y++) {
      for (let x = 0; x <= this.target[X]; x++) {
        this.point(x, y);
      }
    }
    return this;
  }

  pathd() {
    const pt = (x, y) => {
      if (Array.isArray(x)) [x, y] = x;
      return `${x},${y}`;
    };
    let locations = new UMap();

    const tPt = pt(this.target);
    const grid = {x: this.target[X] * 6, y: this.target[Y] * 1.2};
console.info("Initializing Grid...");
    for (let y = 0; y <= grid.y; y++) {
      for (let x = 0; x <= grid.x; x++) {
        locations.set(pt(x, y), {pt: [x, y], cost: Infinity, equipped: null, type: this.point(x, y).type, parent: null});
      }
    }
    locations.set("0,0", {pt: [0, 0], cost: 0, equipped: 1, type: 0, parent: null});

    let unvisited = new USet(locations.keys());

    let step = [0, 0];
console.info("Starting pathfinding...");
    while (step) {
      let [x, y] = step;
      let source = locations.get(pt(step));
      // compile neighbor set.
      const neighbors = new Set();
      if (x < grid.x) neighbors.add(pt(x + 1, y)); // console.log("Hit edge at", step);
      if (y < grid.y) neighbors.add(pt(x, y + 1)); else console.log("Hit edge at", step);
      if (x > 0) neighbors.add(pt(x - 1, y));
      if (y > 0) neighbors.add(pt(x, y - 1));

      for (const neighbor of neighbors) {
        let assigned = locations.get(neighbor);

        let adj = {
          pt: assigned.pt,
          cost: source.cost + 1,
          equipped: source.equipped,
          type: assigned.type,
          parent: pt(step)
        };

        if (adj.type === source.equipped) {
          adj.cost += 7;
          adj.equipped = 3 - adj.type - source.type;
        }
        if (neighbor == tPt && adj.equipped != 1) adj.cost += 7;

        if (adj.cost < assigned.cost) locations.set(neighbor, adj);
      }
      unvisited.delete(pt(step));

      if (pt(step) == tPt) break;

      let next = unvisited
        .map(p => locations.get(p))
        .filter(p => p.cost < Infinity)
        .sort((a, b) => a.cost - b.cost)[0];
      if (next) step = next.pt;
      else return {cost: 0};
    }

    return locations.get(pt(step));
  }

  pathfinder(display = false) {
    this.open = new UMap();
    this.closed = new UMap();

    let step = new PathPoint({x: 0, y: 0, type: this.point(0, 0).type, equipped: 1, target: this.target});

    this.closed.set(step.label, step);

    let i = 0;

    while(step && !step.isTarget) {
      for (let point of step.adjacent) {
        if (this.closed.has(point)) continue;
        else {
          const [x, y] = point.split(",").map(i => parseInt(i, 10));
          const ppt = new PathPoint({x: x, y: y, type: this.point(x, y).type, parent: step});

          if (this.open.has(ppt.label) && ppt.cost >= this.open.get(ppt.label).cost) continue;
          this.open.set(ppt.label, ppt);
        }
      }
      if (step = getNext(this.open, this.closed)) {
        this.closed.set(step.label, step);
        this.open.delete(step.label);
      }
      //if (++i % 10000 == 0 && display) this.print();
    }
    if (display) this.print(step);
    return step;
  }

  point(x, y = null) {
    if (Array.isArray(x)) [x, y] = x;
    let pt = `${x},${y}`;
    if (this.regions.has(pt)) return this.regions.get(pt);
    else {
      let region = {};
      // Set Geologic Index
      if (x == 0 && y == 0) region.geology = 0;
      else if (x == this.target[0] && y == this.target[1]) region.geology = 0;
      else if (y == 0) region.geology = x * 16807;
      else if (x == 0) region.geology = y * 48271;
      else region.geology = this.point(x-1, y).erosion * this.point(x, y-1).erosion;
      // Set Erosion Level
      region.erosion = (region.geology + this.depth) % 20183;
      // Set Terrain
      region.type = (region.erosion % 3); // Rocky = 0, Wet = 1, Narrow = 2

      this.regions.set(pt, region);
      return region;
    }
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
      path.add(step.label);
      while (step = step.parent) path.add(step.label);
    }
    for (let y = 0; y <= this.target[Y] * 1.01 + 2; y++) {
      let line = "";
      for (let x = 0; x <= this.target[X] * 5; x++) {
        let pt = `${x},${y}`;
        let color = null;
        if (path.has(pt)) color = colors.Green;
        else if (this.closed && this.closed.has(pt)) color = colors.Red;
        else if (this.open && this.open.has(pt)) color = colors.Blue;
        let symbol = ((x == this.target[X] && y == this.target[Y]) ? "X" : [".", "=", "|"][this.point(x, y).type]);

        line += (color ? color : "") + symbol + (color ? colors.Reset : "");
      }
      console.log(line);
    }
    console.log("==================");
    return this;
  }

  reset() {
    this.position = [0, 0];
    this.equipped = 1;
    this.time = 0;
    return this;
  }

  get risk() {
    let risk = 0;
    for (let y = 0; y <= this.target[1]; y++) {
      for (let x = 0; x <= this.target[0]; x++) {
        risk += this.regions.get(`${x},${y}`).type;
      }
    }
    return risk;
  }
};

const cave = new Cave(depth, target);

// Part 1
function part1() {
  return cave.risk;
}

// Part 2
function part2() {
  let value = cave.pathfinder();
  return value.cost;
  // 1070 high
  // 1043 target?
}

module.exports = { part1, part2 }
