const fs = require("fs");
const test = false;
const {UMap} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_25${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

const constellations = new UMap();

class Point {
  constructor(line) {
    let coord = line.split(",").map(i => parseInt(i, 10));
    this.x = coord[0];
    this.y = coord[1];
    this.z = coord[2];
    this.t = coord[3];
    return this;
  }

  dist(pt) {
    return Math.abs(this.x - pt.x) + Math.abs(this.y - pt.y) + Math.abs(this.z - pt.z) + Math.abs(this.t - pt.t);
  }
}

let cid = 0;
for (let i = 0; i < input.length; i++) {
  let pt = new Point(input[i]);
  let join = [];
  constellations.forEach((group, c) => {
    for (star of group) {
      if (star.dist(pt) < 4) {
        join.push(c);
        break;
      }
    }
  });
  if (join.length > 0) {
    let primary = join.shift(),
      joined;
    (constellations.get(primary)).add(pt);
    while (joined = join.shift()) {
      constellations.set(primary, new Set([...constellations.get(primary), ...constellations.get(joined)]));
      constellations.delete(joined);
    }
  } else {
    constellations.set(cid++, new Set([pt]));
  }
}

// Part 1
function part1() {
  return constellations.size;
}

// Part 2
function part2() {
  return "VICTORY!";
}

module.exports = { part1, part2 }
