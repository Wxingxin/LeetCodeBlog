

# 二、队列（Queue）——先进先出 FIFO

## 1️⃣ 核心思想

> **First In, First Out（先进先出）**

就像：

* 排队买票
* 任务队列
* 消息队列

```
入队 → [1, 2, 3]
出队 → 1
```

---

## 2️⃣ JS 实现（优化版）

⚠️ `Array.shift()` 时间复杂度是 **O(n)**，不推荐
👉 用 **指针模拟队列**

```js
class Queue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.items[this.tail++] = element;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const value = this.items[this.head];
    delete this.items[this.head++];
    return value;
  }

  isEmpty() {
    return this.head === this.tail;
  }

  size() {
    return this.tail - this.head;
  }
}
```

### 使用示例

```js
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

queue.dequeue(); // 1
```

---

## 3️⃣ 常见使用场景

* **BFS（广度优先搜索）**
* 任务调度
* 请求排队
* 生产者 / 消费者模型

---
