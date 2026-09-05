import apiClient from "./client";

export async function sendChatMessage(message) {
  const { data } = await apiClient.post("/assistant/chat", { message });
  return data.reply;
}

export async function sendVoiceMessage(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await apiClient.post("/assistant/voice", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: "blob",
  });

  return response.data; // audio blob (wav)
}