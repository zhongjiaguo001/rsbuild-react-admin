import React from "react";
import { Avatar, Badge, Input, Tabs, TabPane } from "@douyinfe/semi-ui";
import { IconSearch } from "@douyinfe/semi-icons";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  time?: string;
  unreadCount?: number;
  online?: boolean;
}

interface ContactListProps {
  contacts: Contact[];
  onSelectContact?: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onSelectContact,
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-3">
        <Input
          prefix={<IconSearch />}
          placeholder="搜索"
          showClear
          className="rounded-lg"
        />
      </div>
      
      <Tabs type="line" className="flex-1">
        <TabPane tab="联系人(在线)" itemKey="online">
          <div className="overflow-y-auto h-full">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="py-2 px-3 flex items-center hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectContact && onSelectContact(contact)}
              >
                <div className="relative">
                  <Avatar
                    src={contact.avatar}
                    size="default"
                    alt={contact.name}
                  >
                    {!contact.avatar && contact.name.slice(0, 1)}
                  </Avatar>
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{contact.name}</span>
                    {contact.time && (
                      <span className="text-xs text-gray-400">{contact.time}</span>
                    )}
                  </div>
                  {contact.lastMessage && (
                    <div className="text-sm text-gray-500 truncate">
                      {contact.lastMessage}
                    </div>
                  )}
                </div>
                {contact.unreadCount && contact.unreadCount > 0 && (
                  <Badge count={contact.unreadCount} />
                )}
              </div>
            ))}
          </div>
        </TabPane>
        <TabPane tab="群聊" itemKey="groups">
          <div className="p-4 text-center text-gray-500">暂无群聊</div>
        </TabPane>
      </Tabs>
    </div>
  );
};
