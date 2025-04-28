import { createLazyFileRoute } from "@tanstack/react-router";
import { Card, Button, Table, Typography } from "@douyinfe/semi-ui";
import { useState } from "react";
import {
  menuApi,
  type MenuInfo,
  type MenuQuery,
  type MenuForm,
} from "@/api/system/menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MenuModal } from "./-components/MenuModal";
import { DelBtn, AddBtn, SearchForm } from "@/components";
import type { SearchFieldConfig } from "@/types/search-form";
import { IconFolder, IconFile, IconKey } from "@douyinfe/semi-icons";
import type { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";

function MenuPage() {
  const menuQueryKey = ["menuList"];
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<MenuInfo>();
  const [searchParams, setSearchParams] = useState<MenuQuery>({
    page: 1,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  // 获取菜单树形列表
  const { data: menuList, isLoading } = useQuery({
    queryKey: [menuQueryKey, searchParams],
    queryFn: () => menuApi.getTree().then((res) => res.data),
  });

  // 新增/修改菜单
  const saveMutation = useMutation({
    mutationFn: (values: MenuForm) => {
      return values.id ? menuApi.update(values) : menuApi.add(values);
    },
    onSuccess: () => {
      setModalVisible(false);
      setEditData(undefined);
      queryClient.invalidateQueries({ queryKey: [menuQueryKey] });
    },
  });

  // 处理搜索
  const onSearch = (values: MenuQuery) => {
    setSearchParams((prev) => ({
      ...prev,
      ...values,
    }));
  };

  // 处理重置
  const onReset = () => {
    setSearchParams({
      page: 1,
      pageSize: 10,
    });
  };

  // 搜索字段配置
  const searchFields: SearchFieldConfig[] = [
    {
      field: "name",
      label: "菜单名称",
      type: "input",
      placeholder: "请输入菜单名称",
      showClear: true,
    },
    {
      field: "path",
      label: "路由路径",
      type: "input",
      placeholder: "请输入路由路径",
      showClear: true,
    },
    {
      field: "status",
      label: "状态",
      type: "select",
      placeholder: "菜单状态",
      showClear: true,
      className: "w-full",
      options: [
        { label: "正常", value: 1 },
        { label: "停用", value: 0 },
      ],
    },
    {
      field: "type",
      label: "类型",
      type: "select",
      placeholder: "菜单类型",
      showClear: true,
      className: "w-full",
      options: [
        { label: "目录", value: 0 },
        { label: "菜单", value: 1 },
        { label: "按钮", value: 2 },
      ],
    },
  ];

  // 根据菜单类型获取对应的图标和样式
  const getMenuTypeIcon = (type: number) => {
    switch (type) {
      case 0:
        return <IconFolder size="large" style={{ color: "#0077FA" }} />; // 目录
      case 1:
        return <IconFile style={{ color: "#4CAF50" }} />; // 菜单
      case 2:
        return <IconKey size="small" style={{ color: "#9E9E9E" }} />; // 按钮
      default:
        return null;
    }
  };

  // 根据菜单类型获取对应的样式
  const getMenuTypeStyle = (type: number) => {
    switch (type) {
      case 0:
        return { fontWeight: 600 }; // 目录加粗
      case 1:
        return { fontWeight: 500 }; // 菜单稍微加粗
      case 2:
        return { fontWeight: 400 }; // 按钮正常
      default:
        return {};
    }
  };

  const columns: ColumnProps<MenuInfo>[] = [
    {
      width: 250,
      title: "菜单名称",
      ellipsis: true,
      dataIndex: "name",
      render: (text: string, record: MenuInfo) => (
        <div className="flex items-center gap-2">
          {getMenuTypeIcon(record.type)}
          <Typography.Text style={getMenuTypeStyle(record.type)}>
            {text}
          </Typography.Text>
        </div>
      ),
    },
    {
      width: 150,
      title: "路由路径",
      ellipsis: true,
      dataIndex: "path",
    },
    {
      width: 150,
      title: "组件路径",
      ellipsis: true,
      dataIndex: "component",
    },
    {
      width: 150,
      title: "权限标识",
      ellipsis: true,
      dataIndex: "permission",
    },
    {
      width: 80,
      title: "类型",
      dataIndex: "type",
      render: (type: number) => {
        const typeMap = {
          0: "目录",
          1: "菜单",
          2: "按钮",
        };
        return typeMap[type as keyof typeof typeMap] || "未知";
      },
    },
    {
      width: 80,
      title: "图标",
      dataIndex: "icon",
    },
    {
      width: 80,
      title: "排序",
      dataIndex: "orderNo",
    },
    {
      width: 80,
      title: "状态",
      dataIndex: "status",
      render: (text: number) => (text === 1 ? "正常" : "停用"),
    },
    {
      width: 120,
      title: "创建时间",
      dataIndex: "createdAt",
    },
    {
      title: "操作",
      dataIndex: "operate",
      fixed: "right",
      width: 200,
      render: (_: string, record: MenuInfo) => (
        <div className="flex gap-2">
          <Button
            theme="light"
            type="primary"
            size="small"
            onClick={() => {
              setEditData({
                ...record,
                createdAt: undefined,
                updatedAt: undefined,
              });
              setModalVisible(true);
            }}
          >
            修改
          </Button>
          <DelBtn
            icon={null}
            size="small"
            key={`del-${record.id}`}
            delApi={menuApi.delete}
            ids={String(record.id)}
            queryKey={[menuQueryKey]}
            confirmTitle={`删除菜单 ${record.name}?`}
            confirmContent="此操作不可撤销。"
          >
            删除
          </DelBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="semi-border-color">
        <SearchForm<MenuQuery>
          fields={searchFields}
          onSearch={onSearch}
          onReset={onReset}
          formProps={{
            className: "mb-10",
            labelPosition: "left",
          }}
        />

        <div className="mb-2 flex gap-2">
          <AddBtn
            onClick={() => {
              setEditData(undefined);
              setModalVisible(true);
            }}
          >
            新增
          </AddBtn>
        </div>

        <Table
          loading={isLoading}
          columns={columns}
          dataSource={menuList || []}
          pagination={false}
          rowKey="id"
          expandAllRows
          defaultExpandAllRows
          expandAllGroupRows
          bordered
          size="small"
          indentSize={24}
          childrenRecordName="children"
        />
      </Card>

      {/* 菜单编辑弹窗 */}
      <MenuModal
        visible={modalVisible}
        editData={editData}
        onCancel={() => {
          setModalVisible(false);
          setEditData(undefined);
        }}
        onOk={(values) => {
          saveMutation.mutate(values);
        }}
      />
    </div>
  );
}

export const Route = createLazyFileRoute("/_layout/system/menu/")({
  component: MenuPage,
});
