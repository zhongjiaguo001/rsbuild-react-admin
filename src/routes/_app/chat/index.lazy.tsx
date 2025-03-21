import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input, Avatar, Button, Empty, Typography } from "@douyinfe/semi-ui";
import { IconSend, IconEmoji, IconImage, IconPlus } from "@douyinfe/semi-icons";
import { ContactList } from "@/components/ContactList";

export const Route = createLazyFileRoute("/_app/chat/")({
  component: RouteComponent,
});

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  isMe: boolean;
}

function RouteComponent() {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // 模拟选择联系人
  const handleSelectContact = (contact: any) => {
    setSelectedContact(contact);
    // 模拟加载消息
    const mockMessages: Message[] = [
      {
        id: "1",
        content: "现在的聊天页可以在任何单个聊天中使用吗？",
        senderId: "2",
        timestamp: "昨天 23:20",
        isMe: false,
      },
      {
        id: "2",
        content: "上下文没设置",
        senderId: "1",
        timestamp: "昨天 23:20",
        isMe: true,
      },
      {
        id: "3",
        content: "所以达不能清空",
        senderId: "1",
        timestamp: "昨天 23:20",
        isMe: true,
      },
    ];
    setMessages(mockMessages);
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      senderId: "1", // 假设当前用户ID为1
      timestamp: new Date().toLocaleTimeString(),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  // 处理按键事件，按Enter发送消息
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* 联系人列表 */}
      <ContactList onSelectContact={handleSelectContact} />

      {/* 聊天区域 */}
      <div className="flex-1 flex flex-col h-full">
        {selectedContact ? (
          <>
            {/* 聊天头部 */}
            <div className="p-4 shadow semi-bg-background flex items-center">
              <div className="flex-1">
                <Typography.Title heading={5} className="m-0">
                  {selectedContact.name}
                </Typography.Title>
              </div>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.isMe ? "justify-end" : "justify-start"}`}
                >
                  {!message.isMe && (
                    <Avatar size="small" className="mr-2">
                      {selectedContact.name.substring(0, 2)}
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.isMe
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    <div>{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${message.isMe ? "text-blue-100" : "text-gray-500"}`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                  {message.isMe && (
                    <Avatar size="small" className="ml-2">
                      ME
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center mb-2">
                <Button type="tertiary" icon={<IconEmoji />} className="mr-1" />
                <Button type="tertiary" icon={<IconImage />} className="mr-1" />
                <Button type="tertiary" icon={<IconPlus />} />
              </div>
              <div className="flex">
                <Input
                  className="flex-1 mr-2"
                  placeholder="输入消息..."
                  value={messageInput}
                  onChange={setMessageInput}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  theme="solid"
                  type="primary"
                  icon={<IconSend />}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !selectedContact}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Empty title="选择一个联系人开始聊天" />
          </div>
        )}
      </div>
    </div>
  );
}
