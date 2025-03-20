import axios, { AxiosRequestConfig } from "axios";

// 存储取消令牌的Map
const pendingRequests = new Map<string, AbortController>();

/**
 * 生成请求的唯一键
 * @param config 请求配置
 * @returns 唯一键
 */
const generateRequestKey = (config: AxiosRequestConfig): string => {
  const { method, url, params, data } = config;
  return [
    method?.toLowerCase() || "",
    url || "",
    JSON.stringify(params || {}),
    JSON.stringify(data || {}),
  ].join("&");
};

/**
 * 添加取消令牌
 * @param config 请求配置
 */
export const addCancelToken = (config: AxiosRequestConfig): void => {
  // 如果配置中指定了不需要取消，则跳过
  if (config.cancelable === false) {
    return;
  }

  // 移除已存在的相同请求
  removePendingRequest(config);

  // 创建取消令牌
  const controller = new AbortController();
  config.signal = controller.signal;

  // 存储取消令牌
  const requestKey = generateRequestKey(config);
  pendingRequests.set(requestKey, controller);
};

/**
 * 移除待处理的请求
 * @param config 请求配置
 */
export const removePendingRequest = (config: AxiosRequestConfig): void => {
  const requestKey = generateRequestKey(config);
  if (pendingRequests.has(requestKey)) {
    // 获取并移除取消令牌
    const controller = pendingRequests.get(requestKey);
    controller?.abort();
    pendingRequests.delete(requestKey);
  }
};

/**
 * 清除所有待处理的请求
 */
export const clearPendingRequests = (): void => {
  pendingRequests.forEach((controller) => {
    controller.abort();
  });
  pendingRequests.clear();
};

// 扩展AxiosRequestConfig接口
declare module "axios" {
  interface AxiosRequestConfig {
    cancelable?: boolean;
  }
}
