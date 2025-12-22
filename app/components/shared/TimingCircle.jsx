import React from 'react'

 

export default function TimerCircle({ seconds }) {
  const progress = Math.min(seconds / 30, 1) * 100;

  return (
    <div className="relative h-10 w-10">
      <svg className="h-10 w-10 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
          strokeDasharray="113"
          strokeDashoffset={113 - (113 * progress) / 100}
          strokeLinecap="round"
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
        {seconds}s
      </span>
    </div>
  );
}
