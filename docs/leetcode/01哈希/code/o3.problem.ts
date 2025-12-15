// docs/leetcode/128哈希/code/longest-consecutive.problem.ts

import type { Problem } from "../../../components/js-playground";

export const o301: Problem = {
  id: "o228",
  title: "最长连续序列",
  description:
    "实现 longestConsecutive(nums)，返回数组中最长连续序列的长度。要求时间复杂度尽量为 O(n)。",

  entry: "longestConsecutive",
  judgeMode: "deepEqual",

  starterCode: String.raw`/**
 * @param {number[]} nums  输入数组
 * @return {number}        返回最长连续序列长度
 */
function longestConsecutive(nums) {
  // TODO: 在这里实现最长连续序列的逻辑
}
`,

  tests: [
    {
      name: "样例 1",
      input: [[100, 4, 200, 1, 3, 2]],
      expected: 4,
    },
    {
      name: "样例 2",
      input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]],
      expected: 9,
    },
    {
      name: "样例 3",
      input: [[]],
      expected: 0,
    },
    {
      name: "隐藏 1",
      input: [[10, 5, 12, 3, 55, 4, 11, 2]],
      expected: 4, // 2,3,4,5? + 10,11,12 => 实际最长是 3 (10-12) 或 4 (2-5)；这里用 4 更合理
      hidden: true,
    },
  ],
};
