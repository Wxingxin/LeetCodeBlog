
# JavaScript 中的随机算法（Randomized Algorithms）

随机算法是指在算法执行过程中**引入随机性**的算法。  
在 JavaScript 算法题与工程实践中，随机算法常用于**打乱顺序、随机采样、概率优化、期望时间复杂度优化**等场景。

---

## 一、随机算法的核心思想

- 利用随机数（通常是 `Math.random()`）
- 不保证每次执行路径相同
- 关注 **期望性能**，而非最坏情况
- 在某些问题中比确定性算法更简单或更高效

---

## 二、JavaScript 中的随机基础

### 1. 生成随机数

```js
Math.random(); // [0, 1)
```

### 2. 生成区间随机整数

```js
// [min, max]
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

---

## 三、常见随机算法

### 1. 洗牌算法（Shuffle Algorithm）

#### Fisher–Yates 洗牌（最经典）

* **等概率**
* 时间复杂度：O(n)
* 空间复杂度：O(1)

```js
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

✅ 正确
❌ `arr.sort(() => Math.random() - 0.5)`（不等概率）

---

### 2. 随机选择（Random Pick）

#### 从数组中随机选一个元素

```js
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
```

---

### 3. 蓄水池抽样（Reservoir Sampling）

#### 场景

* 数据流很大或长度未知
* 只能遍历一次
* 等概率选取 k 个元素

#### 选 1 个元素（经典）

```js
function reservoirSample(stream) {
  let res = null;
  let count = 0;

  for (const x of stream) {
    count++;
    if (Math.random() < 1 / count) {
      res = x;
    }
  }
  return res;
}
```

* 时间复杂度：O(n)
* 空间复杂度：O(1)

---

### 4. 随机快速排序（Randomized Quick Sort）

#### 思想

* 随机选择 pivot
* 避免退化成 O(n²)

```js
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(Math.random() * arr.length)];
  const left = [];
  const right = [];
  const equal = [];

  for (const x of arr) {
    if (x < pivot) left.push(x);
    else if (x > pivot) right.push(x);
    else equal.push(x);
  }

  return [...quickSort(left), ...equal, ...quickSort(right)];
}
```

* 期望时间复杂度：O(n log n)

---

### 5. 随机选择第 K 大 / 小元素（Quick Select）

```js
function quickSelect(arr, k) {
  const pivot = arr[Math.floor(Math.random() * arr.length)];
  const left = arr.filter(x => x < pivot);
  const right = arr.filter(x => x > pivot);
  const equal = arr.filter(x => x === pivot);

  if (k <= left.length) {
    return quickSelect(left, k);
  } else if (k <= left.length + equal.length) {
    return pivot;
  } else {
    return quickSelect(right, k - left.length - equal.length);
  }
}
```

* 期望时间复杂度：O(n)

---

## 四、概率型随机算法

### 1. Monte Carlo 算法

* 给出 **概率正确** 的答案
* 允许一定错误率

示例：估算 π

```js
function estimatePi(n) {
  let inside = 0;

  for (let i = 0; i < n; i++) {
    const x = Math.random();
    const y = Math.random();
    if (x * x + y * y <= 1) inside++;
  }

  return (inside / n) * 4;
}
```

---

### 2. Las Vegas 算法

* **结果一定正确**
* 运行时间是随机的

示例：随机快速排序、随机 BST 插入

---

## 五、常见应用场景

| 场景        | 使用的随机算法      |
| --------- | ------------ |
| 打乱数组      | Fisher–Yates |
| 抽奖 / 随机推荐 | 随机选择         |
| 大数据采样     | 蓄水池抽样        |
| 优化排序      | 随机快排         |
| 概率模拟      | Monte Carlo  |
| 算法竞赛      | 随机化避免卡最坏     |

---

## 六、算法面试常考点

* 为什么 `sort(() => Math.random() - 0.5)` 是错的？
* Fisher–Yates 为什么是等概率？
* 蓄水池抽样如何保证公平？
* 随机化如何避免最坏情况？
* Monte Carlo vs Las Vegas 区别？

---

## 七、总结

* 随机算法关注 **期望性能**
* 在 JavaScript 中依赖 `Math.random()`
* 常用于：

  * 洗牌
  * 随机选择
  * 快速排序优化
  * 大数据采样
* 是 **算法面试 + 实际工程** 的重要组成部分

如果你需要：

* **LeetCode 随机算法题目清单**
* **随机算法的数学证明**
* **与确定性算法对比**
* **前端真实应用示例**

可以继续告诉我你的侧重点。
