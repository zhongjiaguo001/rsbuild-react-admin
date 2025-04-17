import { request } from "@/utils/request";

export interface MenuInfo {
  id: number;
  parentId: number | null;
  name: string;
  path: string;
  component: string;
  permission: string;
  type: number; // 0: 目录, 1: 菜单, 2: 按钮
  icon: string;
  orderNo: number;
  keepAlive: number; // 0: 缓存, 1: 不缓存
  show: number; // 1: 显示, 0: 隐藏
  status: number; // 1: 正常, 0: 禁用
  isExt: number; // 0: 否, 1: 是
  extOpenMode: number; // 1: 新窗口, 2: 内嵌
  activeMenu: string;
  createdAt?: string;
  updatedAt?: string;
  children?: MenuInfo[];
}

export interface MenuQuery {
  page?: number;
  pageSize?: number;
  name?: string;
  path?: string;
  component?: string;
  permission?: string;
  status?: number;
  type?: number;
}

export interface MenuForm {
  id?: number;
  parentId?: number | null;
  name: string;
  path?: string;
  component?: string;
  permission?: string;
  type?: number;
  icon?: string;
  orderNo?: number;
  keepAlive?: number;
  show?: number;
  status?: number;
  isExt?: number;
  extOpenMode?: number;
  activeMenu?: string;
}

/**
 * 菜单管理相关API
 */
export const menuApi = {
  /**
   * 获取菜单列表
   */
  getList: (params: MenuQuery) => {
    return request.get<{
      total: number;
      items: MenuInfo[];
    }>("/system/menu/tree", params);
  },

  /**
   * 获取菜单树形结构
   */
  getTree: () => {
    return request.get<MenuInfo[]>("/system/menu/tree");
  },

  /**
   * 新增菜单
   */
  add: (data: MenuForm) => {
    return request.post<MenuInfo>("/system/menu", data, {
      showMessage: true,
    });
  },

  /**
   * 修改菜单
   */
  update: (data: MenuForm) => {
    return request.put<MenuInfo>(`/system/menu/${data.id}`, data, {
      showMessage: true,
    });
  },

  /**
   * 删除菜单
   */
  delete: (ids: string) => {
    return request.delete(`/system/menu/${ids}`);
  },

  /**
   * 获取角色菜单权限
   */
  getRoleMenus: (roleId: number) => {
    return request.get<number[]>(`/system/menu/role/${roleId}`);
  },

  /**
   * 为角色分配菜单权限
   */
  assignRoleMenus: (roleId: number, menuIds: number[]) => {
    return request.post(
      `/system/menu/role/${roleId}`,
      { menuIds },
      {
        showMessage: true,
      }
    );
  },
};
