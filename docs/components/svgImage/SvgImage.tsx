import React from "react";

export type SvgImageProps = {
  /** svg 路径，例如 /images/arch.svg 或相对路径 */
  src: string;
  /** 语义同 <img alt=""> */
  alt?: string;

  /** 宽高：可传 number(像素) 或 string(如 "60%", "20rem") */
  width?: number | string;
  height?: number | string;

  /** 最大宽度：防止太大 */
  maxWidth?: number | string;

  /** 是否自适应：默认 true => 宽度撑满容器，高度按比例 */
  responsive?: boolean;

  /** 是否居中显示：默认 true */
  center?: boolean;

  /** object-fit 行为（对 <img> 有效；对 <object> 外容器也有帮助） */
  fit?: React.CSSProperties["objectFit"];

  /** 额外样式 */
  style?: React.CSSProperties;
  className?: string;

  /**
   * 默认用 <img>（最简单稳定）
   * 若你需要 SVG 内部字体/链接更像“内嵌”，可以改成 useObject
   */
  useObject?: boolean;
};

function toCssSize(v?: number | string) {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

export default function SvgImage({
  src,
  alt = "",
  width,
  height,
  maxWidth,
  responsive = true,
  center = true,
  fit = "contain",
  style,
  className,
  useObject = false,
}: SvgImageProps) {
  const w = toCssSize(width);
  const h = toCssSize(height);
  const mw = toCssSize(maxWidth);

  // 外层容器：负责“像 img 一样”控尺寸
  const wrapperStyle: React.CSSProperties = {
    width: responsive ? w ?? "100%" : w,
    height: h,
    maxWidth: mw,
    display: center ? "block" : "inline-block",
    margin: center ? "0 auto" : undefined,
    ...style,
  };

  // 内容样式
  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: h ? "100%" : "auto",
    display: "block",
    objectFit: fit,
  };

  // 1) <img>：最稳定（推荐）
  if (!useObject) {
    return (
      <div className={className} style={wrapperStyle}>
        <img src={src} alt={alt} style={mediaStyle} />
      </div>
    );
  }

  // 2) <object>：更像“内嵌”，但有些站点 CSP / 样式隔离会更麻烦
  return (
    <div className={className} style={wrapperStyle}>
      <object
        data={src}
        type="image/svg+xml"
        aria-label={alt}
        style={mediaStyle}
      />
    </div>
  );
}
