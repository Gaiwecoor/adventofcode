const fs = require("fs");
const changes = fs.readFileSync(__dirname + "/../input/input_01.txt", "utf8")
  .split("\n")
  .filter(c => c)
  .map(c => parseInt(c, 10));
const log = new Map([[0, 0]]);

// Part 1

function part1() {
  return changes.reduce((a, c) => a += c, 0);
}

// Part 2

function part2(shift = 0) {
  for (let i = 0; i < changes.length; i++) {
    shift += changes[i];
    if (log.has(shift)) {
      return shift;
    } else log.set(shift, true);
  }
  return part2(shift);
}

module.exports = { part1, part2 }
