const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_05.txt", "utf8")
  .trim().split("\n").map(j => parseInt(j, 10));

// Part 1
function part1() {
  let hops = input.slice();
  let l = 0;
  let i = 0;

  while (l >= 0 && l < hops.length) {
    i++;
    l += hops[l]++;
  }

  return i;
}

// Part 2
function part2() {
  let hops = input.slice();
  let l = 0;
  let i = 0;

  while (l >= 0 && l < hops.length) {
    i++;
    let p = l;
    l += hops[l];
    hops[p] += (hops[p] >= 3 ? -1 : 1 );
  }

  return i;
}

module.exports = { part1, part2 }
