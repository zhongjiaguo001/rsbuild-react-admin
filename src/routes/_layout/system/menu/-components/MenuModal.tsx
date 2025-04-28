import { useRef, useEffect } from "react";
import { Modal, Form, Select, Radio } from "@douyinfe/semi-ui";
import type { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { MenuInfo, MenuForm } from "@/api/system/menu";
import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/api/system/menu";

interface MenuModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: MenuForm) => void;
  editData?: MenuInfo;
}

export function MenuModal({
  visible,
  onCancel,
  onOk,
  editData,
}: MenuModalProps) {
  const formRef = useRef<FormApi>();

  // 获取菜单树形结构，用于选择父级菜单
  const { data: menuTree } = useQuery({
    queryKey: ["menuTree"],
    queryFn: () => menuApi.getTree().then((res) => res.data),
    enabled: visible, // 只有在弹窗显示时才请求
  });

  // 将菜单树转换为扁平的选项列表，用于Select组件
  const getMenuOptions = (menus: MenuInfo[] = [], parentName = "") => {
    let options: { label: string; value: number }[] = [];

    menus.forEach((menu) => {
      const label = parentName ? `${parentName} / ${menu.name}` : menu.name;
      options.push({ label, value: menu.id });

      if (menu.children && menu.children.length > 0) {
        options = [...options, ...getMenuOptions(menu.children, label)];
      }
    });

    return options;
  };

  const menuOptions = getMenuOptions(menuTree || []);

  // 添加一个顶级选项
  const parentOptions = [{ label: "顶级菜单", value: 0 }, ...menuOptions];

  const onSubmit = async () => {
    const values = await formRef!.current!.validate();
    // 如果parentId为0，则设置为null
    if (values.parentId === 0) {
      values.parentId = null;
    }
    onOk(values);
  };

  // 当编辑数据变化时，重置表单
  useEffect(() => {
    if (visible && formRef.current) {
      formRef.current.reset();
      if (editData) {
        formRef.current.setValues({
          ...editData,
          // 如果parentId为null，则设置为0
          parentId: editData.parentId === null ? 0 : editData.parentId,
        });
      } else {
        // 新增时的默认值
        formRef.current.setValues({
          parentId: 0,
          type: 0,
          orderNo: 0,
          keepAlive: 0,
          show: 1,
          status: 1,
          isExt: 0,
          extOpenMode: 1,
        });
      }
    }
  }, [visible, editData]);

  return (
    <Modal
      title={editData ? "编辑菜单" : "添加菜单"}
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      width={640}
      centered
    >
      <Form
        className="grid grid-cols-2 gap-4"
        getFormApi={(formApi) => (formRef!.current = formApi)}
      >
        <Form.Select
          className="w-full"
          field="parentId"
          label="上级菜单"
          placeholder="请选择上级菜单"
          optionList={parentOptions}
        />

        <Form.Select
          className="w-full"
          field="type"
          label="菜单类型"
          placeholder="请选择菜单类型"
          rules={[{ required: true, message: "请选择菜单类型" }]}
          optionList={[
            { label: "目录", value: 0 },
            { label: "菜单", value: 1 },
            { label: "按钮", value: 2 },
          ]}
        />

        <Form.Input
          field="name"
          label="菜单名称"
          placeholder="请输入菜单名称"
          rules={[{ required: true, message: "请输入菜单名称" }]}
        />

        <Form.Input
          field="icon"
          label="菜单图标"
          placeholder="请输入菜单图标"
        />

        <Form.Input
          field="path"
          label="路由路径"
          placeholder="请输入路由路径"
        />

        <Form.Input
          field="component"
          label="组件路径"
          placeholder="请输入组件路径"
        />

        <Form.Input
          field="permission"
          label="权限标识"
          placeholder="请输入权限标识"
        />

        <Form.InputNumber
          className="w-full"
          field="orderNo"
          label="显示排序"
          placeholder="请输入显示排序"
          min={0}
        />

        <Form.RadioGroup field="keepAlive" label="是否缓存">
          <Radio value={0}>缓存</Radio>
          <Radio value={1}>不缓存</Radio>
        </Form.RadioGroup>

        <Form.RadioGroup field="show" label="是否显示">
          <Radio value={1}>显示</Radio>
          <Radio value={0}>隐藏</Radio>
        </Form.RadioGroup>

        <Form.RadioGroup field="status" label="菜单状态">
          <Radio value={1}>正常</Radio>
          <Radio value={0}>停用</Radio>
        </Form.RadioGroup>

        <Form.RadioGroup field="isExt" label="是否外链">
          <Radio value={0}>否</Radio>
          <Radio value={1}>是</Radio>
        </Form.RadioGroup>

        <Form.RadioGroup
          field="extOpenMode"
          label="外链打开方式"
          disabled={formRef?.current?.getValues().isExt !== 1}
        >
          <Radio value={1}>新窗口</Radio>
          <Radio value={2}>内嵌</Radio>
        </Form.RadioGroup>

        <Form.Input
          field="activeMenu"
          label="高亮菜单"
          placeholder="请输入高亮菜单"
        />
      </Form>
    </Modal>
  );
}
