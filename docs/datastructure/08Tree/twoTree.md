## 一、LeetCode 中二叉树的「标准结构」

在 LeetCode 里，**二叉树节点的定义是固定的**（不用你自己写构造函数，平台已经帮你定义好了）。

**逻辑结构：**

- 每个节点有：

  - `val`：节点值
  - `left`：左子节点（可能是 `null`）
  - `right`：右子节点（可能是 `null`）

```js
{
  val: number,
  left: TreeNode | null,
  right: TreeNode | null
}
```

---

## 二、直观理解二叉树结构

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20240811023816/Introduction-to-Binary-Tree.webp?utm_source=chatgpt.com)

![Image](https://raw.githubusercontent.com/Codecademy/docs/main/media/binary-tree-labeled.png?utm_source=chatgpt.com)

![Image](https://i.ytimg.com/vi/WLvU5EQVZqY/maxresdefault.jpg?utm_source=chatgpt.com)

例如这棵树：

```
      1
     / \
    2   3
       / \
      4   5
```

在 JS 中，每个节点其实就是一个对象：

```js
const root = {
  val: 1,
  left: {
    val: 2,
    left: null,
    right: null,
  },
  right: {
    val: 3,
    left: {
      val: 4,
      left: null,
      right: null,
    },
    right: {
      val: 5,
      left: null,
      right: null,
    },
  },
};
```

⚠️ **刷题时你不用手动构造这棵树**，LeetCode 会把 `root` 直接传给你的函数。

---

## 三、LeetCode JS 题目的函数签名

典型的树题 JS 模板：

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {number}
 */
var someFunction = function (root) {};
```

你要记住的是：

- `root` 可能是 `null`
- `root.left`、`root.right` 也可能是 `null`

## 四、访问二叉树节点（最常用）

### 1️⃣ 访问当前节点

```js
root.val;
```

### 2️⃣ 访问左右子树

```js
root.left;
root.right;
```

### 3️⃣ 判空（非常重要）

```js
if (root === null) return;
```

## 五、二叉树题目的核心思想（99% 都用）

### 🌟 递归是王道

**树 = 根节点 + 左子树 + 右子树**

```js
var traverse = function (root) {
  if (root === null) return;

  // 1. 处理当前节点
  console.log(root.val);

  // 2. 递归左子树
  traverse(root.left);

  // 3. 递归右子树
  traverse(root.right);
};
```

这就是**前序遍历**。


---

## 七、刷树题时的常见坑（JS）

❌ 忘记判空

```js
root.val; // root 可能是 null，会直接报错
```

✅ 正确写法

```js
if (!root) return;
```
