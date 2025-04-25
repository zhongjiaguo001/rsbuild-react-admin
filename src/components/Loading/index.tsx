import { Spin } from "@douyinfe/semi-ui";
export function Loading() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px] w-full">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"
            style={{
              animationDelay: `${index * 0.15}s`,
              animationDuration: "0.9s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
