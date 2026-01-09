
## 一、选择排序的核心思想（一句话版）

> **每一轮从未排序区间中“选出最小（或最大）的元素”，放到它最终该在的位置。**

📌 关键词：

* **先选，再换**
* **位置是确定的**
* **不依赖相邻比较**

---

## 二、选择排序的基本思路（白话版）

假设有一个数组：

```js
[64, 25, 12, 22, 11]
```

### 排序过程：

1️⃣ 第 1 轮

* 在整个数组中找最小值 `11`
* 和第 0 位交换
  👉 `[11, 25, 12, 22, 64]`

2️⃣ 第 2 轮

* 在 `[25, 12, 22, 64]` 中找最小值 `12`
* 和第 1 位交换
  👉 `[11, 12, 25, 22, 64]`

3️⃣ 第 3 轮

* 在 `[25, 22, 64]` 中找最小值 `22`
* 和第 2 位交换
  👉 `[11, 12, 22, 25, 64]`

……

📌 **第 i 轮结束后，第 i 个位置一定是正确的**



## 四、JS 标准实现（最常用，面试版）

```js
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // 在未排序区间找最小值
    for (let j = i + 1; j < n; j++) {
      //如果当前的值比之前的arr[minIndex]还小，将当前值的数组下标赋值给minIndex
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 把最小值放到当前位置
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}
```

✅ 特点：

* 原地排序（O(1) 空间）
* 每一轮 **最多一次交换**

---

## 五、选择排序的执行过程可视化（加理解）

```js
i = 0  → 找最小 → 放到 0
i = 1  → 找最小 → 放到 1
i = 2  → 找最小 → 放到 2
...
```

📌 **它不是“交换排序”，而是“定位排序”**

---

## 六、选择排序的变种大全

---

### 1️⃣ 从小到大（默认）

```js
arr[j] < arr[minIndex]
```

---

### 2️⃣ 从大到小（选最大）

```js
function selectionSortDesc(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let maxIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (arr[j] > arr[maxIndex]) {
        maxIndex = j;
      }
    }

    [arr[i], arr[maxIndex]] = [arr[maxIndex], arr[i]];
  }

  return arr;
}
```

---

### 3️⃣ 双向选择排序（一次找最小 + 最大）

📌 思想：

* 一轮确定 **两个位置**
* 左边放最小，右边放最大

```js
function selectionSortDouble(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    let min = left;
    let max = left;

    for (let i = left; i <= right; i++) {
      if (arr[i] < arr[min]) min = i;
      if (arr[i] > arr[max]) max = i;
    }

    [arr[left], arr[min]] = [arr[min], arr[left]];

    // 如果最大值被换走了，要修正 max
    if (max === left) max = min;

    [arr[right], arr[max]] = [arr[max], arr[right]];

    left++;
    right--;
  }

  return arr;
}
```

---

### 4️⃣ 稳定版选择排序（很少用）

⚠️ 普通选择排序 **不稳定**

稳定思路：

* 找最小值
* **删除它**
* 插入到当前位置
* 中间元素整体右移

👉 代价：性能变差

---

## 七、复杂度分析（必背）

| 项目    | 复杂度                     |
| ----- | ----------------------- |
| 时间复杂度 | **O(n²)**（最好 / 最坏 / 平均） |
| 空间复杂度 | **O(1)**                |
| 是否稳定  | ❌ 不稳定                   |
| 交换次数  | **≤ n-1 次**             |

📌 对比冒泡排序：

* **比较次数一样**
* **选择排序交换更少**



## 九、常见易错点（你一定会踩）

❌ **错误 1：每次内层循环就交换**

```js
// 错误 ❌
if (arr[j] < arr[i]) {
  swap(arr[i], arr[j]);
}
```

✅ 正确：

* **先记录最小下标**
* **循环结束后只换一次**

---

❌ **错误 2：循环边界写错**

```js
i < n   // ❌ 最后一轮没必要
```

✅ 应该是：

```js
i < n - 1
```

