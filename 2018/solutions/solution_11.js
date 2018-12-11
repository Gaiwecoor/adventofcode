const SN = 5468;
const grid = new Map();
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

function fuel(x, y, s = 3) {
  let supply;
  if (s == 1) supply = power(x, y);
  else {
    supply = fuelCell.get(`${x},${y}`);
    for (let i = 0; i < s; i++) {
      supply += power(x + s - 1, y + i);
    }
    for (let i = 0; i < s - 1; i++) {
      supply += power(x + i, y + s - 1);
    }
  }
  fuelCell.set(`${x},${y}`, supply);
  return supply;
}

function part1() {
  for (let s = 1; s <= 3; s++) {
    for (let x = 1; x <= 301 - s; x++) {
      for (let y = 1; y <= 301 - s; y++) {
        let pwr = fuel(x, y, s);
        if (s == 3 && (!max || pwr > max.pwr)) max = {pwr, x, y, s};
      }
    }
  }
  //console.log(max);
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
  //console.log(max);
  return `${max.x},${max.y},${max.s}`;
}

module.exports = { part1, part2 };
