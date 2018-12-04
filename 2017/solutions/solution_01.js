const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_01.txt", "utf8")
  .trim();

// Part 1
function part1() {
  return input.split("").reduce((s, d, i, a) => s += (d == a[(i + 1) % a.length] ? parseInt(d, 10) : 0), 0);
}

// Part 2
function part2() {
  return input.split("").reduce((s, d, i, a) => s += (d == a[(i + a.length / 2) % a.length] ? parseInt(d, 10) : 0), 0);
}

module.exports = { part1, part2 }
