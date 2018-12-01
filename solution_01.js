const fs = require("fs");
const changes = fs.readFileSync("./input_01.txt", "utf8")
  .split("\n")
  .filter(c => c)
  .map(c => parseInt(c, 10));
const log = new Map([[0, 0]]);
var result1 = 0,
  result2 = 0;

// Part 1

result1 = changes.reduce((a, c) => a += c, 0);
console.log("Cumulative shift:", result1);

// Part 2

function checkShifts() {
  for (let i = 0; i < changes.length; i++) {
    result2 += changes[i];
    if (log.has(result2)) {
      console.log("Double frequency found:", result2);
      return;
    } else log.set(result2, true);
  }
  checkShifts();
}

checkShifts();
