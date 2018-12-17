const fs = require("fs");
const test = false;
const input = fs.readFileSync(__dirname + `/../input/input_16${test ? "_sample" + sample : ""}.txt`, "utf8").split("\n\n\n");
const pattern = /Before: (\[\d+, \d+, \d+, \d+\])\n(\d+ \d+ \d+ \d+)\nAfter:  (\[\d+, \d+, \d+, \d+\])/g

var r = [0, 0, 0, 0];

class Op {
  constructor(fn) {
    this.process = fn;
    this.code = 65535;
    this.resolved = false;
    return this;
  }

  test(before, command, after) {
    let reg1 = JSON.parse(before);
    let reg2 = JSON.parse(after);
    let args = command.split(" ").map(i => parseInt(i, 10));
    r = reg1;
    let op = args.shift();
    this.process(...args);
    for (let i = 0; i < 4; i++) {
      if (r[i] != reg2[i]) {
        this.code &= ~(1 << op);
        return false;
        break;
      }
    }
    return true;
  }
}

const ops = {
  addr: new Op((a, b, c) => r[c] = r[a] + r[b]),
  addi: new Op((a, b, c) => r[c] = r[a] + b),

  mulr: new Op((a, b, c) => r[c] = r[a] * r[b]),
  muli: new Op((a, b, c) => r[c] = r[a] * b),

  banr: new Op((a, b, c) => r[c] = r[a] & r[b]),
  bani: new Op((a, b, c) => r[c] = r[a] & b),

  borr: new Op((a, b, c) => r[c] = r[a] | r[b]),
  bori: new Op((a, b, c) => r[c] = r[a] | b),

  setr: new Op((a, b, c) => r[c] = r[a]),
  seti: new Op((a, b, c) => r[c] = a),

  gtir: new Op((a, b, c) => r[c] = (a > r[b] ? 1 : 0)),
  gtri: new Op((a, b, c) => r[c] = (r[a] > b ? 1 : 0)),
  gtrr: new Op((a, b, c) => r[c] = (r[a] > r[b] ? 1 : 0)),

  eqir: new Op((a, b, c) => r[c] = (a == r[b] ? 1 : 0)),
  eqri: new Op((a, b, c) => r[c] = (r[a] == b ? 1 : 0)),
  eqrr: new Op((a, b, c) => r[c] = (r[a] == r[b] ? 1 : 0))
}

input[1] = input[1].trim().split("\n")
.map(line =>
  line.split(" ")
  .map(n => parseInt(n, 10))
);

// Part 1
function part1() {
  let match;
  let sampleCount = 0;
  while (match = pattern.exec(input[0])) {
    let behaves = 0;
    for (op in ops) {
      if (ops[op].test(match[1], match[2], match[3])) behaves++;
    }
    if (behaves > 2) sampleCount++;
  }
  return sampleCount;
}

// Part 2
function part2() {
  const codes = new Array(16);
  let resolved = 0;

  while (resolved != 65535) {
    for (op in ops) {
      if (!ops[op].resolved) {
        ops[op].code &= ~resolved;
        for (let i = 0; i < 16; i++) {
          if (ops[op].code == 1 << i) {
            ops[op].resolved = true;
            resolved |= 1 << i;
            codes[i] = ops[op];
            break;
          }
        }
      }
    }
  }

  r = [0, 0, 0, 0];

  for (let i = 0; i < input[1].length; i++) {
    let instruction = input[1][i];
    let op = instruction.shift();
    codes[op].process(...instruction);
  }
  return r[0];
}

module.exports = { part1, part2 }
