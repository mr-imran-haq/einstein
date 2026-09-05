import { useQuery } from "@tanstack/react-query";
import { Clock, Target as TargetIcon, CheckSquare, Star, CalendarClock, BookOpen } from "lucide-react";
import Card from "../../components/Card";
import { getRoutines } from "../../api/routine";
import { getTasks } from "../../api/tasks";
import { getTargets } from "../../api/targets";

import { getLocalDateString } from "../../utils/date";

const todayStr = getLocalDateString();

export default function Dashboard() {
  const { data: routines = [] } = useQuery({
    queryKey: ["routines", todayStr],
    queryFn: () => getRoutines(todayStr),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: targets = [] } = useQuery({
    queryKey: ["targets"],
    queryFn: getTargets,
  });

  const completedCount = tasks.filter((t) => t.is_completed).length;
  const activeTargets = targets.filter((t) => t.status === "active");

  const stats = [
    { label: "Today's routine items", value: routines.length, sub: "Scheduled today", icon: Clock },
    { label: "Tasks completed", value: `${completedCount} / ${tasks.length}`, sub: "Keep going", icon: CheckSquare },
    { label: "Focus score", value: "—", sub: "Coming in Phase 11", icon: Star },
    { label: "Active targets", value: activeTargets.length, sub: "In progress", icon: TargetIcon },
  ];

  const statusColor = {
    done: "bg-accent/10 text-accent",
    in_progress: "bg-highlight/10 text-highlight",
    pending: "bg-black/5 text-muted",
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <Icon size={18} className="text-accent mb-3" />
            <p className="text-sm text-muted">{label}</p>
            <p className="text-2xl font-display mt-1">{value}</p>
            <p className="text-xs text-muted mt-1">{sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Today's routine" icon={<CalendarClock size={18} className="text-accent" />}>
          {routines.length === 0 ? (
            <p className="text-sm text-muted">Nothing scheduled today yet.</p>
          ) : (
            <ul className="space-y-3">
              {routines.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted w-16 inline-block">{item.start_time}</span>
                    <span className="text-ink">{item.activity}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[item.status]}`}>
                    {item.status.replace("_", " ")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Study targets" icon={<BookOpen size={18} className="text-accent" />}>
          {activeTargets.length === 0 ? (
            <p className="text-sm text-muted">No active targets yet.</p>
          ) : (
            <ul className="space-y-4">
              {activeTargets.slice(0, 5).map((target) => (
                <li key={target.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink">{target.subject}</span>
                    <span className="text-muted">{target.progress_percent}%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${target.progress_percent}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="To-do list" icon={<CheckSquare size={18} className="text-accent" />}>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.slice(0, 5).map((task) => (
              <li key={task.id} className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={task.is_completed} readOnly className="accent-accent" />
                <span className={task.is_completed ? "line-through text-muted" : "text-ink"}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}