// src/api/chat/index.ts
import { request } from "@/utils/request";

export interface ChatMessage {
  id: string;
  role: "system" | "user" | "assistant";
  content: string;
  createAt: number;
  status?: "pending" | "complete" | "error";
}

export interface SendMessageParams {
  content: string;
  attachment?: string[];
}

export interface ChatHistoryParams {
  limit?: number;
  before?: string;
}

// 聊天相关API
export const chatApi = {
  /**
   * 发送消息
   * @param data 消息内容
   */
  sendMessage: (data: SendMessageParams) => {
    return request.post<ChatMessage>("/chat/send", data);
  },

  /**
   * 获取聊天历史
   * @param params 查询参数
   */
  getChatHistory: (params?: ChatHistoryParams) => {
    return request.get<ChatMessage[]>("/chat/history", { params });
  },
};
