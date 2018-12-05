const fs = require("fs");

const pattern = /(\w+) \((\d+)\)(?: \-> ((?: ?\w+,?)+))?/

const input = fs.readFileSync(__dirname + "/../input/input_07.txt", "utf8")
  .trim().split("\n").map(i => {
    let match = pattern.exec(i);
    return {
      name: match[1],
      weight: parseInt(match[2], 10),
      children: (match[3] ? match[3].split(", ") : null)
    };
  });

function effectiveWeight(node) {
  if (typeof node == "string") node = input.find(p => p.name == node);

  if (node.effectiveWeight) return node.effectiveWeight;

  node.effectiveWeight = node.weight + (node.children ? node.children.reduce((sum, child) => sum + effectiveWeight(child), 0) : 0);

  return node.effectiveWeight;
}

function findImbalance(node) {
  if (typeof node == "string") node = input.find(p => p.name == node);

  if (node.children && node.children.length == 2) {
    if (effectiveWeight(node.children[0]) == effectiveWeight(node.children[1]))
      return null;
    else {
      console.log("I broke with a 2.", node);
      process.exit();
    }
  } else if (node.children) {
    let balance = node.children.map(child => input.find(p => p.name == child));
    let unbalanced = balance.filter(child => child.effectiveWeight != balance[0].effectiveWeight);

    if (unbalanced.length == 0) return null;
    else if (unbalanced.length > 1) {
      balance[0].neighbors = balance[1].effectiveWeight;
      return balance[0];
    } else {
      unbalanced[0].neighbors = balance[0].effectiveWeight;
      return unbalanced[0];
    }

  } else return null;
}

var root = null;

// Part 1
function part1() {
  let children = [].concat(...input.filter(p => p.children).map(p => p.children));
  root = input.find(p => !children.includes(p.name));
  return root.name;
}

// Part 2
function part2() {
  effectiveWeight(root);
  
  let imbalanced = root;
  let found = false;
  while (!found) {
    let wobble = findImbalance(imbalanced);
    if (wobble) imbalanced = wobble;
    else found = imbalanced;
  }

  let shifted = found.weight + found.neighbors - found.effectiveWeight;
  found.shifted = shifted;
  return found;
}

module.exports = { part1, part2 }
