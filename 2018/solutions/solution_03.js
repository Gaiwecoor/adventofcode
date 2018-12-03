const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_03.txt", "utf8")
  .trim()
  .split("\n");

const parse = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/

const claims = input.map((claim) => {
  let parsed = parse.exec(claim);
  return {
    id: parsed[1],
    x: parseInt(parsed[2], 10),
    y: parseInt(parsed[3], 10),
    w: parseInt(parsed[4], 10),
    h: parseInt(parsed[5], 10)
  }
});

const sheet = [];

// Part 1
function part1() {
  claims.forEach(claim => {
    for (let x = claim.x; x < (claim.x + claim.w); x++) {
      for (let y = claim.y; y < (claim.y + claim.h); y++) {
        if (!sheet[x]) sheet[x] = [];
        if (!sheet[x][y]) sheet[x][y] = 1;
        else sheet[x][y]++;
      }
    }
  });
  let multi = sheet.map(col => col.filter(i => i > 1).length)
    .reduce((a, c) => a + c, 0);

  return multi;
}

// Part 2
function part2() {
  for (let i = 0; i < claims.length; i++) {
    let claim = claims[i];
    let soleClaim = true;
    for (let x = claim.x; x < (claim.x + claim.w); x++) {
      for (let y = claim.y; y < (claim.y + claim.h); y++) {
        if (sheet[x][y] > 1) {
          soleClaim = false;
          break;
        }
      }
      if (!soleClaim) break;
    }
    if (soleClaim) return claim.id;
  }
}

module.exports = { part1, part2 }
