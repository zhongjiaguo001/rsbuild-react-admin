// src/pages/chat/components/SessionList.tsx
import React from "react";
import {
  Card,
  List,
  Typography,
  Button,
  Popconfirm,
  Spin,
} from "@douyinfe/semi-ui";
import { IconDelete } from "@douyinfe/semi-icons";
import type { SessionList } from "@/api/chat";

interface SessionListProps {
  sessions: SessionList[];
  activeSessionId: number | null;
  onSelectSession: (sessionId: number) => void;
  onDeleteSession: (sessionId: number) => void;
  loading?: boolean;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return null;
  }

  return (
    <>
      {sessions.map((session) => (
        <div
          key={session.id}
          onClick={() => onSelectSession(session.id)}
          className={`flex shadow border border-[var(--semi-color-border)] cursor-pointer rounded-[8px] hover:bg-[var(--semi-color-fill-1)] p-2 my-4 justify-center items-center ${session.id === activeSessionId ? "!bg-[var(--semi-color-primary)] !text-white" : ""}`}
        >
          <div>
            <div className="w-full font-bold overflow-hidden text-nowrap text-ellipsis">
              {session.title}
            </div>
            {session.lastMessage && (
              <div className="w-[200px] text-nowrap overflow-hidden text-ellipsis">
                {session.lastMessage}
              </div>
            )}
          </div>
          //{" "}
          <Popconfirm
            title="确定要删除这个会话吗？"
            content="删除后将无法恢复"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDeleteSession(session.id);
            }}
            okText="删除"
            cancelText="取消"
          >
            <Button
              type="danger"
              theme="borderless"
              size="small"
              icon={<IconDelete />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
      ))}
    </>
  );
};

export default SessionList;
