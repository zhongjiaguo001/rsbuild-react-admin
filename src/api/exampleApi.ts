import request from "../utils/request";
import { ApiResponse, QueryParams, User } from "../types";

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 获取用户列表
   * @param params 查询参数
   * @returns 用户列表和总数
   */
  getUsers: (params: QueryParams) => {
    return request.get<{ users: User[]; totalCount: number }>("/users", params);
  },

  /**
   * 获取用户详情
   * @param id 用户ID
   * @returns 用户详情
   */
  getUserById: (id: number) => {
    return request.get<User>(`/users/${id}`);
  },

  /**
   * 创建用户
   * @param data 用户数据
   * @returns 创建的用户
   */
  createUser: (data: Omit<User, "id" | "createdAt">) => {
    return request.post<User>("/users", data);
  },

  /**
   * 更新用户
   * @param id 用户ID
   * @param data 用户数据
   * @returns 更新的用户
   */
  updateUser: (id: number, data: Partial<Omit<User, "id" | "createdAt">>) => {
    return request.put<User>(`/users/${id}`, data);
  },

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 操作结果
   */
  deleteUser: (id: number) => {
    return request.delete<{ success: boolean }>(`/users/${id}`);
  },

  /**
   * 用户登录
   * @param data 登录数据
   * @returns 登录结果
   */
  login: (data: { email: string; password: string }) => {
    return request.post<{ token: string; user: User }>("/auth/login", data);
  },

  /**
   * 用户登出
   * @returns 登出结果
   */
  logout: () => {
    return request.post<{ success: boolean }>("/auth/logout");
  },
};

/**
 * 消息相关API
 */
export const messageApi = {
  /**
   * 获取消息列表
   * @param params 查询参数
   * @returns 消息列表
   */
  getMessages: (params: { contactId: number } & QueryParams) => {
    return request.get<{ messages: any[]; totalCount: number }>(
      "/messages",
      params
    );
  },

  /**
   * 发送消息
   * @param data 消息数据
   * @returns 发送的消息
   */
  sendMessage: (data: {
    contactId: number;
    content: string;
    type?: "text" | "image" | "file";
  }) => {
    return request.post<{ message: any }>("/messages", data);
  },
};
