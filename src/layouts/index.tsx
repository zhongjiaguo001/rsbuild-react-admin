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
    <Layout className="h-screen">
      <Header>
        <TitleBar />
      </Header>
      <Layout>
        <Sider>
          <Sidebar />
        </Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
