import React from "react";
import type { RunResult, Problem } from "./types";

type Props = {
  problem: Problem;
  result: RunResult;
  onRun: () => void;
  fontSize: number;
  onFontSizeChange: (next: number) => void;
};

const MIN_FS = 12;
const MAX_FS = 22;

export function Toolbar({
  problem,
  result,
  onRun,
  fontSize,
  onFontSizeChange,
}: Props) {
  return (
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
        onClick={onRun}
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

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <button
          onClick={() => onFontSizeChange(Math.max(MIN_FS, fontSize - 1))}
          style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}
          title="减小字体"
        >
          A-
        </button>
        <span style={{ fontSize: 12, opacity: 0.75 }}>{fontSize}px</span>
        <button
          onClick={() => onFontSizeChange(Math.min(MAX_FS, fontSize + 1))}
          style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer" }}
          title="增大字体"
        >
          A+
        </button>
      </div>
    </div>
  );
}
