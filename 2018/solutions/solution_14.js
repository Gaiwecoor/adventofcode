const input = 540561;
const inStr = input.toString();
const recipes = [3, 7];
var i, j;

// Part 1
function part1() {
  i = 0;
  j = 1;
  while (recipes.length < input + 10) {
    let sum = recipes[i] + recipes[j];
    if (sum > 9) recipes.push(Math.floor(sum / 10), sum % 10);
    else recipes.push(sum);
    i = (i + recipes[i] + 1) % recipes.length;
    j = (j + recipes[j] + 1) % recipes.length;
  }
  return recipes.slice(input, input + 10).join("");
}

// Part 2
function part2() {
  let string = recipes.join("");
  let stringPos = 0;
  while (string.indexOf(inStr) < 0) {
    while (string.length > 0 && !inStr.startsWith(string)) {
      string = string.substr(1);
      stringPos++;
    }
    let sum = recipes[i] + recipes[j];
    if (sum > 9) recipes.push(Math.floor(sum / 10), sum % 10);
    else recipes.push(sum);
    string += sum;
    i = (i + recipes[i] + 1) % recipes.length;
    j = (j + recipes[j] + 1) % recipes.length;
  }
  return position = stringPos + string.indexOf(inStr);
}

module.exports = { part1, part2 }
