const fs = require("fs");
const test = false;
const {USet} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_23${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

const parse = /pos=<(-?\d+,-?\d+,-?\d+)>, r=(\d+)/;
const [X, Y, Z] = [0, 1, 2];

const totalRange = {
  minx: null, maxx: null,
  miny: null, maxy: null,
  minz: null, maxz: null
};

function closer(pt, a, b) {
  return (Math.abs(pt - a) < Math.abs(pt - b) ? a : b);
}

class Point {
  constructor(line) {
    let match = parse.exec(line);
    this.r = parseInt(match[2], 10);
    [this.x, this.y, this.z] = match[1].split(",").map(i => parseInt(i, 10));

    if (totalRange.minx === null || this.x - this.r < totalRange.minx) totalRange.minx = this.x - this.r;
    if (totalRange.miny === null || this.y - this.r < totalRange.miny) totalRange.miny = this.y - this.r;
    if (totalRange.minz === null || this.z - this.r < totalRange.minz) totalRange.minz = this.z - this.r;
    if (totalRange.maxx === null || this.x + this.r > totalRange.maxx) totalRange.maxx = this.x + this.r;
    if (totalRange.maxy === null || this.y + this.r > totalRange.maxy) totalRange.maxy = this.y + this.r;
    if (totalRange.maxz === null || this.z + this.r > totalRange.maxz) totalRange.maxz = this.z + this.r;

    return this;
  }

  distance(pt) {
    return Math.abs(pt.x - this.x) + Math.abs(pt.y - this.y) + Math.abs(pt.z - this.z);
  }

  reaches(range) {
    let pt = {
      x: ((range.minx <= this.x && range.maxx >= this.x) ? this.x : closer(this.x, range.minx, range.maxx)),
      y: ((range.miny <= this.y && range.maxy >= this.y) ? this.y : closer(this.y, range.miny, range.maxy)),
      z: ((range.minz <= this.z && range.maxz >= this.z) ? this.z : closer(this.z, range.minz, range.maxz)),
    };

    return (this.distance(pt) <= this.r);
  }
}

const bots = input.map(line => new Point(line));

// Part 1
function part1() {
  let strong = bots.sort((a, b) => b.r - a.r)[0];
  let count = 0;
  for (let i = 0; i < bots.length; i++) {
    if (bots[i].distance(strong) <= strong.r) count++;
  }
  return count;
}

// Part 2
function part2() {
  const sub = 5;
  let subdivide = true;
  let ranges = new Set([totalRange]);

  while (subdivide) {
    let newRanges;
    subdivide = false;
    for (const range of ranges) {
      let maxCount = null;
      const [dx, dy, dz] = [Math.ceil((range.maxx - range.minx) / sub), Math.ceil((range.maxy - range.miny) / sub), Math.ceil((range.maxz - range.minz) / sub)];
      subdivide = (subdivide || dx > 1 || dy > 1 || dz > 1);
      for (let x = range.minx; x < range.maxx; x += dx) {
        for (let y = range.miny; y < range.maxy; y += dy) {
          for (let z = range.minz; z < range.maxz; z += dz) {
            const [minx, miny, minz] = [x, y, z];
            const [maxx, maxy, maxz] = [x + dx - 1, y + dy - 1, z + dz - 1];
            let region = {maxx, maxy, maxz, minx, miny, minz};
            let count = 0;
            for (let i = 0; i < bots.length; i++) {
              if (bots[i].reaches(region)) count++;
            }
            if (maxCount == null || count > maxCount) {
              newRanges = new Set([region]);
              maxCount = count;
            } else if (maxCount == count) {
              newRanges.add(region);
            }
          }
        }
      }
    }
    ranges = newRanges;
  }

  let short = null;
  for (point of ranges) {
    let d = Math.abs(point.minx) + Math.abs(point.miny) + Math.abs(point.minz);
    if (short == null || d < short) short = d;
  }
  return short;
}

module.exports = { part1, part2 }
