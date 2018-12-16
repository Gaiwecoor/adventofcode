const { USet, Chain } = require("./utils");

class Pathfinder {
  constructor(...args) {
    if (Array.isArray(args[0])) this.grid = args[0];
    else if (args.length == 2) this.grid = (new Array(args[1])).fill((new Array(args[0])).fill(true));
    else this.grid = null;
    return this;
  }

  _findDistance(step) {
    return this._generatePath(step).length;
  }

  _generatePath(step) {
    let path = new Chain(step);
    while (path.value.previous) {
      path = path.addBefore(path.value.previous);
    }
    return path.chain;
  }

  findPath(pointA, pointB, routing = true) {
    let queue = new Chain(new PathStep(pointA));
    let log = new Set([queue.value.label]);
    do {
      if (queue.value.distanceTo(pointB) == 0) {
        return (routing ? this._generatePath(queue.value) : this._findDistance(queue.value));
      } else {
        // Peek at neighbors
        let neighbors = queue.value.adjacent.filter(pt => (this.grid[pt.y][pt.x] || pt.distanceTo(pointB) == 0) && !log.has(pt.label));
        for (const pt of neighbors) {
          if (pt.distanceTo(pointB) == 0) {
            return (routing ? this._generatePath(pt) : this._findDistance(pt));
          } else {
            queue.addToEnd(pt);
            log.add(pt.label);
          }
        }
      }
    } while (queue = queue.next);
    return (routing ? [] : null);
  }

  setBlocked(point, blocked = true) {
    this.grid[point.y][point.x] = !blocked;
    return this;
  }

  setPassable(point, passable = true) {
    this.grid[point.y][point.x] = passable;
    return this;
  }
}

class Point {
  constructor(point) {
    this.x = point.x;
    this.y = point.y;
    return this;
  }

  get adjacent() {
    return new USet()
    .add(new Point({x: this.x, y: this.y - 1}))
    .add(new Point({x: this.x - 1, y: this.y}))
    .add(new Point({x: this.x + 1, y: this.y}))
    .add(new Point({x: this.x, y: this.y + 1}));
  }

  get label() {
    return `${this.x},${this.y}`;
  }

  distanceTo(point) {
    return Math.abs(this.x - point.x) + Math.abs(this.y - point.y);
  }
}

class PathStep extends Point {
  constructor(point, previous = null) {
    super(point);
    this.previous = previous;
    this.step = (previous ? previous.step + 1 : 0);
    return this;
  }

  get adjacent() {
    return new USet()
    .add(new PathStep({x: this.x, y: this.y - 1}, this))
    .add(new PathStep({x: this.x - 1, y: this.y}, this))
    .add(new PathStep({x: this.x + 1, y: this.y}, this))
    .add(new PathStep({x: this.x, y: this.y + 1}, this));
  }
}

module.exports = {Pathfinder, Point};
