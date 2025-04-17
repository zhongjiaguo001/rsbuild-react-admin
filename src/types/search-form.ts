import type { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import type { ReactNode } from "react";

// 基础搜索字段配置接口
export interface SearchFieldConfig {
  // 字段名，用于表单数据收集
  field: string;
  // 字段标签
  label: string;
  // 组件类型，用于决定渲染哪种输入组件
  type: "input" | "select" | "date" | "dateRange" | "custom";
  // 栅格跨度，用于控制字段在表单中的宽度
  span?: number;
  // 表单验证规则
  rules?: any[];
  // 允许其他任意属性，这些属性将传递给对应的输入组件
  [key: string]: any;
}

// 输入框字段配置接口
export interface InputFieldConfig extends SearchFieldConfig {
  type: "input";
  // 输入框类型
  inputType?: string;
  // 占位符
  placeholder?: string;
  // 前缀图标
  prefix?: ReactNode;
  // 后缀图标
  suffix?: ReactNode;
  // 其他Input组件支持的属性
}

// 选择器字段配置接口
export interface SelectFieldConfig extends SearchFieldConfig {
  type: "select";
  // 选项列表
  options: Array<{ label: string | ReactNode; value: string | number }>;
  // 占位符
  placeholder?: string;
  // 是否支持多选
  multiple?: boolean;
  // 其他Select组件支持的属性
}

// 日期选择器字段配置接口
export interface DatePickerFieldConfig extends SearchFieldConfig {
  type: "date" | "dateRange";
  // 日期格式
  format?: string;
  // 占位符
  placeholder?: string | string[];
  // 其他DatePicker组件支持的属性
}

// 自定义字段配置接口
export interface CustomFieldConfig extends SearchFieldConfig {
  type: "custom";
  // 自定义渲染函数，接收表单API和当前字段配置
  render: (formApi: FormApi, config: CustomFieldConfig) => ReactNode;
}
