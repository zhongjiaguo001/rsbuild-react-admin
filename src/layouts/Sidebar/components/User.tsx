import {
  Popover,
  Avatar,
  Divider,
  Card,
  Button,
  Typography,
} from "@douyinfe/semi-ui";
import { Link, useNavigate } from "@tanstack/react-router";
import { userStore } from "@/store";

function Profile() {
  const navigate = useNavigate();
  const logout = userStore((state) => state.logout);
  const userInfo = userStore((state) => state.user);

  const { Text } = Typography;

  // // 计算距离生日还有多少天
  // const getDaysUntilBirthday = () => {
  //   if (!userInfo.birthday) return null;
  //   const today = new Date();
  //   const birthday = new Date(userInfo.birthday);
  //   const diffTime = Math.abs(birthday.getTime() - today.getTime());
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays;
  // };

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: "/login" });
    } catch (error) {
      throw error;
    }
  };

  if (!userInfo) {
    return (
      <Card style={{ width: 240 }}>
        <div className="flex flex-col items-center gap-2">
          <Text>您尚未登录</Text>
          <Link preload={false} to="/login">
            <Button type="primary">登录</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ width: 240 }}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar size="default" color="blue">
            {userInfo.username.slice(0, 2)}
          </Avatar>
          <div className="flex flex-col">
            <Text strong>{userInfo.username}</Text>
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
            <Text>
              中文
              {/* {userInfo.language} */}
            </Text>
          </div>
          {/* {userInfo.birthday && (
            <div className="flex items-center gap-2">
              <Text type="tertiary">距离生日：</Text>
              <Text>{getDaysUntilBirthday()}天</Text>
            </div>
          )} */}
          <div className="flex items-center gap-2">
            <Text type="tertiary">邮箱：</Text>
            <Text>{userInfo.email}</Text>
          </div>
          {/* {userInfo.phone && (
            <div className="flex items-center gap-2">
              <Text type="tertiary">手机：</Text>
              <Text>{userInfo.phone}</Text>
            </div>
          )} */}
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
