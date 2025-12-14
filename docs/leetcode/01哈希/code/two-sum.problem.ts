import type { Problem } from "../../../components/js-playground";

export const twoSumProblem: Problem = {
  id: "two-sum",
  title: "两数之和",
  description:
    "实现 twoSum(nums, target)，返回两个下标。顺序不限，例如 [0,1] 或 [1,0] 都算对。",
  entry: "twoSum",
  judgeMode: "unorderedPair",
  starterCode: String.raw`/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // TODO
}
`,
  tests: [
    { name: "样例 1", input: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { name: "样例 2", input: [[3, 2, 4], 6], expected: [1, 2] },
    { name: "样例 3", input: [[3, 3], 6], expected: [0, 1] },
    {
      name: "隐藏 1",
      input: [[1, 5, 9, 13], 14],
      expected: [0, 3],
      hidden: true,
    },
  ],
};
