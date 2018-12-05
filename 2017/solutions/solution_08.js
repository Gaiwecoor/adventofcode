const fs = require("fs");
const pattern = /(\w+) (inc|dec) (-?\d+) if (\w+) ([<>=!]+) (-?\d+)/;
const input = fs.readFileSync(__dirname + "/../input/input_08.txt", "utf8")
  .trim().split("\n").map((inst, i) => {
    let match = pattern.exec(inst);
    if (!match) console.log(i);
    return {
      target: match[1],
      value: parseInt(match[3], 10) * (match[2] == "inc" ? 1 : -1),
      comp: match[4],
      test: match[5],
      thresh: parseInt(match[6], 10)
    }
  });

console.log(input.map(i => i.test).reduce((collection, current) => (collection.includes(current) ? collection : collection.push(current)), []));

function runRegisters() {
  let registers = new Map();
  let max = 0;
  for (let i = 0; i < input.length; i++) {
    let op = input[i];
    if (!registers.has(op.target)) registers.set(op.target, 0);
    if (!registers.has(op.comp)) registers.set(op.comp, 0);

    let toRun = eval(`registers.get(op.comp) ${op.test} op.thresh`);

    if (toRun) {
      let newValue = registers.get(op.target) + op.value;
      if (newValue > max) max = newValue;
      registers.set(op.target, registers.get(op.target) + op.value);
    }
  }

  return {registers, max};
}

const {registers, max} = runRegisters();

// Part 1
function part1() {
  return Math.max(...Array.from(registers.values()));
}

// Part 2
function part2() {
  return max;
}

module.exports = { part1, part2 }
