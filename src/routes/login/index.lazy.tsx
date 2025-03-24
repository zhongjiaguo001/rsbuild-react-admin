import { useRef, useState } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Form, Button, Card, Typography, Toast } from "@douyinfe/semi-ui";
import { GithubOne, Google } from "@icon-park/react";
import { useMutation } from "@tanstack/react-query";
import {
  type RegisterType,
  type LoginDataType,
  LoginType,
  userApi,
} from "@/api/user";
import type { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { useNavigate } from "@tanstack/react-router";
import { userStore } from "@/store";

export const Route = createLazyFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const formRef = useRef<FormApi>();
  const { Title } = Typography;
  const [isLogin, setIsLogin] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const setToken = userStore((state) => state.setToken);
  const setUserData = userStore((state) => state.setUserData);

  // 发送验证码
  const sendCodeMutation = useMutation({
    mutationFn: userApi.sendVerificationCode,
    onSuccess: () => {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
  });

  const handleSendCode = async () => {
    try {
      await formRef.current?.validate?.(["email"]);
      sendCodeMutation.mutate({
        email: await formRef.current?.getValue?.("email"),
        purpose: isLogin ? "login" : "register",
      });
    } catch (errors) {
      Toast.error("请输入有效的邮箱地址");
      return;
    }
  };

  // 登录/注册
  const authMutation = useMutation({
    mutationFn: (values: LoginType | RegisterType) => {
      return isLogin
        ? userApi.login(values as LoginType)
        : userApi.register(values as RegisterType);
    },
    onSuccess: (data: LoginDataType | any) => {
      if (isLogin) {
        setToken(data.access_token);
        setUserData(data.user);
        navigate({ to: "/" });
      } else {
        setIsLogin(true);
      }
      Toast.success(`${isLogin ? "登录" : "注册"}成功`);
    },
  });

  const handleSubmit = async (values: {
    email: string;
    username?: string;
    verification_code: string;
    agreement: boolean;
  }) => {
    if (!values.agreement) {
      Toast.error("请先阅读并同意服务条款和隐私政策");
      return;
    }
    authMutation.mutate({
      email: values.email,
      verification_code: values.verification_code,
      purpose: isLogin ? "login" : "register",
      username: isLogin ? undefined : values.username,
    });
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <Card bordered className="!rounded-2xl">
        <Form
          getFormApi={(formApi) => (formRef!.current = formApi)}
          onSubmit={handleSubmit}
        >
          <Title heading={4} className="text-center mb-8">
            {isLogin ? "登录" : "注册"}
          </Title>
          {!isLogin && (
            <Form.Input
              field="username"
              label="昵称"
              placeholder="请输入昵称"
              rules={[
                {
                  required: true,
                  message: "请输入昵称",
                },
              ]}
            />
          )}
          <Form.Input
            size="large"
            field="email"
            label="邮箱"
            placeholder="请输入邮箱地址"
            rules={[
              {
                required: true,
                type: "email",
                message: "请输入有效的邮箱地址",
              },
            ]}
          />
          <Form.Input
            size="large"
            field="verification_code"
            label="验证码"
            placeholder="请输入验证码"
            className="flex-grow"
            rules={[{ required: true, message: "请输入验证码" }]}
            addonAfter={
              <Button
                theme="borderless"
                className="self-center"
                disabled={countdown > 0}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
              </Button>
            }
          />
          <Form.Checkbox label=" " field="agreement">
            我已阅读并同意
            <a href="#" className="semi-color-primary">
              服务条款
            </a>
            和
            <a href="#" className="text-blue-500">
              隐私政策
            </a>
          </Form.Checkbox>
          <Button
            theme="solid"
            type="primary"
            size="large"
            htmlType="submit"
            className="w-full"
            loading={authMutation.isPending}
          >
            {isLogin ? "登录" : "注册"}
          </Button>
          <div className="mt-4 text-center">
            <Button theme="borderless" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "没有账号？立即注册" : "已有账号？立即登录"}
            </Button>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <Button icon={<GithubOne />} theme="borderless" />
            <Button icon={<Google />} theme="borderless" />
          </div>
        </Form>
      </Card>
    </div>
  );
}
