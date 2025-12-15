import React, { useMemo, useState } from "react";

type Option = {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
};

export type QuizProps = {
  title?: string;
  question: string;
  options: Option[]; // 固定 4 个也行
  answerId: string; // 正确选项 id，例如 "B"
  explanation?: string;
  shuffle?: boolean; // 是否打乱选项
};

export default function Quiz(props: QuizProps) {
  const {
    title = "单选题",
    question,
    options,
    answerId,
    explanation,
    shuffle = false,
  } = props;

  const [picked, setPicked] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const viewOptions = useMemo(() => {
    if (!shuffle) return options;
    // 简单洗牌（前端展示足够用）
    return [...options].sort(() => Math.random() - 0.5);
  }, [options, shuffle]);

  const isCorrect = submitted && picked === answerId;

  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 12,
        padding: 16,
        margin: "16px 0",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <strong>{title}</strong>
        {submitted && (
          <span
            style={{
              fontWeight: 600,
              color: isCorrect ? "green" : "crimson",
            }}
          >
            {isCorrect ? "✅ 正确" : "❌ 错误"}
          </span>
        )}
      </div>

      <div style={{ marginTop: 10, lineHeight: 1.7 }}>
        <div style={{ fontWeight: 600 }}>{question}</div>

        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {viewOptions.map((op) => {
            const active = picked === op.id;

            let border = "1px solid rgba(0,0,0,0.16)";
            let bg = "transparent";

            if (submitted) {
              if (op.id === answerId) {
                border = "1px solid rgba(0,128,0,0.6)";
                bg = "rgba(0,128,0,0.08)";
              } else if (active && op.id !== answerId) {
                border = "1px solid rgba(220,20,60,0.6)";
                bg = "rgba(220,20,60,0.08)";
              }
            } else if (active) {
              border = "1px solid rgba(0,0,0,0.5)";
              bg = "rgba(0,0,0,0.04)";
            }

            return (
              <button
                key={op.id}
                type="button"
                onClick={() => {
                  if (submitted) return;
                  setPicked(op.id);
                }}
                style={{
                  textAlign: "left",
                  border,
                  background: bg,
                  borderRadius: 10,
                  padding: "10px 12px",
                  cursor: submitted ? "not-allowed" : "pointer",
                  fontSize: 14,
                }}
              >
                <strong style={{ marginRight: 8 }}>{op.id}.</strong>
                {op.text}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!picked || submitted}
            style={{
              borderRadius: 10,
              padding: "8px 12px",
              border: "1px solid rgba(0,0,0,0.2)",
              cursor: !picked || submitted ? "not-allowed" : "pointer",
            }}
          >
            提交
          </button>

          <button
            type="button"
            onClick={() => {
              setPicked(null);
              setSubmitted(false);
            }}
            style={{
              borderRadius: 10,
              padding: "8px 12px",
              border: "1px solid rgba(0,0,0,0.2)",
              cursor: "pointer",
            }}
          >
            重置
          </button>
        </div>

        {submitted && explanation && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 10,
              background: "rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>解析</div>
            <div style={{ lineHeight: 1.7 }}>{explanation}</div>
          </div>
        )}
      </div>
    </div>
  );
}
