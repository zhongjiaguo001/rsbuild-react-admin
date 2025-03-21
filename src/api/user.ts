import request from "../utils/request";

export type UserDataType = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
};

export type LoginDataType = {
  access_token: string;
  token_type: string;
  user: UserDataType;
};

export type QueryCodeParams = {
  email: string;
  purpose: string;
};

export type RegisterType = {
  email: string;
  username: string;
  verification_code?: string;
  purpose: string;
};

export type LoginType = {
  email: string;
  verification_code?: string;
  purpose: string;
};

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 发送验证码
   * @param email 邮箱地址
   * @returns 发送结果
   */
  sendVerificationCode: (data: QueryCodeParams) => {
    return request.post<{ success: boolean }>(
      "/auth/send-verification-code",
      data,
      {
        showMessage: true,
      }
    );
  },

  /**
   * 用户注册
   * @param data 注册数据
   * @returns 注册结果
   */
  register: (data: RegisterType) => {
    return request.post("/auth/register", data);
  },

  /**
   * 用户登录
   * @param data 登录数据
   * @returns 登录结果
   */
  login: (data: LoginType) => {
    return request.post<LoginDataType>("/auth/login", data);
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

/**
 * 消息相关API
 */
// export const messageApi = {
//   /**
//    * 获取消息列表
//    * @param params 查询参数
//    * @returns 消息列表
//    */
//   getMessages: (params: { contactId: number } & QueryParams) => {
//     return request.get<{ messages: any[]; totalCount: number }>(
//       "/messages",
//       params
//     );
//   },

//   /**
//    * 发送消息
//    * @param data 消息数据
//    * @returns 发送的消息
//    */
//   sendMessage: (data: {
//     contactId: number;
//     content: string;
//     type?: "text" | "image" | "file";
//   }) => {
//     return request.post<{ message: any }>("/messages", data);
//   },
// };
