const fs = require("fs");
const {USet} = require("./utils");
const test = false;
const sample = "6";
const {Pathfinder, Point} = require("./pathfinder");
const input = fs.readFileSync(__dirname + `/../input/input_15${test ? "_sample" + sample : ""}.txt`, "utf8").trim();

function parseMap(input) {
  let cavern = input.replace(/#|\./g, " ").split("\n");
  for (let y = 0; y < cavern.length; y++) {
    for (let x = 0; x < cavern[y].length; x++) {
      if (cavern[y][x] != " ") army.addUnit({type: cavern[y][x], x: x, y: y});
    }
  }
  return input.split("\n").map(y => y.split("").map(x => (x == "." ? 0 : 1)));
};

function readingOrder(fn = null) {
  return (a, b) => {
    if (fn && fn(a, b) != 0) return fn(a, b);
    else if (a.y == b.y) return (a.x - b.x);
    else return (a.y - b.y);
  }
}

class Army {
  constructor(input, elfPower = 3) {
    this.units = new USet();
    this.field = new Pathfinder(
      input
      .split("\n")
      .map(y =>
        y.split("")
        .map(x =>
          (x == ".")
        )
      )
    );
    this.complete = false;

    let cavern = input.replace(/#|\./g, " ").split("\n");
    for (let y = 0; y < cavern.length; y++) {
      for (let x = 0; x < cavern[y].length; x++) {
        if (cavern[y][x] != " ") this.addUnit({type: cavern[y][x], x: x, y: y, atk: (cavern[y][x] == "E" ? elfPower : 3)});
      }
    }

    return this;
  }

  addUnit(info) {
    info.army = this;
    this.units.add(new Unit(info));
    return this;
  }

  adjacent(units) {
    let adjacent = new USet();
    for (let unit of units) {
      for (let adj of unit.adjacent) adjacent.add(adj);
    }
    return adjacent.filter(unit => this.field.grid[unit.y][unit.x]);
  }

  faction(type, getType = true, filter = null) {
    if (getType) return this.units.filter(unit => unit.type == type && (!filter || filter(unit)));
    else return this.units.filter(unit => unit.type != type && (!filter || filter(unit)));
  }

  get map() {
    let map = new Array(this.field.grid.length);
    for (let y = 0; y < this.field.grid.length; y++) {
      map[y] = new Array(this.field.grid[y].length);
      for (let x = 0; x < this.field.grid[y].length; x++) {
        map[y][x] = (this.field.grid[y][x] ? " " : "#");
      }
    }

    this.units.forEach(unit => map[unit.y][unit.x] = unit.type);
    for (let y = 0; y < this.field.grid.length; y++) map[y] = map[y].join("");
    return map;
  }

  get marchingOrder() {
    return this.units.toArray().sort(readingOrder());
  }

  overlay(pts, symbol = "!") {
    let map = this.map;
    for (let i = 0; i < map.length; i++) map[i] = map[i].split("");
    for (let pt of pts) map[pt.y][pt.x] = symbol;
    for (let i = 0; i < map.length; i++) map[i] = map[i].join("");
    console.log(map);
    return map;
  }

  sortUnits() {
    return this.units.toArray().sort(readingOrder());
  }
}

class Unit extends Point {
  constructor(info) {
    super(info);
    this.atk = 3;
    this.def = 0;
    this.hp = 200;
    for (let x in info) {
      this[x] = info[x];
    }
    return this;
  }

  attack(enemy) {
    enemy.hp -= Math.max(this.atk - this.def, 0);
    if (enemy.hp <= 0) enemy.die();
    return this;
  }

  get dead() {
    return this.hp <= 0;
  }

  die() {
    this.hp = 0;
    if (this.army) {
      this.army.field.setPassable(this);
      this.army.units.delete(this);
      if (this.army.faction(this.type).size == 0) this.army.complete = true;
    }
    return this;
  }

  move() {
    if (this.target) return this; // Unit is already adjacent to an enemy.
    else {
      // Unit is not in range. Find nearest enemy.
      let enemies = this.army.faction(this.type, false);
      if (enemies.size == 0) return this; // Nobody to attack!

      let destinations = this.army.adjacent(enemies);
      let min = null;
      let nearest = [];
      for (let point of destinations) {
        let dist = this.army.field.findPath(this, point, false);
        if (dist) {
          if (min === null || dist == min) {
            min = dist;
            nearest.push(point);
          } else if (dist < min) {
            min = dist;
            nearest = [point];
          }
        }
      }
      if (nearest.length == 0) return this; // Nowhere to go. *shrug*
      let target = nearest.sort(readingOrder())[0];
      let steps = this.adjacent.filter(pt => this.army.field.grid[pt.y][pt.x]);
      min = null;
      nearest = [];

      for (const point of steps) {
        let dist = this.army.field.findPath(point, target, false);
        if (dist) {
          if (min === null || dist == min) {
            min = dist;
            nearest.push(point);
          } else if (dist < min) {
            min = dist;
            nearest = [point];
          }
        }
      }
      if (nearest.length == 0) return this; // No available steps. *shrug*
      let step = nearest.sort(readingOrder())[0];

      this.army.field.setPassable(this);
      this.x = step.x;
      this.y = step.y;
      this.army.field.setBlocked(this);
      return this;
    }
  }

  get target() {
    return this.army.faction(this.type, false, (unit) => this.distanceTo(unit) == 1).toArray().sort(readingOrder((a, b) => a.hp - b.hp))[0];
    //return this.army.units.filter(unit => unit.type != this.type && this.distanceTo(unit) == 1).toArray().sort(readingOrder((a, b) => a.hp - b.hp))[0];
  }

  turn() {
    this.move();
    let target = this.target;
    if (target) {
      this.attack(target);
    }
    return this;
  }

}

// Part 1
function part1() {
  let army = new Army(input);
  let turn = 0;
  while (!army.complete) {
    let marchingOrder = army.marchingOrder;
    let unitNum;
    for (unitNum = 0; unitNum < marchingOrder.length; unitNum++) {
      if (army.complete) break;
      let unit = marchingOrder[unitNum];
      if (!unit.dead) {
        unit.turn();
      }
    }
    if (unitNum == marchingOrder.length) turn++;
  }

  let teamHealth = 0;
  if (army.faction("E").size == 0) {
    for (let unit of army.faction("G")) {
      teamHealth += unit.hp;
    }
  } else if (army.faction("G").size == 0) {
    for (let unit of army.faction("E")) {
      teamHealth += unit.hp;
    }
  }
  return turn * teamHealth;
}

// Part 2
function part2() {
  let atk = 3;
  const elfCount = input.split("").filter(pt => pt == "E").length;

  while (true) {
    atk++;
    let army = new Army(input, atk);

    let turn = 0;
    while (army.faction("E").size == elfCount && !army.complete) {
      let marchingOrder = army.marchingOrder;
      let unitNum;
      for (unitNum = 0; unitNum < marchingOrder.length; unitNum++) {
        if (army.complete) break;
        let unit = marchingOrder[unitNum];
        if (!unit.dead) {
          unit.turn();
        }
      }
      if (unitNum == marchingOrder.length) turn++;
    }

    if (army.faction("E").size != elfCount) continue;

    let teamHealth = 0;
    if (army.faction("E").size == 0) {
      for (let unit of army.faction("G")) {
        teamHealth += unit.hp;
      }
    } else if (army.faction("G").size == 0) {
      for (let unit of army.faction("E")) {
        teamHealth += unit.hp;
      }
    }
    return turn * teamHealth;
  }
}

module.exports = { part1, part2 }
