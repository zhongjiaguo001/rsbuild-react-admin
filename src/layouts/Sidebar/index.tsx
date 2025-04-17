import React from "react";
import { Nav } from "@douyinfe/semi-ui";
import { useNavigate } from "react-router-dom";
import { IconHome, IconSetting, IconComment } from "@douyinfe/semi-icons";

// 定义一个静态的系统管理模块路由 包含用户 角色 菜单 员工 部门 权限 日志 字典 配置等
const systemRouter = {
  itemKey: "/system",
  text: "系统管理",
  icon: <IconSetting />,
  items: [
    {
      itemKey: "/system/user",
      text: "用户管理",
    },
    {
      itemKey: "/system/role",
      text: "角色管理",
    },
    {
      itemKey: "/system/menu",
      text: "菜单管理",
    },
    {
      itemKey: "/system/employee",
      text: "员工管理",
    },
    {
      itemKey: "/system/department",
      text: "部门管理",
    },
    {
      itemKey: "/system/permission",
      text: "权限管理",
    },
    {
      itemKey: "/system/log",
      text: "日志管理",
    },
  ],
};

const items = [
  {
    itemKey: "/",
    text: "首页",
    icon: <IconHome />,
  },
  {
    itemKey: "/chat",
    text: "AI对话",
    icon: <IconComment />,
  },
].concat(systemRouter); // 合并成一个数组 方便遍历

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Nav
      className="h-full semi-border-color border-r"
      onSelect={(key) => navigate(key.itemKey as string)}
      items={items}
      footer={{
        collapseButton: true,
      }}
    />
  );
};
