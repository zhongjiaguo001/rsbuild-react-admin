// src/hooks/use-chat.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  chatApi,
  type ChatMessage,
  type SessionList,
  type SendMessageParams,
  type CreateSessionParams,
} from "@/api/chat";

/**
 * 获取会话列表的Hook
 */
export const useSessionList = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["chat-sessions", page, pageSize],
    queryFn: () => chatApi.getSessions({ page, pageSize }),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取数据
  });
};

/**
 * 获取会话消息列表的Hook
 */
export const useSessionMessages = (sessionId: number | null) => {
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: () => {
      if (!sessionId) return Promise.resolve({ data: [] });
      return chatApi.getSessionMessages(sessionId);
    },
    select: (data) => data.data,
    enabled: !!sessionId, // 只有当sessionId存在时才执行查询
    staleTime: 1000 * 60 * 5, // 5分钟内不重新获取数据
  });
};

/**
 * 创建新会话的Hook
 */
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSessionParams) => chatApi.createSession(data),
    onSuccess: () => {
      // 创建成功后，使会话列表缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
};

/**
 * 发送消息的Hook
 */
export const useSendMessage = (sessionId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageParams) => chatApi.sendMessage(data),
    onSuccess: () => {
      if (sessionId) {
        // 发送成功后，使当前会话的消息列表缓存失效，触发重新获取
        queryClient.invalidateQueries({
          queryKey: ["chat-messages", sessionId],
        });
        // 同时更新会话列表，因为最新消息和更新时间已经变化
        queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
      }
    },
  });
};

/**
 * 删除会话的Hook
 */
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => chatApi.deleteSession(sessionId),
    onSuccess: () => {
      // 删除成功后，使会话列表缓存失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
};

/**
 * 删除消息的Hook
 */
export const useDeleteMessage = (sessionId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => chatApi.deleteMessage(messageId),
    onSuccess: () => {
      if (sessionId) {
        // 删除成功后，使当前会话的消息列表缓存失效，触发重新获取
        queryClient.invalidateQueries({
          queryKey: ["chat-messages", sessionId],
        });
      }
    },
  });
};
