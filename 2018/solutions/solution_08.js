const fs = require("fs");
const {Tree, UMap} = require("./utils");
const pattern = /Step (\w+) must be finished before step (\w+) can begin./;

function parse(line) {

}

const config = {
  test: false
}

const input = fs.readFileSync(`${__dirname}/../input/input_08${config.test ? "_sample" : ""}.txt`, "utf8")
  .trim().split(" ").map(i => parseInt(i, 10));

const tree = new Tree();

var nextId = 0;

function extractNode(values, parent = null) {
  let childCount = values.shift();
  let metadataCount = values.shift();
  let metadata = [];
  let id = nextId++;

  tree.addNode(id);
  if (parent != null) tree.connectNodes(parent, id);

  for (let i = 0; i < childCount; i++) {
    extractNode(values, id);
  }
  for (let i = 0; i < metadataCount; i++) {
    metadata.push(values.shift());
  }
  tree.get(id).value = metadata;
}

function nodeValue(node) {
  if (node.children.size == 0) return node.value.reduce((sum, data) => sum += data, 0);

  let sum = 0;

  let children = node.children.toArray().sort();
  node.value.forEach(val => {
    if (children[val - 1]) sum += nodeValue(children[val - 1]);
  });
  return sum;
}

while (input.length > 0) {
  extractNode(input);
}

// Part 1
function part1() {
  return tree.toArray()
    .reduce((metadata, node) => metadata.concat(node.value), [])
    .reduce((sum, value) => sum += value, 0);
}

// Part 2
function part2() {
  let root = tree.find(n => n.root);
  return nodeValue(root);
}

module.exports = { part1, part2 }
