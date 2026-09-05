import apiClient from "./client";

export async function getCreations() {
  const { data } = await apiClient.get("/creations");
  return data;
}

export async function deleteCreation(id) {
  await apiClient.delete(`/creations/${id}`);
}