

# 三、链表（Linked List）——非连续存储

## 1️⃣ 核心思想

> 每个节点存 **值 + 指针**

```
value | next
```

```
1 → 2 → 3 → null
```

### 特点

✅ 插入 / 删除快
❌ 随机访问慢（不能像数组 nums[i]）

---

## 2️⃣ 单向链表实现

### 节点

```js
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

### 链表

```js
class LinkedList {
  constructor() {
    this.head = null;
  }

  append(value) {
    const node = new ListNode(value);

    if (!this.head) {
      this.head = node;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }

    current.next = node;
  }

  remove(value) {
    if (!this.head) return;

    if (this.head.value === value) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
    }
  }
}
```

---

## 3️⃣ 链表经典题型（非常重要）

* 反转链表
* 快慢指针（环形链表）
* 合并有序链表
* 删除倒数第 N 个节点

### 反转链表（必背）

```js
var reverseList = function(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
};
```

---

# 四、三种数据结构对比总结

| 结构 | 特点   | 访问   | 插入/删除 | 常见用途     |
| -- | ---- | ---- | ----- | -------- |
| 栈  | 后进先出 | O(1) | O(1)  | 回溯、表达式   |
| 队列 | 先进先出 | O(1) | O(1)  | BFS、任务调度 |
| 链表 | 非连续  | O(n) | O(1)  | 频繁插删     |

---

# 五、你现在怎么学最有效（建议）

你可以按这个顺序练 👇
1️⃣ 栈 → 括号匹配
2️⃣ 队列 → BFS
3️⃣ 链表 → 反转 / 快慢指针

如果你愿意，我可以：

* 🔥 给你 **LeetCode 对应题目清单**
* 🔥 用 **动画思路一步步走指针**
* 🔥 把它们和 **实际前端场景（事件循环、任务队列）** 结合讲

你想从 **哪一个结构的题目** 开始刷？
