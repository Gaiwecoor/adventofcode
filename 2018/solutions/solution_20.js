const fs = require("fs");
const test = false;
const {USet} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_20${test ? "_sample" : ""}.txt`, "utf8").trim();
let inst = input.substring(1, input.length - 1);
const group = /\(([^\(\)]*)\)/;
const parseGroup = /(\w*)(?:%(\d+)%)?(.*)/;
const groups = new Map();
const paths = new USet();

var i = 0, match
while (match = group.exec(inst)) {
  groups.set(i, match[1]);
  inst = inst.replace(match[0], `%${i++}%`);
}

function parse(map, path = "") {
  let match = parseGroup.exec(map);

  path += match[1];

  if (match[2]) {
    let branches = groups.get(parseInt(match[2], 10)).split("|");

    if (branches[branches.length - 1] == "") { // "Optional path"
      branches[branches.length - 1] = match[3];
      match[3] = "";
    }

    for (let i = 0; i < branches.length; i++) {
      parse(branches[i] + match[3], path);
    }

  } else paths.add(trim(path));
}

function trim(path) {
  const backstep = /NS|EW|SN|WE/;
  let turnPoint = path.search(backstep);
  if (turnPoint != -1) return path.substring(0, turnPoint + 1);
  else return path;
};

// Part 1
function part1() {
  parse(inst);
  return paths.toArray().sort((a, b) => b.length - a.length)[0].length;
}

// Part 2
function part2() {
  let longpaths = paths.filter(p => p.length >= 1000);
  let rooms = new Set();
  for (path of longpaths) {
    for (let i = 1000; i <= path.length; i++) rooms.add(path.substring(0, i));
  }
  return rooms.size;
}

module.exports = { part1, part2 }
