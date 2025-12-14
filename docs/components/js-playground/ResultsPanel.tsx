import React from "react";
import type { RunResult } from "./types";
import { safeStringify } from "./iframeRunner";

export function ResultsPanel({ result }: { result: RunResult }) {
  return (
    <div style={{ borderTop: "1px solid var(--rp-c-divider, #ddd)", padding: 10 }}>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>测试结果</div>

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
                <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{d.error}</pre>
              ) : d.hidden ? (
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>（隐藏用例不展示输入输出）</div>
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
        <div style={{ fontSize: 12, opacity: 0.7 }}>点击运行后显示通过/失败详情</div>
      )}
    </div>
  );
}
