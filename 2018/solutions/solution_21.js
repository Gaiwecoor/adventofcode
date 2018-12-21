const fs = require("fs");
const test = false;
const {USet} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_21${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

const r = [0, 0, 0, 0, 0, 0];
var ip = 0;
const bind = parseInt(input.shift().split(" ")[1], 10);

class Op {
  constructor(fn) {
    this.process = fn;
    this.code = 65535;
    this.resolved = false;
    return this;
  }

  exec(a, b, c) {
    r[bind] = ip;
    this.process(a, b, c);
    ip = r[bind] + 1;
    return r;
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

// Part 1
function part1() {
  while (ip < input.length) {
    if (ip == 28) return r[5];
    let inst = input[ip].split(" ");
    let op = inst.shift();
    inst = inst.map(i => parseInt(i, 10));
    ops[op].exec(...inst);
  }
}

// Part 2
function part2() {
  r.fill(0);
  ip = 0;
  let last = null;
  let values = new USet();
  while (ip < input.length) {
    if (ip == 28) {
      if (values.has(r[5])) return last;
      else {
        last = r[5];
        values.add(r[5]);
      }
    }
    let inst = input[ip].split(" ");
    let op = inst.shift();
    inst = inst.map(i => parseInt(i, 10));
    ops[op].exec(...inst);
  }
}

module.exports = { part1, part2 }
