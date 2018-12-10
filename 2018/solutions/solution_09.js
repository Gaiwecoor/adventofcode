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

const input = parse(fs.readFileSync(`${__dirname}/../input/input_09${config.test ? "_sample" : ""}.txt`, "utf8"));

function play(numPlayers, last) {
  let players = [];
  for (let i = 0; i <= numPlayers; i++) players[i] = 0;
  const circle = [0, 1];
  let p = 1;
  for (let i = 2; i <= last; i++) {
    if (i % 23 != 0) {
      p = (p + 2) % circle.length;
      circle.splice(p, 0, i);
    } else {
      let player = i % numPlayers;
      if (!players[player]) players[player] = 0;
      p -= 7;
      p = (p < 0 ? p += circle.length : p);
      players[(i) % numPlayers] += i + circle.splice(p, 1)[0];
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
