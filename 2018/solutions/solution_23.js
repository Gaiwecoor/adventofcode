const fs = require("fs");
const test = false;
const {UMap} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_23${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n");

const parse = /pos=<(-?\d+,-?\d+,-?\d+)>, r=(\d+)/;

class Point {
  constructor(line) {
    let match = parse.exec(line);
    this.r = match[2];
    [this.x, this.y, this.z] = match[1].split(",").map(i => parseInt(i, 10));
    return this;
  }

  distance(pt) {
    return Math.abs(pt.x - this.x) + Math.abs(pt.y - this.y) + Math.abs(pt.z - this.z);
  }
}

const bots = input.map(line => new Point(line));

// Part 1
function part1() {
  let strong = bots.sort((a, b) => b.r - a.r)[0];
  let count = 0;
  for (let i = 0; i < bots.length; i++) {
    if (bots[i].distance(strong) <= strong.r) count++;
  }
  return count;
}

// Part 2
function part2() {
/*  DON'T ACTUALLY TRY THIS ... VERY BAD IDEA.
  let grid = new UMap();
  for (let i = 0; i < bots.length; i++) {
    let bot = bots[i];
    console.log("BOT", i);
    console.log(bot);
    for (let z = bot.z - bot.r; z <= bot.z + bot.r; z++) {
      for (let y = bot.y - (bot.r - Math.abs(bot.z - z)); y <= bot.y + (bot.r - Math.abs(bot.z - z)); y++) {
        for (let x = bot.x - (bot.r - Math.abs(bot.z - z) - Math.abs(bot.y - y)); x <= bot.x + (bot.r - Math.abs(bot.z - z) - Math.abs(bot.y - y)); x++) {
          let pt = `${x},${y},${z}`;
          let overlap = grid.get(pt);
          if (!overlap) overlap = 0;
          grid.set(pt, ++overlap);
        }
      }
    }
  }

  let pts = grid.map((count, pt) => ({pt, count}))
    .sort((a, b) => b.count - a.count)
    .filter((pt, i, a) => pt.count == a[0].count)
    .map(pt => pt.pt.split(",").reduce((sum, i) => sum + parseInt(i, 10), 0))
    .sort((a, b) => b - a);

  return pts[0];
*/
}

module.exports = { part1, part2 }
