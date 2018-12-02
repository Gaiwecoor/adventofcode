const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_02.txt", "utf8")
  .split("\n")
  .filter(c => c);

// Part 1

function part1() {
  let double = 0;
  let triple = 0;
  input.forEach(line => {
    let letters = line.split("");
    let values = {};
    for (let i = 0; i < letters.length; i++) {
      if (!values[letters[i]]) values[letters[i]] = 0;
      values[letters[i]]++;
    }
    if (Object.values(values).indexOf(2) >= 0) double++;
    if (Object.values(values).indexOf(3) >= 0) triple++;
  });
  return double * triple;
}

// Part 2

function part2() {
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      let a = input[i];
      let b = input[j];
      let diff = 0;
      let same = "";
      for (let k = 0; k < a.length; k++) {
        if (a[k] != b[k]) diff++;
        else (same += a[k]);
        if (diff > 1) break;
      }
      if (diff == 1) return same;
    }
  }
}

module.exports = { part1, part2 }
