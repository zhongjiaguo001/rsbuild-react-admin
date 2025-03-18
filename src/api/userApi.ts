import { ApiResponse, QueryParams, User } from "../types";
import { USERS } from "./mockData";

// 模拟延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 获取用户列表
export async function getUsers(params: QueryParams): Promise<
  ApiResponse<{
    users: User[];
    totalCount: number;
  }>
> {
  // 模拟网络延迟
  await delay(500);

  const { page = 1, pageSize = 10, sortBy, sortOrder, search } = params;

  // 复制用户数组以便进行排序和过滤
  let filteredUsers = [...USERS];

  // 搜索过滤
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
    );
  }

  // 排序
  if (sortBy) {
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof User];
      const bValue = b[sortBy as keyof User];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "desc"
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      return sortOrder === "desc"
        ? Number(bValue) - Number(aValue)
        : Number(aValue) - Number(bValue);
    });
  }

  // 分页
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return {
    success: true,
    data: {
      users: paginatedUsers,
      totalCount: filteredUsers.length,
    },
  };
}

// 获取单个用户
export async function getUser(id: number): Promise<ApiResponse<User>> {
  await delay(300);

  const user = USERS.find((user) => user.id === id);

  if (!user) {
    return {
      success: false,
      message: "用户不存在",
      data: {} as User,
    };
  }

  return {
    success: true,
    data: user,
  };
}
