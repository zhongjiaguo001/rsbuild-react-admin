import React, { useState } from 'react';
import { Input, Avatar, Badge } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
}

const ContactList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  
  // 模拟联系人数据
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'JiwuChat 商讨群组',
      avatar: '',
      lastMessage: '管理员撤回了一条消息',
      time: '06:17',
      unread: 0,
      isGroup: true
    },
    {
      id: '2',
      name: 'BJJ',
      avatar: '',
      lastMessage: '👍',
      time: '03:30',
      unread: 0
    },
    {
      id: '3',
      name: '你们哪 - 官方群组',
      avatar: '',
      lastMessage: 'k-k-k-k...你懂了吗？',
      time: '00:45',
      unread: 0,
      isGroup: true
    },
    {
      id: '4',
      name: 'Kiwi2333',
      avatar: '',
      lastMessage: '222',
      time: '昨天 21:12',
      unread: 0
    },
    {
      id: '5',
      name: 'JasonTeng',
      avatar: '',
      lastMessage: '我们已经设计好了！一起加油实现！',
      time: '2023-01-24',
      unread: 0
    }
  ];

  return (
    <div className="w-72 h-full border-r border-gray-200 flex flex-col">
      {/* 搜索框 */}
      <div className="p-3">
        <Input
          prefix={<IconSearch />}
          placeholder="搜索"
          value={searchText}
          onChange={setSearchText}
          className="rounded-full bg-gray-100"
        />
      </div>
      
      {/* 联系人列表 */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map(contact => (
          <div 
            key={contact.id} 
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
          >
            <div className="relative">
              {contact.isGroup ? (
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  {contact.name.substring(0, 2)}
                </div>
              ) : (
                <Avatar size="medium" color="blue">
                  {contact.name.substring(0, 2)}
                </Avatar>
              )}
              {contact.unread > 0 && (
                <Badge count={contact.unread} position="rightTop" />
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex justify-between">
                <span className="font-medium truncate">{contact.name}</span>
                <span className="text-xs text-gray-500">{contact.time}</span>
              </div>
              <div className="text-sm text-gray-500 truncate">{contact.lastMessage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;