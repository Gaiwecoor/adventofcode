const fs = require("fs");
const turns = fs.readFileSync(__dirname + "/../input/input_01.txt", "utf8")
  .trim()
  .split(", ");

function route(n) {
  let dir = n[0];
  let dis = parseInt(n.substr(1), 10);

  if (dir == "R") {
    loc.o++;
    loc.o %= 4;
  } else {
    loc.o--;
    if (loc.o < 0) loc.o += 4;
  }
}

// Part 1
function part1() {
  let loc = { o: 0, x: 0, y: 0 };
  turns.forEach(n => {
    let dir = n[0];
    let dis = parseInt(n.substr(1), 10);

    if (dir == "R") {
      loc.o++;
      loc.o %= 4;
    } else {
      loc.o--;
      if (loc.o < 0) loc.o += 4;
    }

    if (loc.o == 0) loc.y += dis;
    else if (loc.o == 1) loc.x += dis;
    else if (loc.o == 2) loc.y -= dis;
    else if (loc.o == 3) loc.x -= dis;
  });
  return (Math.abs(loc.x) + Math.abs(loc.y));
}

// Part 2
function part2() {
  let loc = { o: 0, x: 0, y: 0 };
  let route = ["0,0"];
  for (let i = 0; i <= turns.length; i++) {
    let n = turns[i];
    let dir = n[0];
    let dis = parseInt(n.substr(1), 10);

    if (dir == "R") {
      loc.o++;
      loc.o %= 4;
    } else {
      loc.o--;
      if (loc.o < 0) loc.o += 4;
    }

    for (let d = 0; d < dis; d++) {
      if (loc.o == 0) loc.y++;
      else if (loc.o == 1) loc.x++;
      else if (loc.o == 2) loc.y--;
      else if (loc.o == 3) loc.x--;

      let pos = [loc.x, loc.y].join();
      if (route.includes(pos)) return (Math.abs(loc.x) + Math.abs(loc.y));
      else route.push(pos);
    }
  };
}

module.exports = { part1, part2 }
