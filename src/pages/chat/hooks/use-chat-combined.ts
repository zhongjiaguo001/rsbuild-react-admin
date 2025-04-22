// src/pages/chat/hooks/use-chat-combined.ts
import { useEffect, useRef } from "react";
import {
  useSessionList,
  useSessionMessages,
  useSendMessage,
  useDeleteSession,
  useDeleteMessage,
} from "@/hooks/use-chat";
import { useChatStore } from "@/store";
import { type Message } from "@/api/chat";

/**
 * 结合React Query和Zustand的聊天数据管理Hook
 *
 * 这个Hook将服务器状态(React Query)和客户端状态(Zustand)结合起来，
 * 提供一个统一的接口来管理AI聊天数据。
 */
export const useChatCombined = () => {
  // 从Zustand获取客户端状态
  const {
    activeSessionId,
    isStreaming,
    tempMessages,
    fileUploading,
    siderCollapsed,
    setActiveSession,
    setIsStreaming,
    addTempMessage,
    updateTempMessage,
    clearTempMessages,
    setFileUploading,
    toggleSider,
  } = useChatStore();

  // 使用React Query获取服务器状态
  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useSessionList();

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useSessionMessages(activeSessionId);

  // 变更操作
  const sendMessageMutation = useSendMessage(activeSessionId);
  const deleteSessionMutation = useDeleteSession();
  const deleteMessageMutation = useDeleteMessage(activeSessionId);

  // 事件源引用，用于流式响应
  const eventSourceRef = useRef<EventSource | null>(null);

  // 合并服务器消息和临时消息
  const currentMessages =
    activeSessionId && messagesData
      ? [...messagesData, ...(tempMessages[activeSessionId] || [])]
      : [];

  // 发送消息并处理流式响应
  const sendMessage = async (
    content: string,
    fileUrl?: string,
    mimeType?: string
  ) => {
    if (!activeSessionId || isStreaming) return;

    try {
      // 添加用户消息到临时消息
      const userMessage: Message = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: [{ type: "text", text: content }],
        createAt: Date.now(),
        status: "complete",
      };

      // 如果有文件，添加文件信息
      if (fileUrl && mimeType) {
        if (mimeType.startsWith("image/")) {
          userMessage.content.push({
            type: "image_url",
            image_url: { url: fileUrl },
          });
        } else {
          userMessage.content.push({
            type: "file_url",
            file_url: {
              url: fileUrl,
              name: fileUrl.split("/").pop() || "文件",
              size: "",
              type: mimeType,
            },
          });
        }
      }

      addTempMessage(activeSessionId, userMessage);

      // 添加AI响应占位消息
      const aiMessage: Message = {
        id: `temp-ai-${Date.now()}`,
        role: "assistant",
        content: [{ type: "text", text: "" }],
        createAt: Date.now(),
        status: "loading",
      };
      addTempMessage(activeSessionId, aiMessage);

      // 设置流式响应状态
      setIsStreaming(true);

      // 发送消息到服务器
      if (fileUrl) {
        // 如果有文件，使用普通API
        await sendMessageMutation.mutateAsync({
          sessionId: activeSessionId,
          content,
          fileUrl,
          mimeType,
        });

        // 完成后清理临时消息并刷新
        clearTempMessages(activeSessionId);
        await refetchMessages();
        setIsStreaming(false);
      } else {
        // 使用流式API
        const eventSource = new EventSource(
          `/api/ai/stream?sessionId=${activeSessionId}&content=${encodeURIComponent(content)}`
        );
        eventSourceRef.current = eventSource;

        let responseText = "";

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "content") {
            responseText += data.content;
            updateTempMessage(activeSessionId, aiMessage.id, {
              content: [{ type: "text", text: responseText }],
              status: "incomplete",
            });
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          eventSourceRef.current = null;
          setIsStreaming(false);

          // 完成后清理临时消息并刷新
          clearTempMessages(activeSessionId);
          refetchMessages();
        };

        eventSource.addEventListener("done", () => {
          eventSource.close();
          eventSourceRef.current = null;
          setIsStreaming(false);

          // 完成后清理临时消息并刷新
          clearTempMessages(activeSessionId);
          refetchMessages();
          // 同时刷新会话列表，因为最新消息已更新
          refetchSessions();
        });
      }
    } catch (error) {
      console.error("发送消息失败:", error);
      setIsStreaming(false);
      // 更新AI消息状态为错误
      const errorMessage = tempMessages[activeSessionId]?.find(
        (m) => m.role === "assistant" && m.status === "loading"
      );
      if (errorMessage) {
        updateTempMessage(activeSessionId, errorMessage.id, {
          content: [{ type: "text", text: "消息发送失败，请重试。" }],
          status: "error",
        });
      }
    }
  };

  // 取消流式响应
  const cancelStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsStreaming(false);

      // 更新AI消息状态
      if (activeSessionId) {
        const loadingMessage = tempMessages[activeSessionId]?.find(
          (m) =>
            m.role === "assistant" &&
            (m.status === "loading" || m.status === "incomplete")
        );
        if (loadingMessage) {
          updateTempMessage(activeSessionId, loadingMessage.id, {
            status: "complete",
            content: [
              {
                type: "text",
                text: loadingMessage.content[0]?.text + " [已中断]",
              },
            ],
          });
        }
      }
    }
  };

  // 删除会话
  const deleteSession = async (sessionId: number) => {
    try {
      await deleteSessionMutation.mutateAsync(sessionId);
      // 如果删除的是当前活动会话，清除活动会话
      if (sessionId === activeSessionId) {
        setActiveSession(null);
      }
    } catch (error) {
      console.error("删除会话失败:", error);
    }
  };

  // 删除消息
  const deleteMessage = async (messageId: number) => {
    try {
      await deleteMessageMutation.mutateAsync(messageId);
    } catch (error) {
      console.error("删除消息失败:", error);
    }
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return {
    // 状态
    activeSessionId,
    isStreaming,
    isLoadingSessions,
    isLoadingMessages,
    fileUploading,
    siderCollapsed,

    // 数据
    sessions: sessionsData?.list || [],
    pagination: sessionsData?.pagination,
    messages: currentMessages,

    // 操作
    setActiveSession,
    sendMessage,
    cancelStream,
    deleteSession,
    deleteMessage,
    setFileUploading,
    toggleSider,

    // 刷新
    refetchSessions,
    refetchMessages,
  };
};
