const fs = require("fs");
const pattern = /((\w+\-?)+)\-(\d+)\[(\w+)\]/
const input = fs.readFileSync(__dirname + "/../input/input_04.txt", "utf8")
  .trim().split("\n").map(c => pattern.exec(c));

const alpha = "abcdefghijklmnopqrstuvwxyz";

function validate(room) {
  let code = room[1].replace(/\-/g, "");
  let codeInfo = [];
  for (let i = 0; i < code.length; i++) {
    let info = codeInfo.find(c => c.letter == code[i]);
    if (info) info.freq++;
    else codeInfo.push({letter: code[i], freq: 1});
  }
  codeInfo.sort((a, b) => {
    if (a.freq != b.freq) return b.freq - a.freq;
    else return a.letter.localeCompare(b.letter);
  });
  let check = "";
  for (let i = 0; i < 5; i++) check += codeInfo[i].letter;
  return check == room[4];
}

function decrypt(room) {
  let code = room[1];
  let sector = parseInt(room[3], 10);
  let name = code.split("").map(letter => {
    if (letter == "-") return " ";
    else return alpha[(alpha.indexOf(letter) + sector) % 26];
  }).join("");
  return { name, sector };
}

const rooms = input.filter(validate);

// Part 1
function part1() {
  return rooms.reduce((sum, room) => sum + parseInt(room[3], 10), 0);
}

// Part 2
function part2() {
  return rooms.map(decrypt).find(r => r.name.includes("north")).sector;
}

module.exports = { part1, part2 }
