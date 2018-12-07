const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_06.txt", "utf8")
  .trim().split("\n").map(c => c.split(", ").map(d => parseInt(d, 10)));

const {Set} = require("./utils");

const X = 0, Y = 1;

const max = input.reduce((max, pt) => [Math.max(max[X], pt[X]), Math.max(max[Y], pt[Y])], [0, 0]);
const min = input.reduce((min, pt) => [Math.min(min[X], pt[X]), Math.min(min[Y], pt[Y])], max);

const pts = input.map(pt => [pt[X] - min[X], pt[Y] - min[Y]]);
max[X] = max[X] - min[X];
max[Y] = max[Y] - min[Y];

const u = {
  count: (array, element) => array.filter(e => e === element).length,
  dist: (a, b) => Math.abs(a[X] - b[X]) + Math.abs(a[Y] - b[Y]),
  minValue: (array) => Math.min(...array),
  minIndex: (array) => array.indexOf(Math.min(...array))
}

// Part 1
function part1() {
  let grid = [];
  for (let y = 0; y <= max[Y]; y++) {
    grid[y] = [];
    for (let x = 0; x <= max[X]; x++) {
      grid[y][x] = pts.map(pt => u.dist([x, y], pt));
      let minDistance = u.minValue(grid[y][x]);
      grid[y][x] = ((u.count(grid[y][x], minDistance) > 1) ? null : u.minIndex(grid[y][x]));
    }
  }

  let ignore = new Set();

  for (let y = 0; y <= max[Y]; y++) {
    if (grid[y][0] !== null) ignore.add(grid[y][0]);
    if (grid[y][max[X]] !== null) ignore.add(grid[y][max[X]]);
  }
  for (let x = 0; x <= max[X]; x++) {
    if (grid[0][x] !== null) ignore.add(grid[0][x]);
    if (grid[max[Y]][x] !== null) ignore.add(grid[max[Y]][x]);
  }

  let sizes = pts.map((pt, i) => {
    if (ignore.includes(i)) return 0;
    else return grid.reduce((total, row) =>
      total + row.reduce((sum, pt) =>
        sum + (pt === i ? 1 : 0)
      , 0)
    , 0);
  });
  return Math.max(...sizes);
}

// Part 2
function part2() {
  let size = 0;
  let maxDistance = 10000;
  for (let x = 0; x <= max[X]; x++) {
    for (let y = 0; y <= max[Y]; y++) {
      let distance = 0;
      for (let i = 0; i < pts.length && distance < maxDistance; i++) {
        distance += u.dist([x, y], pts[i]);
      }
      if (distance < maxDistance) size++;
    }
  }
  return size;
}

module.exports = { part1, part2 }
