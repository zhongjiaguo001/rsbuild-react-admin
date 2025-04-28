import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Card,
  Form,
  Button,
  Avatar,
  Typography,
  Tabs,
  TabPane,
  Toast,
  Upload,
  Spin,
} from "@douyinfe/semi-ui";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconCalendar,
  IconCamera,
} from "@douyinfe/semi-icons";
import {
  uploadAvatar,
  getUserProFile,
  updateUserProFile,
  updateUserPassword,
  type ProfileInfo,
} from "@/api/system/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const { Text } = Typography;

// 基本资料表单组件
const BasicInfoForm = ({
  userInfo,
  onSuccess,
}: {
  userInfo: ProfileInfo;
  onSuccess: () => void;
}) => {
  const handleSubmit = (values: ProfileInfo) => {
    updateProfileMutation.mutate(values);
  };

  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileInfo) => updateUserProFile(values),
    onSuccess,
  });

  const handleCancel = () => {
    // 重置表单或返回上一页
    console.log("取消编辑");
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initValues={userInfo}
      labelPosition="left"
      labelWidth={100}
      labelAlign="right"
    >
      <Form.Input
        field="username"
        label="用户昵称"
        placeholder="请输入用户昵称"
        showClear
        rules={[{ required: true, message: "请输入用户昵称" }]}
      />
      <Form.Input
        field="phonenumber"
        label="手机号码"
        placeholder="请输入手机号码"
        showClear
        rules={[{ required: true, message: "请输入手机号码" }]}
      />
      <Form.Input
        field="email"
        label="邮箱"
        placeholder="请输入邮箱"
        showClear
        rules={[{ required: true, message: "请输入邮箱" }]}
      />
      <Form.RadioGroup field="gender" label="性别">
        <Form.Radio value="男">男</Form.Radio>
        <Form.Radio value="女">女</Form.Radio>
      </Form.RadioGroup>
      <div className="flex justify-center mt-6">
        <Button
          type="primary"
          htmlType="submit"
          className="mr-4"
          loading={updateProfileMutation.isPending}
        >
          保存
        </Button>
        <Button onClick={handleCancel}>关闭</Button>
      </div>
    </Form>
  );
};

// 修改密码表单组件
const PasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const updatePasswordMutation = useMutation({
    mutationFn: (values: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => updateUserPassword(values),
    onSuccess,
  });

  const handleSubmit = (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      Toast.error("两次输入的密码不一致");
      return;
    }
    updatePasswordMutation.mutate(values);
  };

  const handleCancel = () => {
    console.log("取消编辑");
  };

  return (
    <Form
      labelPosition="left"
      labelWidth={100}
      labelAlign="right"
      onSubmit={handleSubmit}
    >
      <Form.Input
        field="oldPassword"
        label="旧密码"
        type="password"
        placeholder="请输入旧密码"
        showClear
        rules={[{ required: true, message: "请输入旧密码" }]}
      />
      <Form.Input
        field="newPassword"
        label="新密码"
        type="password"
        placeholder="请输入新密码"
        showClear
        rules={[{ required: true, message: "请输入新密码" }]}
      />
      <Form.Input
        field="confirmPassword"
        label="确认密码"
        type="password"
        placeholder="请确认新密码"
        showClear
        rules={[{ required: true, message: "请确认新密码" }]}
      />
      <div className="flex justify-center mt-6">
        <Button
          type="primary"
          htmlType="submit"
          className="mr-4"
          loading={updatePasswordMutation.isPending}
        >
          保存
        </Button>
        <Button onClick={handleCancel}>关闭</Button>
      </div>
    </Form>
  );
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("基本资料");
  const queryClient = useQueryClient();

  // 获取用户信息
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getUserProFile().then((res) => res.data),
  });

  // 上传头像
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => {
      Toast.success("头像上传成功");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: () => {
      Toast.error("头像上传失败");
    },
  });

  // 刷新用户信息
  const refreshUserInfo = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  };

  // 头像上传已在Upload组件的customRequest中处理

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 flex sm:flex-row flex-col  gap-6">
      {/* 左侧个人信息卡片  */}
      <Card className="sm:w-[35%] w-full">
        <div className="flex flex-col items-center">
          <div className="text-lg font-medium mb-4">个人信息</div>
          <div className="relative">
            <Avatar
              size="large"
              src={
                userInfo?.avatar ||
                "https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/avatarDemo.jpeg"
              }
              style={{ width: 100, height: 100, marginBottom: 16 }}
            />
            <Upload
              action=""
              limit={1}
              accept="image/*"
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                // 调用API上传文件
                uploadAvatarMutation.mutate(
                  file.fileInstance as unknown as File,
                  {
                    onSuccess: (res) => {
                      onSuccess(res);
                    },
                  }
                );
              }}
              className="absolute bottom-4 right-0 bg-[var(--semi-color-primary)] rounded-full p-1 cursor-pointer"
            >
              <IconCamera size="small" className="text-white" />
            </Upload>
          </div>
          <div className="w-full mt-4">
            <div className="flex items-center py-3 border-b border-[var(--semi-color-border)]">
              <IconUser className="mr-2" />
              <Text strong>用户名称</Text>
              <Text className="ml-auto">{userInfo?.username}</Text>
            </div>
            <div className="flex items-center py-3 border-b border-[var(--semi-color-border)]">
              <IconPhone className="mr-2" />
              <Text strong>手机号码</Text>
              <Text className="ml-auto">{userInfo?.phonenumber}</Text>
            </div>
            <div className="flex items-center py-3 border-b border-[var(--semi-color-border)]">
              <IconMail className="mr-2" />
              <Text strong>用户邮箱</Text>
              <Text className="ml-auto">{userInfo?.email}</Text>
            </div>
            <div className="flex items-center py-3 border-b border-[var(--semi-color-border)]">
              <IconUser className="mr-2" />
              <Text strong>所在部门</Text>
              <Text className="ml-auto">{userInfo?.dept.name || "未设置"}</Text>
            </div>
            <div className="flex items-center py-3 border-b border-[var(--semi-color-border)]">
              <IconUser className="mr-2" />
              <Text strong>所属角色</Text>
              <Text className="ml-auto">{userInfo?.remark || "未设置"}</Text>
            </div>
            {userInfo?.createdAt && (
              <div className="flex items-center py-3 border-b border-[var(--semi-color-border)]">
                <IconCalendar className="mr-2" />
                <Text strong>创建日期</Text>
                <Text className="ml-auto">{userInfo.createdAt}</Text>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* 右侧编辑表单 */}
      <Card className="flex-1">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane tab="基本资料" itemKey="基本资料">
            {userInfo && (
              <BasicInfoForm userInfo={userInfo} onSuccess={refreshUserInfo} />
            )}
          </TabPane>
          <TabPane tab="修改密码" itemKey="修改密码">
            <PasswordForm onSuccess={refreshUserInfo} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}

export const Route = createLazyFileRoute("/_layout/system/user/profile")({
  component: UserProfile,
});
