import apiClient from "./client";

export async function getRoutines(forDate) {
  const params = forDate ? { for_date: forDate } : {};
  const { data } = await apiClient.get("/routines", { params });
  return data;
}

export async function createRoutine(payload) {
  const { data } = await apiClient.post("/routines", payload);
  return data;
}

export async function updateRoutine(id, payload) {
  const { data } = await apiClient.patch(`/routines/${id}`, payload);
  return data;
}

export async function deleteRoutine(id) {
  await apiClient.delete(`/routines/${id}`);
}