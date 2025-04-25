// src/hooks/use-user-query.ts
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth";

export const useUserInfoQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: authApi.getUserInfo,
    enabled,
    staleTime: 1000 * 60 * 5, // 5分钟
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};

export const useMenusQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["menus"],
    queryFn: authApi.getUserMenus,
    enabled,
    staleTime: 1000 * 60 * 5, // 5分钟
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
