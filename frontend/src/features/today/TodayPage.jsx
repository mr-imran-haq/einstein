import { useQuery } from "@tanstack/react-query";
import { CalendarClock, CheckSquare, CalendarDays } from "lucide-react";
import { getRoutines } from "../../api/routine";
import { getTasks } from "../../api/tasks";
import { getEvents } from "../../api/events";
import { getLocalDateString } from "../../utils/date";
import Card from "../../components/Card";

export default function TodayPage() {
  const todayStr = getLocalDateString();

  const { data: routines = [] } = useQuery({
    queryKey: ["routines", todayStr],
    queryFn: () => getRoutines(todayStr),
  });

  const { data: tasks = [] } = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  const { data: events = [] } = useQuery({ queryKey: ["events"], queryFn: getEvents });

  const todayTasks = tasks.filter((t) => t.deadline === todayStr && !t.is_completed);
  const todayEvents = events.filter((e) => e.event_datetime.startsWith(todayStr));

  const statusColor = {
    done: "bg-accent/10 text-accent",
    in_progress: "bg-highlight/10 text-highlight",
    pending: "bg-black/5 text-muted",
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-ink">Today's Plan</h2>
      <p className="text-sm text-muted -mt-4">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>

      <Card title="Routine" icon={<CalendarClock size={18} className="text-accent" />}>
        {routines.length === 0 ? (
          <p className="text-sm text-muted">Nothing scheduled today.</p>
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

      <Card title="Tasks due today" icon={<CheckSquare size={18} className="text-accent" />}>
        {todayTasks.length === 0 ? (
          <p className="text-sm text-muted">No tasks due today.</p>
        ) : (
          <ul className="space-y-2">
            {todayTasks.map((task) => (
              <li key={task.id} className="text-sm text-ink flex items-center justify-between">
                <span>{task.title}</span>
                <span className="text-xs text-muted">{task.priority}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Events today" icon={<CalendarDays size={18} className="text-accent" />}>
        {todayEvents.length === 0 ? (
          <p className="text-sm text-muted">No events today.</p>
        ) : (
          <ul className="space-y-2">
            {todayEvents.map((event) => (
              <li key={event.id} className="text-sm text-ink">
                {event.event_datetime.split("T")[1]?.slice(0, 5)} — {event.title}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}