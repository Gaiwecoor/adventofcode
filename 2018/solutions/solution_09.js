const fs = require("fs");
const pattern = /(\d+) players; last marble is worth (\d+) points/;

function parse(line) {
  let match = pattern.exec(line);
  return ({
    players: parseInt(match[1], 10),
    last: parseInt(match[2], 10)
  });
}

const config = {
  test: false,
  line: 7
}

class Link {
  constructor(value, newChain = false) {
    this.value = value;
    if (newChain) {
      this.next = this;
      this.previous = this;
    }
    return this;
  }

  insertAfter(item) {
    if (!(item instanceof Link)) item = new Link(item);
    item.previous = this;
    item.next = this.next;
    this.next.previous = item;
    this.next = item;
    return item;
  }

  preceding(n) {
    return (n == 0 ? this : this.previous.preceding(n - 1));
  }

  remove() {
    this.previous.next = this.next;
    this.next.previous = this.previous;
    return this;
  }
}

const input = parse(fs.readFileSync(`${__dirname}/../input/input_09${config.test ? "_sample" : ""}.txt`, "utf8"));

function play(numPlayers, last) {
  let players = Array(numPlayers).fill(0, 0, numPlayers);
  let marble = new Link(0, true);
  marble = marble.insertAfter(1);

  for (let i = 2; i <= last; i++) {
    if (i % 23 != 0) {
      marble = marble.next.insertAfter(i);
    } else {
      let player = (i % numPlayers) + 1;
      let removed = marble.preceding(7).remove();
      players[i % numPlayers] += i + removed.value;
      marble = removed.next;
    }
  }
  return Math.max(...players);
}

// Part 1
function part1() {
  return play(input.players, input.last);
}

// Part 2
function part2() {
  return play(input.players, input.last * 100);
}

module.exports = { part1, part2 }
