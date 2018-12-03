const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_01.txt", "utf8")
  .trim();
  
// Part 1
function part1() {
  return input.split("").reduce((l, d) => {
    if (d == "(") return ++l;
    else return --l;
  }, 0);
}

// Part 2
function part2() {
  let l = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] == "(") l++;
    else l--;
    if (l < 0) return (i + 1);
  }
}

module.exports = { part1, part2 }
