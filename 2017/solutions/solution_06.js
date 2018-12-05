const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_06.txt", "utf8")
  .trim().replace(/\s+/g, "\t").split("\t").map(i => parseInt(i, 10));

const maxIndex = (array) => array.indexOf(Math.max(...array));

const patterns = new Map();
var i = 0;
while (!patterns.has(input.join(","))) {
  patterns.set(input.join(","), i);
  i++;
  let max = maxIndex(input);
  let dist = input[max];
  input[max] = 0;
  for (let i = max + 1; i <= max + dist; i++) {
    input[i % input.length]++;
  }
}

// Part 1
function part1() {
  return i;
}

// Part 2
function part2() {
  return i - patterns.get(input.join(","));
}

module.exports = { part1, part2 }
