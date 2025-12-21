const root = {
  val: 10,
  left: {
    val: 6,
    left: { val: 3, left: null, right: null },
    right: { val: 8, left: null, right: null },
  },
  right: {
    val: 15,
    left: null,
    right: { val: 20, left: null, right: null },
  },
};

var inorderTraversal = function (root) {
  // 用来保存遍历结果
  const res = [];

  // 深度优先搜索（递归）
  const dfs = (node) => {
    // 递归终止条件：节点为空
    if (!node) return;

    // ① 先递归遍历左子树
    dfs(node.left);

    // ② 再处理当前节点（中序的“中”）
    res.push(node.val);

    // ③ 最后递归遍历右子树
    dfs(node.right);
  };

  // 从根节点开始
  dfs(root);

  // 返回结果
  return res;
};

console.log(inorderTraversal(root));
