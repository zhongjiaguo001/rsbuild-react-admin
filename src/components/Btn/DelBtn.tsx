import React from "react";
import { Button, Modal } from "@douyinfe/semi-ui";
import { useDeleteMutation } from "@/hooks/use-delete";
import type { QueryKey } from "@tanstack/react-query";
import type { ButtonProps } from "@douyinfe/semi-ui/lib/es/button/";
import { IconDelete } from "@douyinfe/semi-icons";

interface DelBtnProps extends Omit<ButtonProps, "onClick"> {
  delApi: (ids: string) => Promise<any>;
  queryKey: QueryKey;
  ids: string | string[];
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onSuccess?: () => void;
  confirm?: boolean;
  confirmTitle?: string;
  confirmContent?: string;
  successMsg?: string;
  errorMsg?: string;
  loadingText?: React.ReactNode;
}

export function DelBtn({
  ids,
  queryKey,
  delApi,
  onSuccess,
  children = "删除",
  icon = <IconDelete />,
  type = "danger",
  theme = "light",
  confirm = true,
  confirmTitle = "确认删除",
  confirmContent = "确定要删除选中的数据吗？",
  successMsg, // Pass custom messages to the hook
  errorMsg,
  loadingText,
  disabled: externalDisabled, // Rename incoming disabled prop
  ...rest
}: DelBtnProps) {
  const deleteMutation = useDeleteMutation(delApi, {
    queryKeyToInvalidate: queryKey, // Use the hook's invalidation feature
    onSuccess: () => onSuccess?.(),
    ...(successMsg && { successMsg }),
    ...(errorMsg && { errorMsg }),
  });

  const hasValidIds = ids && (Array.isArray(ids) ? ids.length > 0 : true);

  const handleClick = () => {
    if (!hasValidIds) {
      console.warn("DelBtn clicked with no valid IDs.");
      return;
    }

    if (confirm) {
      Modal.confirm({
        centered: true,
        title: confirmTitle,
        content: confirmContent,
        onOk: () => {
          // Pass ids when calling mutate
          deleteMutation.mutate(Array.isArray(ids) ? ids.join(",") : ids);
        },
        onCancel: () => {},
      });
    } else {
      deleteMutation.mutate(Array.isArray(ids) ? ids.join(",") : ids);
    }
  };

  const isLoading = deleteMutation.isPending;
  const isDisabled = !hasValidIds || isLoading || externalDisabled;

  return (
    <Button
      onClick={handleClick}
      type={type}
      theme={theme}
      icon={isLoading && loadingText ? undefined : icon}
      loading={isLoading}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
}
