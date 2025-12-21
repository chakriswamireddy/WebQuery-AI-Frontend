"use client";

import { useState, useEffect } from "react";
import { createTask, getTask } from "../lib/api";
 

export default function Home() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [status, setStatus] = useState(null);
  const [answer, setAnswer] = useState(null);

  async function submit() {
    setAnswer(null);
    const task = await createTask(url, question);
    setTaskId(task.id);
    setStatus(task.status);
  }

  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      const task = await getTask(taskId);
      setStatus(task.status);

      if (task.status === "completed") {
        setAnswer(task.answer);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId]);

  return (
<div className="min-h-screen bg-gray-50 flex items-start justify-center py-16">
  <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
    
    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
      SiteQuery
    </h1>

    <div className="space-y-4">
      <input
        placeholder="Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <textarea
        placeholder="Ask a question about the website"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <button
        onClick={submit}
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5
                   text-sm font-medium text-white hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </div>

    {status && (
      <p className="mt-6 text-sm text-gray-600">
        Status: <span className="font-medium text-gray-900">{status}</span>
      </p>
    )}

    {answer && (
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          Answer
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {answer}
        </p>
      </div>
    )}

  </div>
</div>

  );
}
