const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_05.txt", "utf8")
  .trim();

const alpha = "abcdefghijklmnopqrstuvwxyz";

var pattBuild = [];

for (let i = 0; i < alpha.length; i++) {
  pattBuild.push(alpha[i] + alpha[i].toUpperCase());
  pattBuild.push(alpha[i].toUpperCase() + alpha[i]);
}

const pattern = new RegExp(pattBuild.join("|"), "g");

function react(poly) {
  let inStr = poly;
  let outStr = poly;
  do {
    inStr = outStr;
    outStr = inStr.replace(pattern, "");
  } while (outStr != inStr);
  return outStr
}

// Part 1
function part1() {
  return react(input).length;
}

// Part 2
function part2() {
  let reduced = [];
  for (let i = 0; i < alpha.length; i++) {
    let reducePoly = input.replace(RegExp(alpha[i], "gi"), "");
    reduced.push(react(reducePoly).length);
  }
  reduced.sort((a, b) => a - b);
  return reduced[0];
}

module.exports = { part1, part2 }
