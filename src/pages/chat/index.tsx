// src/pages/chat/index.tsx
import React, { useState, useRef, useEffect } from "react";
import { Layout, Button, Divider, Toast, Chat } from "@douyinfe/semi-ui";
import { IconPlus, IconStop } from "@douyinfe/semi-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi, type Message } from "@/api/chat";
import { ROLE_CONFIG, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "./constants";
import SessionList from "./components/SessionList";
import { useParams, useNavigate } from "@tanstack/react-router";
import { userStore } from "@/store";
const { Sider, Content: LayoutContent } = Layout;

// Helper function to determine MIME type from URL (add this if missing)
const getMimeType = (url: string): string | undefined => {
  const extension = url.split(".").pop()?.toLowerCase();
  if (!extension) return undefined;

  const mimeTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Add more mappings as needed
  };

  return mimeTypes[extension] || undefined;
};

const ChatPage: React.FC = () => {
  // 获取路由参数中的会话ID
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 转换 sessionId 字符串到数字类型，如果存在的话
  const parsedSessionId = sessionId ? Number(sessionId) : null;
  const [activeSession, setActiveSession] = useState<number | null>(
    parsedSessionId
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 消息格式化函数
  const formatMessages = (messages: any[]) => {
    return messages.map((message) => {
      const formattedMessage: Message = {
        id: message.id.toString(),
        role: message.role,
        name: message.role === "user" ? "用户" : "AI 助手",
        content: [],
        parentId: message.parentId || null,
        createAt: new Date(message.createdAt).getTime(),
        status: message.status || "complete",
      };

      // 处理文件/图片
      if (message.fileUrl && message.mimeType) {
        if (message.mimeType.startsWith("image/")) {
          formattedMessage.content.push({
            type: "image_url",
            image_url: { url: message.fileUrl },
          });
        } else {
          formattedMessage.content.push({
            type: "file_url",
            file_url: {
              url: message.fileUrl,
              name:
                message.fileName || message.fileUrl.split("/").pop() || "文件",
              size: message.fileSize || "",
              type: message.mimeType,
            },
          });
        }
      }

      // 添加文本内容
      if (message.content) {
        formattedMessage.content!.push({
          type: "text",
          text: message.content,
        });
      }

      return formattedMessage;
    });
  };

  // 获取会话列表
  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => chatApi.getSessions(),
  });

  // 获取消息列表查询
  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ["messages", activeSession],
    queryFn: async () => {
      if (!activeSession) {
        setChatMessages([]);
        return;
      }
      const response = await chatApi.getSessionMessages(activeSession);
      setChatMessages(formatMessages(response.data));
      return response.data;
    },
    // 禁用窗口聚焦时自动重新获取，避免不必要的请求
    refetchOnWindowFocus: false,
    // 设置数据过期时间为0，确保每次查询都获取最新数据
    staleTime: 0,
    // enabled: !!activeSession,
  });

  // 创建新会话
  const createSessionMutation = useMutation({
    mutationFn: chatApi.createSession,
    onSuccess: (data) => {
      // 获取新创建的会话ID
      const newSessionId = data.data.id;

      // 更新 React Query 缓存
      queryClient.invalidateQueries({ queryKey: ["sessions"] });

      // 设置活动会话
      setActiveSession(newSessionId);

      // 导航到新会话
      navigate(`/chat/${newSessionId}`);

      Toast.success("会话创建成功");
    },
    onError: () => {
      Toast.error("创建会话失败");
    },
  });

  // 删除会话
  const deleteSessionMutation = useMutation({
    mutationFn: chatApi.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      if (activeSession === deleteSessionMutation.variables) {
        setActiveSession(null);
        navigate("/chat"); // 删除当前会话后回到新建会话页面
      }
      Toast.success("会话删除成功");
    },
    onError: () => {
      Toast.error("删除会话失败");
    },
  });

  // 上传文件
  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => chatApi.uploadFile(file),
  });

  // 清理 EventSource，防止内存泄漏
  useEffect(() => {
    return () => {
      cleanupStreamConnection();
    };
  }, []);

  // 监听activeSession变化，强制刷新消息列表
  useEffect(() => {
    if (activeSession) {
      refetchMessages();
    }
  }, [activeSession, refetchMessages]);

  // 清理流式连接的辅助函数
  const cleanupStreamConnection = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsStreaming(false);
  };

  // 中断生成
  const handleStopGeneration = async () => {
    // 如果有活跃会话，尝试向服务器发送取消请求
    if (activeSession) {
      try {
        await fetch(`http://localhost:3000/api/ai/message/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userStore.getState().token}`,
          },
          body: JSON.stringify({ sessionId: activeSession }),
        });
      } catch (error) {
        console.error("取消生成请求失败:", error);
      }
    }

    cleanupStreamConnection();

    // 更新最后一条 AI 消息的状态
    setChatMessages((prev) => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;

      if (lastIndex >= 0 && newMessages[lastIndex].role === "assistant") {
        newMessages[lastIndex] = {
          ...newMessages[lastIndex],
          status: "complete", // 将状态设为完成
        };
      }

      return newMessages;
    });

    Toast.info("已停止生成");
  };

  const handleSelectSession = (sessionId: number) => {
    // 如果当前有正在进行的流，先中断它
    if (isStreaming) {
      cleanupStreamConnection();
    }

    navigate(`/chat/${sessionId}`);
    setActiveSession(sessionId);

    // 强制刷新消息列表，确保获取最新数据
    setTimeout(() => {
      refetchMessages();
    }, 100);
  };

  const handleDeleteSession = (sessionId: number) => {
    deleteSessionMutation.mutate(sessionId);
  };

  // 创建流式连接的函数 - 使用 Fetch API
  const createStreamConnection = async (
    sessionId: number,
    content: string,
    fileUrl: string = "",
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: any) => void
  ) => {
    try {
      // 创建 AbortController 用于取消请求
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      setIsStreaming(true);

      // 构建请求数据
      const requestData = {
        sessionId,
        content,
        fileUrl,
        mimeType: fileUrl ? getMimeType(fileUrl) : undefined,
      };

      console.log("发送请求:", requestData);

      // 发送 POST 请求
      const response = await fetch(
        "http://localhost:3000/api/ai/message/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            Authorization: `Bearer ${userStore.getState().token}`,
          },
          body: JSON.stringify(requestData),
          signal,
          // 重要：必须设置以下选项来支持流式响应
          cache: "no-store",
          credentials: "same-origin",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorText}`
        );
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = ""; // 累积的完整内容

      console.log("开始读取流");

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("流读取完成");
          onComplete();
          break;
        }

        // 解码二进制数据
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        console.log("接收到数据:", chunk);

        // 按行处理 SSE 数据
        let lineEnd;
        while ((lineEnd = buffer.indexOf("\n")) !== -1) {
          const line = buffer.substring(0, lineEnd).trim();
          buffer = buffer.substring(lineEnd + 1);

          console.log("处理行:", line);

          if (line.startsWith("data: ")) {
            const data = line.substring(6);
            console.log("数据内容:", data);

            // 检查结束信号
            if (data === "[DONE]") {
              console.log("收到完成信号");
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              console.log("解析后的数据:", parsed);

              if (parsed.type === "message" && parsed.content) {
                // 追加到完整内容
                fullContent += parsed.content;
                // 传递累积的完整内容而不是单个块
                onChunk(fullContent);
              } else if (parsed.type === "done") {
                console.log("收到完成类型");
                onComplete();
                return;
              } else if (parsed.type === "error") {
                console.error("收到错误类型:", parsed.error);
                onError(new Error(parsed.error || "未知错误"));
                return;
              } else if (parsed.choices && parsed.choices[0]?.delta?.content) {
                // 处理 OpenAI 兼容格式
                const content = parsed.choices[0].delta.content;
                fullContent += content;
                onChunk(fullContent);
              } else if (typeof parsed === "string") {
                // 直接处理纯文本内容
                fullContent += parsed;
                onChunk(fullContent);
              }
            } catch (error) {
              console.warn("无法解析 JSON 数据:", data, error);

              // 尝试作为纯文本处理
              if (data && data !== "[DONE]") {
                fullContent += data;
                onChunk(fullContent);
              }
            }
          } else if (line.startsWith("event: done")) {
            console.log("收到完成事件");
            onComplete();
            return;
          } else if (line.startsWith("event: error")) {
            console.error("收到错误事件");
            const errorData = buffer.substring(0, buffer.indexOf("\n")).trim();
            if (errorData.startsWith("data: ")) {
              try {
                const errorJson = JSON.parse(errorData.substring(6));
                onError(new Error(errorJson.error || "未知错误"));
              } catch (e) {
                onError(new Error("流处理错误"));
              }
            } else {
              onError(new Error("流处理错误"));
            }
            return;
          }
        }
      }

      // 流正常结束
      console.log("流处理完成");
      onComplete();
    } catch (error) {
      console.error("流式连接错误:", error);
      if (error.name !== "AbortError") {
        onError(error);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // 创建用户消息
  const createUserMessage = (
    content: string,
    fileUrl?: string,
    mimeType?: string
  ): Message => {
    const message: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      name: "用户",
      content: [{ type: "text", text: content }],
      createAt: Date.now(),
      status: "complete",
    };

    // 添加文件附件（如果有）
    if (fileUrl && mimeType) {
      if (mimeType.startsWith("image/")) {
        message.content.push({
          type: "image_url",
          image_url: { url: fileUrl },
        });
      } else {
        message.content.push({
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

    return message;
  };

  // 创建助手消息
  const createAssistantMessage = (): Message => {
    return {
      id: `temp-${Date.now() + 1}`,
      role: "assistant",
      name: "AI 助手",
      content: [{ type: "text", text: "" }],
      createAt: Date.now(),
      status: "loading",
    };
  };

  // 更新助手消息内容和状态 - 修复为替换内容而不是追加
  const updateAssistantMessage = (
    content: string | null,
    status: "loading" | "incomplete" | "complete" | "error"
  ) => {
    setChatMessages((prev) => {
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;

      if (lastIndex >= 0 && newMessages[lastIndex].role === "assistant") {
        const updatedMessage = { ...newMessages[lastIndex] };

        // 更新文本内容（如果提供）
        if (content !== null) {
          const updatedContent = [...updatedMessage.content];
          const textContentIndex = updatedContent.findIndex(
            (item) => item.type === "text"
          );

          if (textContentIndex >= 0) {
            // 替换内容而不是追加
            updatedContent[textContentIndex] = {
              ...updatedContent[textContentIndex],
              text: content,
            };
          } else {
            updatedContent.push({ type: "text", text: content });
          }

          updatedMessage.content = updatedContent;
        }

        // 更新状态
        updatedMessage.status = status;

        newMessages[lastIndex] = updatedMessage;
      }

      return newMessages;
    });
  };

  const handleSendMessage = async (content: string, attachment?: any[]) => {
    // 如果正在生成中，先中断当前生成
    if (isStreaming) {
      cleanupStreamConnection();
    }

    // 如果没有活动会话，先创建一个新会话
    let currentSessionId = activeSession;
    if (!currentSessionId) {
      try {
        // 使用消息内容的前20个字符作为会话标题
        const sessionTitle =
          content.length > 20 ? content.substring(0, 20) + "..." : content;

        const result = await createSessionMutation.mutateAsync({
          title: sessionTitle,
        });

        // 直接使用返回的会话ID，而不是依赖状态更新
        currentSessionId = result.data.id;
      } catch (error) {
        Toast.error("创建会话失败");
        return;
      }
    }

    // 确保此时有会话ID
    if (!currentSessionId) {
      Toast.error("无法确定当前会话");
      return;
    }

    let fileUrl = "";
    let mimeType = "";

    // 处理附件
    if (attachment && attachment.length > 0) {
      try {
        const file = attachment[0].originFile;
        const result = await uploadFileMutation.mutateAsync(file);
        fileUrl = result.data.url;
        mimeType = result.data.mimeType;
      } catch (error) {
        console.error("文件上传失败:", error);
        Toast.error("文件上传失败");
        return;
      }
    }

    try {
      // 创建用户消息对象
      const tempUserMessage = createUserMessage(content, fileUrl, mimeType);

      // 创建 AI 响应消息占位符
      const tempAiMessage = createAssistantMessage();

      // 添加消息到UI
      setChatMessages((prev) => [...prev, tempUserMessage, tempAiMessage]);

      // 创建流式连接 - 现在使用 POST 请求
      createStreamConnection(
        currentSessionId,
        content,
        fileUrl,
        // 处理流式内容更新 - 传入的是累积的完整内容
        (fullContent) => {
          updateAssistantMessage(fullContent, "incomplete");
        },
        // 处理完成事件
        () => {
          updateAssistantMessage(null, "complete");
          refetchMessages();
          refetchSessions();
        },
        // 处理错误事件
        (error) => {
          console.error("接收消息时发生错误:", error);
          Toast.error("接收消息时发生错误");
          updateAssistantMessage("抱歉，发生了错误，请重试。", "error");
        }
      );
    } catch (error) {
      console.error("发送消息失败:", error);
      Toast.error("发送消息失败");
      setIsStreaming(false);
    }
  };

  const handleReset = async () => {
    if (!activeSession) return;

    // 如果正在生成中，先中断当前生成
    if (isStreaming) {
      cleanupStreamConnection();
    }

    // 确保此处使用 activeSession
    const currentSessionId = activeSession;

    // 找到最后一条用户消息
    const lastUserMessageIndex = [...chatMessages]
      .reverse()
      .findIndex((msg) => msg.role === "user");

    if (lastUserMessageIndex === -1) return;

    const lastUserMessage =
      chatMessages[chatMessages.length - 1 - lastUserMessageIndex];

    // 提取用户消息中的文本内容
    const userTextContent =
      lastUserMessage.content.find((item) => item.type === "text")?.text || "";

    // 提取用户消息中的文件 URL (如果有)
    const userFileUrl = lastUserMessage.content.find(
      (item) => item.type === "file_url" || item.type === "image_url"
    );

    const fileUrl =
      userFileUrl?.type === "file_url"
        ? userFileUrl.file_url?.url
        : userFileUrl?.type === "image_url"
          ? userFileUrl.image_url?.url
          : "";

    // 移除 AI 回复并添加新的加载状态消息
    setChatMessages((prev) => {
      const newMessages = [...prev];
      // 移除最后一条 AI 消息
      if (
        newMessages.length > 0 &&
        newMessages[newMessages.length - 1].role === "assistant"
      ) {
        newMessages.pop();
      }

      // 添加新的加载状态消息
      newMessages.push({
        id: `temp-${Date.now()}`,
        role: "assistant",
        name: "AI 助手",
        content: [{ type: "text", text: "" }],
        createAt: Date.now(),
        status: "loading",
      });

      return newMessages;
    });

    // 创建流式连接进行重新生成 - 使用与 handleSendMessage 一致的模式
    createStreamConnection(
      currentSessionId,
      userTextContent,
      fileUrl,
      // 内容更新处理 - 传入累积的完整内容
      (fullContent) => {
        updateAssistantMessage(fullContent, "incomplete");
      },
      // 完成处理
      () => {
        updateAssistantMessage(null, "complete");
        refetchMessages();
      },
      // 错误处理
      (error) => {
        console.error("重新生成回复时发生错误:", error);
        Toast.error("重新生成回复时发生错误");
        updateAssistantMessage("抱歉，无法重新生成回复，请稍后再试。", "error");
      }
    );
  };

  // 创建新的聊天
  const handleCreateChat = () => {
    setActiveSession(null);
    navigate("/chat");
  };

  // 配置上传属性
  const uploadProps = {
    action: "", // 手动处理上传
    maxSize: MAX_FILE_SIZE,
    accept: ALLOWED_FILE_TYPES.join(","),
    showUploadList: false,
    beforeUpload: () => {
      // 返回 false 以阻止默认上传行为
      return false;
    },
  };

  return (
    <Layout className="h-full">
      <Sider className="p-4 w-[300px] border-r border-[var(--semi-color-border)]">
        <div className="flex flex-col">
          <Button
            block
            size="large"
            theme="solid"
            type="primary"
            icon={<IconPlus />}
            onClick={handleCreateChat}
          >
            新建会话
          </Button>
          <Divider className="pb-4" />
        </div>

        <SessionList
          sessions={sessionsData?.data?.list || []}
          activeSessionId={activeSession}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          loading={isLoadingSessions}
        />
      </Sider>

      <Layout>
        {isStreaming && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              type="danger"
              theme="solid"
              icon={<IconStop />}
              onClick={handleStopGeneration}
            >
              停止生成
            </Button>
          </div>
        )}
        <LayoutContent>
          <Chat
            chats={chatMessages}
            onMessageSend={handleSendMessage}
            roleConfig={ROLE_CONFIG}
            uploadProps={uploadProps}
            uploadTipProps={{ content: "支持上传图片、PDF等文件" }}
            placeholder="给 AI 发送消息"
            locale={{ send: "发送", upload: "上传", reset: "重试" }}
            inputStyle={{ maxHeight: "120px" }}
            style={{ height: "calc(100vh - 50px)", maxWidth: "100%" }}
            disabled={isStreaming}
            onMessageReset={handleReset}
          />
        </LayoutContent>
      </Layout>
    </Layout>
  );
};

export default ChatPage;
