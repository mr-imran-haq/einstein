import { useQuery } from "@tanstack/react-query";
import { TrendingUp, CheckSquare, Target as TargetIcon, Flame } from "lucide-react";
import { getTasks } from "../../api/tasks";
import { getTargets } from "../../api/targets";
import { getHabits } from "../../api/habits";
import Card from "../../components/Card";

export default function ProgressPage() {
  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const { data: targets = [] } = useQuery({ queryKey: ["targets"], queryFn: getTargets });
  const { data: habits = [] } = useQuery({ queryKey: ["habits"], queryFn: getHabits });

  const completedTasks = tasks.filter((t) => t.is_completed).length;
  const taskCompletionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const activeTargets = targets.filter((t) => t.status === "active");
  const completedTargets = targets.filter((t) => t.status === "completed").length;
  const avgTargetProgress = activeTargets.length
    ? Math.round(activeTargets.reduce((sum, t) => sum + t.progress_percent, 0) / activeTargets.length)
    : 0;

  const longestStreak = habits.reduce((max, h) => Math.max(max, h.current_streak), 0);
  const totalStreakDays = habits.reduce((sum, h) => sum + h.current_streak, 0);

  const stats = [
    {
      label: "Task completion rate",
      value: `${taskCompletionRate}%`,
      sub: `${completedTasks} / ${tasks.length} tasks done`,
      icon: CheckSquare,
    },
    {
      label: "Active study targets",
      value: activeTargets.length,
      sub: `${completedTargets} completed overall`,
      icon: TargetIcon,
    },
    {
      label: "Avg. target progress",
      value: `${avgTargetProgress}%`,
      sub: "Across active subjects",
      icon: TrendingUp,
    },
    {
      label: "Longest habit streak",
      value: `${longestStreak} days`,
      sub: `${totalStreakDays} total streak-days`,
      icon: Flame,
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="font-display text-xl text-ink flex items-center gap-2">
        <TrendingUp size={20} className="text-accent" /> Progress
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <Icon size={18} className="text-accent mb-3" />
            <p className="text-sm text-muted">{label}</p>
            <p className="text-2xl font-display mt-1">{value}</p>
            <p className="text-xs text-muted mt-1">{sub}</p>
          </Card>
        ))}
      </div>

      <Card title="Study targets breakdown">
        {activeTargets.length === 0 ? (
          <p className="text-sm text-muted">No active targets yet.</p>
        ) : (
          <ul className="space-y-3">
            {activeTargets.map((t) => (
              <li key={t.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-ink">{t.subject} — {t.name}</span>
                  <span className="text-muted">{t.progress_percent}%</span>
                </div>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${t.progress_percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Habit streaks">
        {habits.length === 0 ? (
          <p className="text-sm text-muted">No habits tracked yet.</p>
        ) : (
          <ul className="space-y-2">
            {habits.map((h) => (
              <li key={h.id} className="flex items-center justify-between text-sm">
                <span className="text-ink">{h.name}</span>
                <span className="flex items-center gap-1 text-highlight">
                  <Flame size={14} /> {h.current_streak} days
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}