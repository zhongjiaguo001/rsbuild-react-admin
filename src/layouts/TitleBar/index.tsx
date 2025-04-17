import { useState, type ReactNode } from "react";
import { Button, Typography, Avatar } from "@douyinfe/semi-ui";
import { ThemeToggle } from "@/components/ThemeToggle";
import { IconSemiLogo } from "@douyinfe/semi-icons";

interface TitleBarProps {
  title?: string;
  logo?: string;
  children?: ReactNode;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const TitleBar = ({
  title = "管理系统",
  logo,
  children,
}: TitleBarProps) => {
  return (
    <div className="flex items-center justify-end p-2">
      <div className="flex items-center gap-2">
        <IconSemiLogo size="extra-large" />
        <Typography.Title heading={6}>{title}</Typography.Title>
      </div>
      {/* 自定义内容区域 */}
      <div style={{ flex: 1, marginLeft: 16 }}>{children}</div>
      <ThemeToggle />
    </div>
  );
};
