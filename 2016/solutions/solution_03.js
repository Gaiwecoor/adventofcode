const fs = require("fs");
const input = fs.readFileSync(__dirname + "/../input/input_03.txt", "utf8")
  .trim()
  .split("\n")
  .map(i => i.trim().replace(/ +/g, ",").split(",").map(s => parseInt(s, 10)));

function countTriangles(list) {
  return list.map(t => {
    let sum = t.reduce((a, c) => a + c, 0);
    let max = Math.max(...t);

    return (sum > 2 * max);
  })
  .filter(t => t)
  .length;
}

// Part 1
function part1() {
  return countTriangles(input);
}

// Part 2
function part2() {
  let triangles2 = [];
  for (let i = 0; i < input.length; i += 3) {
    for (let j = 0; j < 3; j++)
      triangles2.push([input[i][j], input[i + 1][j], input[i + 2][j]]);
  }
  return countTriangles(triangles2);
}

module.exports = { part1, part2 }
