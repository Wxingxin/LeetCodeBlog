## 1️⃣ 前序遍历（根 → 左 → 右）

### code

```js
var preorderTraversal = function (root) {
  // 用来存放遍历结果的数组
  const res = [];

  // 定义一个深度优先搜索函数（递归）
  const dfs = (node) => {
    // 递归终止条件：
    // 如果当前节点为空，直接返回
    if (!node) return;

    // ① 前序遍历第一步：先处理“当前节点”
    res.push(node.val);

    // ② 递归遍历左子树
    dfs(node.left);

    // ③ 递归遍历右子树
    dfs(node.right);
  };

  // 从根节点开始遍历整棵树
  dfs(root);

  // 返回最终结果
  return res;
};
```

### Data

```
        10
       /  \
      6    15
     / \     \
    3   8     20
```

```js
const root = {
  val: 10,
  left: {
    val: 6,
    left: { val: 3, left: null, right: null },
    right: { val: 8, left: null, right: null },
  },
  right: {
    val: 15,
    left: null,
    right: { val: 20, left: null, right: null },
  },
};
```
### STEP

初始状态

```js
res = [];
dfs(root); // root.val = 10
```

---

🟢 第 1 步：访问 10

```js
res.push(10);
res = [10];
```

递归调用：

- `dfs(6)`（左）
- `dfs(15)`（右，稍后）

---

🟢 第 2 步：访问 6

```js
res.push(6);
res = [10, 6];
```

递归调用：

- `dfs(3)`
- `dfs(8)`

---

🟢 第 3 步：访问 3

```js
res.push(3);
res = [10, 6, 3];
```

- `dfs(null)` → return
- `dfs(null)` → return

✅ 节点 3 处理完，**回到 6**

---

🟢 第 4 步：访问 8

```js
res.push(8);
res = [10, 6, 3, 8];
```

- `dfs(null)` → return
- `dfs(null)` → return

✅ 左子树（6）处理完，**回到 10**

---

🟢 第 5 步：访问 15

```js
res.push(15);
res = [10, 6, 3, 8, 15];
```

- `dfs(null)` → return
- `dfs(20)`

---

🟢 第 6 步：访问 20

```js
res.push(20);
res = [10, 6, 3, 8, 15, 20];
```

- `dfs(null)` → return
- `dfs(null)` → return

---

五、最终返回结果

```js
[10, 6, 3, 8, 15, 20];
```

## 2️⃣ 中序遍历（左 → 根 → 右）

```js
var inorderTraversal = function (root) {
  const res = [];

  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  };

  dfs(root);
  return res;
};
```

```js
var inorderTraversal = function (root) {
  // 用来保存遍历结果
  const res = [];

  // 深度优先搜索（递归）
  const dfs = (node) => {
    // 递归终止条件：节点为空
    if (!node) return;

    // ① 先递归遍历左子树
    dfs(node.left);

    // ② 再处理当前节点（中序的“中”）
    res.push(node.val);

    // ③ 最后递归遍历右子树
    dfs(node.right);
  };

  // 从根节点开始
  dfs(root);

  // 返回结果
  return res;
};
```

## 3️⃣ 后序遍历（左 → 右 → 根）

```js
var postorderTraversal = function (root) {
  const res = [];

  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    res.push(node.val);
  };

  dfs(root);
  return res;
};
```
