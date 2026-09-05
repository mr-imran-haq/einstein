import apiClient from "./client";

export async function getEvents() {
  const { data } = await apiClient.get("/events");
  return data;
}

export async function createEvent(payload) {
  const { data } = await apiClient.post("/events", payload);
  return data;
}

export async function deleteEvent(id) {
  await apiClient.delete(`/events/${id}`);
}