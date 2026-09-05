import apiClient from "./client";

export async function getPreferences() {
  const { data } = await apiClient.get("/news/preferences");
  return data;
}

export async function addPreference(topic) {
  const { data } = await apiClient.post("/news/preferences", { topic });
  return data;
}

export async function deletePreference(id) {
  await apiClient.delete(`/news/preferences/${id}`);
}

export async function getArticles() {
  const { data } = await apiClient.get("/news/articles");
  return data;
}

export async function deleteArticle(id) {
  await apiClient.delete(`/news/articles/${id}`);
}