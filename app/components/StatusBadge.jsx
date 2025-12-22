
import React from 'react'

 


 export default function StatusBadge({ status }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset";

  const variants = {
    pending:
      "bg-gray-50 text-gray-700 ring-gray-200",
    processing:
      "bg-blue-50 text-blue-700 ring-blue-200",
    completed:
      "bg-green-50 text-green-700 ring-green-200",
    failed:
      "bg-red-50 text-red-700 ring-red-200",
  };

  return (
    <span className={`${base} ${variants[status] || variants.pending}`}>
      {status}
    </span>
  );
}
