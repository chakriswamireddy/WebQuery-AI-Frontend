import { useMutation } from "@tanstack/react-query";
 
import { useQuery } from "@tanstack/react-query";
import { createTask, getTask } from "../lib/api";
import { queryClient } from "../clients/queryClient";
import { useEffect, useRef, useState } from "react";
 

export function useCreateTask() {
    return useMutation({
        mutationFn: ({ url, question }) => createTask(url, question),
    });
}



const MAX_WAIT_TIME = 2 * 60 * 1000; // 2 minutes

export function useTask(taskId) {
  const eventSourceRef = useRef(null);
  const timeoutRef = useRef(null);

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const eventSource = new EventSource(
      `${API_URL}/tasks/${taskId}/stream`
    );

    eventSourceRef.current = eventSource;
    setStatus("processing");

    // ⏱️ timeout guard
    timeoutRef.current = setTimeout(() => {
      setError(new Error("Task timed out"));
      setStatus("failed");
      eventSource.close();
    }, MAX_WAIT_TIME);

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        setData(payload);
        setStatus(payload.status);

        if (
          payload.status === "completed" ||
          payload.status === "failed"
        ) {
          clearTimeout(timeoutRef.current);
          eventSource.close();
        }
      } catch (err) {
        setError(err);
        clearTimeout(timeoutRef.current);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setError(new Error("Connection lost"));
      clearTimeout(timeoutRef.current);
      eventSource.close();
    };

    return () => {
      clearTimeout(timeoutRef.current);
      eventSource.close();
    };
  }, [taskId]);

  function stopListening() {
    clearTimeout(timeoutRef.current);
    eventSourceRef.current?.close();
  }

  return {
    data,
    status,
    error,
    stopListening,
    isProcessing: status === "processing",
    isCompleted: status === "completed",
    isFailed: status === "failed",
  };
}
