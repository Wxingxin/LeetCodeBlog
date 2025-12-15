import React from "react";

export type Difficulty = "easy" | "medium" | "hard";

type Props = {
  title: string;
  difficulty: Difficulty;
  tags?: string[];
  meta?: React.ReactNode; // 右侧扩展：比如「题号/来源/通过率」等
  children?: React.ReactNode; // 描述/提示/链接等
};

const DIFF_TEXT: Record<Difficulty, string> = {
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

export default function ProblemHeader({
  title,
  difficulty,
  tags = [],
  meta,
  children,
}: Props) {
  // 用 data-difficulty 让 CSS 精确控制配色（含暗色）
  return (
    <section className="problemHeader" data-difficulty={difficulty}>
      <div className="problemHeader__top">
        <div className="problemHeader__titleRow">
          <h1 className="problemHeader__title">{title}</h1>

          <span className="problemHeader__badge" aria-label={`难度：${DIFF_TEXT[difficulty]}`}>
            {DIFF_TEXT[difficulty]}
          </span>

          {tags.length > 0 && (
            <div className="problemHeader__tags">
              {tags.map((t) => (
                <span key={t} className="problemHeader__tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {meta ? <div className="problemHeader__meta">{meta}</div> : null}
      </div>

      {children ? <div className="problemHeader__content">{children}</div> : null}

      {/* 组件内联样式：不依赖全局 CSS，也方便你后续抽到全局 */}
      <style>{`
        .problemHeader {
          border: 1px solid var(--ph-border);
          background: var(--ph-bg);
          border-radius: 14px;
          padding: 14px 14px 12px;
          margin: 14px 0 16px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        .problemHeader__top {
          display: flex;
          gap: 12px;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .problemHeader__titleRow {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          min-width: 240px;
        }

        .problemHeader__title {
          font-size: 20px;
          line-height: 1.2;
          margin: 0;
        }

        .problemHeader__badge {
          display: inline-flex;
          align-items: center;
          height: 22px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--ph-badge-border);
          background: var(--ph-badge-bg);
          color: var(--ph-badge-text);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .02em;
          user-select: none;
        }

        .problemHeader__tags {
          display: inline-flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .problemHeader__tag {
          display: inline-flex;
          align-items: center;
          height: 20px;
          padding: 0 8px;
          border-radius: 999px;
          border: 1px solid rgba(127,127,127,0.25);
          background: rgba(127,127,127,0.08);
          font-size: 12px;
          opacity: 0.9;
        }

        .problemHeader__meta {
          font-size: 12px;
          opacity: 0.8;
        }

        .problemHeader__content {
          margin-top: 10px;
          font-size: 13px;
          opacity: 0.9;
          line-height: 1.6;
        }

        /* ===== 配色：亮色默认（你也可以换成 rp 变量） ===== */
        .problemHeader[data-difficulty="easy"] {
          --ph-bg: rgba(52, 199, 89, 0.10);
          --ph-border: rgba(52, 199, 89, 0.35);
          --ph-badge-bg: rgba(52, 199, 89, 0.18);
          --ph-badge-border: rgba(52, 199, 89, 0.45);
          --ph-badge-text: rgba(0, 120, 40, 0.95);
        }

        .problemHeader[data-difficulty="medium"] {
          --ph-bg: rgba(255, 204, 0, 0.12);
          --ph-border: rgba(255, 204, 0, 0.45);
          --ph-badge-bg: rgba(255, 204, 0, 0.20);
          --ph-badge-border: rgba(255, 204, 0, 0.55);
          --ph-badge-text: rgba(140, 100, 0, 0.95);
        }

        .problemHeader[data-difficulty="hard"] {
          --ph-bg: rgba(255, 59, 48, 0.10);
          --ph-border: rgba(255, 59, 48, 0.40);
          --ph-badge-bg: rgba(255, 59, 48, 0.18);
          --ph-badge-border: rgba(255, 59, 48, 0.55);
          --ph-badge-text: rgba(150, 0, 0, 0.95);
        }

        /* ===== 暗色适配：如果你的站点是 data-theme="dark" 或 class="dark" ===== */
        html[data-theme="dark"] .problemHeader,
        html.dark .problemHeader,
        body.dark .problemHeader {
          box-shadow: 0 10px 24px rgba(0,0,0,0.35);
        }

        html[data-theme="dark"] .problemHeader[data-difficulty="easy"],
        html.dark .problemHeader[data-difficulty="easy"],
        body.dark .problemHeader[data-difficulty="easy"] {
          --ph-bg: rgba(52, 199, 89, 0.12);
          --ph-border: rgba(52, 199, 89, 0.35);
          --ph-badge-bg: rgba(52, 199, 89, 0.22);
          --ph-badge-border: rgba(52, 199, 89, 0.55);
          --ph-badge-text: rgba(180, 255, 200, 0.95);
        }

        html[data-theme="dark"] .problemHeader[data-difficulty="medium"],
        html.dark .problemHeader[data-difficulty="medium"],
        body.dark .problemHeader[data-difficulty="medium"] {
          --ph-bg: rgba(255, 204, 0, 0.14);
          --ph-border: rgba(255, 204, 0, 0.40);
          --ph-badge-bg: rgba(255, 204, 0, 0.22);
          --ph-badge-border: rgba(255, 204, 0, 0.55);
          --ph-badge-text: rgba(255, 240, 190, 0.95);
        }

        html[data-theme="dark"] .problemHeader[data-difficulty="hard"],
        html.dark .problemHeader[data-difficulty="hard"],
        body.dark .problemHeader[data-difficulty="hard"] {
          --ph-bg: rgba(255, 59, 48, 0.12);
          --ph-border: rgba(255, 59, 48, 0.42);
          --ph-badge-bg: rgba(255, 59, 48, 0.22);
          --ph-badge-border: rgba(255, 59, 48, 0.60);
          --ph-badge-text: rgba(255, 205, 205, 0.95);
        }
      `}</style>
    </section>
  );
}
