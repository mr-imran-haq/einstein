import apiClient from "./client";

export async function getNotes() {
  const { data } = await apiClient.get("/notes");
  return data;
}

export async function createNote(payload) {
  const { data } = await apiClient.post("/notes", payload);
  return data;
}

export async function updateNote(id, payload) {
  const { data } = await apiClient.patch(`/notes/${id}`, payload);
  return data;
}

export async function deleteNote(id) {
  await apiClient.delete(`/notes/${id}`);
}