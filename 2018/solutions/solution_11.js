const SN = 5468;
const grid = new Map();
const sums = new Map();
const fuelCell = new Map();

var max = null;

function power(x, y) {
  if (grid.has(`${x},${y}`)) return grid.get(`${x},${y}`);
  else {
    let rack = x + 10;
    let pwr = rack * y;
    pwr += SN;
    pwr = pwr * rack;
    pwr = (Math.floor(pwr / 100) % 10) - 5;
    grid.set(`${x},${y}`, pwr);
    return pwr;
  }
}

sums.set("0,0", 0);
sums.set("1,1", power(1, 1));
for (let i = 2; i <= 300; i++) {
  sums.set(`${i},0`, 0);
  sums.set(`0,${i}`, 0);
  sums.set(`${i},1`, sums.get(`${i - 1},1`) + power(i, 1));
  sums.set(`1,${i}`, sums.get(`1,${i - 1}`) + power(1, i));
}
for (let x = 2; x <= 300; x++) {
  for (let y = 2; y <= 300; y++) {
    sums.set(`${x},${y}`, power(x, y) + sums.get(`${x},${y - 1}`) + sums.get(`${x - 1},${y}`) - sums.get(`${x - 1},${y - 1}`));
  }
}

function fuel(x, y, s = 3) {
  return sums.get(`${x - 1},${y - 1}`) + sums.get(`${x + s - 1},${y + s - 1}`) - sums.get(`${x + s - 1},${y - 1}`) - sums.get(`${x - 1},${y + s - 1}`);
}

function part1() {
  let s = 3;
  for (let x = 1; x <= 301 - s; x++) {
    for (let y = 1; y <= 301 - s; y++) {
      let pwr = fuel(x, y);
      if (!max || pwr > max.pwr) max = {pwr, x, y, s};
    }
  }
  return `${max.x},${max.y}`;
}

function part2() {
  for (let s = 4; s <= 300; s++) {
    for (let x = 1; x <= 301 - s; x++) {
      for (let y = 1; y <= 301 - s; y++) {
        let pwr = fuel(x, y, s);
        if (pwr > max.pwr) max = {pwr, x, y, s};
      }
    }
  }
  return `${max.x},${max.y},${max.s}`;
}

module.exports = { part1, part2, fuel, sums, power };
