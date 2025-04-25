// src/hooks/useAuth.js
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { useAuthStore } from "@/store";

export const useUserInfo = () => {
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  return useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await authApi.getUserInfo();
      if (response.data) {
        setUserInfo(response.data);
      }
      return response.data;
    },
    enabled: !!useAuthStore.getState().token, // 只有在有token时才执行
    staleTime: 1000 * 60 * 5, // 5分钟后过期
  });
};

export const useUserRouters = () => {
  return useQuery({
    queryKey: ["userRouters"],
    queryFn: async () => {
      const response = await authApi.getUserMenus();
      return response.data;
    },
    enabled: !!useAuthStore.getState().token,
    staleTime: 1000 * 60 * 5,
  });
};
