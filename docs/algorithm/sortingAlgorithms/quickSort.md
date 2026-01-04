好，这一篇我们把 **JS 的快速排序（Quick Sort）** 彻底讲透。
它是 **面试之王 + 实际最常用排序之一**，但也是最容易“会写却不真懂”的算法。

我按你前面学习节奏来，**一站式大全版**👇
**思想 → 原理 → 核心步骤 → 代码 → 分区方式大全 → 复杂度 → 优化 → 易错点 → 面试总结**

---

# 一、快速排序的核心思想（一句话）

> **选一个基准值（pivot），把数组分成「比它小的」和「比它大的」，再递归排序左右两边。**

📌 关键词：

* 分治思想
* 基准值（pivot）
* 分区（partition）

---

# 二、为什么快排这么快？

和你已经学过的排序对比一下：

| 算法       | 最坏         | 平均               | 特点     |
| -------- | ---------- | ---------------- | ------ |
| 插入 / 选择  | O(n²)      | O(n²)            | 简单     |
| 归并       | O(n log n) | O(n log n)       | 稳定、占空间 |
| **快速排序** | O(n²)      | ⭐ **O(n log n)** | 原地、常数小 |

👉 **快排赢在：**

* 不需要额外数组
* CPU cache 友好
* 实际运行极快

---

# 三、快速排序的直观理解（白话）

数组：

```js
[7, 2, 1, 6, 8, 5, 3, 4]
```

### 第一步：选一个基准（pivot = 4）

```text
小于 4 → [2,1,3]
pivot → [4]
大于 4 → [7,6,8,5]
```

### 第二步：递归左右

```text
[2,1,3] → 排序
[7,6,8,5] → 排序
```

### 第三步：拼起来

```text
[1,2,3,4,5,6,7,8]
```

📌 **不断“分区”，直到区间长度为 1**

---

# 四、快速排序的算法步骤（标准）

```text
quickSort(arr, left, right):
    if left >= right:
        return

    pivotIndex = partition(arr, left, right)

    quickSort(arr, left, pivotIndex - 1)
    quickSort(arr, pivotIndex + 1, right)
```

---

# 五、JS 经典实现（最常写，面试必会）

## 1️⃣ Lomuto 分区法（好理解）

👉 以 **最后一个元素作为 pivot**

```js
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return arr;

  const pivotIndex = partition(arr, left, right);

  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);

  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}
```

📌 特点：

* 易写
* 易讲
* 面试友好

---

# 六、快速排序的分区方式大全（高频）

---

## 1️⃣ Lomuto 分区（上面那个）

* pivot：末尾
* 指针：一个
* **最容易写，但交换次数略多**

---

## 2️⃣ Hoare 分区（性能更好）

👉 双指针，从两边向中间

```js
function quickSortHoare(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;

  const pivot = arr[Math.floor((left + right) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (arr[i] < pivot) i++;
    while (arr[j] > pivot) j--;

    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }

  quickSortHoare(arr, left, j);
  quickSortHoare(arr, i, right);

  return arr;
}
```

📌 特点：

* 交换少
* 性能更好
* 稍难理解

---

## 3️⃣ 三路快排（处理大量重复元素）

📌 思想：
把数组分成三部分：

```text
< pivot | == pivot | > pivot
```

```js
function quickSort3Way(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;

  let lt = left;
  let gt = right;
  let i = left + 1;
  const pivot = arr[left];

  while (i <= gt) {
    if (arr[i] < pivot) {
      [arr[i], arr[lt]] = [arr[lt], arr[i]];
      lt++;
      i++;
    } else if (arr[i] > pivot) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
    } else {
      i++;
    }
  }

  quickSort3Way(arr, left, lt - 1);
  quickSort3Way(arr, gt + 1, right);
}
```

📌 **重复值很多时性能碾压普通快排**

---

# 七、时间 & 空间复杂度（必背）

| 情况      | 时间复杂度            |
| ------- | ---------------- |
| 最好      | O(n log n)       |
| 平均      | ⭐ **O(n log n)** |
| 最坏（已排序） | ❌ O(n²)          |

| 项目    | 说明            |
| ----- | ------------- |
| 空间复杂度 | O(log n)（递归栈） |
| 是否稳定  | ❌ 不稳定         |
| 是否原地  | ✅ 是           |

---

# 八、如何避免最坏情况（面试加分）

### 1️⃣ 随机选 pivot

```js
const randomIndex = left + Math.floor(Math.random() * (right - left + 1));
[arr[randomIndex], arr[right]] = [arr[right], arr[randomIndex]];
```

---

### 2️⃣ 三数取中（median-of-three）

```text
pivot = median(arr[left], arr[mid], arr[right])
```

---

### 3️⃣ 小数组切换插入排序（工程优化）

📌 实际 JS 引擎常用

---

# 九、快速排序 vs 归并排序（高频）

| 对比   | 快排    | 归并         |
| ---- | ----- | ---------- |
| 平均性能 | ⭐ 更快  | 稳定         |
| 最坏情况 | O(n²) | O(n log n) |
| 空间   | 少     | 多          |
| 稳定性  | ❌     | ✅          |
| 使用场景 | 数组    | 链表         |

---

# 十、常见易错点（必看）

❌ **递归区间写错**

```js
quickSort(arr, left, pivotIndex); // ❌
```

✅ 正确：

```js
quickSort(arr, left, pivotIndex - 1);
```

---

❌ **partition 忘了 return**

---

❌ **pivot 选得太死（总是第一个或最后一个）**

---

# 十一、一句话面试总结（直接背）

> 快速排序基于分治思想，通过选择一个基准值将数组划分为左右两部分，使左边都小于基准、右边都大于基准，然后递归排序子区间。它是原地排序，平均时间复杂度为 O(n log n)，但在极端情况下会退化为 O(n²)。

---

## 十二、到这里你已经完成了「排序算法主线」

你现在已经系统学完：

✅ 选择排序
✅ 插入排序
✅ 希尔排序
✅ 归并排序
✅ **快速排序（核心）**

👉 下一步我强烈建议你：

1️⃣ **堆排序（最后一个主流排序）**
2️⃣ **JS 原生 `Array.sort` 的底层逻辑**
3️⃣ **一张表彻底记住所有排序（面试专用）**

你想继续哪一个？我直接给你安排 👍
