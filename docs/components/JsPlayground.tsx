import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

type TestCase = {
  name: string;
  input: any[];
  expected: any;
  hidden?: boolean;
};

type JudgeMode = "deepEqual" | "unorderedPair";

export type Problem = {
  id: string;
  title: string;
  description: string;
  entry: string; // 用户需要实现的函数名
  starterCode: string;
  tests: TestCase[];
  judgeMode?: JudgeMode; // ✅ 用于“两数之和”等特殊判题
};

type Props = {
  problem: Problem;
  height?: number;
};

function getIsDark() {
  const html = document.documentElement;
  const body = document.body;
  return (
    html.getAttribute("data-theme") === "dark" ||
    html.classList.contains("dark") ||
    body.classList.contains("dark")
  );
}

function safeStringify(v: any) {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export default function JsPlayground({ problem, height = 260 }: Props) {
  const [code, setCode] = useState(problem.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [result, setResult] = useState<
    | { status: "idle" }
    | { status: "running" }
    | {
        status: "done";
        passed: number;
        total: number;
        details: Array<{
          name: string;
          ok: boolean;
          input?: any[];
          expected?: any;
          actual?: any;
          error?: string;
          hidden?: boolean;
        }>;
      }
  >({ status: "idle" });

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // ✅ 跟随站点主题
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(getIsDark());
    const obs = new MutationObserver(() => setIsDark(getIsDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  const monacoTheme = isDark ? "vs-dark" : "vs";

  // ✅ 切换题目时重置
  useEffect(() => {
    setCode(problem.starterCode);
    setOutput([]);
    setResult({ status: "idle" });
  }, [problem.id, problem.starterCode]);

  // iframe HTML：注入用户代码 + 测试运行器
  const iframeHtml = useMemo(() => {
    const testsJson = safeStringify(problem.tests);
    const entryName = problem.entry;
    const judgeMode = problem.judgeMode ?? "deepEqual";

    // 注意：这里用模板字符串拼接 code，请确保 code 是你允许的字符串
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

  // 深比较（基础）
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

  // ✅ “两数之和”这类：下标对不要求顺序
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

    const fn =
      (typeof window[entry] === "function" ? window[entry] : null) ||
      (typeof globalThis[entry] === "function" ? globalThis[entry] : null);

    if (!fn) {
      send("test-result", {
        passed: 0,
        total: tests.length,
        details: tests.map(t => ({ name: t.name, ok: false, error: "未找到函数 " + entry, hidden: !!t.hidden }))
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
  }, [code, problem]);

  // 监听 iframe 回传
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!e.data || e.data.source !== "js-playground") return;

      if (e.data.type === "console") {
        const { level, args } = e.data.payload as {
          level: "log" | "warn" | "error";
          args: string[];
        };
        setOutput((prev) => {
          const prefix =
            level === "error" ? "❌ " : level === "warn" ? "⚠️ " : "";
          return [...prev, prefix + args.join(" ")];
        });
        return;
      }

      if (e.data.type === "test-result") {
        const { passed, total, details } = e.data.payload as any;
        setResult({ status: "done", passed, total, details });
        return;
      }
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const run = () => {
    setOutput([]);
    setResult({ status: "running" });
    if (iframeRef.current) iframeRef.current.srcdoc = iframeHtml;
  };

  return (
    <div
      style={{
        border: "1px solid var(--rp-c-divider, #ddd)",
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--rp-c-bg, transparent)",
      }}
    >
      {/* 题目信息 */}
      <div
        style={{
          padding: 10,
          borderBottom: "1px solid var(--rp-c-divider, #ddd)",
        }}
      >
        <div style={{ fontWeight: 600 }}>{problem.title}</div>
        <div
          style={{
            fontSize: 12,
            opacity: 0.75,
            marginTop: 4,
            whiteSpace: "pre-wrap",
          }}
        >
          {problem.description}
        </div>
      </div>

      {/* 工具栏 */}
      <div
        style={{
          padding: 10,
          display: "flex",
          gap: 10,
          alignItems: "center",
          borderBottom: "1px solid var(--rp-c-divider, #ddd)",
        }}
      >
        <button
          onClick={run}
          style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}
        >
          ▶ 运行
        </button>

        {result.status === "done" ? (
          <span style={{ fontSize: 12, opacity: 0.9 }}>
            {result.passed === result.total ? "✅ 全部通过" : "❌ 未通过"}（
            {result.passed}/{result.total}）
          </span>
        ) : result.status === "running" ? (
          <span style={{ fontSize: 12, opacity: 0.7 }}>运行中…</span>
        ) : (
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            实现函数：{problem.entry}(...) 后点击运行
          </span>
        )}
      </div>

      {/* 编辑器 */}
      <Editor
        height={height}
        defaultLanguage="javascript"
        value={code}
        onChange={(v) => setCode(v ?? "")}
        theme={monacoTheme}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />

      {/* 测试结果 */}
      <div
        style={{
          borderTop: "1px solid var(--rp-c-divider, #ddd)",
          padding: 10,
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
          测试结果
        </div>

        {result.status === "done" ? (
          <div style={{ display: "grid", gap: 8 }}>
            {result.details.map((d, idx) => (
              <div
                key={idx}
                style={{
                  padding: 8,
                  border: "1px solid var(--rp-c-divider, #ddd)",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {d.ok ? "✅" : "❌"} {d.name} {d.hidden ? "(隐藏用例)" : ""}
                </div>

                {!d.ok && d.error ? (
                  <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>
                    {d.error}
                  </pre>
                ) : d.hidden ? (
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                    （隐藏用例不展示输入输出）
                  </div>
                ) : (
                  <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>
                    输入: {safeStringify(d.input)}
                    {"\n"}期望: {safeStringify(d.expected)}
                    {"\n"}实际: {safeStringify(d.actual)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            点击运行后显示通过/失败详情
          </div>
        )}
      </div>

      {/* console 输出 */}
      <div
        style={{
          borderTop: "1px solid var(--rp-c-divider, #ddd)",
          padding: 10,
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
          console 输出
        </div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {output.length ? output.join("\n") : "（无输出）"}
        </pre>
      </div>

      <iframe
        ref={iframeRef}
        title="js-runner"
        sandbox="allow-scripts"
        style={{ display: "none" }}
      />
    </div>
  );
}
