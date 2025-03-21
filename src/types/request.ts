import type { AxiosRequestConfig } from "axios";

/**
 * API响应的通用接口
 */
export interface ApiResponse<T = any> {
  // 响应状态码
  code: number;
  // 响应数据
  data: T;
  // 响应消息
  message: string;
}

/**
 * 请求配置接口，扩展自AxiosRequestConfig
 */
export interface RequestOptions extends AxiosRequestConfig {
  // 是否显示全局loading
  showLoading?: boolean;
  // 是否显示错误信息
  showError?: boolean;
  // 是否显示接口返回的消息
  showMessage?: boolean;
  // 自定义错误处理
  customErrorHandler?: (error: any) => void;
  // 重试次数
  retryCount?: number;
  // 重试延迟(ms)
  retryDelay?: number;
  // 是否可取消请求
  cancelable?: boolean;
}

// 扩展AxiosRequestConfig接口
declare module "axios" {
  interface AxiosRequestConfig {
    requestOptions?: RequestOptions;
  }
}
