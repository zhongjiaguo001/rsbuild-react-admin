import { createLazyFileRoute } from "@tanstack/react-router";

import { Card, Button, Table, Switch, Modal, Form } from "@douyinfe/semi-ui";
import { useState } from "react";
import {
  listUser,
  addUser,
  updateUser,
  deleteUser,
  changeStatus,
  resetPassword,
  assignRoles,
  type UserInfo,
  type UserQuery,
  type UserForm,
} from "@/api/system/user";
import { AssignRoleModal } from "./-components/AssignRoleModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { UserModal } from "./-components/UserModal";
import { DelBtn, AddBtn, SearchForm } from "@/components";
import type { SearchFieldConfig } from "@/types/search-form";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";

export const Route = createLazyFileRoute("/_layout/system/user/")({
  component: UserPage,
});

function UserPage() {
  const navigate = useNavigate();
  const userQueryKey = "userList";
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editData, setEditData] = useState<UserInfo>();
  const [assignRoleVisible, setAssignRoleVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number>();
  const [searchParams, setSearchParams] = useState<UserQuery>({
    page: 1,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  // 获取用户列表
  const { data: userList, isLoading } = useQuery({
    queryKey: [userQueryKey, searchParams],
    queryFn: () => listUser(searchParams).then((res) => res.data),
  });

  // 新增/修改用户
  const saveMutation = useMutation({
    mutationFn: (values: UserForm) => {
      return values.id ? updateUser(values) : addUser(values);
    },
    onSuccess: () => {
      setModalVisible(false);
      setEditData(undefined);
      queryClient.invalidateQueries({ queryKey: [userQueryKey] });
    },
  });

  // 重置密码
  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      resetPassword(id, password),
  });

  // 分配角色
  const assignRoleMutation = useMutation({
    mutationFn: ({ id, roleIds }: { id: number; roleIds: number[] }) =>
      assignRoles(id, roleIds),
    onSuccess: () => {
      setAssignRoleVisible(false);
      setCurrentUserId(undefined);
      queryClient.invalidateQueries({ queryKey: [userQueryKey] });
    },
  });

  // 修改用户状态
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userQueryKey] });
    },
  });

  // 处理搜索
  const onSearch = (values: UserQuery) => {
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
      field: "username",
      label: "用户名称",
      type: "input",
      placeholder: "请输入用户名称",
      showClear: true,
    },
    {
      field: "phone",
      label: "手机号码",
      type: "input",
      placeholder: "请输入手机号码",
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

  const columns: ColumnProps<UserInfo>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
      align: "center",
    },
    {
      width: 120,
      title: "用户名称",
      ellipsis: true,
      dataIndex: "username",
    },
    {
      width: 120,
      ellipsis: true,
      title: "用户昵称",
      dataIndex: "nickname",
    },
    {
      width: 100,

      title: "部门",
      dataIndex: "department",
    },
    {
      width: 120,
      title: "手机号码",
      dataIndex: "phone",
    },
    {
      width: 80,
      title: "状态",
      dataIndex: "status",
      render: (text: string, record: UserInfo) => (
        <Switch
          checked={text === "0"}
          onChange={(status) => {
            Modal.confirm({
              centered: true,
              title: status ? "确认启用" : "确认停用",
              content: `是否确认${status ? "启用" : "停用"}${record.username}该用户？`,
              onOk: () => {
                changeStatusMutation.mutate({
                  id: record.id,
                  status: status ? "0" : "1",
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
      width: 320,
      render: (_: string, record: UserInfo) => (
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
            delApi={deleteUser}
            ids={String(record.id)}
            queryKey={[userQueryKey]}
            confirmTitle={`删除用户 ${record.username}?`}
            confirmContent="此操作不可撤销。"
          >
            删除
          </DelBtn>
          <Button
            theme="light"
            type="warning"
            size="small"
            onClick={() => {
              let newPassword = "";
              Modal.confirm({
                centered: true,
                title: "确认重置",
                content: (
                  <Form>
                    <Form.Input
                      field="password"
                      label="新密码"
                      type="password"
                      placeholder="请输入新密码"
                      onChange={(value) => (newPassword = value)}
                      rules={[{ required: true, message: "请输入新密码" }]}
                    />
                  </Form>
                ),
                onOk: () => {
                  if (!newPassword) {
                    return Promise.reject("请输入新密码");
                  }
                  resetPasswordMutation.mutate({
                    id: record.id,
                    password: newPassword,
                  });
                },
              });
            }}
          >
            重置密码
          </Button>
          <Button
            theme="light"
            type="tertiary"
            size="small"
            onClick={() => {
              const roleIds = record.roles?.map((item) => item.id) || [];
              navigate({
                to: `/system/user/auth-role/${record.id}?roleIds=${roleIds.join(",")}`,
              });
            }}
          >
            分配角色
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="semi-border-color">
        <SearchForm<UserQuery>
          fields={searchFields}
          onSearch={onSearch}
          onReset={onReset}
          formProps={{
            className: "mb-10",
            labelPosition: "left",
          }}
        />

        <div className="flex gap-2 mb-2">
          <AddBtn
            onClick={() => {
              setEditData(undefined);
              setModalVisible(true);
            }}
          />
          <DelBtn
            delApi={deleteUser}
            ids={selectedRowKeys.map(String)}
            queryKey={[userQueryKey]}
            onSuccess={() => {
              setSelectedRowKeys([]);
            }}
            confirmContent={`确定要删除选中的 ${selectedRowKeys.length} 项吗？`}
          />
        </div>
        <Table
          resizable
          rowKey="id"
          bordered
          columns={columns}
          dataSource={userList?.list}
          loading={isLoading}
          pagination={{
            total: userList?.total || 0,
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

        <UserModal
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

        <AssignRoleModal
          visible={assignRoleVisible}
          userId={currentUserId}
          onCancel={() => {
            setAssignRoleVisible(false);
            setCurrentUserId(undefined);
          }}
          onOk={(roleIds) => {
            if (currentUserId) {
              assignRoleMutation.mutate({
                id: currentUserId,
                roleIds,
              });
            }
          }}
        />
      </Card>
    </div>
  );
}
