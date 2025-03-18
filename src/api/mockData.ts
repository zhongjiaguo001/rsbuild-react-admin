import { User } from "../types";

// 生成模拟用户数据
export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `用户 ${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index % 3 === 0 ? "管理员" : "普通用户",
    status: index % 5 === 0 ? "inactive" : "active",
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
  }));
};

// 预生成100个用户
export const USERS: User[] = generateUsers(100);
