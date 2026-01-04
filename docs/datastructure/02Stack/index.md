# STACK

## BASE KNOWDLOG

### 栈（stack），它是一种受限的线性表,后进先出(LIFO)

其限制是仅允许在表的一端进行插入和删除运算。这一端被称为栈顶，相对地，把另一端称为栈底。

LIFO（lastinfirstout）表示就是后进入的元素，第一个弹出栈空间.类似于自动餐托盘，最后放上的托盘，往往先把拿出去使用

向一个栈插入新元素又称作进栈、入栈或压栈，它是把新元素放到栈顶元素的上面，使之成为新的栈顶元素;

从一个栈删除元素又称作出栈或退栈，它是把栈顶元素删除掉，使其相邻的元素成为新的栈顶元素。

### 生活中类似于栈的

自助餐的托盘，最新放上去的，最先被客人拿走使用

收到很多的邮件(实体的)，从上往下依次处理这些邮件. (最新到的邮件，最先处理)

注意：不允许改变邮件的次序，比如从最小开始，或者处于最紧急的邮件，否则就不再是栈结构了.而是队列或者优先级队列结构.

# 一、栈（Stack）——后进先出 LIFO

## 1️⃣ 核心思想

> **Last In, First Out（后进先出）**

就像：

- 叠盘子
- 浏览器 **返回按钮**
- 函数调用栈（Call Stack）

```
入栈 → [1, 2, 3]
出栈 → 3
```

---

## 2️⃣ JS 实现（用 Array）

### Function

```js
1. push element

2. pop element

3. View the top element of the stack.

4. Check if the stack is empty.

5. Get stack all element

6. toSring function
```

```js
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  toString() {
    let resultString = "";
    for (let i = 0; i < this.items.length; i++) {
      resultString = resultString + this.itmes[i] + "";
    }
    return resultString;
  }
}
```

### 使用示例

```js
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);

stack.pop(); // 3
stack.peek(); // 2
```
