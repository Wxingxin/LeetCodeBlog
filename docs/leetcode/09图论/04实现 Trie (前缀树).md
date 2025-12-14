# 题
Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

Trie() 初始化前缀树对象。
void insert(String word) 向前缀树中插入字符串 word 。
boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。
 

示例：

输入
`["Trie", "insert", "search", "search", "startsWith", "insert", "search"]`
`[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]`
输出
`[null, null, true, false, true, null, true]`

解释
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");   // 返回 True
trie.search("app");     // 返回 False
trie.startsWith("app"); // 返回 True
trie.insert("app");
trie.search("app");     // 返回 True

# 题

这是 **LeetCode 208：实现 Trie（前缀树）**。
我会按 **“结构设计 → 代码实现 → 用示例一步一步走”** 来讲，这样你能真正理解，而不是死记。

---

## 一、Trie 的核心思想（先建立直觉）

Trie 本质是：

* **每个节点表示一个字符**
* **从根节点到某个节点的一条路径 = 一个字符串的前缀**
* 用一个标志位 `isEnd` 表示：
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
var Trie = function() {
  this.root = {
    children: {},
    isEnd: false
  };
};
```

* `root` 不存字符，只是起点
* `children`：哈希表（JS 对象）
* `isEnd`：标记完整单词结束

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
Trie.prototype.insert = function(word) {
  let node = this.root;

  for (const ch of word) {
    if (!node.children[ch]) {
      node.children[ch] = {
        children: {},
        isEnd: false
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

* 必须：

  1. 路径存在
  2. **最后一个字符节点的 `isEnd === true`**

### 代码

```js
Trie.prototype.search = function(word) {
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

* 只关心路径是否存在
* **不关心 `isEnd`**

### 代码

```js
Trie.prototype.startsWith = function(prefix) {
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

## 六、完整代码（可直接提交 LeetCode）

```js
var Trie = function() {
  this.root = {
    children: {},
    isEnd: false
  };
};

Trie.prototype.insert = function(word) {
  let node = this.root;

  for (const ch of word) {
    if (!node.children[ch]) {
      node.children[ch] = {
        children: {},
        isEnd: false
      };
    }
    node = node.children[ch];
  }

  node.isEnd = true;
};

Trie.prototype.search = function(word) {
  let node = this.root;

  for (const ch of word) {
    if (!node.children[ch]) return false;
    node = node.children[ch];
  }

  return node.isEnd === true;
};

Trie.prototype.startsWith = function(prefix) {
  let node = this.root;

  for (const ch of prefix) {
    if (!node.children[ch]) return false;
    node = node.children[ch];
  }

  return true;
};
```

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

* a → p → p → l → e
* 最后 `isEnd = true`
  ✅ 返回 `true`

---

### 3️⃣ `search("app")`

* a → p → p
* **但 `isEnd = false`**（还没插入 app）
  ❌ 返回 `false`

---

### 4️⃣ `startsWith("app")`

* 路径存在即可
  ✅ 返回 `true`

---

### 5️⃣ `insert("app")`

把第二个 `p` 节点：

```
p.isEnd = true
```

---

### 6️⃣ `search("app")`

* 路径存在
* `isEnd = true`
  ✅ 返回 `true`

---

## 八、时间 & 空间复杂度（面试常问）

* `insert / search / startsWith`

  * 时间复杂度：`O(L)`（L = 字符串长度）
* 空间复杂度：

  * 最坏 `O(26 * N * L)`（但共享前缀，实际更优）

---

## 九、一句话记忆法（考试 / 面试用）

> **Trie 就是“按字符走树，是否成词看 isEnd”**

如果你愿意，我也可以：

* 画一张 **Trie 动态演变图**
* 或对比 **Trie vs HashSet**
* 或扩展到 **删除单词 / 自动补全**

直接说你想继续哪一步 👍
