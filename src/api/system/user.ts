import request from "@/utils/request";

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  position: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
  roles?: Array<{ id: number; value: string }>;
}

export interface UserQuery extends SearchQuery {
  username?: string;
  phone?: string;
  status?: boolean;
  createdAt?: [string, string];
}

export interface UserForm {
  id?: number;
  username: string;
  password?: string;
  nickname: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  position: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 用户管理相关API
 */
export const userApi = {
  /**
   * 获取用户列表
   */
  getList: (params: UserQuery) => {
    return request.get<{
      total: number;
      list: UserInfo[];
    }>("/system/user/list", params);
  },

  /**
   * 新增用户
   */
  add: (data: UserForm) => {
    return request.post("/system/user", data, {
      showMessage: true,
    });
  },

  /**
   * 修改用户
   */
  update: (data: UserForm) => {
    return request.put(`/system/user`, data, {
      showMessage: true,
    });
  },

  /**
   * 删除用户
   */
  delete: (ids: string) => {
    return request.delete(`/system/user/${ids}`);
  },

  /**
   * 重置密码
   */
  resetPassword: (id: number, newPassword: string) => {
    return request.put(
      `/system/user/resetPwd`,
      { id, newPassword },
      { showMessage: true }
    );
  },

  /**
   * 修改用户状态
   */
  changeStatus: (id: number, status: string) => {
    return request.put(`/system/user/changeStatus`, { id, status });
  },

  /**
   * 分配用户角色
   */
  assignRoles: (id: number, roleIds: number[]) => {
    return request.post(
      `/system/user/${id}/roles`,
      { roleIds },
      {
        showMessage: true,
      }
    );
  },

  /**
   * 获取用户角色
   */
  getRoles: (id: number) => {
    return request.get<number[]>(`/system/user/${id}/roles`);
  },
};
