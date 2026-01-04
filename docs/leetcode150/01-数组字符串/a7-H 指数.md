
# H 指数
## 题目

给你一个整数数组 `citations` ，其中 `citations[i]` 表示研究者的第 `i` 篇论文被引用的次数。计算并返回该研究者的 `h` 指数。

根据维基百科上` h` 指数的定义：`h` 代表“高引用次数” ，

一名科研人员的 `h` 指数 是指他（她）至少发表了 `h` 篇论文，并且 至少 有 `h` 篇论文被引用次数大于等于 `h` 。

如果 `h` 有多种可能的值，`h `指数 是其中最大的那个。

 

### 示例 1：

输入：`citations = [3,0,6,1,5]`
输出：`3 `
解释：给定数组表示研究者总共有 5 篇论文，每篇论文相应的被引用了 `3, 0, 6, 1, 5 `次。


     由于研究者有 `3` 篇论文每篇 至少 被引用了 `3` 次，其余两篇论文每篇被引用 不多于 `3` 次，所以她的 `h` 指数是 `3`。

### 示例 2：

输入：`citations = [1,3,1]`

输出：`1`
 

 ### code
 ```js
/**
 * @param {number[]} citations
 * @return {number}
 */
var hIndex = function(citations) {
  // 1. 按引用次数从大到小排序
  citations.sort((a, b) => b - a);

  let h = 0;

  // 2. 遍历排序后的数组
  for (let i = 0; i < citations.length; i++) {
    // i + 1 表示“论文数量”
    // citations[i] 表示“第 i 篇论文的引用次数”
    if (citations[i] >= i + 1) {
      h = i + 1; // 满足条件，更新 h
    } else {
      break; // 后面只会更小，不可能再满足
    }
  }

  return h;
};

 ```