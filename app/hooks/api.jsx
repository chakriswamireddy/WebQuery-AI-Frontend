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
  const eventSourceRef = useRef(null);

  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!taskId) return;

    const eventSource = new EventSource(
      `${API_URL}/tasks/${taskId}/stream`
    );

    eventSourceRef.current = eventSource;
    setStatus("loading");

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        setData(payload);
        setStatus(payload.status);

        if (
          payload.status === "completed" ||
          payload.status === "failed"
        ) {
          eventSource.close();
        }
      } catch (err) {
        setError(err);
        eventSource.close();
      }
    };

    eventSource.onerror = (err) => {
      setError(err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [taskId]);

  function stopListening() {
    eventSourceRef.current?.close();
  }

  return {
    data,
    status,
    error,
    isLoading: status === "loading" || status === "processing",
    isCompleted: status === "completed",
    isFailed: status === "failed",
    stopListening,
  };
}
