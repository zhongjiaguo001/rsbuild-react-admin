import React, { useState, useCallback, useEffect } from "react";
import { Chat, Toast } from "@douyinfe/semi-ui";
import { chatApi, type ChatMessage } from "@/api/chat";

// 默认系统消息
const defaultMessage: ChatMessage[] = [
  {
    role: "system",
    id: "system-welcome",
    createAt: Date.now(),
    content: "您好，我是AI助手，有什么可以帮助您的？",
  },
];

// 角色配置
const roleInfo = {
  user: {
    name: "用户",
    avatar:
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/docs-icon.png",
  },
  assistant: {
    name: "AI助手",
    avatar:
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png",
  },
  system: {
    name: "系统",
    avatar:
      "https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/other/logo.png",
  },
};

// 样式配置
const commonOuterStyle = {
  margin: "auto",
  height: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column" as const,
};

let id = 0;
function getId() {
  return `id-${id++}`;
}

// 上传配置
const uploadProps = { action: "/api/chat/upload" };
const uploadTipProps = { content: "支持上传图片、文档等文件" };

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessage);
  const [loading, setLoading] = useState(false);

  // 加载历史消息
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const response = await chatApi.getChatHistory({ limit: 20 });
        if (response.data.length > 0) {
          setMessages([...defaultMessage, ...response.data]);
        }
      } catch (error) {
        console.error("加载历史消息失败:", error);
        Toast.error("加载历史消息失败");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // 发送消息
  const onMessageSend = useCallback(
    async (content: string, attachment?: string[]) => {
      try {
        // 创建用户消息
        const userMessage: ChatMessage = {
          role: "user",
          id: getId(),
          createAt: Date.now(),
          content,
        };

        // 更新消息列表，添加用户消息
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // 创建临时的AI回复消息（状态为pending）
        const tempAssistantMessage: ChatMessage = {
          role: "assistant",
          id: getId(),
          createAt: Date.now(),
          content: "",
          status: "pending",
        };

        // 更新消息列表，添加临时AI回复
        setMessages((prevMessages) => [...prevMessages, tempAssistantMessage]);

        // 发送消息到API
        const response = await chatApi.sendMessage({
          content,
          attachment,
        });

        // 更新AI回复
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;

          // 确保最后一条消息是AI回复
          if (
            lastIndex >= 0 &&
            updatedMessages[lastIndex].role === "assistant"
          ) {
            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              content: response.data.content,
              status: "complete",
            };
          }

          return updatedMessages;
        });
      } catch (error) {
        console.error("发送消息失败:", error);
        Toast.error("发送消息失败，请稍后再试");

        // 更新AI回复为错误状态
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;

          // 确保最后一条消息是AI回复
          if (
            lastIndex >= 0 &&
            updatedMessages[lastIndex].role === "assistant"
          ) {
            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              content: "抱歉，我暂时无法回答您的问题，请稍后再试。",
              status: "error",
            };
          }

          return updatedMessages;
        });
      }
    },
    []
  );

  // 消息列表变化回调
  const onChatsChange = useCallback((chats: ChatMessage[]) => {
    setMessages(chats);
  }, []);

  // 重置消息回调（用于重新生成回复）
  const onMessageReset = useCallback(async () => {
    try {
      // 获取最后一条用户消息
      const lastUserMessageIndex = [...messages]
        .reverse()
        .findIndex((msg) => msg.role === "user");
      if (lastUserMessageIndex === -1) return;

      const lastUserMessage =
        messages[messages.length - 1 - lastUserMessageIndex];

      // 更新最后一条AI回复为pending状态
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;

        if (lastIndex >= 0 && updatedMessages[lastIndex].role === "assistant") {
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            content: "",
            status: "pending",
          };
        }

        return updatedMessages;
      });

      // 重新发送最后一条用户消息
      const response = await chatApi.sendMessage({
        content: lastUserMessage.content,
      });

      // 更新AI回复
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;

        if (lastIndex >= 0 && updatedMessages[lastIndex].role === "assistant") {
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            content: response.data.content,
            status: "complete",
          };
        }

        return updatedMessages;
      });
    } catch (error) {
      console.error("重新生成回复失败:", error);
      Toast.error("重新生成回复失败，请稍后再试");

      // 更新AI回复为错误状态
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastIndex = updatedMessages.length - 1;

        if (lastIndex >= 0 && updatedMessages[lastIndex].role === "assistant") {
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            content: "抱歉，我暂时无法重新生成回复，请稍后再试。",
            status: "error",
          };
        }

        return updatedMessages;
      });
    }
  }, [messages]);

  return (
    <Chat
      align="leftRight"
      mode="bubble"
      uploadProps={uploadProps}
      style={commonOuterStyle}
      chats={messages}
      roleConfig={roleInfo}
      onChatsChange={onChatsChange}
      onMessageSend={onMessageSend}
      onMessageReset={onMessageReset}
      uploadTipProps={uploadTipProps}
      loading={loading}
    />
  );
}

export default ChatPage;
