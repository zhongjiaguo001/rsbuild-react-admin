import { Dropdown, Avatar, Modal } from "@douyinfe/semi-ui";
import { useAuthStore } from "@/store";
import { redirect, useNavigate } from "@tanstack/react-router";

function User() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleToUserProFile = () => {
    navigate({
      to: "/system/user/profile",
    });
  };

  const handleLogout = () => {
    Modal.confirm({
      centered: true,
      title: "退出登录",
      content: "确定要退出登录吗？",
      onOk: async () => {
        await logout();
        redirect({
          to: "/login",
          replace: true,
        });
      },
    });
  };

  return (
    <Dropdown
      position="bottomLeft"
      render={
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleToUserProFile}>个人中心</Dropdown.Item>
          <Dropdown.Item onClick={handleLogout}>退出登录</Dropdown.Item>
        </Dropdown.Menu>
      }
    >
      <Avatar size="small" />
    </Dropdown>
  );
}

export default User;
