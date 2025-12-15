// docs/leetcode/49哈希/code/group-anagrams.problem.ts

import type { Problem } from "../../../components/js-playground";

export const o201: Problem = {
  id: "o149",
  title: "字母异位词分组",
  description:
    "实现 groupAnagrams(strs)，将字母异位词分到同一组中返回。组内顺序不限，组与组之间顺序也不限。",

  entry: "groupAnagrams",

  // 返回的是二维数组；通常不强调顺序，这里用 unorderedPair 不合适
  // 如果你的判题系统支持“忽略二维数组顺序”的模式，可替换成对应模式；
  // 否则建议按用例写成固定顺序（下面 tests 我给了一个常见输出顺序）。
  judgeMode: "deepEqual",

  starterCode: String.raw`/**
 * @param {string[]} strs  输入字符串数组
 * @return {string[][]}    返回分组后的二维数组
 */
function groupAnagrams(strs) {
  // TODO: 在这里实现字母异位词分组的逻辑
}
`,

  tests: [
    {
      name: "样例 1",
      input: [["eat", "tea", "tan", "ate", "nat", "bat"]],
      expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]],
    },
    {
      name: "样例 2",
      input: [[""]],
      expected: [[""]],
    },
    {
      name: "样例 3",
      input: [["a"]],
      expected: [["a"]],
    },
    {
      name: "隐藏 1",
      input: [["ab", "ba", "abc", "bca", "cab", "zzz"]],
      expected: [["ab", "ba"], ["abc", "bca", "cab"], ["zzz"]],
      hidden: true,
    },
  ],
};
