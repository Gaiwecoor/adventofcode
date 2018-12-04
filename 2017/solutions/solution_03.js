const fs = require("fs");
const input = 277678;
function points(value) {
  var ring = Math.ceil((Math.sqrt(value) + 1) / 2) - 1;
  var compass = [
    (2 * ring - 1) ** 2 + ring,
    (2 * ring - 1) ** 2 + 3 * ring,
    (2 * ring + 1) ** 2 - 3 * ring,
    (2 * ring + 1) ** 2 - ring
  ];
  var angle = Math.min(...compass.map(p => Math.abs(p - value)));

  for (let i = 0; i < compass.length; i++) {
    if (Math.abs(compass[i] - value) == angle) {
      var dir = i;
      break;
    }
  }

  if (dir == 0) {
    var x = ring;
    var y = value - compass[dir];
  } else if (dir == 1) {
    var x = compass[dir] - value;
    var y = ring;
  } else if (dir == 2) {
    var x = -ring;
    var y = compass[dir] - value;
  } else if (dir == 3) {
    var x = value - compass[dir];
    var y = -ring;
  }

  return { ring, angle, x, y }
}

// Part 1
function part1() {
  let {ring, angle} = points(input);
  return ring + angle;
}

// Part 2
function part2() {
  let value = 1;
  let address = new Map([["0,0", value]]);

  let i = 1;
  while (value <= input) {
    i++;
    let {x, y} = points(i);
    value = 0;
    for (let a = x - 1; a <= x + 1; a++) {
      for (let b = y - 1; b <= y + 1; b++) {
        let pos = [a, b].join()
        if (address.has(pos)) value += address.get(pos);
      }
    }
    address.set([x, y].join(), value);
  }

  return value;
}

module.exports = { part1, part2 }
