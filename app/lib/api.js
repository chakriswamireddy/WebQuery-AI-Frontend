const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTask(url, question) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, question }),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function getTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`);
  if (!res.ok) throw new Error("Failed to fetch task");
  return res.json();
}
