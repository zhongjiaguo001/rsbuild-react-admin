import { Card, Table, Button, Pagination, Toast } from "@douyinfe/semi-ui";
import {
  useParams,
  useRouterState,
  useNavigate,
  createLazyFileRoute,
} from "@tanstack/react-router";
import { useState } from "react";
import { roleApi } from "@/api/system/role";
import { assignRoles } from "@/api/system/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function AuthRole() {
  const { search } = useRouterState().location;
  const params = new URLSearchParams(search);
  const roleIdsParam = params.get("roleIds");
  const roleIds = roleIdsParam ? roleIdsParam.split(",").map(Number) : [];
  const { id: userId } = useParams({
    from: "/_layout/system/user/auth-role/$id",
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(roleIds);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    total: 0,
  });
  // 获取角色列表
  const { data: roleData, isLoading } = useQuery({
    queryKey: ["roleList", pagination.currentPage, pagination.pageSize],
    queryFn: () =>
      roleApi
        .getList({
          page: pagination.currentPage,
          pageSize: pagination.pageSize,
        })
        .then((res) => {
          setPagination((prev) => ({
            ...prev,
            total: res.data.total,
          }));
          return res.data.list;
        }),
  });

  // 分配角色
  const assignRoleMutation = useMutation({
    mutationFn: (roleIds: number[]) => assignRoles(Number(userId), roleIds),
    onSuccess: () => {
      Toast.success("分配角色成功");
      queryClient.invalidateQueries({ queryKey: ["userRoles"] });
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
    },
    onError: () => {
      Toast.error("分配角色失败");
    },
  });

  // 处理分页变化
  const handlePageChange = (currentPage: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage,
    }));
  };

  // 处理每页条数变化
  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      currentPage: 1, // 重置到第一页
    }));
  };

  // 保存分配
  const handleSave = () => {
    assignRoleMutation.mutate(selectedRoleIds);
  };

  // 返回用户列表
  const handleReturn = () => navigate({ to: "/system/user" });

  // 表格列定义
  const columns = [
    {
      title: "角色名称",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "权限标识",
      dataIndex: "value",
      width: 200,
    },
    {
      title: "排序",
      dataIndex: "orderNo",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (status: number) => <span>{status === 1 ? "正常" : "停用"}</span>,
    },
    {
      title: "备注",
      dataIndex: "remark",
      width: 200,
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={`为用户 ID: ${userId} 分配角色`}
        headerExtraContent={
          <div className="flex gap-2">
            <Button
              theme="solid"
              type="primary"
              onClick={handleSave}
              loading={assignRoleMutation.isPending}
            >
              保存
            </Button>
            <Button onClick={handleReturn}>返回</Button>
          </div>
        }
      >
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={roleData || []}
          pagination={false}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedRoleIds,
            onChange: (values) => setSelectedRoleIds(values as number[]),
          }}
        />
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </Card>
    </div>
  );
}

export const Route = createLazyFileRoute("/_layout/system/user/auth-role/$id")({
  component: AuthRole,
});
