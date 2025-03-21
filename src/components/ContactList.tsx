import React, { useState } from "react";
import { Input, Button, Avatar, Badge } from "@douyinfe/semi-ui";
import { Search, Plus } from "@icon-park/react";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
}

interface ContactListProps {
  onSelectContact?: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  onSelectContact,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );

  // 模拟联系人数据
  const contacts: Contact[] = [
    {
      id: "1",
      name: "JiwuChat 商讨群组",
      avatar: "",
      lastMessage: "管理员撤回了一条消息",
      time: "06:17",
      unread: 0,
      isGroup: true,
    },
    {
      id: "2",
      name: "BJJ",
      avatar: "",
      lastMessage: "👍",
      time: "03:30",
      unread: 0,
    },
    {
      id: "3",
      name: "你们哪 - 官方群组",
      avatar: "",
      lastMessage: "k-k-k-k...你懂了吗？",
      time: "00:45",
      unread: 0,
      isGroup: true,
    },
    {
      id: "4",
      name: "Kiwi2333",
      avatar: "",
      lastMessage: "222",
      time: "昨天 21:12",
      unread: 0,
    },
    {
      id: "5",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "6",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "7",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "8",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "9",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "10",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "11",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "12",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "13",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "14",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
    {
      id: "15",
      name: "JasonTeng",
      avatar: "",
      lastMessage: "我们已经设计好了！一起加油实现！",
      time: "2023-01-24",
      unread: 0,
    },
  ];

  return (
    <div className="w-72 h-full border-r semi-border-color flex flex-col">
      {/* 搜索框 */}
      <div className="relative z-10 semi-bg-background shadow p-3 flex items-center gap-2">
        <Input
          prefix={<Search className="ml-2" />}
          placeholder="搜索"
          value={searchText}
          onChange={setSearchText}
          className="rounded-full bg-gray-100"
        />
        <Button icon={<Plus />} />
      </div>

      {/* 联系人列表 */}
      <div className="flex-1 pl-2 overflow-y-auto semi-light-scrollbar">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`my-2 p-3 border rounded semi-border-color semi-bg-background flex items-center cursor-pointer ${selectedContactId === contact.id ? "bg-blue-50 border-blue-300" : ""}`}
            onClick={() => {
              setSelectedContactId(contact.id);
              onSelectContact && onSelectContact(contact);
            }}
          >
            <Avatar shape="square" color="blue">
              {contact.name.substring(0, 2)}
            </Avatar>
            {contact.unread > 0 && (
              <Badge count={contact.unread} position="rightTop" />
            )}

            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="font-medium truncate">{contact.name}</span>
                <span className="text-xs text-gray-500">{contact.time}</span>
              </div>
              <div className="text-sm text-gray-500 truncate">
                {contact.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
