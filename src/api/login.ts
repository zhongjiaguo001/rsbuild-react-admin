import request from "../utils/request";

export type UserDataType = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
};

export type QueryCodeParams = {
  email: string;
  purpose: string;
};

export type LoginType = {
  username: string; // Changed from email
  password: string; // Added password
  captcha: string;
};

/**
 * 用户相关API
 */
export const loginApi = {
  /**
   * 获取图片验证码
   * @returns 验证码图片数据和UUID
   */
  getCodeImg: () => {
    // Changed to GET and updated return type
    return request.get<string>("/auth/getCodeImg");
  },
  /**
   * 用户登录
   * @param data 登录数据
   * @returns 登录结果
   */
  login: (data: LoginType) => {
    return request.post<string>("/auth/login", data);
  },
  /**
   * 用户登出
   * @returns 登出结果
   */
  logout: () => {
    return request.post("/auth/logout", null, {
      showMessage: true,
    });
  },
};
