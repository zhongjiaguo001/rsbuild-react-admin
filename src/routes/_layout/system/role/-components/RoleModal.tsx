import { Form, Modal, Tree, Button } from "@douyinfe/semi-ui";
import { type RoleInfo, type RoleForm } from "@/api/system/role";
import { useRef, useEffect, useState } from "react";
import type { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { useQuery } from "@tanstack/react-query";
import { menuApi } from "@/api/system/menu";

interface RoleModalProps {
  visible: boolean;
  editData?: RoleInfo;
  onCancel: () => void;
  onOk: (
    values: RoleForm & { orderNo: number; status: number; menuIds: number[] }
  ) => void;
}

export function RoleModal({
  visible,
  editData,
  onCancel,
  onOk,
}: RoleModalProps) {
  const { Radio } = Form;
  const formRef = useRef<FormApi>();
  const [expandAll, setExpandAll] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [parentChildRelation, setParentChildRelation] = useState(true);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

  // 获取菜单树形结构
  const { data: menuTree } = useQuery({
    queryKey: ["menuTree"],
    queryFn: () => menuApi.getTree().then((res) => res.data),
    enabled: visible, // 只有在弹窗显示时才请求
  });

  // 获取角色已分配的菜单ID列表
  const { data: roleMenuIds } = useQuery({
    queryKey: ["roleMenus", editData?.id],
    queryFn: () => menuApi.getRoleMenus(editData!.id).then((res) => res.data),
    enabled: visible && !!editData?.id, // 只有在弹窗显示且有roleId时才请求
  });

  // 将菜单树转换为Tree组件需要的格式
  const convertMenuTree = (menus = []) => {
    return menus.map((menu) => ({
      label: menu.name,
      value: menu.id,
      key: menu.id,
      children:
        menu.children && menu.children.length > 0
          ? convertMenuTree(menu.children)
          : undefined,
    }));
  };

  // 递归获取所有菜单ID
  const getAllMenuIds = (menus) => {
    let ids: number[] = [];
    menus.forEach((menu) => {
      ids.push(menu.id);
      if (menu.children && menu.children.length > 0) {
        ids = [...ids, ...getAllMenuIds(menu.children)];
      }
    });
    return ids;
  };

  const treeData = convertMenuTree(menuTree || []);

  // 处理全选/全不选
  const handleCheckAll = (checked: boolean) => {
    setCheckAll(checked);
    if (checked && menuTree) {
      const allMenuIds = getAllMenuIds(menuTree);
      setSelectedMenuIds(allMenuIds);
      formRef.current?.setFieldValue("menuIds", allMenuIds);
    } else {
      setSelectedMenuIds([]);
      formRef.current?.setFieldValue("menuIds", []);
    }
  };

  // 监听菜单选择变化
  const handleMenuChange = (value) => {
    setSelectedMenuIds(value);
    // 更新全选状态
    if (menuTree && value.length === getAllMenuIds(menuTree).length) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  };

  const onSubmit = async () => {
    const values = await formRef!.current!.validate();
    onOk(values);
  };

  // 当角色ID变化时，重置表单中的菜单权限
  useEffect(() => {
    if (visible && formRef.current && roleMenuIds) {
      formRef.current.setFieldValue("menuIds", roleMenuIds);
      setSelectedMenuIds(roleMenuIds);
      // 更新全选状态
      if (menuTree && roleMenuIds.length === getAllMenuIds(menuTree).length) {
        setCheckAll(true);
      } else {
        setCheckAll(false);
      }
    }
  }, [visible, editData?.id, roleMenuIds, menuTree]);

  // 重置状态
  useEffect(() => {
    if (!visible) {
      setExpandAll(true);
      setCheckAll(false);
      setParentChildRelation(true);
      setSelectedMenuIds([]);
    }
  }, [visible]);

  return (
    <Modal
      title={editData ? "编辑角色" : "新增角色"}
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      width={640}
      centered
    >
      <Form
        className="grid grid-cols-1"
        getFormApi={(formApi) => (formRef!.current = formApi)}
        initValues={{
          ...editData,
          status: editData?.status ?? 1,
          orderNo: editData?.orderNo ?? 1,
        }}
      >
        <Form.Input
          field="name"
          label="角色名称"
          placeholder="请输入角色名称"
          rules={[{ required: true, message: "请输入角色名称" }]}
        />
        <Form.Input
          field="value"
          label="权限字符"
          placeholder="请输入权限字符"
          rules={[{ required: true, message: "请输入权限字符" }]}
        />
        <Form.InputNumber
          field="orderNo"
          className="w-full"
          label="角色顺序"
          placeholder="请输入角色顺序"
          defaultValue={1}
          min={1}
          rules={[{ required: true, message: "请输入角色顺序" }]}
        />
        <Form.RadioGroup field="status" label="状态" defaultValue={1}>
          <Radio value={1}>正常</Radio>
          <Radio value={0}>停用</Radio>
        </Form.RadioGroup>
        <div className="col-span-full">
          <Form.Slot label="菜单权限" field="menuIds">
            <div className="mb-2 flex items-center gap-2">
              <Button
                size="small"
                theme="light"
                type="tertiary"
                onClick={() => setExpandAll(!expandAll)}
              >
                {expandAll ? "折叠" : "展开"}
              </Button>
              <Button
                size="small"
                theme="light"
                type="tertiary"
                onClick={() => handleCheckAll(!checkAll)}
              >
                {checkAll ? "取消全选" : "全选"}
              </Button>
              <Form.Checkbox
                checked={parentChildRelation}
                onChange={(checked) => setParentChildRelation(checked)}
              >
                父子联动
              </Form.Checkbox>
            </div>
            <Tree
              treeData={treeData}
              multiple
              value={selectedMenuIds}
              onChange={handleMenuChange}
              checkRelation={parentChildRelation ? "related" : "unRelated"}
              expandAll={expandAll}
              leafOnly={false}
              motion={false}
              showClear
              style={{ width: "100%", maxHeight: "300px", overflow: "auto" }}
            />
          </Form.Slot>
        </div>
        <div className="col-span-full">
          <Form.TextArea
            field="description"
            label="备注"
            placeholder="请输入备注"
          />
        </div>
      </Form>
    </Modal>
  );
}
