import { useRef } from "react";
import { Modal, Form } from "@douyinfe/semi-ui";
import type { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { UserForm } from "@/api/system/user";

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: UserForm) => void;
  editData?: UserForm;
}

export function UserModal({
  visible,
  onCancel,
  onOk,
  editData,
}: UserModalProps) {
  const { Select, Radio } = Form;
  const formRef = useRef<FormApi>();

  const onSubmit = async () => {
    const values = (await formRef!.current!.validate()) as UserForm;
    onOk(values);
  };

  return (
    <Modal
      title={editData ? "编辑用户" : "添加用户"}
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      width={640}
    >
      <Form
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        getFormApi={(formApi) => (formRef!.current = formApi)}
        initValues={editData}
      >
        <Form.Input
          field="nickname"
          label="用户昵称"
          placeholder="请输入用户昵称"
          rules={[{ required: true, message: "请输入用户昵称" }]}
        />
        <Form.Select
          className="w-full"
          field="department"
          label="归属部门"
          placeholder="请选择归属部门"
        >
          <Select.Option value="技术部">技术部</Select.Option>
          <Select.Option value="产品部">产品部</Select.Option>
          <Select.Option value="市场部">市场部</Select.Option>
          <Select.Option value="运营部">运营部</Select.Option>
        </Form.Select>
        <Form.Input
          field="phone"
          label="手机号码"
          placeholder="请输入手机号码"
        />
        <Form.Input field="email" label="邮箱" placeholder="请输入邮箱" />
        <Form.Input
          field="username"
          label="用户名称"
          placeholder="请输入用户名称"
          rules={[{ required: true, message: "请输入用户名称" }]}
        />
        {!editData && (
          <Form.Input
            field="password"
            label="用户密码"
            type="password"
            placeholder="请输入用户密码"
            rules={[{ required: true, message: "请输入用户密码" }]}
          />
        )}
        <Form.Select
          className="w-full"
          field="gender"
          label="用户性别"
          placeholder="请选择"
        >
          <Select.Option value="male">男</Select.Option>
          <Select.Option value="female">女</Select.Option>
          <Select.Option value="other">其他</Select.Option>
        </Form.Select>
        <Form.RadioGroup field="status" label="状态" defaultValue={1}>
          <Radio value={1}>正常</Radio>
          <Radio value={0}>停用</Radio>
        </Form.RadioGroup>
        <Form.Select
          className="w-full"
          field="position"
          label="岗位"
          placeholder="请选择岗位"
        >
          <Select.Option value="developer">开发工程师</Select.Option>
          <Select.Option value="tester">测试工程师</Select.Option>
          <Select.Option value="pm">产品经理</Select.Option>
        </Form.Select>
        <Form.Select
          className="w-full"
          field="role"
          label="角色"
          placeholder="请选择角色"
        >
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="user">普通用户</Select.Option>
          <Select.Option value="guest">访客</Select.Option>
        </Form.Select>
        {/* 独占一行用grid */}
        <div className="col-span-full">
          <Form.TextArea field="remark" label="备注" placeholder="请输入内容" />
        </div>
      </Form>
    </Modal>
  );
}
