import { createRootRoute } from "@tanstack/react-router";
import { Loading } from "@/components/Loading";
import { Outlet, redirect } from "@tanstack/react-router";
import { userStore } from "@/store";
import { Toast } from "@douyinfe/semi-ui";

const whiteList = ["/login", "/not-found"];
export const Route = createRootRoute({
  component: Outlet,
  pendingComponent: Loading,
  beforeLoad: ({ location }) => {
    const token = userStore.getState().token;
    if (!token && !whiteList.includes(location.pathname)) {
      Toast.error("您还没有登录！");
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
});
