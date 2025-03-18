import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/chat/")({
  component: ChatPage,
});

function ChatPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center  h-full overflow-y-scroll">
      {Array.from({ length: 500 }).map((_, i) => {
        return (
          <div key={i} className=" flex items-center justify-center w-full ">
            联系人 {i}
          </div>
        );
      })}
      <div className="text-gray-400">请选择一个联系人开始聊天</div>
    </div>
  );
}
