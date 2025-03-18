import { Layout } from "@douyinfe/semi-ui";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TitleBar } from "@/layouts/TitleBar";
import { Sidebar } from "@/layouts/Sidebar";
import { Loading } from "@/components/Loading";

export const Route = createRootRoute({
  component: RootLayout,
  pendingComponent: () => Loading,
});

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
        <Content className="h-full bg-gray-50 dark:bg-transparent semi-light-scrollbar overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
