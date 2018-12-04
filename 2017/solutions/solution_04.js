const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_04.txt", "utf8")
  .trim().split("\n").map(p => p.split(" "));

function stringInfo(info, letter) {
  if (info[letter]) info[letter]++;
  else info[letter] = 1;
  return info;
}

function anagram(a, b) {
  if (a.length != b.length) return false;
  let aInfo = a.split("").reduce(stringInfo, {});
  let bInfo = b.split("").reduce(stringInfo, {});

  if (Object.keys(aInfo).length != Object.keys(bInfo).length) return false;

  for (let l in aInfo) {
    if (!bInfo[l] || (aInfo[l] != bInfo[l])) return false;
  }

  return true;
}

function validate(code) {
  for (let i = 0; i < code.length - 1; i++) {
    for (let j = i + 1; j < code.length; j++) {
      if (code[i] == code[j]) return false;
    }
  }
  return true;
}

function validateAnagram(code) {
  for (let i = 0; i < code.length - 1; i++) {
    for (let j = i + 1; j < code.length; j++) {
      if (anagram(code[i], code[j])) return false;
    }
  }
  return true;
}

// Part 1
function part1() {
  return input.reduce((count, code) => count + (validate(code) ? 1 : 0), 0);
}

// Part 2
function part2() {
  return input.reduce((count, code) => count + (validateAnagram(code) ? 1 : 0), 0);
}

module.exports = { part1, part2, anagram }
