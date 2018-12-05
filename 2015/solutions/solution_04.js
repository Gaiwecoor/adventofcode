const md5 = require("md5");
const input = "ckczppom";

function findZeroes(n) {
  let output = null,
    m = null,
    i = 0,
    match = "";
    for (let j = 0; j < n; j++) match += "0";
    while (!output) {
      i++;
      m = md5(input + i);
      if (m.startsWith(match)) output = i;
    }
    return { output, m };
}

// Part 1
function part1() {
  return findZeroes(5).output;
}

// Part 2
function part2() {
  return findZeroes(6).output;
}

module.exports = { part1, part2 }
