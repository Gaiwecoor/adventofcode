const fs = require("fs");
const test = false;
const input = fs.readFileSync(__dirname + `/../input/input_12${(test ? "_sample" : "")}.txt`, "utf8")
	.trim().split("\n");

class PotLine {
  constructor(input) {
    this.pots = new Map();
    this.growth = {};

    let init = input[0].substr(15).trim();

    this.min = 0;
    this.max = init.length - 1;

    // Set up initial state
    for (let i = 0; i < init.length; i++) {
      this.pots.set(i, init[i]);
    }

    for (let i = 2; i < input.length; i++) {
      let pattern = input[i].split(" => ");
      this.growth[pattern[0]] = pattern[1].trim();
    }

    return this;
  }

  grow(generations = 1) {
    for (let gen = 1; gen <= generations; gen++) {
      let next = new Map();
      // Check existing pots;
      for (let [i, v] of this.pots) {
        next.set(i, this.growth[this.state(i)]);
      }
      // Check edges;
      let min = this.min;
      let max = this.max;
      for (let i = 1; i <= 2; i++) {
        if (this.growth[this.state(max + i)] == "#") {
          next.set(max + i, "#");
          this.max = max + i;
        }
        if (this.growth[this.state(min - i)] == "#") {
          next.set(min - i, "#");
          this.min = min - i;
        }
      }

      this.pots = next;
    }
    return this;
  }

  pot(index) {
    if (!this.pots.has(index)) return ".";
    else return this.pots.get(index);
  }

  state(index) {
    let b = index - 2;
    let st = "";
    for (let i = 0; i < 5; i++) {
      st += this.pot(b + i);
    }
    return st;
  }

  get snapshot() {
    let str = "";
    let sum = 0;
    for (let i = this.min; i <= this.max; i++) {
      if (this.pot(i) == "#") {
        str += "#";
        sum += i;
      } else str += " ";
    }
    str = str.trim();
    return { str, sum };
  }
}

pots = new PotLine(input);

function part1() {
  return pots.grow(20).snapshot.sum;
}

function part2() {
  let old = pots.snapshot;
  let now;
  for (var i = 21; i <= 50000000000; i++) {
    now = pots.grow().snapshot;
    if (now.str == old.str) break;
    old = now;
  }
  return now.sum + ((50000000000 - i) * (now.sum - old.sum));
}

module.exports = { part1, part2 };
