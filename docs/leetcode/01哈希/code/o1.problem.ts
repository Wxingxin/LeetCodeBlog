// docs/leetcode/01哈希/code/two-sum.problem.ts

// 引入 Problem 类型，用于约束题目配置对象的结构
// 这是你 JS Playground / 题目系统中的统一题目描述接口
import type { Problem } from "../../../components/js-playground";

// 导出 twoSum 题目的完整配置
// 每一道 LeetCode 题在系统中都对应一个 Problem 对象
export const o101: Problem = {
  // 题目唯一标识，用于路由、查找、判题等
  id: "o101",

  // 题目标题，用于页面展示
  title: "两数之和",

  // 题目描述（简要说明题意和返回规则）
  // 这里强调了返回下标，且顺序不影响正确性
  description:
    "实现 twoSum(nums, target)，返回两个下标。顺序不限，例如 [0,1] 或 [1,0] 都算对。",

  // 入口函数名
  // 判题系统会从用户代码中查找这个函数并执行
  entry: "twoSum",

  // 判题模式
  // unorderedPair 表示返回的是“无序的两个值”，
  // 即 [0,1] 与 [1,0] 在判题时视为等价
  judgeMode: "unorderedPair",

  // 用户初始看到的代码模板
  // 使用 String.raw 是为了：
  // 1. 保留原始换行和缩进
  // 2. 避免转义字符影响代码展示
  starterCode: String.raw`/**
 * @param {number[]} nums  输入数组
 * @param {number} target  目标和
 * @return {number[]}      返回两个元素下标
 */
function twoSum(nums, target) {
  // TODO: 在这里实现两数之和的逻辑
}
`,

  // 测试用例列表
  tests: [
    {
      // 测试名称，用于 UI 展示
      name: "样例 1",

      // 输入参数，对应 twoSum(nums, target)
      input: [[2, 7, 11, 15], 9],

      // 期望输出结果
      expected: [0, 1],
    },
    {
      name: "样例 2",
      input: [[3, 2, 4], 6],
      expected: [1, 2],
    },
    {
      name: "样例 3",
      input: [[3, 3], 6],
      expected: [0, 1],
    },
    {
      // 隐藏测试用例
      // 用于防止用户只针对样例写“投机解法”
      name: "隐藏 1",
      input: [[1, 5, 9, 13], 14],
      expected: [0, 3],

      // hidden = true 表示该用例不在界面上显示
      hidden: true,
    },
  ],
};
