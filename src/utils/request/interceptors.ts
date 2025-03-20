import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { RequestOptions } from "./index";
import { addCancelToken, removePendingRequest } from "./cancelToken";

/**
 * 请求拦截器
 * @param config 请求配置
 * @returns 处理后的请求配置
 */
export const requestInterceptor = (
  config: AxiosRequestConfig
): AxiosRequestConfig => {
  // 添加取消令牌
  addCancelToken(config);

  // 获取token并添加到请求头
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 显示全局loading
  const requestOptions = config.requestOptions as RequestOptions;
  if (requestOptions?.showLoading) {
    // TODO: 实现全局loading
    console.log("显示loading");
  }

  return config;
};

/**
 * 请求错误拦截器
 * @param error 错误信息
 * @returns Promise.reject(error)
 */
export const requestErrorInterceptor = (
  error: AxiosError
): Promise<AxiosError> => {
  return Promise.reject(error);
};

/**
 * 响应拦截器
 * @param response 响应数据
 * @returns 处理后的响应数据
 */
export const responseInterceptor = (response: AxiosResponse): any => {
  // 移除请求取消令牌
  removePendingRequest(response.config);

  // 隐藏全局loading
  const requestOptions = response.config.requestOptions as RequestOptions;
  if (requestOptions?.showLoading) {
    // TODO: 隐藏全局loading
    console.log("隐藏loading");
  }

  // 直接返回data部分
  return response.data;
};

/**
 * 响应错误拦截器
 * @param error 错误信息
 * @returns Promise.reject(error)
 */
export const responseErrorInterceptor = async (
  error: AxiosError
): Promise<any> => {
  const config = error.config as any;

  // 移除请求取消令牌
  if (config) {
    removePendingRequest(config);
  }

  // 隐藏全局loading
  const requestOptions = config?.requestOptions as RequestOptions;
  if (requestOptions?.showLoading) {
    // TODO: 隐藏全局loading
    console.log("隐藏loading");
  }

  return Promise.reject(error);
};
