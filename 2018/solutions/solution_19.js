const fs = require("fs");
const test = false;
const input = fs.readFileSync(__dirname + `/../input/input_19${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

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
    let inst = input[ip].split(" ");
    let op = inst.shift();
    inst = inst.map(i => parseInt(i, 10));
    ops[op].exec(...inst);
  }
  return r[0];
}

// Part 2
function part2() {
  /********************************************************************
  **  NOTE: Closer examination of the instructions showed that it    **
  **  was seeking the sum of all factors of the number 10551340.     **
  **  This feels like the cheater way, but it gets the answer.       **
  *********************************************************************/
  let c = 10551340;
  let limit = Math.sqrt(c);
  let factors = [];
  for (let i = 1; i < limit; i++) {
    if (c % i == 0) factors.push(i, c / i);
  }
  return factors.reduce((sum, factor) => sum + factor, 0);
}

module.exports = { part1, part2 }
