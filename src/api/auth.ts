// src/api/auth.ts
import { request } from "@/utils/request";

export interface UserInfo {}

export type UserType = {
  id: number;
  username: string;
  nickname: string;
  avatar: string;
  email: string;
  status: string;
};

export type RoleType = String[];

export type PermissionType = String[];

export type MenuItem = {
  id: number;
  parentId: number | null;
  path: string;
  name: string;
  permission: string;
  type: number; // 0: 目录, 1: 菜单, 2: 按钮
  icon: string;
  component: string | null;
  keepAlive: number;
  show: number;
  status: number;
  isExt: number;
  extOpenMode: number;
  activeMenu: string | null;
  query: string | null;
  orderNo: number;
  createdAt: string;
  updatedAt: string;
  children?: MenuItem[];
};

export interface UserInfo {
  user: UserType;
  roles: string[];
  permissions: string[];
}

export interface LoginParams {
  username: string;
  password: string;
  captcha: string;
}

export const authApi = {
  /**
   * 获取图片验证码
   */
  getCodeImg: () => {
    return request.get<string>("/auth/getCodeImg");
  },

  /**
   * 用户登录
   */
  login: (data: LoginParams) => {
    return request.post<string>("/auth/login", data);
  },

  /**
   * 用户登出
   */
  logout: () => {
    return request.post("/auth/logout", null, {
      showMessage: true,
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo: () => {
    return request.get<UserInfo>("/system/user/profile");
  },

  /**
   * 获取用户权限
   */
  getUserPermissions: () => {
    return request.get<string[]>("/system/user/permissions");
  },

  /**
   * 获取用户菜单
   */
  getUserMenus: () => {
    return request.get("/auth/getRouters");
  },
};
