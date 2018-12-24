const fs = require("fs");
const test = false;
const {USet} = require("./utils");
const input = fs.readFileSync(__dirname + `/../input/input_24${test ? "_sample" : ""}.txt`, "utf8").trim().split("\n\n");
const parseUnit = /(\d+) units each with (\d+) hit points (?:\((?:(immune|weak) to ([\w, ]+))?(?:; )?(?:(immune|weak) to ([\w, ]+))?\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/;
/*
  1 - Number of units
  2 - HP
  3 - Damage modifier 1 (weak/immune)
  4 - Damage modifier 1 types
  5 - Damage modifier 2 (weak/immune)
  6 - Damage modifier 2 types
  7 - Atk damage
  8 - Atk type
  9 - Initiative
*/

class System extends USet {
  constructor(input, boost = 0) {
    super();
    input = input.split("\n");
    this.system = input[0].substr(0, input[0].length - 1);
    for (let i = 1; i < input.length; i++) this.add((new UnitGroup(input[i], boost)).setArmy(this));
    return this;
  }

  select(army) {
    for (const group of army) group.targeted = false;
    const groups = this.sort((a, b) => (b.power == a.power ? b.initiative - a.initiative : b.power - a.power));
    for (const group of groups) group.select(army);
    return this;
  }

  get units() {
    let count = 0;
    for (const group of this) {
      count += group.count;
    }
    return count;
  }
}

class UnitGroup {
  constructor(line, boost = 0) {
    let match = parseUnit.exec(line);
    this.count = parseInt(match[1], 10);
    this.hp = parseInt(match[2], 10);
    this.immune = [];
    this.weak = [];
    this.atk = parseInt(match[7], 10) + boost;
    this.type = match[8];
    this.initiative = parseInt(match[9], 10);
    this.targeted = false;
    if (match[3]) this[match[3]] = match[4].split(", ");
    if (match[5]) this[match[5]] = match[6].split(", ");
    return this;
  }

  attack() {
    if (this.count <= 0) return this;
    let atk = this.power;
    if (this.target.immune.includes(this.type)) atk = 0;
    if (this.target.weak.includes(this.type)) atk *= 2;
    if (atk) {
      this.target.count -= Math.floor(atk / this.target.hp);
      if (this.target.count <= 0) this.target.army.delete(this.target);
    }
    return this;
  }

  get power() {
    return this.count * this.atk;
  }

  select(army) {
    let target = army
      .filter(g => !g.targeted && g.weak.includes(this.type))
      .sort((a, b) => (b.power == a.power ? b.initiative - a.initiative : b.power - a.power)).first();
    if (!target) {
      target = army
        .filter(g => !g.targeted && !g.immune.includes(this.type))
        .sort((a, b) => (b.power == a.power ? b.initiative - a.initiative : b.power - a.power)).first();
    }
    if (target) target.targeted = true;
    this.target = target;
    return this;
  }

  setArmy(army) {
    this.army = army;
    return this;
  }
}

function battle(immune, infection) {
  while (immune.size > 0 && infection.size > 0) {
    immune.select(infection);
    infection.select(immune);
    let divisions = new USet();
    let activeImmune = immune.filter(u => u.target);
    for (let group of activeImmune) divisions.add(group);
    let activeInfection = infection.filter(u => u.target);
    for (let group of activeInfection) divisions.add(group);
    divisions = divisions.sort((a, b) => b.initiative - a.initiative);
    for (const div of divisions) div.attack();
    if (divisions.size == 0) break;
  }
  if (immune.size > 0 && infection.size == 0) return {system: immune.system, units: immune.units};
  if (infection.size > 0 && immune.size == 0) return {system: infection.system, units: infection.units};
  return {system: "Stale"};
}

// Part 1
function part1() {
  const immune = new System(input[0]);
  const infection = new System(input[1]);
  return battle(immune, infection).units;
}

// Part 2
function part2() {
  var immune, infection, outcome;
  let i = 0;
  do {
    immune = new System(input[0], ++i);
    infection = new System(input[1]);
    outcome = battle(immune, infection);
  } while (outcome.system != "Immune System");
  return outcome.units;
}

module.exports = { part1, part2 }
