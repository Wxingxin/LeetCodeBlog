# 题

`Trie（发音类似 "try"）`或者说 前缀树 是一种`树形数据结构`，

用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 `Trie 类`：

`Trie()` 初始化前缀树对象。

`void insert(String word)` 向前缀树中插入字符串 `word` 。

`boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false` 。

`boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix` ，返回 `true` ；否则，返回 `false` 。

## 示例：

输入：

`["Trie", "insert", "search", "search", "startsWith", "insert", "search"]`

`[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]`

输出：

`[null, null, true, false, true, null, true]`

解释：

`Trie trie = new Trie();`

`trie.insert("apple");`

`trie.search("apple");` // 返回 True

`trie.search("app");  ` // 返回 False

`trie.startsWith("app");` // 返回 True

`trie.insert("app");`

`trie.search("app");` // 返回 True

# 解题

## 思路

### 1️⃣ Trie 是什么？

**Trie（前缀树）**是一种专门用于处理字符串的树形结构，特点是：

- 每一层表示一个字符
- 从根到某个节点的路径，代表一个字符串前缀
- 非常适合做：

  - 单词搜索
  - 前缀匹配
  - 自动补全

---

### 2️⃣ 数据结构设计

- **每个节点**：一个对象（HashMap）

  - key：字符
  - value：下一个节点

- **isEnd 标记**：

  - 用来区分：

    - `app` 是不是一个完整单词
    - 还是只是 `apple` 的前缀

示意：

```
root
 └─ a
    └─ p
       └─ p (isEnd = true)
          └─ l
             └─ e (isEnd = true)
```

```
root = {
  a: {
    p: {
      p: {
        isEnd: true,      // "app" 到这里结束
        l: {
          e: {
            isEnd: true   // "apple" 到这里结束
          }
        }
      }
    }
  }
}
```

---

### 3️⃣ 三个核心操作

✅ insert(word)

- 从根节点开始
- 按字符逐层创建/复用节点
- 在单词末尾标记 `isEnd = true`

✅ search(word)

- 必须：

  1. 路径完整存在
  2. 最后一个节点的 `isEnd === true`

✅ startsWith(prefix)

- 只要求前缀路径存在
- 不关心是否是完整单词

---

### 4️⃣ 复杂度分析

设字符串长度为 `L`：

- **插入**：`O(L)`
- **搜索**：`O(L)`
- **前缀判断**：`O(L)`
- **空间复杂度**：`O(所有字符总数)`

## code

```js
// Trie 构造函数
// 每个 Trie 节点本质上是一个对象（Hash Map）
var Trie = function () {
  // root 是整棵前缀树的根节点
  this.root = {};
};

/**
 * 插入单词
 * @param {string} word
 * @return {void}
 */
Trie.prototype.insert = function (word) {
  // 从根节点开始
  let node = this.root;

  // 遍历单词中的每一个字符
  for (const char of word) {
    // 如果当前节点没有这个字符对应的子节点
    if (!node[char]) {
      // 创建一个新的节点
      node[char] = {};
    }

    // 移动到该字符对应的子节点
    node = node[char];
  }

  // 单词遍历结束，在最后一个节点做结束标记
  node.isEnd = true;
};

/**
 * 搜索完整单词
 * @param {string} word
 * @return {boolean}
 */
Trie.prototype.search = function (word) {
  let node = this.root;

  // 按字符向下查找
  for (const char of word) {
    // 如果路径中断，说明单词不存在
    if (!node[char]) return false;
    node = node[char];
  }

  // 必须走到单词结尾，并且该节点是一个单词的结尾
  return node.isEnd === true;
};

/**
 * 判断是否存在某个前缀
 * @param {string} prefix
 * @return {boolean}
 */
Trie.prototype.startsWith = function (prefix) {
  let node = this.root;

  // 只要前缀路径存在即可，不要求 isEnd
  for (const char of prefix) {
    if (!node[char]) return false;
    node = node[char];
  }

  return true;
};
```

## 一、Trie 的核心思想（先建立直觉）

Trie 本质是：

- **每个节点表示一个字符**
- **从根节点到某个节点的一条路径 = 一个字符串的前缀**
- 用一个标志位 `isEnd` 表示：
  👉 **是否有单词在这里结束**

### 节点结构（逻辑）

```js
{
  children: { 'a': nodeA, 'p': nodeP, ... },
  isEnd: false
}
```

---

## 二、整体数据结构设计

### 1️⃣ Trie 构造函数

```js
var Trie = function () {
  this.root = {
    children: {},
    isEnd: false,
  };
};
```

- `root` 不存字符，只是起点
- `children`：哈希表（JS 对象）
- `isEnd`：标记完整单词结束

---

## 三、insert(word)：插入单词

### 思路（非常重要）

1. 从 `root` 开始
2. 遍历 `word` 的每个字符
3. 如果当前字符不存在 → 创建新节点
4. 移动到该字符节点
5. 单词结束 → 标记 `isEnd = true`

### 代码

```js
Trie.prototype.insert = function (word) {
  let node = this.root;

  for (const ch of word) {
    if (!node.children[ch]) {
      node.children[ch] = {
        children: {},
        isEnd: false,
      };
    }
    node = node.children[ch];
  }

  node.isEnd = true;
};
```

---

## 四、search(word)：查完整单词

### 思路

- 必须：

  1. 路径存在
  2. **最后一个字符节点的 `isEnd === true`**

### 代码

```js
Trie.prototype.search = function (word) {
  let node = this.root;

  for (const ch of word) {
    if (!node.children[ch]) {
      return false;
    }
    node = node.children[ch];
  }

  return node.isEnd === true;
};
```

---

## 五、startsWith(prefix)：查前缀

### 思路

- 只关心路径是否存在
- **不关心 `isEnd`**

### 代码

```js
Trie.prototype.startsWith = function (prefix) {
  let node = this.root;

  for (const ch of prefix) {
    if (!node.children[ch]) {
      return false;
    }
    node = node.children[ch];
  }

  return true;
};
```

---

---

## 七、结合示例一步一步走（重点）

### 1️⃣ `insert("apple")`

路径创建：

```
root
 └─ a
    └─ p
       └─ p
          └─ l
             └─ e (isEnd = true)
```

---

### 2️⃣ `search("apple")`

- a → p → p → l → e
- 最后 `isEnd = true`
  ✅ 返回 `true`

---

### 3️⃣ `search("app")`

- a → p → p
- **但 `isEnd = false`**（还没插入 app）
  ❌ 返回 `false`

---

### 4️⃣ `startsWith("app")`

- 路径存在即可
  ✅ 返回 `true`

---

### 5️⃣ `insert("app")`

把第二个 `p` 节点：

```
p.isEnd = true
```

---

### 6️⃣ `search("app")`

- 路径存在
- `isEnd = true`
  ✅ 返回 `true`

---

# 

好，这里我**专门把 Trie 的结构“拆开揉碎”画清楚**，并且**明确回答你：`isEnd` 是不是属性、放在哪里、为什么要有它**。
下面这个版本可以直接当你自己的学习笔记或面试讲解稿。

---

## 一、先回答关键问题：`isEnd` 是什么？

✅ **`isEnd` 是 Trie 节点上的一个属性（boolean）**

* 它 **不属于字符**
* 它 **不指向子节点**
* 它只是一个 **标记**：
  👉「**从 root 走到当前节点，这条路径是否构成一个完整单词**」

📌 **一个节点可以：**

* 有子节点（说明它是某些更长单词的前缀）
* 同时 `isEnd = true`（说明它本身也是一个完整单词）

---

## 二、Trie 中“节点”的真实结构（JS 视角）

在你的代码里，每一个节点本质是一个普通对象，例如：

```js
{
  a: {...},
  b: {...},
  isEnd: true
}
```

👉 **节点包含两类东西：**

1. **字符 → 子节点（边）**
2. **isEnd → 是否为单词结尾（标记）**

---

## 三、详细 Trie 结构图（以插入 "app" 和 "apple" 为例）

### 1️⃣ 插入顺序

```text
insert("app")
insert("apple")
```

---

### 2️⃣ 用「对象结构」画出来（最真实）

```js
root = {
  a: {
    p: {
      p: {
        isEnd: true,      // "app" 到这里结束
        l: {
          e: {
            isEnd: true   // "apple" 到这里结束
          }
        }
      }
    }
  }
}
```

📌 注意：

* `isEnd` 和 `l` 是**同级属性**
* `isEnd` 不影响继续向下走

---

## 四、等价的“树形结构图（完整版）”

这次我会把 **节点、属性、层级** 全部标清楚：

```
(root)
 │
 └── a
     │
     └── p
         │
         └── p
             ├── isEnd: true      ← 单词 "app" 在这里结束
             │
             └── l
                 │
                 └── e
                     └── isEnd: true  ← 单词 "apple" 在这里结束
```

---

## 五、每一层到底“代表什么”？

我们逐层解释：

### 🔹 root（根节点）

* 不代表任何字符
* 只是入口

---

### 🔹 节点 `a`

* 表示前缀 `"a"`
* `isEnd` 不存在 → `"a"` 不是单词

---

### 🔹 第一个 `p`

* 表示前缀 `"ap"`
* 不是单词

---

### 🔹 第二个 `p`

* 表示前缀 `"app"`
* ✅ `isEnd = true`
* 说明 `"app"` 是一个完整单词
* 同时还有子节点 `l`

  * 说明 `"app"` 也是 `"apple"` 的前缀

---

### 🔹 节点 `e`

* 表示前缀 `"apple"`
* ✅ `isEnd = true`
* `"apple"` 是完整单词
* 没有子节点 → 不能再延伸

---

## 六、为什么一定要有 `isEnd`？

假设 **没有 `isEnd`**：

* 搜索 `"app"`
* 路径存在：a → p → p
* ❌ 但你**无法判断** `"app"` 是不是一个完整单词
  （因为 `"apple"` 也会经过这里）

👉 所以：

> **路径存在 ≠ 单词存在**

必须用 `isEnd` 来区分。

---

## 七、search vs startsWith 的本质区别（结合图理解）

### 🔍 `search("app")`

* 路径存在 ✔
* 最后节点 `isEnd === true` ✔
  ✅ 返回 `true`

---

### 🔍 `search("ap")`

* 路径存在 ✔
* 但 `p` 节点没有 `isEnd` ❌
  ❌ 返回 `false`

---

### 🔍 `startsWith("ap")`

* 只看路径是否存在 ✔
  ✅ 返回 `true`

---

这是个**非常关键、问得非常好的点** 👍
我直接用**一句话 + 拆解 + 形象类比 + 图示**把 `node = node[char]` 讲透。

---

## 一句话先给结论

```js
node = node[char];
```

👉 **作用：把“当前指针”移动到下一个字符对应的 Trie 节点上，继续往下走。**

如果没有这句，程序**永远停在 root，不可能遍历完整单词**。

---

## 拆开来看：node 到底是什么？

在 Trie 里：

```js
let node = this.root;
```

* `node` **不是字符**
* `node` 是：**“当前所在的节点对象”**
* 它就像一个**指针 / 游标**

---

## 用“走树”的角度理解

### 代码片段

```js
for (const char of word) {
  if (!node[char]) return false;
  node = node[char];
}
```

每一轮循环干两件事：

1️⃣ **判断能不能走**

```js
if (!node[char]) return false;
```

2️⃣ **真的往下走一层**

```js
node = node[char];
```

---

## 结合具体例子理解（search("app")）

Trie 里已有 `"app"` 和 `"apple"`：

```
(root)
 └─ a
    └─ p
       └─ p (isEnd = true)
```

### 初始状态

```js
node = root
```

---

### 第 1 轮：char = 'a'

```js
node['a'] 存在
node = node['a']
```

现在：

```
node 指向 "a" 节点
```

---

### 第 2 轮：char = 'p'

```js
node['p'] 存在
node = node['p']
```

现在：

```
node 指向第一个 "p"
```

---

### 第 3 轮：char = 'p'

```js
node['p'] 存在
node = node['p']
```

现在：

```
node 指向第二个 "p"
```

👉 **这一步如果不写 `node = node[char]`，你永远还停在上一个节点！**

---

## 如果删掉 `node = node[char]` 会发生什么？

假设代码变成这样 ❌：

```js
for (const char of word) {
  if (!node[char]) return false;
}
```

### 结果是：

* 每一轮都在用 **同一个 node（root）**
* 等价于：

  ```js
  root['a'] ?
  root['p'] ?
  root['p'] ?
  ```
* **完全没有向下走树**

👉 Trie 就被你当成一个普通对象用了，结构优势全没了。

---

## 用现实世界类比（最形象）

### 把 Trie 想成“楼梯”

* `node`：你现在站在哪一层
* `node[char]`：通往下一层的楼梯

```js
node = node[char];
```

就等于：

> **“走上这一级楼梯，站到下一层”**

如果不走：

* 你永远在一楼
* 不可能到三楼

---

## 用 JS 对象的角度再说一遍（非常关键）

假设当前节点是：

```js
node = {
  p: {
    p: {
      isEnd: true
    }
  }
}
```

当 `char === 'p'` 时：

```js
node[char]  // => node.p
```

执行：

```js
node = node[char];
```

等价于：

```js
node = {
  p: {
    isEnd: true
  }
}
```

👉 `node` **变成了子节点对象**

---

## 总结一句话（你可以背）

> `node = node[char]` 的作用是：
> **把当前指针从父节点移动到子节点，让 Trie 能按字符逐层向下遍历。**

---

如果你愿意，我可以：

* 用 **逐行执行 + 表格** 帮你模拟 JS 执行过程
* 把 Trie 改成 **指针版 / class Node 版**，更像 C++ / Java
* 讲清楚 **为什么 search 要判断 isEnd，startsWith 不用**

你继续追问这个点，说明你已经理解到 Trie 的“核心”了。
