好，这一篇我们把 **JS 的归并排序（Merge Sort）** 系统性讲透。
它是**面试必考 + 实际工程常用**的排序之一，思想非常“算法味”。

我按你前面学习节奏来：
**思想 → 原理 → 步骤 → 代码 → 变种 → 复杂度 → 对比 → 易错点 → 面试总结**

---

# 一、归并排序的核心思想（一句话）

> **分而治之：把数组不断拆成更小的有序数组，再把它们合并成一个大的有序数组。**

📌 关键词：

* 分治（Divide & Conquer）
* 先分，再治
* 合并两个有序数组

---

# 二、为什么要用归并排序？

你前面学的排序（冒泡 / 选择 / 插入 / 希尔）有共同问题：

* ❌ 时间复杂度最坏是 O(n²)
* ❌ 大数据量性能差

👉 归并排序解决了这个问题：

✅ **稳定保证 O(n log n)**
✅ **不依赖数据是否有序**

---

# 三、归并排序的直观理解（白话）

数组：

```js
[5, 2, 4, 6, 1, 3]
```

### 第一步：不断拆分

```text
[5,2,4,6,1,3]
→ [5,2,4] [6,1,3]
→ [5] [2,4] [6] [1,3]
→ [5] [2] [4] [6] [1] [3]
```

---

### 第二步：两两合并（关键）

```text
[2] + [4] → [2,4]
[1] + [3] → [1,3]

[5] + [2,4] → [2,4,5]
[6] + [1,3] → [1,3,6]

[2,4,5] + [1,3,6]
→ [1,2,3,4,5,6]
```

📌 **拆到不能再拆，再向上合并**

---

# 四、归并排序的算法步骤（标准）

```text
mergeSort(arr):
    如果 arr 长度 <= 1:
        返回 arr

    mid = arr.length / 2
    left = mergeSort(arr[0...mid])
    right = mergeSort(arr[mid...end])

    return merge(left, right)
```

---

# 五、JS 经典实现（递归版，面试最常写）

## 1️⃣ 合并两个有序数组（核心函数）

```js
function merge(left, right) {
  let res = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      res.push(left[i++]);
    } else {
      res.push(right[j++]);
    }
  }

  // 拼接剩余部分
  return res.concat(left.slice(i)).concat(right.slice(j));
}
```

---

## 2️⃣ 归并排序主函数

```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}
```

✅ 特点：

* 思路清晰
* 面试友好
* 稳定排序

---

# 六、归并排序的本质（非常重要）

### 它不是“原地排序”

👉 每次合并都会**创建新数组**

📌 本质是：

> **用空间换时间**

---

# 七、归并排序的变种大全

---

## 1️⃣ 原地归并排序（优化空间，面试加分）

⚠️ 思想复杂，面试只需会思路

```js
function mergeSortInPlace(arr, left = 0, right = arr.length - 1, temp = []) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);

  mergeSortInPlace(arr, left, mid, temp);
  mergeSortInPlace(arr, mid + 1, right, temp);

  let i = left, j = mid + 1, k = 0;

  while (i <= mid && j <= right) {
    temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
  }
  while (i <= mid) temp[k++] = arr[i++];
  while (j <= right) temp[k++] = arr[j++];

  for (let p = 0; p < k; p++) {
    arr[left + p] = temp[p];
  }
}
```

📌 面试一句话即可：

> 可通过辅助数组实现近似原地归并

---

## 2️⃣ 自底向上归并排序（非递归）

📌 思想：

* 先合并长度为 1
* 再 2、4、8…

```js
function mergeSortIterative(arr) {
  const n = arr.length;
  let temp = new Array(n);

  for (let size = 1; size < n; size *= 2) {
    for (let left = 0; left < n - size; left += size * 2) {
      let mid = left + size - 1;
      let right = Math.min(left + size * 2 - 1, n - 1);

      mergeRange(arr, left, mid, right, temp);
    }
  }
  return arr;
}

function mergeRange(arr, left, mid, right, temp) {
  let i = left, j = mid + 1, k = left;

  while (i <= mid && j <= right) {
    temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
  }
  while (i <= mid) temp[k++] = arr[i++];
  while (j <= right) temp[k++] = arr[j++];

  for (let p = left; p <= right; p++) {
    arr[p] = temp[p];
  }
}
```

📌 优点：

* 无递归
* 避免栈溢出

---

# 八、时间 & 空间复杂度（必背）

| 项目    | 复杂度                  |
| ----- | -------------------- |
| 时间复杂度 | **O(n log n)**（所有情况） |
| 空间复杂度 | **O(n)**             |
| 是否稳定  | ✅ 稳定                 |
| 是否原地  | ❌ 否                  |

---

# 九、归并排序 vs 快速排序（高频面试）

| 对比    | 归并排序          | 快速排序          |
| ----- | ------------- | ------------- |
| 时间复杂度 | 稳定 O(n log n) | 平均 O(n log n) |
| 最坏情况  | O(n log n)    | O(n²)         |
| 空间复杂度 | O(n)          | O(log n)      |
| 稳定性   | ✅             | ❌             |
| 使用场景  | 链表 / 稳定性要求    | 数组 / 性能优先     |

📌 **链表排序首选归并排序**

---

# 十、常见易错点（重点）

❌ **忘了递归终止条件**

```js
if (arr.length === 1) // ❌ 不完整
```

✅ 正确：

```js
if (arr.length <= 1)
```

---

❌ **合并时漏掉剩余元素**

```js
while (i < left.length && j < right.length)
// ❌ 忘了处理剩余
```

---

❌ **以为归并是原地排序**

👉 这是快排 / 堆排的特点，不是归并

---

# 十一、一句话面试总结（直接背）

> 归并排序基于分治思想，将数组不断拆分为更小的子数组，直到每个子数组只有一个元素，再通过合并两个有序数组的方式得到最终有序结果。它时间复杂度稳定为 O(n log n)，是稳定排序，但需要额外 O(n) 空间。

---

## 下一步学习建议（非常适合你）

你已经形成一条**完整排序链路**了：

* 插入 → 希尔 → 归并
  👉 下一步强烈建议：

1️⃣ **快速排序（面试之王）**
2️⃣ **堆排序（结构型排序）**
3️⃣ **JS 原生 sort 的底层思想**

如果你愿意，我可以直接给你：

* 🔥 **排序算法总表（一次记住）**
* 🔥 **前端面试排序高频题 & 标准回答**
* 🔥 **快排一步一步拆解（保证你真懂）**

你想继续哪一个？
