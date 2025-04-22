# AI聊天数据管理方案

本方案采用React Query和Zustand结合的方式实现AI聊天数据的管理，充分发挥两者的优势：

- **React Query**：负责处理服务器状态，包括会话列表、消息获取和缓存
- **Zustand**：负责管理客户端状态，包括当前活动会话、UI状态等

## 文件结构

```
├── hooks/
│   └── use-chat.ts           # React Query相关hooks，处理服务器状态
├── store/
│   └── modules/
│       └── chat.ts           # Zustand store，处理客户端状态
└── pages/
    └── chat/
        └── hooks/
            └── use-chat-combined.ts  # 结合React Query和Zustand的统一接口
```

## 使用方法

### 在组件中使用

```tsx
import { useChatCombined } from "./hooks/use-chat-combined";

const ChatPage = () => {
  const {
    // 状态
    activeSessionId,
    isStreaming,
    isLoadingSessions,
    isLoadingMessages,
    fileUploading,
    siderCollapsed,

    // 数据
    sessions,
    pagination,
    messages,

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
  } = useChatCombined();

  // 使用这些状态和方法实现UI...
};
```

## 功能特点

1. **数据缓存与同步**：React Query自动处理数据缓存，减少不必要的网络请求
2. **状态管理**：Zustand管理UI状态和临时状态，如流式响应中的消息
3. **流式响应处理**：支持流式AI响应，提供更好的用户体验
4. **文件上传支持**：支持图片和文件的上传和显示
5. **状态持久化**：关键UI状态会被持久化到localStorage

## 数据流

1. 用户操作触发状态变更（如选择会话、发送消息）
2. 客户端状态通过Zustand立即更新
3. 服务器交互通过React Query进行，包括数据获取和变更
4. 变更成功后，React Query自动使相关查询缓存失效并重新获取
5. 组件通过useChatCombined获取最新状态并渲染UI

## 扩展建议

1. 添加消息搜索功能
2. 实现会话分组或标签
3. 添加消息导出功能
4. 实现更多AI模型的支持
