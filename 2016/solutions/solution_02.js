const fs = require("fs");
const turns = fs.readFileSync(__dirname + "/../input/input_02.txt", "utf8")
  .trim()
  .split("\n");
/*const turns = [
  "ULL",
  "RRDDD",
  "LURDL",
  "UUUUD"
];*/
function nav1(loc, dir) {
  if ((dir == "L") && ![1, 4, 7].includes(loc)) {
    loc -= 1;
  } else if ((dir == "R") && ![3, 6, 9].includes(loc)) {
    loc += 1;
  } else if ((dir == "U") && loc > 3) {
    loc -= 3;
  } else if ((dir == "D") && loc < 7) {
    loc +=3;
  }
  return loc;
}

function nav2(loc, dir) {
  if (dir == "L") {
    if (![1, 2, 5, 10, 13].includes(loc)) loc--;
  } else if (dir == "R") {
    if (![1, 4, 9, 12, 13].includes(loc)) loc++;
  } else if (dir == "U") {
    if ([3, 13].includes(loc)) loc -= 2;
    else if ([6, 7, 8, 10, 11, 12].includes(loc)) loc -= 4;
  } else if (dir == "D") {
    if ([1, 11].includes(loc)) loc += 2;
    else if ([2, 3, 4, 6, 7, 8].includes(loc)) loc += 4;
  }
  return loc;
}

// Part 1
function part1() {
  let loc = 5;
  let code = "";
  turns.forEach(spread => {
    loc = spread.split("").reduce(nav1, loc);
    code += loc;
  });
  return code;
}

// Part 2
function part2() {
  let labels = [null,"1","2","3","4","5","6","7","8","9","A","B","C","D"];
  let loc = 5;
  let code = "";
  turns.forEach(spread => {
    loc = spread.split("").reduce(nav2, loc);
    code += labels[loc];
  });
  return code;
}

module.exports = { part1, part2 }
