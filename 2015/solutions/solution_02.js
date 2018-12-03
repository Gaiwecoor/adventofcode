const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_02.txt", "utf8")
  .trim().split("\n").map(i => i.split("x").map(d => parseInt(d, 10)));

// Part 1
function part1() {
  return input.reduce((a, c) => {
    let wrap = 2 * ((c[0] * c[1]) + (c[0] * c[2]) + (c[1] * c[2]));
    let slack = c[0] * c[1] * c[2] / Math.max(...c);
    return a + wrap + slack;
  }, 0);
}

// Part 2
function part2() {
  return input.reduce((a, c) => {
    let ribbon = 2 * (c[0] + c[1] + c[2] - Math.max(...c));
    let bow = c[0] * c[1] * c[2];
    return a + ribbon + bow;
  }, 0);
}

module.exports = { part1, part2 }
