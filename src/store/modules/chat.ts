// src/store/modules/chat.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Message } from "@/api/chat";

interface ChatState {
  // 当前活动会话ID
  activeSessionId: number | null;
  // 是否正在流式响应中
  isStreaming: boolean;
  // 临时消息存储（用于流式响应或本地状态）
  tempMessages: Record<number, Message[]>;
  // 上传文件相关状态
  fileUploading: boolean;
  // UI状态
  siderCollapsed: boolean;

  // Actions
  setActiveSession: (sessionId: number | null) => void;
  setIsStreaming: (streaming: boolean) => void;
  addTempMessage: (sessionId: number, message: Message) => void;
  updateTempMessage: (
    sessionId: number,
    messageId: string,
    updates: Partial<Message>
  ) => void;
  clearTempMessages: (sessionId: number) => void;
  setFileUploading: (uploading: boolean) => void;
  toggleSider: () => void;
}

export const useChatStore = create<ChatState>(
  persist(
    (set, get) => ({
      // 初始状态
      activeSessionId: null,
      isStreaming: false,
      tempMessages: {},
      fileUploading: false,
      siderCollapsed: false,

      // Actions
      setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

      setIsStreaming: (streaming) => set({ isStreaming: streaming }),

      addTempMessage: (sessionId, message) =>
        set((state) => {
          const currentMessages = state.tempMessages[sessionId] || [];
          return {
            tempMessages: {
              ...state.tempMessages,
              [sessionId]: [...currentMessages, message],
            },
          };
        }),

      updateTempMessage: (sessionId, messageId, updates) =>
        set((state) => {
          const currentMessages = state.tempMessages[sessionId] || [];
          const updatedMessages = currentMessages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          );

          return {
            tempMessages: {
              ...state.tempMessages,
              [sessionId]: updatedMessages,
            },
          };
        }),

      clearTempMessages: (sessionId) =>
        set((state) => {
          const { [sessionId]: _, ...rest } = state.tempMessages;
          return { tempMessages: rest };
        }),

      setFileUploading: (uploading) => set({ fileUploading: uploading }),

      toggleSider: () =>
        set((state) => ({ siderCollapsed: !state.siderCollapsed })),
    }),
    {
      name: "chat-store", // localStorage中的键名
      partialize: (state) => ({
        // 只持久化部分状态
        activeSessionId: state.activeSessionId,
        siderCollapsed: state.siderCollapsed,
      }),
    }
  )
);
