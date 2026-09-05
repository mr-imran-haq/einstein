import apiClient from "./client";

export async function getTasks() {
  const { data } = await apiClient.get("/tasks");
  return data;
}

export async function createTask(payload) {
  const { data } = await apiClient.post("/tasks", payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await apiClient.patch(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id) {
  await apiClient.delete(`/tasks/${id}`);
}