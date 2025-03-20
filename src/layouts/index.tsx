import { Layout } from "@douyinfe/semi-ui";
import { Outlet } from "@tanstack/react-router";
import { TitleBar } from "@/layouts/TitleBar";
import { Sidebar } from "@/layouts/Sidebar";

export function RootLayout() {
  const { Sider, Content, Header } = Layout;
  return (
    <Layout className="h-screen flex flex-col">
      <Header className="flex-shrink-0">
        <TitleBar />
      </Header>
      <Layout className="flex-grow overflow-hidden">
        <Sider className="h-full">
          <Sidebar />
        </Sider>
        <Content className="h-full semi-bg-background-page semi-light-scrollbar overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
