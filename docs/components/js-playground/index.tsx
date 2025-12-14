// docs/components/js-playground/index.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { Problem, RunResult } from "./types";
import { useIsDarkTheme } from "./hooks";
import { buildIframeHtml } from "./iframeRunner";
import { Toolbar } from "./Toolbar";
import { ResultsPanel } from "./ResultsPanel";
import { ConsolePanel } from "./ConsolePanel";
import { Resizer } from "./Resizer";
import { launchFireworks } from "./fireworks"; // ✅ 成功执行后放烟花

type Props = {
  problem: Problem;
  height?: number; // 初始高度
};

// =====================
// 本地存储：辅助函数
// =====================
function lsGet(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function lsSet(key: string, val: string) {
  try {
    localStorage.setItem(key, val);
  } catch {
    // ignore
  }
}
// ✅ 新增：删除本地存储
function lsRemove(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export default function JsPlayground({ problem, height = 260 }: Props) {
  // =====================
  // 本地存储：每题独立保存
  // =====================
  const codeKey = `js-playground:code:${problem.id}`;

  // ✅ 初始化：优先读本地保存，否则用 starterCode
  const [code, setCode] = useState(() => {
    const saved = typeof window !== "undefined" ? lsGet(codeKey) : null;
    return saved ?? problem.starterCode;
  });

  const [output, setOutput] = useState<string[]>([]);
  const [result, setResult] = useState<RunResult>({ status: "idle" });

  // ✅ 新增：编辑器高度可拖拽 + 字体大小可调
  const [editorHeight, setEditorHeight] = useState<number>(height);
  const [fontSize, setFontSize] = useState<number>(14);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const isDark = useIsDarkTheme();
  const monacoTheme = isDark ? "vs-dark" : "vs";

  // =====================
  // ✅ 题目切换：优先读该题保存，没有才用 starterCode
  //    （注意：你原来有两个 useEffect 做“切题重置”，会互相覆盖，这里只保留一个）
  // =====================
  useEffect(() => {
    const saved = lsGet(`js-playground:code:${problem.id}`);
    setCode(saved ?? problem.starterCode);

    setOutput([]);
    setResult({ status: "idle" });
    setEditorHeight(height);
    setFontSize(14);
  }, [problem.id, problem.starterCode, height]);

  const iframeHtml = useMemo(() => buildIframeHtml(code, problem), [code, problem]);

  // =====================
  // 监听 iframe 回传
  // =====================
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!e.data || e.data.source !== "js-playground") return;

      if (e.data.type === "console") {
        const { level, args } = e.data.payload as {
          level: "log" | "warn" | "error";
          args: string[];
        };
        setOutput((prev) => {
          const prefix = level === "error" ? "❌ " : level === "warn" ? "⚠️ " : "";
          return [...prev, prefix + args.join(" ")];
        });
        return;
      }

      if (e.data.type === "test-result") {
        const { passed, total, details } = e.data.payload as any;
        setResult({ status: "done", passed, total, details });

        // ✅ 全部通过才放烟花
        if (total > 0 && passed === total) {
          launchFireworks();
        }
      }
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // =====================
  // 运行：刷新 iframe 执行
  // =====================
  const run = () => {
    setOutput([]);
    setResult({ status: "running" });
    if (iframeRef.current) iframeRef.current.srcdoc = iframeHtml;
  };

  // =====================
  // ✅ 重置代码：清空本地保存 + 恢复 starterCode
  // =====================
  const resetCode = () => {
    lsRemove(codeKey);              // 1) 删除本题本地保存
    setCode(problem.starterCode);   // 2) 恢复默认代码
    setOutput([]);                  // 3) 可选：顺便清空输出
    setResult({ status: "idle" });  // 4) 可选：重置判题状态
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
      <div style={{ padding: 10, borderBottom: "1px solid var(--rp-c-divider, #ddd)" }}>
        <div style={{ fontWeight: 600 }}>{problem.title}</div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4, whiteSpace: "pre-wrap" }}>
          {problem.description}
        </div>
      </div>

      <Toolbar
        problem={problem}
        result={result}
        onRun={run}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        onResetCode={resetCode} // ✅ 新增：传给 Toolbar
      />

      <Editor
        height={editorHeight}
        defaultLanguage="javascript"
        value={code}
        // ✅ 本地存储：用户编辑即保存
        onChange={(v) => {
          const next = v ?? "";
          setCode(next);
          lsSet(codeKey, next);
        }}
        theme={monacoTheme}
        options={{
          minimap: { enabled: false },
          fontSize,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />

      <Resizer height={editorHeight} onHeightChange={setEditorHeight} />

      <ResultsPanel result={result} />
      <ConsolePanel output={output} />

      <iframe ref={iframeRef} title="js-runner" sandbox="allow-scripts" style={{ display: "none" }} />
    </div>
  );
}

export type { Problem } from "./types";
