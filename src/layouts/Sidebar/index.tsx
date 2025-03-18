import React from "react";
import { Avatar, Button, Divider } from "@douyinfe/semi-ui";
import { Home, MessageOne, Setting, Peoples } from "@icon-park/react";
import { Link } from "@tanstack/react-router";

export const Sidebar: React.FC = () => {
  return (
    <div className="w-16 h-full flex flex-col items-center py-4 border-gray-200 border-r">
      {/* 头像 */}
      <div>
        <Avatar size="small" color="blue">
          XG
        </Avatar>
        <Divider margin={10} />
      </div>

      {/* 导航图标 */}
      <div className="flex flex-col gap-2 items-center">
        <Link to="/">
          <Button
            size="large"
            type="tertiary"
            theme="borderless"
            icon={<Home size={18} />}
          />
        </Link>
        <Link to="/chat">
          <Button
            size="large"
            type="tertiary"
            theme="borderless"
            icon={<MessageOne size={18} />}
          />
        </Link>
        <Link to="/contact">
          <Button
            size="large"
            type="tertiary"
            theme="borderless"
            icon={<Peoples size={18} />}
          />
        </Link>
      </div>

      {/* 底部设置图标 */}
      <Link className="mt-auto" to="/settings">
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
