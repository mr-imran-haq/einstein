import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Flame, Check } from "lucide-react";
import { getHabits, createHabit, checkInHabit, deleteHabit } from "../../api/habits";
import Card from "../../components/Card";

export default function HabitsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data: habits = [], isLoading } = useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });

  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const checkInMutation = useMutation({
    mutationFn: checkInHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, frequency: "daily" });
    setName("");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-ink">Habits</h2>

      <Card>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="New habit (e.g. Read 20 pages)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded-md px-4 py-2 text-sm flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </form>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted">Loading habits...</p>
      ) : habits.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No habits yet. Add one above.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <Card key={habit.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink font-medium">{habit.name}</p>
                  <div className="flex items-center gap-1 text-xs text-highlight mt-1">
                    <Flame size={14} />
                    <span>{habit.current_streak} day streak</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => checkInMutation.mutate(habit.id)}
                    className="bg-accent/10 text-accent rounded-md px-3 py-1.5 text-xs flex items-center gap-1 hover:bg-accent/20"
                  >
                    <Check size={14} /> Done today
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(habit.id)}
                    className="text-muted hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}