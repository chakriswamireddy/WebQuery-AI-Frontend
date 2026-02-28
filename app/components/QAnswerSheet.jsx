
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import TimerCircle from "./shared/TimingCircle";
import { X } from "lucide-react";

export default function AnswerSheet({ status, answer, onCancel, clearInputs }) {
  const [seconds, setSeconds] = useState(0);

   // reset timer when a new task starts
  useEffect(() => {
    if (status === "processing") {
      setSeconds(0);
    }
  }, [status]);

  useEffect(() => {
    if (status === "pending" || status === "processing") {
      const i = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(i);
    }
    else if (status == "completed" || status == "success") {
      toast.success("Your Question has been answered");

    }
  }, [status]);

 



  if (!status) return <></>

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Answer
        </h3>

        <div className="flex items-center gap-3">
          {(status === "pending" || status === "processing") ? (
            <>
              <TimerCircle seconds={seconds} />

              <button
                onClick={onCancel}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Cancel
              </button>
            </>
          )
            : (
              <div  className="flex italic items-end gap-2 ">
                <span className="text-xs text-gray-500">
                  Fetched in <span className="font-medium">{ seconds }s</span>
                </span>

                <button
                  onClick={ () => { onCancel(); clearInputs()}}
                  className="border rounded-full text-red-400  " >  <X className=" size-4 " /> </button>
              </div>
            )
          }
        </div>
      </div>
 
      <div className="p-4">
        {(status === "pending" || status === "processing") && (
          <p className="text-sm text-gray-500 italic animate-pulse">
            Generating answer<span className="tracking-widest">...</span>
          </p>
        )}

        {status === "completed" && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {answer}
          </p>
        )}

        {status === "failed" && (
          <p className="text-sm text-red-600">
            Failed to generate answer.
          </p>
        )}
      </div>
    </div>
  );
}
