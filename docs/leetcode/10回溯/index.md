LeetCode 里“回溯题”看起来千奇百怪，但它们的**解法骨架几乎都一样**：都是在一棵“选择树”上做 DFS，枚举所有可能，满足条件就收集/计数，不满足就剪枝回退。

## 回溯题的共同骨架

核心元素永远是这 4 个：

1. **路径 path**：当前已经选了什么
2. **选择列表 choices**：下一步还能选什么
3. **结束条件**：什么时候把 path 作为答案收集（或返回计数）
4. **撤销选择（回退）**：递归回来把状态还原

通用模板（JS）：

```js
function backtrack(path, choices) {
  if (满足结束条件) {
    res.push([...path]);   // 或计数 / 更新最优
    return;
  }

  for (const choice of choices) {
    if (不合法) continue;  // 剪枝

    path.push(choice);     // 做选择
    backtrack(path, 更新后的choices); // 递归
    path.pop();            // 撤销选择（回溯）
  }
}
```

## 它们“相同”的地方到底是什么？

### 1) 都是在枚举：排列 / 组合 / 子集 / 切割 / 棋盘

你看到不同题型，本质都是在选：

* **排列 Permutation**：顺序重要（如全排列）
* **组合 Combination**：顺序不重要（如组合总和）
* **子集 Subset**：选/不选（如子集）
* **切割 Partition**：在位置上切（如分割回文串）
* **棋盘 Board**：按格子放（如 N 皇后、数独）

但代码仍是同一套：`for -> choose -> dfs -> undo`

### 2) 主要差异只在 “choices 怎么更新” 和 “剪枝”

* 排列：用 `used[]` 或交换法控制是否用过
* 组合：用 `startIndex` 控制不能回头选，避免重复
* 子集：每层决定选不选；或用 `startIndex` 枚举加入
* 组合求和：同一个数能否重复用，决定递归传 `i` 还是 `i+1`
* 棋盘：合法性检查更重（行/列/对角线 / 9 宫格）

## 五类最常见回溯“套路”对照

### A. 子集（78）

特点：每个元素“选或不选”；常见写法是每层把当前 path 收集一次。

```js
function subsets(nums) {
  const res = [];
  function dfs(start, path) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      dfs(i + 1, path);
      path.pop();
    }
  }
  dfs(0, []);
  return res;
}
```

### B. 组合（77）

特点：用 `start` 防止重复；顺序不重要。

```js
function combine(n, k) {
  const res = [];
  function dfs(start, path) {
    if (path.length === k) return res.push([...path]);
    for (let i = start; i <= n; i++) {
      path.push(i);
      dfs(i + 1, path);
      path.pop();
    }
  }
  dfs(1, []);
  return res;
}
```

### C. 排列（46）

特点：顺序重要；用 `used[]`。

```js
function permute(nums) {
  const res = [];
  const used = Array(nums.length).fill(false);

  function dfs(path) {
    if (path.length === nums.length) return res.push([...path]);
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      dfs(path);
      path.pop();
      used[i] = false;
    }
  }
  dfs([]);
  return res;
}
```

### D. 去重（90 / 47 / 40）

特点：输入有重复元素，**先排序**，再在同一层跳过重复。

```js
if (i > start && nums[i] === nums[i - 1]) continue; // 组合/子集去重
```

### E. 棋盘类（51 N 皇后 / 37 数独）

特点：回溯 + 更强的合法性检查（剪枝是关键）。

---

## 一句话记住回溯题的“本质”

> 回溯 = 带撤销的 DFS 枚举；
> 差别只在：**结束条件**、**选择范围**、**去重/剪枝规则**。

如果你告诉我你卡的是哪一类（排列/组合/子集/切割/棋盘），我可以把那一类的**通用模板 + 常见坑（去重、startIndex、used、剪枝）**用一页总结给你。
