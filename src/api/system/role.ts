import { request } from "@/utils/request";

export interface RoleInfo {
  id: number;
  name: string;
  value: string;
  orderNo: number;
  status: number;
  remark: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
  createdAt?: string;
  status?: number;
  name?: string;
  value?: string;
}

export interface RoleForm {
  id?: number;
  name: string;
  description?: string;
  permissions: string[];
}

export const roleApi = {
  /** 获取角色列表 */
  getList: (params: RoleQuery) =>
    request.get<{ total: number; list: RoleInfo[] }>(
      "/system/role/list",
      params
    ),

  /** 新增角色 */
  add: (data: RoleForm) =>
    request.post<RoleInfo>("/system/role/create", data, {
      showMessage: true,
    }),

  /** 更新角色 */
  update: (data: RoleForm) =>
    request.put<RoleInfo>(`/system/role/update/${data.id}`, data, {
      showMessage: true,
    }),

  /** 删除角色 */
  delete: (ids: string | string[]) =>
    request.delete(`/system/role/${Array.isArray(ids) ? ids.join(",") : ids}`),

  /** 更新角色状态 */
  updateStatus: (id: number, status: number) =>
    request.post(
      `/system/role/updateStatus`,
      {
        id,
        status,
      },
      {
        showMessage: true,
      }
    ),
};
