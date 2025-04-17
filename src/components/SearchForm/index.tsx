import { Form, Button, Row, Col } from "@douyinfe/semi-ui";
import type { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { useState, useEffect } from "react";
import {
  SearchFieldConfig,
  SelectFieldConfig,
  CustomFieldConfig,
  //   InputFieldConfig,
  //   DatePickerFieldConfig,
} from "@/types/search-form";
import { IconSearch, IconRefresh } from "@douyinfe/semi-icons";

interface DynamicSearchFormProps<T> {
  // 搜索字段配置数组
  fields: SearchFieldConfig[];
  // 搜索回调函数，接收表单值作为参数
  onSearch?: (values: T) => void;
  // 重置回调函数
  onReset?: () => void;
  // Form组件的其他属性
  formProps?: Omit<
    React.ComponentProps<typeof Form>,
    "onSubmit" | "onReset" | "getFormApi"
  >;
  // 栅格列数，默认为4
  columns?: number;
  // 是否显示搜索按钮，默认为true
  showSearchButton?: boolean;
  // 是否显示重置按钮，默认为true
  showResetButton?: boolean;
  // 初始值
  initialValues?: Record<string, any>;
}

/**
 * 动态搜索表单组件
 */
export function SearchForm<T>({
  fields,
  onSearch,
  onReset,
  formProps = {},
  columns = 4,
  showSearchButton = true,
  showResetButton = true,
  initialValues,
}: DynamicSearchFormProps<T>) {
  const [formApi, setFormApi] = useState<FormApi | null>(null);
  //   const [formValues, setFormValues] = useState<Record<string, any>>(
  //     initialValues || {}
  //   );

  // 当初始值变化时更新表单
  useEffect(() => {
    if (initialValues && formApi) {
      formApi.setValues(initialValues);
    }
  }, [initialValues, formApi]);

  const renderField = (fieldConfig: SearchFieldConfig, formApi: FormApi) => {
    // 解构出由 DynamicSearchForm 管理的基础属性
    const { field, label, type, span, rules, ...restProps } = fieldConfig;

    // 所有字段类型共享的属性
    const commonProps = {
      field,
      label,
      rules,
    };

    switch (type) {
      case "input":
        // const inputConfig = fieldConfig as InputFieldConfig;
        return <Form.Input {...commonProps} {...restProps} />;

      case "select":
        // 'options' 是 Select 特有的，需要单独处理
        const { options } = fieldConfig as SelectFieldConfig;
        return (
          <Form.Select {...commonProps} optionList={options} {...restProps} />
        );

      case "date":
      case "dateRange":
        // const dateConfig = fieldConfig as DatePickerFieldConfig;
        return <Form.DatePicker {...commonProps} type={type} {...restProps} />;

      case "custom":
        // 自定义渲染函数
        const customConfig = fieldConfig as CustomFieldConfig;
        const { render } = customConfig;

        // 确保自定义渲染函数存在
        if (!render) {
          console.error("Custom field must provide a render function");
          return null;
        }

        // 传递完整的配置给自定义渲染函数
        const fullCustomConfig = customConfig;
        return render(formApi, fullCustomConfig);

      default:
        console.error(`Unsupported field type: ${type}`);
        return null;
    }
  };

  const handleSubmit = (values: T) => {
    // setFormValues(values);
    onSearch?.(values);
  };

  const handleReset = () => {
    // setFormValues({});
    onReset?.();
  };

  return (
    <Form
      onSubmit={(values) => handleSubmit(values as T)}
      onReset={handleReset}
      getFormApi={setFormApi}
      initValues={initialValues}
      {...formProps}
    >
      {({ formState, values, formApi }) => (
        <>
          <Row gutter={[16, 16]}>
            {fields.map((fieldConfig, index) => {
              // 计算每个字段占据的栅格宽度
              const fieldSpan = fieldConfig.span || 24 / columns;

              return (
                <Col span={fieldSpan} key={`${fieldConfig.field}-${index}`}>
                  {renderField(fieldConfig, formApi)}
                </Col>
              );
            })}
          </Row>

          {(showSearchButton || showResetButton) && (
            <Row type="flex" justify="end" style={{ marginTop: 16 }}>
              <Col>
                {showSearchButton && (
                  <Button
                    icon={<IconSearch />}
                    theme="solid"
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: 8 }}
                  >
                    搜索
                  </Button>
                )}
                {showResetButton && (
                  <Button icon={<IconRefresh />} htmlType="reset">
                    重置
                  </Button>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </Form>
  );
}
