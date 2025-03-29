class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.isEmpty() ? "Queue is empty" : this.items.shift();
  }

  peek() {
    return this.isEmpty() ? "Queue is empty" : this.items[0];
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = Queue;
