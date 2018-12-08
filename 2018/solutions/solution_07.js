const fs = require("fs");
const {Set, Tree, UMap} = require("./utils");
const pattern = /Step (\w+) must be finished before step (\w+) can begin./;

function parse(line) {
  let match = pattern.exec(line);
  return [match[1], match[2]];
}

const config = {
  workTime: 60,
  workers: 5
}

const input = fs.readFileSync(__dirname + "/../input/input_07.txt", "utf8")
  .trim().split("\n").map(parse);

class Instructions extends Tree {
  constructor(nodeMap) {
    super(nodeMap);
    for (const [index, node] of this) {
      node.value = {
        time: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(index) + config.workTime + 1,
        assigned: false
      };
    }
  }

  get available() {
    return this
      .filter(n => n.root && !n.value.assigned)
      .toArray()
      .sort((a, b) => a.index.localeCompare(b.index));
  }

  booklet() {
    let book = "";
    let steps = this.clone();
    let iterations = 0;
    while (steps.size > 0) {
      let available = steps.filter(n => n.root).map(n => n.index);
      available.sort();
      if (available.length > 0) {
        book += available[0];
        steps.removeNode(available[0]);
      } else break;
    }
    return book;
  }

  clone() {
    let map = [];
    let parents = this.filter(n => n.children.size > 0);
    for (const [index, parent] of parents) {
      for (const [__, child] of parent.children) {
        map.push([index, child.index]);
      }
    }
    return new Instructions(map);
  }

  work(workers) {
    let t = -1;
    let task = new Array(workers);
    let steps = this.clone();
    let active = 0;
    let available;
    let update = true;
    let complete = "";

    while (steps.size > 0 || active > 0) {
      for (let i = 0; i < workers; i++) {
        if (task[i] && task[i].complete <= t) {
          update = true;
          steps.removeNode(task[i].task);
          complete += task[i].task;
          active--;
          task[i] = null;
        }
      }
      if (update) {
        available = steps.available;
        update = false;
      }
      for (let i = 0; i < workers; i++) {
        if (!task[i] && available.length > 0) {
          let nextTask = available.shift();
          task[i] = {
            task: nextTask.index,
            complete: t + nextTask.value.time
          };
          steps.get(nextTask.index).value.assigned = true;
          active++;
        }
      }
      t++;
    }
    return t;
  }
}

const instructions = new Instructions(input);

// Part 1
function part1() {
  return instructions.booklet();
}

// Part 2
function part2() {
  return instructions.work(config.workers);
}

module.exports = { part1, part2 }
