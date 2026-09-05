import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus } from "lucide-react";
import { getTasks, createTask, updateTask, deleteTask } from "../../api/tasks";
import Card from "../../components/Card";

export default function TodoPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_completed }) => updateTask(id, { is_completed }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate({
      title,
      priority,
      deadline: deadline || null,
    });
    setTitle("");
    setDeadline("");
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-xl text-ink mb-4">To-Do List</h2>

      <Card>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-border rounded-md px-2 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border border-border rounded-md px-2 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded-md px-4 py-2 text-sm flex items-center gap-1 justify-center"
          >
            <Plus size={16} /> Add
          </button>
        </form>

        {isLoading ? (
          <p className="text-sm text-muted">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted">No tasks yet. Add one above.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-3 text-sm border-b border-border last:border-0 pb-2 last:pb-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.is_completed}
                    onChange={() =>
                      toggleMutation.mutate({ id: task.id, is_completed: !task.is_completed })
                    }
                    className="accent-accent"
                  />
                  <div>
                    <p className={task.is_completed ? "line-through text-muted" : "text-ink"}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted">
                      {task.priority}
                      {task.deadline ? ` · due ${task.deadline}` : ""}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(task.id)}
                  className="text-muted hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}