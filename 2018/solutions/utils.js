class Chain {
  constructor(value) {
    this.previous = null;
    this.next = null;
    this.value = value;
    return this;
  }
  addAfter(value) {
    let part = new Chain(value)
      .setPrevious(this)
      .setNext(this.next);
    if (this.next) this.next.previous = part;
    this.next = part;
    return part;
  }
  addBefore(value) {
    let part = new Chain(value)
      .setPrevious(this.previous)
      .setNext(this);
    if (this.previous) this.previous.next = part;
    this.previous = part;
    return part;
  }
  addToBeginning(value) {
    return this.first.addBefore(value);
  }
  addToEnd(value) {
    return this.last.addAfter(value);
  }
  get chain() {
    let chain = [];
    let link = this.first;
    do {
      chain.push(link.value);
    } while (link = link.next);
    return chain;
  }
  get first() {
    let first = this;
    while (first.previous) {
      first = first.previous;
    }
    return first;
  }
  get last() {
    let last = this;
    while (last.next) {
      last = last.next;
    }
    return last;
  }
  remove(advance = true) {
    this.previous.next = this.next;
    this.next.previous = this.previous;
    return (advance ? this.next : this.previous);
  }
  setNext(part) {
    this.next = part;
    return this;
  }
  setPrevious(part) {
    this.previous = part;
    return this;
  }
}

class TreeNode {
  constructor(index, value = null) {
    this.index = index;
    this.value = value;
    this.children = new UMap();
    this.parents = new UMap();
  }

  addChild(child) {
    this.children.set(child.index, child);
    child.parents.set(this.index, this);
    return this;
  }

  addParent(parent) {
    this.parents.set(parent.index, parent);
    parent.children.set(this.index, this);
    return this;
  }

  removeChild(child) {
    if (typeof child == "string") child = this.children.get(child);
    this.children.delete(child.index);
    child.parents.delete(this.index);
    return this;
  }

  removeParent(parent) {
    if (typeof parent == "string") parent = this.parents.get(parent);
    this.parents.delete(parent.index);
    parent.children.delete(this.index);
    return this;
  }

  get root() {
    return this.parents.size == 0;
  }
}

class UMap extends Map {
  constructor(iterable) {
    super(iterable);
  }

  toArray() {
    const results = new Array(this.size);
    let i = 0;
    for (const [key, value] of this) {
      results[i++] = value;
    }
    return results;
  }

  filter(fn) {
    const results = new UMap();
    for (const [key, value] of this) {
      if (fn(value, key)) results.set(key, value);
    }
    return results;
  }

  find(fn) {
    for (const [key, value] of this) {
      if (fn(value, key)) return value;
    }
    return null;
  }

  first(count) {
    if (count === undefined) return this.values().next().value;
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    count = Math.min(this.size, count);
    const arr = new Array(count);
    const iter = this.values();
    for (let i = 0; i < count; i++) arr[i] = iter.next().value;
    return arr;
  }

  map(fn) {
    const results = new Array(this.size);
    let i = 0;
    for (const [key, value] of this) {
      results[i++] = fn(value, key);
    }
    return results;
  }

  sort(fn = (a, b) => +(a > b) || +(a === b) - 1) {
    return new UMap([...this.entries()].sort((a, b) => fn(a[1], b[1], a[0], b[0])));
  }
}

class Grid extends UMap {
  constructor() {
    super();
    return this;
  }

  get(...coord) {
    let key = JSON.stringify(coord);
    if (super.has(key)) return super.get(key);
    else if (typeof this.default != "undefined") return this.default;
    else return undefined;
  }

  has(...coord) {
    let key = JSON.stringify(coord);
    return super.has(key);
  }

  print() {
    if (!this.boundaries) return this;
    for (let y = this.boundaries.yMin; y <= this.boundaries.yMax; y++) {
      let line = "";
      for (let x = this.boundaries.xMin; x <= this.boundaries.xMax; x++) {
        line += this.get(x, y);
      }
      console.log(line);
    }
    return this;
  }

  set(value, ...coord) {
    let key = JSON.stringify(coord);
    return super.set(key, value);
  }

  setBoundaries(boundaries) {
    this.boundaries = boundaries;
    return this;
  }

  setDefault(value) {
    this.default = value;
    return this;
  }
}

class Tree extends UMap {
  constructor(nodeMap, defaultValue = null) {
    if (nodeMap) {
      let indexes = new Set();
      for (const [parent, child] of nodeMap) indexes.add(parent, child);

      super(indexes.map(i => ([i, new TreeNode(i, defaultValue)])));

      // nodeMap must be an iterable of parent/child pairs
      for (const [parent, child] of nodeMap) this.connectNodes(parent, child);
    } else super();
    return this;
  }

  addNode(index, value = null) {
    this.set(index, new TreeNode(index, value));
    return this;
  }

  clone() {
    let map = [];
    let parents = this.filter(n => n.children.size > 0);
    for (const [index, parent] of parents) {
      for (const [__, child] of parent.children) {
        map.push([index, child.index]);
      }
    }
    return new Tree(map);
  }

  connectNodes(parent, child) {
    if (!(parent instanceof TreeNode)) parent = this.get(parent);
    if (!(child instanceof TreeNode)) child = this.get(child);
    this.get(parent.index).addChild(child);
    return this;
  }

  removeNode(index) {
    let node = this.get(index);
    for (const [key, parent] of node.parents) {
      parent.removeChild(node);
    }
    for (const [key, child] of node.children) {
      child.removeParent(node);
    }
    this.delete(index);
  }
}

class USet extends Set {
  constructor(iterable) {
    super(iterable);
  }

  toArray() {
    const results = new Array(this.size);
    let i = 0;
    for (const item of this) results[i++] = item;
    return results;
  }

  filter(fn) {
    const results = new USet();
    for (const item of this) if (fn(item)) results.add(item);
    return results;
  }

  find(fn) {
    for (const item of this) if (fn(item)) return item;
    return null;
  }

  first(count) {
    if (count === undefined) return this.values().next().value;
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    count = Math.min(this.size, count);
    const arr = new Array(count);
    const iter = this.values();
    for (let i = 0; i < count; i++) arr[i] = iter.next().value;
    return arr;
  }

  map(fn) {
    const results = new Array(this.size);
    let i = 0;
    for (const item of this) results[i++] = fn(item);
    return results;
  }

  sort(fn = (a, b) => (a > b) || (a === b) - 1) {
    return new USet([...this.values()].sort((a, b) => fn(a, b)));
  }
}

module.exports = { Chain, Grid, Tree, TreeNode, UMap, USet };
