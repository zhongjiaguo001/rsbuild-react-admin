import { useState } from "react";
import { Card, Button, Table, Switch, Modal } from "@douyinfe/semi-ui";
import type { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";
import {
  roleApi,
  type RoleInfo,
  type RoleQuery,
  type RoleForm,
} from "@/api/system/role";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoleModal } from "./components/RoleModal";
import { format } from "date-fns";
import { DelBtn, AddBtn, SearchForm } from "@/components";
import type { SearchFieldConfig } from "@/types/search-form";

function RolePage() {
  const roleQueryKey = ["roleList"];
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<RoleInfo>();
  // 移除单独的分配菜单弹窗状态，直接在角色表单中处理菜单权限
  const [searchParams, setSearchParams] = useState<RoleQuery>({
    page: 1,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  // 获取角色列表
  const { data: roleList, isLoading } = useQuery({
    queryKey: [roleQueryKey, searchParams],
    queryFn: () => roleApi.getList(searchParams).then((res) => res.data),
  });

  // 新增/修改角色
  const saveMutation = useMutation({
    mutationFn: (values: RoleForm) => {
      return values.id ? roleApi.update(values) : roleApi.add(values);
    },
    onSuccess: () => {
      setModalVisible(false);
      setEditData(undefined);
      queryClient.invalidateQueries({ queryKey: [roleQueryKey] });
    },
  });

  // 菜单权限已集成到角色表单中，不再需要单独的分配菜单权限mutation

  // 修改用户状态
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      roleApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roleQueryKey] });
    },
  });

  // 处理搜索
  const onSearch = (values: RoleQuery) => {
    const { createdAt, ...rest } = values;
    const startTime = createdAt?.[0]
      ? format(new Date(createdAt[0]), "yyyy-MM-dd")
      : undefined;
    const endTime = createdAt?.[1]
      ? format(new Date(createdAt[1]), "yyyy-MM-dd")
      : undefined;
    setSearchParams((prev) => ({
      ...prev,
      ...rest,
      startTime,
      endTime,
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
      label: "角色名称",
      type: "input",
      placeholder: "请输入角色名称",
      showClear: true,
    },
    {
      field: "value",
      label: "权限标识",
      type: "input",
      placeholder: "请输入权限标识",
      showClear: true,
    },
    {
      field: "status",
      label: "状态",
      type: "select",
      placeholder: "用户状态",
      showClear: true,
      className: "w-full",
      options: [
        { label: "正常", value: 1 },
        { label: "停用", value: 0 },
      ],
    },
    {
      field: "createdAt",
      label: "创建时间",
      type: "dateRange",
      showClear: true,
      format: "yyyy-MM-dd",
      defaultValue: ["2012-01-01", "2025-01-01"],
    },
  ];

  const columns: ColumnProps<RoleInfo>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      align: "center",
    },
    {
      width: 120,
      title: "角色名称",
      ellipsis: true,
      dataIndex: "name",
    },
    {
      width: 200,
      title: "权限字符",
      ellipsis: true,
      dataIndex: "value",
    },
    {
      width: 60,
      title: "显示顺序",
      ellipsis: true,
      dataIndex: "orderNo",
    },
    {
      width: 80,
      title: "状态",
      dataIndex: "status",
      render: (text: boolean, record: RoleInfo) => (
        <Switch
          checked={text}
          onChange={(status) => {
            Modal.confirm({
              centered: true,
              title: status ? "确认启用" : "确认停用",
              content: `是否确认${status ? "启用" : "停用"}${record.name}该角色？`,
              onOk: () => {
                changeStatusMutation.mutate({
                  id: record.id,
                  status: status ? 1 : 0,
                });
              },
            });
          }}
        />
      ),
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
      width: 300,
      render: (_: string, record: RoleInfo) => (
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
          {/* 菜单权限已集成到角色表单中，不再需要单独的分配菜单按钮 */}
          <DelBtn
            icon={null}
            size="small"
            key={`del-${record.id}`}
            delApi={roleApi.delete}
            ids={String(record.id)}
            queryKey={[roleQueryKey]}
            confirmTitle={`删除角色 ${record.name}?`}
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
        <SearchForm<RoleQuery>
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
          />
          <DelBtn
            delApi={roleApi.delete}
            ids={selectedRowKeys.map(String)}
            queryKey={[roleQueryKey]}
            onSuccess={() => {
              setSelectedRowKeys([]);
              console.log("批量删除成功，已清空选择");
            }}
            confirmContent={`确定要删除选中的 ${selectedRowKeys.length} 项吗？`}
          />
        </div>
        <Table
          resizable
          rowKey="id"
          bordered
          columns={columns}
          dataSource={roleList?.list}
          loading={isLoading}
          pagination={{
            total: roleList?.total || 0,
            currentPage: searchParams.page,
            pageSize: searchParams.pageSize,
            showSizeChanger: true,
            showTotal: true,
            onChange: (page, pageSize) => {
              setSearchParams((prev) => ({ ...prev, page, pageSize }));
            },
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys) =>
              setSelectedRowKeys(selectedKeys as number[]),
          }}
        />

        <RoleModal
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
      </Card>
    </div>
  );
}

export default RolePage;
