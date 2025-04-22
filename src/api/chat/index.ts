// src/api/chat/index.ts
import { request } from "@/utils/request";

export interface Content {
  type: "text" | "image_url" | "file_url";
  text?: string;
  image_url?: {
    url: string;
    [x: string]: any;
  };
  file_url?: {
    url: string;
    name: string;
    size: string;
    type: string;
    [x: string]: any;
  };
}

// 格式化的消息类型
export interface Message {
  role?: string;
  name?: string;
  id?: string;
  content?: string | Content[];
  parentId?: string;
  createAt?: number;
  status?: "loading" | "incomplete" | "complete" | "error";
  [x: string]: any;
}

export interface ChatMessage {
  id: number;
  sessionId: number;
  content: string;
  role: "user" | "assistant" | "system";
  fileUrl?: string;
  mimeType?: string;
  tokens?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionList {
  id: number;
  title: string;
  modelId?: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
  lastMessage?: string;
}

export interface CreateSessionParams {
  title: string;
  modelId?: string;
  firstMessage?: string;
}

export interface SendMessageParams {
  sessionId: number;
  content: string;
  fileUrl?: string;
  mimeType?: string;
}

export interface SessionListParams {
  page?: number;
  pageSize?: number;
}

// AI聊天相关API
export const chatApi = {
  /**
   * 创建新会话
   */
  createSession: (data: CreateSessionParams) => {
    return request.post<{ id: number }>("/ai/session", data);
  },

  /**
   * 获取会话列表
   */
  getSessions: (params?: SessionListParams) => {
    return request.get<{
      list: SessionList[];
      pagination: {
        current: number;
        pageSize: number;
        total: number;
      };
    }>("/ai/session", params);
  },

  /**
   * 获取会话消息列表
   */
  getSessionMessages: (sessionId: number) => {
    return request.get<ChatMessage[]>(`/ai/session/${sessionId}/messages`);
  },

  /**
   * 删除会话
   */
  deleteSession: (sessionId: number) => {
    return request.delete(`/ai/session/${sessionId}`);
  },

  /**
   * 上传文件
   */
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request.post<{
      url: string;
      name: string;
      mimeType: string;
      size: number;
    }>("/ai/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * 获取AI模型列表
   */
  getModels: () => {
    return request.get<{ id: string; name: string }[]>("/ai/models");
  },
};
