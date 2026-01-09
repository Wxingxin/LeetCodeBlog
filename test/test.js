var lengthOfLongestSubstring = function (s) {
  //1-1 辅助map ： Map 用来记录：字符 → 该字符「最后一次」出现的下标
  const map = new Map();
  //1-2 辅助指针 ： 滑动窗口左边界（起始下标）
  let left = 0;
  //1-3 返回的值 ： 记录当前找到的最长无重复子串长度
  let maxLen = 0;

  //2 for循环 ： right 是滑动窗口的右边界，不断向右扩展
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    console.log(char);
    console.log(typeof char)

    // 如果当前字符之前出现过，并且在当前窗口范围内
    if (map.has(char)) {
      // 将左边界移动到：
      // 上一次该字符出现位置的「下一个位置」
      // 用 Math.max 是为了防止 left 回退
      left = Math.max(left, map.get(char) + 1);
    }

    // 更新当前字符的最新出现位置
    map.set(char, right);

    // 当前窗口长度 = right - left + 1
    maxLen = Math.max(maxLen, right - left + 1);
  }

  //3 返回 ： 返回最长无重复子串的长度
  return maxLen;
};

s = "abcabcbb"

const res = lengthOfLongestSubstring(s)
console.log(res)

