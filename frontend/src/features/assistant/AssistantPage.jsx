import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { sendChatMessage } from "../../api/assistant";

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I'm Einstein. Ask me to create a routine, task, or target." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <h2 className="font-display text-xl text-ink mb-4 flex items-center gap-2">
        <Sparkles size={20} className="text-accent" /> AI Assistant
      </h2>

      <div className="flex-1 overflow-y-auto bg-surface border border-border rounded-lg p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] text-sm px-3 py-2 rounded-lg ${
              msg.role === "user"
                ? "bg-accent text-white ml-auto"
                : "bg-black/5 text-ink"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[80%] text-sm px-3 py-2 rounded-lg bg-black/5 text-muted">
            Thinking...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Create a task to finish my assignment by Friday"
          className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-white rounded-md px-4 py-2 disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}