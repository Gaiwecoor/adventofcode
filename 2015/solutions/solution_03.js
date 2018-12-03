const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_03.txt", "utf8")
  .trim();

// Part 1
function part1() {
  let loc = [0, 0];
  let deliveries = new Map([[loc.join(), true]]);
  for (let i = 0; i < input.length; i++) {
    let d = input[i];
    if (d == ">") loc[0]++;
    else if (d == "<") loc[0]--;
    else if (d == "^") loc[1]++;
    else if (d == "v") loc[1]--;

    let pos = loc.join();

    if (!deliveries.has(pos)) deliveries.set(pos, true);
  }
  return deliveries.size;
}

// Part 2
function part2() {
  let loc = [[0, 0], [0, 0]];
  let deliveries = new Map([[loc[0].join(), true]]);
  for (let i = 0; i < input.length; i = i + 2) {
    [input[i], input[i + 1]].forEach((d, s) => {
      if (d == ">") loc[s][0]++;
      else if (d == "<") loc[s][0]--;
      else if (d == "^") loc[s][1]++;
      else if (d == "v") loc[s][1]--;

      let pos = loc[s].join();

      if (!deliveries.has(pos)) deliveries.set(pos, true);
    });
  }
  return deliveries.size;
}

module.exports = { part1, part2 }
