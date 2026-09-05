import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { logFocusSession, getTodayFocusMinutes } from "../../api/focus";
import Card from "../../components/Card";

const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;

export default function FocusPage() {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState("focus"); // "focus" | "break"
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const { data: todayMinutes = 0 } = useQuery({
    queryKey: ["focus-today"],
    queryFn: getTodayFocusMinutes,
  });

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  async function handleSessionComplete() {
    clearInterval(intervalRef.current);
    setIsRunning(false);

    if (mode === "focus") {
      await logFocusSession(25);
      queryClient.invalidateQueries({ queryKey: ["focus-today"] });
      setMode("break");
      setSecondsLeft(BREAK_SECONDS);
    } else {
      setMode("focus");
      setSecondsLeft(FOCUS_SECONDS);
    }
  }

  function reset() {
    setIsRunning(false);
    setMode("focus");
    setSecondsLeft(FOCUS_SECONDS);
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="font-display text-xl text-ink flex items-center gap-2">
        <Timer size={20} className="text-accent" /> Focus Timer
      </h2>

      <Card>
        <div className="text-center py-8">
          <p className="text-sm text-muted mb-2 uppercase tracking-wide">
            {mode === "focus" ? "Focus session" : "Break"}
          </p>
          <p className="font-display text-6xl text-ink mb-6">
            {minutes}:{seconds}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsRunning((prev) => !prev)}
              className="bg-accent text-white rounded-full w-14 h-14 flex items-center justify-center"
            >
              {isRunning ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button
              onClick={reset}
              className="bg-black/5 text-ink rounded-full w-14 h-14 flex items-center justify-center"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-muted text-center">
          Focused today: <span className="text-ink font-medium">{todayMinutes} minutes</span>
        </p>
      </Card>
    </div>
  );
}