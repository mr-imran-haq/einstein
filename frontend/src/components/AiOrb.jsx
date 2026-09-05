import { useRef, useState } from "react";
import { Sparkles, Mic, Loader2, Volume2 } from "lucide-react";
import { sendVoiceMessage } from "../api/assistant";

// idle -> listening -> processing -> speaking -> idle
export default function AiOrb() {
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function startListening() {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processVoice(audioBlob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setStatus("listening");
    } catch {
      setErrorMsg("Microphone access denied.");
    }
  }

  function stopListening() {
    mediaRecorderRef.current?.stop();
    setStatus("processing");
  }

  async function processVoice(audioBlob) {
    try {
      const responseBlob = await sendVoiceMessage(audioBlob);
      const audioUrl = URL.createObjectURL(responseBlob);
      const audio = new Audio(audioUrl);

      setStatus("speaking");
      audio.onended = () => setStatus("idle");
      audio.play();
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  function handleClick() {
    if (status === "idle") {
      startListening();
    } else if (status === "listening") {
      stopListening();
    }
  }

  const statusLabel = {
    idle: null,
    listening: "Listening...",
    processing: "Thinking...",
    speaking: "Speaking...",
  }[status];

  const orbColor = {
    idle: "bg-accent",
    listening: "bg-highlight",
    processing: "bg-highlight",
    speaking: "bg-accent",
  }[status];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
      {(statusLabel || errorMsg) && (
        <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs text-muted shadow-sm">
          {errorMsg || statusLabel}
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={status === "processing" || status === "speaking"}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-colors ${orbColor} disabled:opacity-80`}
        aria-label="Talk to Einstein"
      >
        {status === "listening" && (
          <span className="absolute inset-0 rounded-full bg-highlight animate-ping opacity-40" />
        )}

        {status === "idle" && <Sparkles size={22} className="text-white relative" />}
        {status === "listening" && <Mic size={22} className="text-white relative" />}
        {status === "processing" && <Loader2 size={22} className="text-white relative animate-spin" />}
        {status === "speaking" && <Volume2 size={22} className="text-white relative" />}
      </button>
    </div>
  );
}