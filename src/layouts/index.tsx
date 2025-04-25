import { Layout } from "@douyinfe/semi-ui";
import { Outlet } from "@tanstack/react-router";
import { TitleBar } from "@/layouts/TitleBar";
import { Sidebar } from "@/layouts/Sidebar";

export function RootLayout() {
  const { Sider, Content, Header } = Layout;
  return (
    <Layout className="h-screen flex flex-col">
      <Header className="flex-shrink-0 border-b border-[var(--semi-color-border)] bg-[var(--semi-color-bg-1)]">
        <TitleBar />
      </Header>
      <Layout className="flex-grow overflow-hidden">
        <Sider className="h-full bg-[var(--semi-color-bg-1)]">
          <Sidebar />
        </Sider>
        <Content className="h-full semi-light-scrollbar overflow-auto bg-[rgba(249,250,251,1)] dark:bg-[var(--semi-color-bg-0)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
