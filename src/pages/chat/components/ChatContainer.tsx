// src/pages/chat/components/ChatContainer.tsx
import React, { useRef } from "react";
import {
  Button,
  Input,
  Typography,
  Space,
  Spin,
  Empty,
  Upload,
} from "@douyinfe/semi-ui";
import {
  IconSend,
  IconPlus,
  IconDelete,
  IconStop,
  IconFile,
} from "@douyinfe/semi-icons";
import { useChatCombined } from "../hooks/use-chat-combined";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../constants";

const { Text, Title } = Typography;

/**
 * 聊天容器组件
 * 使用结合React Query和Zustand的方式管理AI聊天数据
 */
const ChatContainer: React.FC = () => {
  const {
    // 状态
    activeSessionId,
    isStreaming,
    isLoadingMessages,
    fileUploading,

    // 数据
    messages,

    // 操作
    sendMessage,
    cancelStream,
    deleteMessage,
    setFileUploading,
  } = useChatCombined();

  // 输入框引用
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // 文件上传引用
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [fileMimeType, setFileMimeType] = React.useState<string | null>(null);

  // 处理发送消息
  const handleSendMessage = () => {
    if (!inputRef.current || !activeSessionId) return;

    const content = inputRef.current.value.trim();
    if (!content && !fileUrl) return;

    sendMessage(content, fileUrl || undefined, fileMimeType || undefined);

    // 清空输入框和文件
    inputRef.current.value = "";
    setFileUrl(null);
    setFileMimeType(null);
  };

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!activeSessionId) return false;

    // 检查文件类型和大小
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      console.error("不支持的文件类型");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      console.error("文件大小超过限制");
      return false;
    }

    try {
      setFileUploading(true);

      // 创建表单数据
      const formData = new FormData();
      formData.append("file", file);

      // 上传文件
      const response = await fetch("/api/ai/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("文件上传失败");
      }

      const data = await response.json();

      // 设置文件URL和MIME类型
      setFileUrl(data.data.filePath);
      setFileMimeType(file.type);

      return false; // 阻止默认上传行为
    } catch (error) {
      console.error("文件上传失败:", error);
      return false;
    } finally {
      setFileUploading(false);
    }
  };

  // 渲染消息
  const renderMessages = () => {
    if (isLoadingMessages) {
      return (
        <div className="flex justify-center items-center h-full">
          <Spin size="large" />
        </div>
      );
    }

    if (!activeSessionId || messages.length === 0) {
      return (
        <div className="flex justify-center items-center h-full">
          <Empty
            image={<IconPlus size="large" />}
            title="没有消息"
            description="开始一个新的对话吧"
          />
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        {messages.map((message) => {
          const isUser = message.role === "user";
          const isLoading = message.status === "loading";
          const isError = message.status === "error";

          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${isUser ? "bg-blue-500 text-white" : "bg-gray-100"} ${isError ? "bg-red-100" : ""}`}
              >
                {/* 文本内容 */}
                {message.content.map((content, index) => {
                  if (content.type === "text") {
                    return (
                      <Text key={`text-${index}`}>
                        {content.text || ""}
                        {isLoading && <Spin size="small" />}
                      </Text>
                    );
                  }

                  if (content.type === "image_url") {
                    return (
                      <img
                        key={`img-${index}`}
                        src={content.image_url?.url}
                        alt="图片"
                        className="max-w-full rounded mt-2"
                      />
                    );
                  }

                  if (content.type === "file_url") {
                    return (
                      <a
                        key={`file-${index}`}
                        href={content.file_url?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center mt-2 text-blue-500"
                      >
                        <IconFile className="mr-1" />
                        {content.file_url?.name}
                      </a>
                    );
                  }

                  return null;
                })}

                {/* 消息操作按钮 */}
                {!isLoading && !isUser && (
                  <div className="mt-2 text-right">
                    <Button
                      type="tertiary"
                      size="small"
                      icon={<IconDelete />}
                      onClick={() => deleteMessage(Number(message.id))}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto">{renderMessages()}</div>

      {/* 输入区域 */}
      <div className="border-t p-4">
        {fileUrl && (
          <div className="mb-2 p-2 bg-gray-100 rounded flex justify-between items-center">
            <Text>
              {fileMimeType?.startsWith("image/") ? "图片已上传" : "文件已上传"}
            </Text>
            <Button
              type="tertiary"
              icon={<IconDelete />}
              onClick={() => {
                setFileUrl(null);
                setFileMimeType(null);
              }}
            />
          </div>
        )}

        <div className="flex items-end">
          <Upload
            action=""
            accept={ALLOWED_FILE_TYPES.join(",")}
            showUploadList={false}
            beforeUpload={handleFileUpload}
            disabled={!activeSessionId || isStreaming || fileUploading}
          >
            <Button
              type="tertiary"
              icon={<IconPlus />}
              disabled={!activeSessionId || isStreaming || fileUploading}
            />
          </Upload>

          <Input
            ref={inputRef}
            className="flex-1 mx-2"
            placeholder="输入消息..."
            disabled={!activeSessionId || isStreaming}
            onEnterPress={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          {isStreaming ? (
            <Button type="danger" icon={<IconStop />} onClick={cancelStream} />
          ) : (
            <Button
              type="primary"
              icon={<IconSend />}
              disabled={!activeSessionId || fileUploading}
              onClick={handleSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
