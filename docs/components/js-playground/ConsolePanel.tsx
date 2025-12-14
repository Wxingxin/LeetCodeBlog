import React from "react";

export function ConsolePanel({ output }: { output: string[] }) {
  return (
    <div style={{ borderTop: "1px solid var(--rp-c-divider, #ddd)", padding: 10 }}>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>console 输出</div>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
        {output.length ? output.join("\n") : "（无输出）"}
      </pre>
    </div>
  );
}
