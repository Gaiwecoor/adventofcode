const fs = require("fs");
const test = false;
const input = fs.readFileSync(__dirname + `/../input/input_18${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

class Field {
  constructor(input) {
    this.acreage = input;
    this.age = 0;
    this.states = new Map([[this.acreage.join(), this.age]]);
  }

  countAdjacent(pointX, pointY) {
    let adjacent = {".": 0, "|": 0, "#": 0};
    for (let y = Math.max(pointY - 1, 0); y <= Math.min(pointY + 1, this.acreage.length - 1); y++) {
      for (let x = Math.max(pointX - 1, 0); x <= Math.min(pointX + 1, this.acreage[y].length - 1); x++) {
        if (y == pointY && x == pointX) continue;
        adjacent[this.acreage[y][x]]++;
      }
    }
    return adjacent;
  }

  grow(minutes = 1) {
    let looped = false;
    for (let i = 0; i < minutes; i++) {
      let newGrowth = new Array(this.acreage.length).fill("");
      for (let y = 0; y < this.acreage.length; y++) {
        for (let x = 0; x < this.acreage[y].length; x++) {
          let adjacent = this.countAdjacent(x, y);
          if (this.acreage[y][x] == "." && adjacent["|"] >= 3) newGrowth[y] += "|";
          else if (this.acreage[y][x] == "|" && adjacent["#"] >= 3) newGrowth[y] += "#";
          else if (this.acreage[y][x] == "#" && !(adjacent["#"] >= 1 && adjacent["|"] >= 1)) newGrowth[y] += ".";
          else newGrowth[y] += this.acreage[y][x];
        }
      }
      this.age++;
      this.acreage = newGrowth;
      let state = newGrowth.join();
      if (!looped && this.states.has(state)) {
        let first = this.states.get(state);
        let loop = this.age - first;
        i += Math.floor((minutes - i) / loop) * loop;
        looped = true;
      } else this.states.set(state, this.age);
    }
    return this;
  }

  get lumberyards() {
    let lumberyards = 0;
    for (let y = 0; y < this.acreage.length; y++) {
      for (let x = 0; x < this.acreage[y].length; x++) {
        if (this.acreage[y][x] == "#") lumberyards++;
      }
    }
    return lumberyards;
  }

  print(type = null) {
    if (type) {
      for (let y = 0; y < this.acreage.length; y++) {
        let line = "";
        for (let x = 0; x < this.acreage[y].length; x++) {
          line += this.countAdjacent(x, y)[type];
        }
        console.log(line);
      }
      return this;
    }
    for (let y = 0; y < this.acreage.length; y++) console.log(this.acreage[y]);
    console.log("================================");
    return this;
  }

  get value() {
    return this.wooded * this.lumberyards;
  }

  get wooded() {
    let wooded = 0;
    for (let y = 0; y < this.acreage.length; y++) {
      for (let x = 0; x < this.acreage[y].length; x++) {
        if (this.acreage[y][x] == "|") wooded++;
      }
    }
    return wooded;
  }
}

const woodland = new Field(input);

// Part 1
function part1() {
  return woodland.grow(10).value;
}

// Part 2
function part2() {
  return woodland.grow(1000000000 - 10).value;
}

module.exports = { part1, part2 }
