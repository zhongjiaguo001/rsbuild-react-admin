import { Modal, Select, Toast } from "@douyinfe/semi-ui";
import { useQuery } from "@tanstack/react-query";
import { roleApi } from "@/api/system/role";
import { useState } from "react";

interface AssignRoleModalProps {
  visible: boolean;
  userId?: number;
  onCancel: () => void;
  onOk: (roleIds: number[]) => void;
}

export function AssignRoleModal(props: AssignRoleModalProps) {
  const { visible, userId, onCancel, onOk } = props;
  const [value, setValue] = useState<number[]>([]);
  // 获取角色列表
  const { data: roleList } = useQuery({
    queryKey: ["roleList"],
    queryFn: () => roleApi.getList({}).then((res) => res.data.list),
  });

  return (
    <Modal
      title="分配角色"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        if (!userId) {
          Toast.error("没有传递用户ID");
          return;
        }

        if (value.length === 0) {
          Toast.error("请选择要分配的角色");
          return;
        }

        onOk(value);
      }}
      centered
    >
      <Select
        value={value}
        onChange={(value) => setValue(value as number[])}
        filter
        multiple
        className="w-full"
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        optionList={
          roleList?.map((item) => ({
            label: item.name,
            value: item.id,
          })) || []
        }
        placeholder="请选择要分配的角色"
      />
    </Modal>
  );
}
