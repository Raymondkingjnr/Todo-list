import customFetch from "./utiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
export const useFetchTasks = () => {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const { data } = await customFetch.get("/");
      return data;
    },
  });

  return { isLoading, isError, data };
};

// //////////////////////////

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const { mutate: createTask, isLoading } = useMutation({
    mutationFn: (taskTitle) => customFetch.post("/", { title: taskTitle }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
      toast.success("task added");
    },
    onError: (error) => {
      toast.error(error.response.data.msg);
    },
  });
  return { createTask, isLoading };
};

export const useEditTask = () => {
  const queryClient = useQueryClient();

  const { mutate: editTask } = useMutation({
    mutationFn: ({ taskId, isDone }) => {
      return customFetch.patch(`/${taskId}`, { isDone });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });

  return { editTask };
};

////////////// Functionality for deleting item.

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteTask, isLoading: deleteTaskLoading } = useMutation({
    mutationFn: ({ taskId }) => {
      return customFetch.delete(`/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
  });
  return { deleteTask, deleteTaskLoading };
};
