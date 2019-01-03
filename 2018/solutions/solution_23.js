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
    let aligns = 0;
    const [X, Y, Z] = [4, 2, 1];
    if (range.x <= this.x && range.x + range.dx - 1 >= this.x) aligns += X;
    if (range.y <= this.y && range.y + range.dy - 1 >= this.y) aligns += Y;
    if (range.z <= this.z && range.z + range.dz - 1 >= this.z) aligns += Z;

    let pt = {
      x: closer(this.x, range.x, range.x + range.dx - 1),
      y: closer(this.y, range.y, range.y + range.dy - 1),
      z: closer(this.z, range.z, range.z + range.dz - 1)
    };
    if (aligns == 7) return true; // Type A: Point inside range

    if (aligns & X) pt.x = this.x;
    if (aligns & Y) pt.y = this.y;
    if (aligns & Z) pt.z = this.z;

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
  let sub = 10;

  totalRange.x = totalRange.maxx - totalRange.minx;
  totalRange.y = totalRange.maxy - totalRange.miny;
  totalRange.z = totalRange.maxz - totalRange.minz;

  let divide = true;

  let ranges = new Set([totalRange]);
let k = 0;
  while (divide) {
    k++
    let newRanges = new Set();
    divide = false;
    for (const range of ranges) {
      let maxCount = null;
      let dx = Math.ceil((range.maxx - range.minx) / sub);
      let dy = Math.ceil((range.maxy - range.miny) / sub);
      let dz = Math.ceil((range.maxz - range.minz) / sub);
      divide = (divide || dx > 1 || dy > 1 || dz > 1);
      let j = 0;
      for (let x = range.minx; x < range.maxx; x += dx) {
        for (let y = range.miny; y < range.maxy; y += dy) {
          for (let z = range.minz; z < range.maxz; z += dz) {
            let minx = x;
            let miny = y;
            let minz = z;
            let maxx = x + dx - 1;
            let maxy = y + dy - 1;
            let maxz = z + dz - 1;
            let region = {x, y, z, dx, dy, dz, maxx, maxy, maxz, minx, miny, minz, j};
            let count = 0;
            for (let i = 0; i < bots.length; i++) {
              if (bots[i].reaches(region)) count++;
            }
            region.count = count;
            if (maxCount == null || count > maxCount) {
              newRanges = new Set([region]);
              maxCount = count;
            } else if (maxCount == count) {
              newRanges.add(region);
            }
            j++;
          }
        }
      }
    }
    ranges = newRanges;
  }

  let short = null;
  for (point of ranges) {
    let d = Math.abs(point.x) + Math.abs(point.y) + Math.abs(point.z);
    if (short == null || d < short) short = d;
  }
  return short;
}
// 41588937 Low
module.exports = { part1, part2 }
