import {
  Popover,
  Avatar,
  Divider,
  Card,
  Button,
  Typography,
} from "@douyinfe/semi-ui";
import { useState } from "react";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  isOnline: boolean;
  language?: string;
  birthday?: string;
  lastOnline?: string;
}

function Profile() {
  // 模拟用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  // 模拟用户数据
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: 1,
    name: "WeiXia0",
    email: "13037453655@qq.com",
    isOnline: true,
    language: "中文",
    birthday: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后
    phone: "",
  });

  const { Text } = Typography;

  // 计算距离生日还有多少天
  const getDaysUntilBirthday = () => {
    if (!userInfo.birthday) return null;
    const today = new Date();
    const birthday = new Date(userInfo.birthday);
    const diffTime = Math.abs(birthday.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <Card style={{ width: 240 }}>
        <div className="flex flex-col items-center gap-2">
          <Text>您尚未登录</Text>
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ width: 240 }}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar size="default" color="blue">
            {userInfo.name.slice(0, 2)}
          </Avatar>
          <div className="flex flex-col">
            <Text strong>{userInfo.name}</Text>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <Text type="tertiary" size="small">
                在线
              </Text>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Text type="tertiary">语言：</Text>
            <Text>{userInfo.language}</Text>
          </div>
          {userInfo.birthday && (
            <div className="flex items-center gap-2">
              <Text type="tertiary">距离生日：</Text>
              <Text>{getDaysUntilBirthday()}天</Text>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Text type="tertiary">邮箱：</Text>
            <Text>{userInfo.email}</Text>
          </div>
          {userInfo.phone && (
            <div className="flex items-center gap-2">
              <Text type="tertiary">手机：</Text>
              <Text>{userInfo.phone}</Text>
            </div>
          )}
        </div>

        <Divider margin={12} />
        <Button type="danger" onClick={handleLogout} block>
          退出登录
        </Button>
      </div>
    </Card>
  );
}

export function User() {
  return (
    <Popover position="right" content={<Profile />}>
      <Avatar size="small" color="blue">
        XG
      </Avatar>
      <Divider margin={10} />
    </Popover>
  );
}
