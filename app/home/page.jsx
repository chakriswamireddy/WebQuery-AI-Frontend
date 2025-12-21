"use client";

import { useState, useEffect } from "react";
import { createTask, getTask } from "../lib/api";
// import { createTask, getTask } from "@/lib/api";

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
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>SiteQuery</h1>

      <input
        placeholder="Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Ask a question about the website"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={submit}>Submit</button>

      {status && <p>Status: {status}</p>}

      {answer && (
        <>
          <h3>Answer</h3>
          <p>{answer}</p>
        </>
      )}
    </div>
  );
}
