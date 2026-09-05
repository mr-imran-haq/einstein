import apiClient from "./client";

export async function logFocusSession(durationMinutes) {
  await apiClient.post("/focus/sessions", { duration_minutes: durationMinutes });
}

export async function getTodayFocusMinutes() {
  const { data } = await apiClient.get("/focus/sessions/today");
  return data.total_minutes;
}