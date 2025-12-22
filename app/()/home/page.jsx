"use client";

import AnswerSheet from "@/app/components/QAnswerSheet";
import StatusBadge from "@/app/components/StatusBadge";
import { useCreateTask, useTask } from "@/app/hooks/api";
import { isValidUrl } from "@/app/lib/validUrl";
import { Bot } from "lucide-react";
import { useState, useEffect } from "react";


import { toast } from "sonner";


export default function Home() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [taskId, setTaskId] = useState(null);

  const { data: task, cancelPolling } = useTask(taskId);
  const { mutate: createTask } = useCreateTask();


  const status = task?.status;
  const answer = task?.answer;



  function clearInputs() {
    setUrl('');
    setQuestion('');
  }

  function submit() {

    if (!(question && question.length > 10 && url && isValidUrl(url))) {
      toast.warning("Enter Proper Question and URL  ");
      return;
    }
    createTask(
      { url, question },
      {
        onSuccess: (data) => {
          setTaskId(data.id);
          toast.success("Task Created Successfully");
          // clearInputs();
        },
      },
      {
        onerror: (err) => {

          toast.warning("Failed to Create Task \n", err);

        },
      }
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-16">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

        <h1 className="text-3xl font-semibold text-green-800 mb-6">
          WebQuery AI
        </h1>

        <div className="space-y-4 mb-4">
          <input
            placeholder="Website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900
                   focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />

          <textarea
            placeholder="Ask a question about the website"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900
                   focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />

          <button
            onClick={submit}
            disabled={status === "processing"}

            className="inline-flex items-center gap-2 justify-center rounded-lg bg-green-600 px-5 py-2.5
                   text-sm font-medium text-white hover:bg-green-700
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Ask AI
            <Bot className="size-5 " />
          </button>
        </div>

        {status && (
          <StatusBadge status={status} />
        )}

        {taskId && (
          <AnswerSheet
            status={status}
            answer={answer}
            onCancel={cancelPolling}
            clearInputs={( ) => {clearInputs(); setTaskId(null);}}
          />
        )}


      </div>
    </div>

  );
}
