import apiClient from "./client";

export async function getTargets() {
  const { data } = await apiClient.get("/targets");
  return data;
}

export async function createTarget(payload) {
  const { data } = await apiClient.post("/targets", payload);
  return data;
}

export async function updateTarget(id, payload) {
  const { data } = await apiClient.patch(`/targets/${id}`, payload);
  return data;
}

export async function deleteTarget(id) {
  await apiClient.delete(`/targets/${id}`);
}