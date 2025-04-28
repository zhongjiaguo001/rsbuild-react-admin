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

export interface ProfileInfo {
  id: number;
  deptId: number;
  username: string;
  nickname: string;
  userType: string;
  email: string;
  phonenumber: string;
  sex: string;
  avatar: string;
  status: string;
  delFlag: string;
  loginIp: string;
  loginDate: string;
  createBy: string;
  createdAt: string;
  updateBy: string;
  updatedAt: string;
  remark: string;
  dept: {
    id: number;
    name: string;
  };
  userRoles: Array<{
    userId: number;
    roleId: number;
    createdAt: string;
    role: {
      id: number;
      name: string;
      key: string;
      orderNo: number;
      dataScope: string;
      menuCheckStrictly: number;
      deptCheckStrictly: number;
      status: string;
      delFlag: string;
      createBy: string;
      createdAt: string;
      updateBy: string;
      updatedAt: string;
      remark: string;
    };
  }>;
  roles: Array<{
    id: number;
    name: string;
    key: string;
  }>;
}

export interface UpdateProfileParams {
  username: string;
  nickname?: string;
  phone: string;
  email: string;
  gender: string;
}

export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// 获取用户列表
export function listUser(params: UserQuery) {
  return request.get<{
    total: number;
    list: UserInfo[];
  }>("/system/user/list", params);
}

// 新增用户
export function addUser(data: UserForm) {
  return request.post("/system/user", data, {
    showMessage: true,
  });
}

// 修改用户信息
export function updateUser(data: UserForm) {
  return request.put("/system/user", data, {
    showMessage: true,
  });
}

// 删除用户
export function deleteUser(ids: string) {
  return request.delete(`/system/user/${ids}`, {
    showMessage: true,
  });
}

// 重置密码
export function resetPassword(id: number, newPassword: string) {
  return request.put(
    `/system/user/resetPwd`,
    { id, newPassword },
    { showMessage: true }
  );
}

// 修改用户状态
export function changeStatus(id: number, status: string) {
  return request.put(`/system/user/changeStatus`, { id, status });
}

// 分配用户角色
export function assignRoles(id: number, roleIds: number[]) {
  return request.post(
    `/system/user/${id}/roles`,
    { roleIds },
    {
      showMessage: true,
    }
  );
}

// 获取用户角色
export function getUserRoles(id: number) {
  return request.get<number[]>(`/system/user/${id}/roles`);
}

// 获取用户个人信息
export function getUserProFile() {
  return request.get<ProfileInfo>("/system/user/profile");
}

// 修改用户个人信息
export function updateUserProFile(data: UpdateProfileParams) {
  return request.put("/system/user/profile", data, {
    showMessage: true,
  });
}

// 修改用户密码
export function updateUserPassword(data: UpdatePasswordParams) {
  return request.put("/system/user/updatePwd", data, {
    showMessage: true,
  });
}

export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  return request.put<string>("/system/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    showMessage: true,
  });
}
