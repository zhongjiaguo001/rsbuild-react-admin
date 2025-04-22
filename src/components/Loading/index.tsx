import { Spin } from "@douyinfe/semi-ui";
export function Loading() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
}
