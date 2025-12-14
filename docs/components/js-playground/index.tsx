import React, { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { Problem, RunResult } from "./types";
import { useIsDarkTheme } from "./hooks";
import { buildIframeHtml } from "./iframeRunner";
import { Toolbar } from "./Toolbar";
import { ResultsPanel } from "./ResultsPanel";
import { ConsolePanel } from "./ConsolePanel";
import { Resizer } from "./Resizer";
import { launchFireworks } from "./fireworks";//成功执行后放烟花

type Props = {
  problem: Problem;
  height?: number; // 初始高度
};

export default function JsPlayground({ problem, height = 260 }: Props) {
  const [code, setCode] = useState(problem.starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [result, setResult] = useState<RunResult>({ status: "idle" });

  // ✅ 新增：编辑器高度可拖拽 + 字体大小可调
  const [editorHeight, setEditorHeight] = useState<number>(height);
  const [fontSize, setFontSize] = useState<number>(14);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const isDark = useIsDarkTheme();
  const monacoTheme = isDark ? "vs-dark" : "vs";

  // 切换题目时重置
  useEffect(() => {
    setCode(problem.starterCode);
    setOutput([]);
    setResult({ status: "idle" });
    setEditorHeight(height); // 题目切换回到初始高度（不想重置可删）
    setFontSize(14); // 同上
  }, [problem.id, problem.starterCode, height]);

  const iframeHtml = useMemo(
    () => buildIframeHtml(code, problem),
    [code, problem]
  );

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

        // ✅ 全部通过才放烟花（并且只有通过时触发一次）
        if (total > 0 && passed === total) {
          launchFireworks(); // 你也可以传 { bursts: 4, durationMs: 1800 } 等
        }
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

      <Toolbar
        problem={problem}
        result={result}
        onRun={run}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      <Editor
        height={editorHeight}
        defaultLanguage="javascript"
        value={code}
        onChange={(v) => setCode(v ?? "")}
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

      <iframe
        ref={iframeRef}
        title="js-runner"
        sandbox="allow-scripts"
        style={{ display: "none" }}
      />
    </div>
  );
}

export type { Problem } from "./types";
