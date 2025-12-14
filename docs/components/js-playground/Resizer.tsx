import React from "react";

type Props = {
  height: number;
  onHeightChange: (next: number) => void;
  min?: number;
  max?: number;
};

export function Resizer({ height, onHeightChange, min = 160, max = 720 }: Props) {
  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault();
        const startY = e.clientY;
        const startH = height;

        const onMove = (ev: PointerEvent) => {
          const dy = ev.clientY - startY;
          const next = Math.max(min, Math.min(max, startH + dy));
          onHeightChange(next);
        };

        const onUp = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
      }}
      style={{
        height: 10,
        cursor: "row-resize",
        background: "var(--rp-c-bg-soft, rgba(127,127,127,0.08))",
        borderTop: "1px solid var(--rp-c-divider, #ddd)",
        userSelect: "none",
      }}
      title="拖拽调整编辑器高度"
    />
  );
}
