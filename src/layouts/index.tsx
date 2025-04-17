import { Layout } from "@douyinfe/semi-ui";
import { Outlet } from "react-router-dom";
import { TitleBar } from "@/layouts/TitleBar";
import { Sidebar } from "@/layouts/Sidebar";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";

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
        <Content className="h-full semi-light-scrollbar overflow-auto">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
