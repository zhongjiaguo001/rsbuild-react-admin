import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import type { ApiResponse, RequestOptions } from "@/types/request";
import { Toast, Modal } from "@douyinfe/semi-ui";
import { useAuthStore } from "@/store";

// 环境变量中的API URL，如果没有则使用默认值
const API_URL =
  import.meta.env.RS_BASE_API_URL + "/api" || "http://localhost:3000/api";

// 默认配置
const defaultOptions: RequestOptions = {
  showLoading: true,
  showError: true,
  showMessage: false,
  retryCount: 2,
  retryDelay: 1000,
};

// 创建axios实例
const createAxiosInstance = (options?: RequestOptions): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 获取token并添加到请求头
      const token = useAuthStore.getState().token;
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
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 隐藏全局loading
      const requestOptions = response.config.requestOptions as RequestOptions;
      if (requestOptions?.showLoading) {
        // TODO: 隐藏全局loading
        console.log("隐藏loading");
      }

      // 显示消息
      if (requestOptions?.showMessage) {
        Toast.success(response.data.message);
      }

      // 直接返回data部分
      return response.data;
    },
    async (error: AxiosError) => {
      const config = error.config as any;

      // 隐藏全局loading
      const requestOptions = config?.requestOptions as RequestOptions;
      if (requestOptions?.showLoading) {
        // TODO: 隐藏全局loading
        console.log("隐藏loading");
      }

      // 处理错误
      if (requestOptions?.customErrorHandler) {
        requestOptions.customErrorHandler(error);
      } else if (requestOptions?.showError) {
        // 默认错误处理
        handleError(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// 默认实例
const axiosInstance = createAxiosInstance();

// 错误处理函数
const handleError = (error: AxiosError) => {
  const { response } = error;
  let message = (response?.data as ApiResponse)?.message || "请求失败";

  if (response) {
    const status = response.status;

    if (status === 401) {
      //   case 401:
      // message = "未授权，请重新登录";
      // 可以在这里处理登出逻辑
      Modal.confirm({
        centered: true,
        title: "系统提示",
        content: "您的登录状态已过期，是否重新登录？",
        okText: "重新登录",
        cancelText: "取消",
        onOk: () => {
          // 执行登出操作
          useAuthStore.getState().logout();
          window.location.href = "/login";
        },
      });
      return;
    }
    // 根据状态码处理错误
    // switch (status) {
    //   case 400:
    //     message = "请求错误";
    //     break;
    //   case 401:
    //     message = "未授权，请重新登录";
    //     // 可以在这里处理登出逻辑
    //     // logout();
    //     // window.location.href = "/login";
    //     break;
    //   case 403:
    //     message = "拒绝访问";
    //     break;
    //   case 404:
    //     message = "请求地址不存在";
    //     break;
    //   case 500:
    //     message = "服务器内部错误";
    //     break;
    //   default:
    //     message = `请求失败(${status})`;
    // }
  } else if (error.message.includes("timeout")) {
    message = "请求超时";
  } else if (error.message.includes("Network")) {
    message = "网络异常";
  }
  if (error.message.includes("timeout")) {
    message = "请求超时";
  } else if (error.message.includes("Network")) {
    message = "网络异常";
  }

  // TODO: 使用UI库的消息提示组件
  Toast.error(message);
};

// 请求方法
export const request = {
  get: <T = any>(
    url: string,
    params?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.get(url, {
      params,
      ...options,
      requestOptions: { ...defaultOptions, ...options },
    });
  },
  post: <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.post(url, data, {
      ...options,
      requestOptions: { ...defaultOptions, ...options },
    });
  },
  put: <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.put(url, data, {
      ...options,
      requestOptions: { ...defaultOptions, ...options },
    });
  },
  delete: <T = any>(
    url: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.delete(url, {
      ...options,
      requestOptions: { ...defaultOptions, ...options },
    });
  },
  patch: <T = any>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    return axiosInstance.patch(url, data, {
      ...options,
      requestOptions: { ...defaultOptions, ...options },
    });
  },
  // 创建自定义实例
  createInstance: (options?: RequestOptions) => {
    return createAxiosInstance(options);
  },
};

export default request;
