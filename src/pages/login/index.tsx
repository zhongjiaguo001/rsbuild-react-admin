import { useRef, useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Typography,
  Toast,
  Image,
} from "@douyinfe/semi-ui";
import { useMutation } from "@tanstack/react-query";
import { LoginType, loginApi } from "@/api/login";
import type { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { useNavigate } from "react-router-dom";
import { userStore } from "@/store";

const { Title } = Typography;

function LoginPage() {
  const navigate = useNavigate();
  const formRef = useRef<FormApi>();
  const setToken = userStore((state) => state.setToken);
  const [captcha, setCaptcha] = useState<string>();

  // 登录
  const authMutation = useMutation({
    mutationFn: async (values: LoginType) => {
      const response = await loginApi.login(values);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data); // 确认这里的 data 是否就是 token 字符串
      navigate("/");
      Toast.success("登录成功");
    },
  });

  // 获取验证码
  const getCaptchaImg = async () => {
    const { data } = await loginApi.getCodeImg();
    setCaptcha(data);
  };
  useEffect(() => {
    getCaptchaImg();
  }, []);

  return (
    <div className="h-screen semi-bg-background-page flex items-center justify-center overflow-hidden">
      <Card bordered className="!rounded-2xl">
        <Form
          getFormApi={(formApi) => (formRef!.current = formApi)}
          onSubmit={(values) => authMutation.mutate(values)}
        >
          <Title heading={4} className="text-center mb-8">
            管理后台
          </Title>
          <Form.Input
            size="large"
            field="username"
            label="用户名"
            placeholder="请输入用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名",
              },
            ]}
          />
          <Form.Input
            size="large"
            field="password"
            label="密码"
            placeholder="请输入密码"
            type="password"
            rules={[
              {
                required: true,
                message: "请输入密码",
              },
            ]}
          />
          <Form.Input
            size="large"
            field="captcha"
            label="验证码"
            placeholder="请输入验证码"
            className="flex-grow"
            rules={[{ required: true, message: "请输入验证码" }]}
            suffix={
              <Image
                src={captcha || ""}
                width={100}
                height={32}
                preview={false}
                onClick={getCaptchaImg}
                style={{ cursor: "pointer" }}
              />
            }
          />
          <Button
            theme="solid"
            type="primary"
            size="large"
            htmlType="submit"
            className="w-full"
            loading={authMutation.isPending}
          >
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
