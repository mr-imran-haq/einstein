import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus } from "lucide-react";
import { getRoutines, createRoutine, updateRoutine, deleteRoutine } from "../../api/routine";
import Card from "../../components/Card";

import { getLocalDateString } from "../../utils/date";

const todayStr = getLocalDateString();

export default function RoutinePage() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState("");
  const [activity, setActivity] = useState("");
  const [category, setCategory] = useState("");

  const { data: routines = [], isLoading } = useQuery({
    queryKey: ["routines", date],
    queryFn: () => getRoutines(date),
  });

  const createMutation = useMutation({
    mutationFn: createRoutine,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateRoutine(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRoutine,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["routines"] }),
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!activity.trim() || !startTime) return;
    createMutation.mutate({
      date,
      start_time: startTime,
      activity,
      category: category || null,
    });
    setActivity("");
    setStartTime("");
    setCategory("");
  }

  const statusColor = {
    done: "bg-accent/10 text-accent",
    in_progress: "bg-highlight/10 text-highlight",
    pending: "bg-black/5 text-muted",
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-ink">Routine</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-border rounded-md px-2 py-1 text-sm"
        />
      </div>

      <Card>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-border rounded-md px-2 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Activity (e.g. Study session)"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm w-32"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded-md px-4 py-2 text-sm flex items-center gap-1 justify-center"
          >
            <Plus size={16} /> Add
          </button>
        </form>

        {isLoading ? (
          <p className="text-sm text-muted">Loading routine...</p>
        ) : routines.length === 0 ? (
          <p className="text-sm text-muted">No routine items for this date.</p>
        ) : (
          <ul className="space-y-2">
            {routines.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 text-sm border-b border-border last:border-0 pb-2 last:pb-0"
              >
                <div>
                  <span className="text-muted w-16 inline-block">{item.start_time}</span>
                  <span className="text-ink">{item.activity}</span>
                  {item.category && (
                    <span className="text-xs text-muted ml-2">({item.category})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      statusMutation.mutate({ id: item.id, status: e.target.value })
                    }
                    className={`text-xs rounded-full px-2 py-1 border-0 ${statusColor[item.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="text-muted hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}