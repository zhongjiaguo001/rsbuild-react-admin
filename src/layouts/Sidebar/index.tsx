import React from "react";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import { Home, MessageOne, Setting, Peoples } from "@icon-park/react";
import { Link, useLocation } from "@tanstack/react-router";
import { User } from "./components/User";

const staticRouter = [
  {
    path: "/",
    label: "首页",
    icon: <Home size={18} />,
  },
  {
    path: "/chat",
    label: "消息",
    icon: <MessageOne size={18} />,
  },
  {
    path: "/contact",
    label: "用户",
    icon: <Peoples size={18} />,
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <div className="w-16 h-full flex flex-col items-center py-4 semi-border-color border-r">
      {/* 头像 */}
      <div>
        <User />
      </div>

      {/* 导航图标 */}
      <div className="flex flex-col gap-2 items-center">
        {staticRouter.map((item) => (
          <Link preload={false} key={item.path} to={item.path}>
            <Tooltip position="right" content={item.label}>
              <Button
                size="large"
                type={location.pathname === item.path ? "primary" : "tertiary"}
                theme={location.pathname === item.path ? "light" : "borderless"}
                icon={item.icon}
              />
            </Tooltip>
          </Link>
        ))}
      </div>

      {/* 底部设置图标 */}
      <Link preload={false} className="mt-auto" to="/settings">
        <Button
          icon={<Setting size={18} />}
          size="large"
          type="tertiary"
          theme="borderless"
        />
      </Link>
    </div>
  );
};
