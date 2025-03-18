// 定义用户数据类型
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

// 定义API响应类型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 定义查询参数类型
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}
