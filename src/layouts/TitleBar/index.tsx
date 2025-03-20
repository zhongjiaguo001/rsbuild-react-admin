import { useState, type ReactNode } from "react";
import { Button, Typography, Avatar } from "@douyinfe/semi-ui";
import {
  Close as IconClose,
  Minus as IconMinus,
  FullScreen as IconMaximize,
  OffScreen as IconMinimize,
} from "@icon-park/react";
import { Window } from "@tauri-apps/api/window";
import { ThemeToggle } from "@/components/ThemeToggle";

interface TitleBarProps {
  title?: string;
  logo?: string;
  children?: ReactNode;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export const TitleBar = ({
  title = "小郭聊天",
  logo,
  children,
}: TitleBarProps) => {
  const appWindow = Window.getCurrent();
  const [isFull, setIsFull] = useState(false);

  const handleToggleFullscreen = async () => {
    appWindow.toggleMaximize();
    setIsFull((value) => !value);
  };

  return (
    <div
      data-tauri-drag-region
      className="flex items-center justify-end p-2 border-b semi-border-color"
    >
      <div className="flex items-center gap-2">
        <Avatar
          className="!bg-[#6E41EF] !text-[18px]"
          shape="square"
          size="extra-small"
          src={logo}
          alt="User"
        >
          XG
        </Avatar>
        <Typography.Title heading={6}>{title}</Typography.Title>
      </div>
      {/* 自定义内容区域 */}
      <div style={{ flex: 1, marginLeft: 16 }}>{children}</div>
      <ThemeToggle />
      <div>
        <Button
          type="tertiary"
          theme="borderless"
          icon={<IconMinus />}
          onClick={() => appWindow.minimize()}
        />
        <Button
          type="tertiary"
          theme="borderless"
          icon={isFull ? <IconMinimize /> : <IconMaximize />}
          onClick={handleToggleFullscreen}
        />
        <Button
          type="tertiary"
          theme="borderless"
          icon={<IconClose />}
          onClick={() => appWindow.hide()}
        />
      </div>
    </div>
  );
};
