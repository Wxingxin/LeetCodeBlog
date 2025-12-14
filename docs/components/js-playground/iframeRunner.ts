import type { Problem } from "./types";

export function safeStringify(v: any) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export function buildIframeHtml(code: string, problem: Problem) {
  const testsJson = safeStringify(problem.tests);
  const entryName = problem.entry;
  const judgeMode = problem.judgeMode ?? "deepEqual";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>JS Runner</title>
</head>
<body>
<script>
(function () {
  const send = (type, payload) => {
    parent.postMessage({ source: "js-playground", type, payload }, "*");
  };

  // console 转发
  const rawLog = console.log;
  const rawErr = console.error;
  const rawWarn = console.warn;

  console.log = function () { send("console", { level: "log", args: Array.from(arguments).map(String) }); rawLog.apply(console, arguments); };
  console.error = function () { send("console", { level: "error", args: Array.from(arguments).map(String) }); rawErr.apply(console, arguments); };
  console.warn = function () { send("console", { level: "warn", args: Array.from(arguments).map(String) }); rawWarn.apply(console, arguments); };

  window.onerror = function (msg, url, line, col, err) {
    send("console", { level: "error", args: [String(msg) + " @ " + line + ":" + col] });
  };

  // 深比较
  const deepEqual = (a, b) => {
    if (Object.is(a, b)) return true;
    if (typeof a !== typeof b) return false;
    if (a && b && typeof a === "object") {
      const aIsArr = Array.isArray(a);
      const bIsArr = Array.isArray(b);
      if (aIsArr !== bIsArr) return false;
      if (aIsArr) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
        return true;
      }
      const ak = Object.keys(a).sort();
      const bk = Object.keys(b).sort();
      if (ak.length !== bk.length) return false;
      for (let i = 0; i < ak.length; i++) if (ak[i] !== bk[i]) return false;
      for (const k of ak) if (!deepEqual(a[k], b[k])) return false;
      return true;
    }
    return false;
  };

  // unordered pair（两数之和下标顺序不敏感）
  const unorderedPairEqual = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== 2 || b.length !== 2) return false;
    return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);
  };

  const tests = ${testsJson};
  const entry = ${JSON.stringify(entryName)};
  const judgeMode = ${JSON.stringify(judgeMode)};

  try {
    // ===== 用户代码开始 =====
${code}
    // ===== 用户代码结束 =====

    // 关键：用户代码在 IIFE 里，函数不一定挂到 globalThis，需要导出
    let localFn = null;
    try { localFn = eval(entry); } catch (e) { localFn = null; }
    if (typeof localFn === "function") globalThis[entry] = localFn;

    const fn =
      (typeof globalThis[entry] === "function" ? globalThis[entry] : null) ||
      (typeof window[entry] === "function" ? window[entry] : null);

    if (!fn) {
      send("test-result", {
        passed: 0,
        total: tests.length,
        details: tests.map((t) => ({
          name: t.name,
          ok: false,
          error: "未找到函数 " + entry,
          hidden: !!t.hidden,
        })),
      });
      return;
    }

    const details = [];
    let passed = 0;

    for (const t of tests) {
      try {
        const actual = fn.apply(null, t.input);
        const ok =
          judgeMode === "unorderedPair"
            ? unorderedPairEqual(actual, t.expected)
            : deepEqual(actual, t.expected);

        if (ok) passed++;
        details.push({
          name: t.name,
          ok,
          input: t.input,
          expected: t.expected,
          actual,
          hidden: !!t.hidden
        });
      } catch (e) {
        details.push({
          name: t.name,
          ok: false,
          input: t.input,
          expected: t.expected,
          error: e && e.stack ? String(e.stack) : String(e),
          hidden: !!t.hidden
        });
      }
    }

    send("test-result", { passed, total: tests.length, details });
  } catch (e) {
    send("test-result", {
      passed: 0,
      total: tests.length,
      details: [{ name: "编译/运行错误", ok: false, error: e && e.stack ? String(e.stack) : String(e) }]
    });
  }
})();
</script>
</body>
</html>`;
}
