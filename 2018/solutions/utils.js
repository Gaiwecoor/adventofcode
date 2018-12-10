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

module.exports = { Set, Tree, TreeNode, UMap };
