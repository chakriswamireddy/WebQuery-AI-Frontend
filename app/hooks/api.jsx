import { useMutation } from "@tanstack/react-query";
 
import { useQuery } from "@tanstack/react-query";
import { createTask, getTask } from "../lib/api";
import { queryClient } from "../clients/queryClient";
 

export function useCreateTask() {
    return useMutation({
        mutationFn: ({ url, question }) => createTask(url, question),
    });
}



export function useTask(taskId) {
 

  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
    enabled: !!taskId,
    refetchInterval: (q) => {
      const status = q.state.data?.status;
      return status === "completed" || status === "failed" ? false : 2000;
    },
  });

  function cancelPolling() {
    queryClient.cancelQueries({ queryKey: ["task", taskId] });
  }

  return {
    ...query,
    cancelPolling,
  };
}

