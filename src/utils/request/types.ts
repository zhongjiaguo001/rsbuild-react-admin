import { AxiosRequestConfig } from "axios";
import { ApiResponse } from "../../types";

/**
 * 请求配置接口，扩展自AxiosRequestConfig
 */
export interface RequestOptions extends AxiosRequestConfig {
  // 是否显示全局loading
  showLoading?: boolean;
  // 是否显示错误信息
  showError?: boolean;
  // 自定义错误处理
  customErrorHandler?: (error: any) => void;
  // 重试次数
  retryCount?: number;
  // 重试延迟(ms)
  retryDelay?: number;
  // 是否可取消请求
  cancelable?: boolean;
}

/**
 * 请求方法接口
 */
export interface RequestMethods {
  get: <T = any>(
    url: string,
    params?: any,
    options?: RequestOptions
  ) => Promise<ApiResponse<T>>;
  post: <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ) => Promise<ApiResponse<T>>;
  put: <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ) => Promise<ApiResponse<T>>;
  delete: <T = any>(
    url: string,
    options?: RequestOptions
  ) => Promise<ApiResponse<T>>;
  patch: <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ) => Promise<ApiResponse<T>>;
  createInstance: (options?: RequestOptions) => RequestMethods;
}

// 扩展AxiosRequestConfig接口
declare module "axios" {
  interface AxiosRequestConfig {
    requestOptions?: RequestOptions;
  }
}
