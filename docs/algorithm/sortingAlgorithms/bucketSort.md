

# 二、桶排序（Bucket Sort）知识点大全

## 1️⃣ 核心思想（必背）

> 把数据分到有限数量的桶中，每个桶单独排序，最后合并。

📦 类似：

> 100 个人，先按身高区间站队（160-165、165-170…），每一队再自己排好。

---

## 2️⃣ 算法流程（标准 4 步）

1. **确定桶的数量**
2. **遍历数组，把元素放入对应桶**
3. **每个桶内部排序（通常用插入排序）**
4. **按顺序合并所有桶**

---

## 3️⃣ 时间 & 空间复杂度

| 情况 | 时间复杂度           |
| -- | --------------- |
| 平均 | **O(n + k)**    |
| 最坏 | O(n²)（所有元素进一个桶） |

* n：元素个数
* k：桶的数量

📌 **前提假设**：数据分布比较均匀
📌 桶排序是**典型的“空间换时间”**

---

## 4️⃣ 稳定性

* ✅ **可以是稳定的**
* 取决于：**桶内使用的排序算法是否稳定**

---

## 5️⃣ 适用场景（面试常考）

✅ 适合：

* 浮点数排序（如 `0 ~ 1`）
* 数据分布均匀
* 已知范围

❌ 不适合：

* 分布极端不均
* 范围特别大但数据很少

---

## 6️⃣ JS 实现（标准版）

```js
function bucketSort(arr, bucketSize = 5) {
  if (arr.length === 0) return arr;

  let min = Math.min(...arr);
  let max = Math.max(...arr);

  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  // 1. 分桶
  for (let num of arr) {
    const index = Math.floor((num - min) / bucketSize);
    buckets[index].push(num);
  }

  // 2. 桶内排序 + 合并
  return buckets.reduce((res, bucket) => {
    bucket.sort((a, b) => a - b); // 桶内排序
    return res.concat(bucket);
  }, []);
}
```

📌 面试说法：

> “桶排序通常配合插入排序作为桶内排序”

---

## 7️⃣ 面试高频问法

### Q1：桶排序为什么最坏是 O(n²)？

👉 所有元素进同一个桶，桶内排序退化

### Q2：桶排序和计数排序的区别？

👉

* 桶排序：桶里放 **值**
* 计数排序：桶里放 **次数**

---
