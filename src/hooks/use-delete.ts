// hooks/use-delete.ts
import { Modal, Toast } from "@douyinfe/semi-ui";
import {
  useMutation,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { queryClient } from "@/utils/query/queryClient"; // Assuming this path is correct

// Define the type for the function that performs the deletion
type DeleteFunction<TVariables = string | string[]> = (
  variables: TVariables
) => Promise<any>;

// Define options specific to this hook, extending standard react-query options
interface UseDeleteMutationOptions<
  TData = unknown, // Type of data returned by deleteFn on success
  TError = Error, // Type of error thrown by deleteFn
  TVariables = string | string[], // Type of variables passed to deleteFn (e.g., ids)
> extends Omit<
    UseMutationOptions<TData, TError, TVariables>,
    "mutationFn" // Exclude mutationFn as it's passed as the first argument
  > {
  // Custom options for this hook
  successMsg?: string | ((data: TData, variables: TVariables) => string);
  errorMsg?: string | ((error: TError, variables: TVariables) => string);
  // Include queryKey for automatic invalidation (optional, can be done in component too)
  queryKeyToInvalidate?: QueryKey;
}

/**
 * Generic hook for delete operations using TanStack Query.
 * Handles mutation state, success/error toasts, and optional cache invalidation.
 *
 * @param deleteFn The async function that performs the deletion API call.
 * @param options Configuration options for the mutation and custom messages/invalidation.
 * @returns The mutation object from TanStack Query.
 */
export const useDeleteMutation = <
  TData = unknown,
  TError = Error,
  TVariables = string | string[],
>(
  deleteFn: DeleteFunction<TVariables>,
  options?: UseDeleteMutationOptions<TData, TError, TVariables>
) => {
  const {
    successMsg = "删除成功",
    errorMsg = "删除失败",
    queryKeyToInvalidate,
    onSuccess: originalOnSuccess,
    onError: originalOnError,
    ...restMutationOptions // Pass remaining standard useMutation options
  } = options || {};

  return useMutation<TData, TError, TVariables>({
    // The core mutation function
    mutationFn: (variables: TVariables) => deleteFn(variables),

    // Side effect on success
    onSuccess: (data, variables, context) => {
      // Show success toast
      const finalSuccessMsg =
        typeof successMsg === "function"
          ? successMsg(data, variables)
          : successMsg;
      Toast.success(finalSuccessMsg);

      // Invalidate cache if queryKey is provided
      if (queryKeyToInvalidate) {
        queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
      }

      // Call the original onSuccess callback passed in options
      originalOnSuccess?.(data, variables, context);
    },

    // Side effect on error
    onError: (error, variables, context) => {
      // Show error toast
      const finalErrorMsg =
        typeof errorMsg === "function" ? errorMsg(error, variables) : errorMsg;
      // You might want to extract more specific error details from 'error' object
      const displayError = `${finalErrorMsg}${
        error instanceof Error ? `: ${error.message}` : ""
      }`;
      Toast.error(displayError);

      // Call the original onError callback passed in options
      originalOnError?.(error, variables, context);
    },

    // Spread the rest of the standard mutation options
    ...restMutationOptions,
  });
};
