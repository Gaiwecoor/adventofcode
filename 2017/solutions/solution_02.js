const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_02.txt", "utf8")
  .trim().split("\n").map(l => l.split("\t").map(i => parseInt(i, 10)));

// Part 1
function part1() {
  return input.reduce((sum, line) => sum += Math.max(...line) - Math.min(...line), 0);
}

// Part 2
function part2() {
  return input.reduce((sum, line) => {
    for (i = 0; i < line.length - 1; i++) {
      for (j = i + 1; j < line.length; j++) {
        let d = Math.max(line[i], line[j]) / Math.min(line[i], line[j]);
        if (d == parseInt(d, 10)) {
          return sum + d;
        }
      }
    }
  }, 0);
}

module.exports = { part1, part2 }
