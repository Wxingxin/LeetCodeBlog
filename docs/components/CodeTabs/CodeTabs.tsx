// docs/components/CodeTabs.tsx
import React from "react";

// ✅ v1 常见写法：rspress/theme
// import { Tabs, Tab } from 'rspress/theme';

// ✅ v2 常见写法：@rspress/core/theme
import { Tabs, Tab } from "@rspress/core/theme"; // :contentReference[oaicite:2]{index=2}

type CodeTabProps = {
  lang: string; // 用作 value
  label?: string; // 按钮显示文字
  children: React.ReactNode; // 你在 mdx 里塞进来的 ```xxx``` 代码块
};

type CodeTabsProps = {
  defaultLang?: string; // 默认选中的语言（不传就取第一个）
  groupId?: string; // 多处 CodeTabs 联动用
  children:
    | React.ReactElement<CodeTabProps>[]
    | React.ReactElement<CodeTabProps>;
};

export function CodeTabs({
  defaultLang,
  groupId = "code-lang",
  children,
}: CodeTabsProps) {
  const items = React.Children.toArray(
    children
  ) as React.ReactElement<CodeTabProps>[];
  const defaultValue = defaultLang ?? items?.[0]?.props?.lang;

  return (
    <Tabs defaultValue={defaultValue} groupId={groupId}>
      {items.map((child) => (
        <Tab
          key={child.props.lang}
          value={child.props.lang}
          label={child.props.label ?? child.props.lang}
        >
          {child.props.children}
        </Tab>
      ))}
    </Tabs>
  );
}

// 只是一个“语义壳”，方便你在 MDX 里写 <CodeTabs.Tab ...> 包住代码块
CodeTabs.Tab = function CodeTab({ children }: CodeTabProps) {
  return <>{children}</>;
};
