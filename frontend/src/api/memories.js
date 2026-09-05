import apiClient from "./client";

export async function getMemories() {
  const { data } = await apiClient.get("/memories");
  return data;
}

export async function deleteMemory(id) {
  await apiClient.delete(`/memories/${id}`);
}

export async function clearMemories() {
  await apiClient.delete("/memories");
}