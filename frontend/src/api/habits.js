import apiClient from "./client";

export async function getHabits() {
  const { data } = await apiClient.get("/habits");
  return data;
}

export async function createHabit(payload) {
  const { data } = await apiClient.post("/habits", payload);
  return data;
}

export async function checkInHabit(id) {
  const { data } = await apiClient.post(`/habits/${id}/check-in`);
  return data;
}

export async function deleteHabit(id) {
  await apiClient.delete(`/habits/${id}`);
}