const fs = require("fs");
const test = false;
const tracks = fs.readFileSync(__dirname + `/../input/input_13${(test ? "_sample" : "")}.txt`, "utf8");

var carts = [];

class Cart {
  constructor(orientation = "^", x = 0, y = 0) {
    this.orientation = ["^", ">", "v", "<"].indexOf(orientation);
    this.turnCount = 0;
    this.x = x;
    this.y = y;
    this.train = null;
    this.id = null;
    return this;
  }

  get arrow() {
    if (this.orientation < 4)
      return ["^", ">", "v", "<"][this.orientation];
    else return this.orientation;
  }

  get crash() {
    if (this.train.carts.find(c => (c.x == this.x) && (c.y == this.y) && (c.id != this.id))) {
      return true;
    } else return false;
  }

  setTrain(train) {
    this.train = train;
    this.id = train.carts.length;
    return this;
  }

  travel() {
    if (!this.crash) {
      if (this.orientation == 0) this.y--;
      else if (this.orientation == 1) this.x++;
      else if (this.orientation == 2) this.y++;
      else if (this.orientation == 3) this.x--;
      return this.turn(this.train.tracks[this.y][this.x]);
    } else return this;
  }

  turn(dir) {
    if (dir == "+") this.orientation = (this.orientation + [3, 0, 1][this.turnCount++ % 3]) % 4;
    else if (dir == "/") this.orientation = (5 - this.orientation) % 4;
    else if (dir == "\\") this.orientation = (3 - this.orientation);
    return this;
  }
}

class Train {
  constructor(tracks, sort) {
    this.carts = [];
    tracks = tracks.split("\n");
    this.tracks = tracks;
    for (let y = 0; y < tracks.length; y++) {
      for (let x = 0; x < tracks[y].length; x++) {
        if (["^", ">", "v", "<"].includes(tracks[y][x])) {
          this.addCart(tracks[y][x], x, y);
        }
      }
      tracks[y] = tracks[y].replace(/\^|v/g, "|").replace(/<|>/g, "-");
    }
    return this;
  }

  addCart(...args) {
    this.carts.push((new Cart(...args)).setTrain(this));
    return this;
  }

  print(str) {
    for (let y = 0; y < this.tracks.length; y++) {
      let row = "";
      for (let x = 0; x < this.tracks[y].length; x++) {
        let cart = this.carts.find(c => c.x == x && c.y == y);
        if (cart) row += (cart.crash ? "X" : cart.arrow);
        else row += this.tracks[y][x];
      }
      console.log(row);
    }
    return str;
  }

  run(remove = false, print = false) {
    while (this.carts.length > 1) {
      this.carts = this.carts.sort(this.sort);
      if (print) this.print();
      for (let i = 0; i < this.carts.length; i++) {
        let cart = this.carts[i].travel();
        if (cart.crash) {
          if (!remove) return cart;
          let other = this.carts.find(c => c.crash && c != cart);
          i -= (this.carts.indexOf(other) < i ? 2 : 1);
          this.carts = this.carts.filter(c => !c.crash);
        }
      }
    }
    return this.carts[0];
  }

  sort(a, b) {
    if (a.y == b.y) return a.x - b.x;
    else return (a.y - b.y);
  }
}

function part1() {
  let train = new Train(tracks);
  let cart = train.run(false);
  return `${cart.x},${cart.y}`;
}

function part2() {
  let train = new Train(tracks);
  let cart = train.run(true);
  return `${cart.x},${cart.y}`;
}

module.exports = { part1, part2 };
