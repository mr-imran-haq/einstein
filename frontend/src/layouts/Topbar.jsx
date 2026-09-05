import { Bell } from "lucide-react";

export default function Topbar() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div>
        <h2 className="font-display text-2xl text-ink">Good morning</h2>
        <p className="text-muted text-sm mt-1">Let's make today count.</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right text-sm">
          <p className="text-ink">{today}</p>
          <p className="text-muted">{time}</p>
        </div>
        <button className="p-2 rounded-full hover:bg-black/5">
          <Bell size={20} className="text-ink/70" />
        </button>
      </div>
    </header>
  );
}