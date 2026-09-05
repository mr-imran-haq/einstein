import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus } from "lucide-react";
import { getTargets, createTarget, updateTarget, deleteTarget } from "../../api/targets";
import Card from "../../components/Card";

export default function TargetsPage() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");

  const { data: targets = [], isLoading } = useQuery({
    queryKey: ["targets"],
    queryFn: getTargets,
  });

  const createMutation = useMutation({
    mutationFn: createTarget,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["targets"] }),
  });

  const progressMutation = useMutation({
    mutationFn: ({ id, progress_percent }) => updateTarget(id, { progress_percent }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["targets"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTarget,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["targets"] }),
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!subject.trim() || !name.trim()) return;
    createMutation.mutate({
      subject,
      name,
      deadline: deadline || null,
      progress_percent: 0,
    });
    setSubject("");
    setName("");
    setDeadline("");
  }

  const active = targets.filter((t) => t.status === "active");
  const completed = targets.filter((t) => t.status === "completed");

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-ink">Study Targets</h2>

      <Card>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            type="text"
            placeholder="Subject (e.g. Data Structures)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-border rounded-md px-3 py-2 text-sm w-40 outline-none focus:border-accent"
          />
          <input
            type="text"
            placeholder="Target (e.g. Finish chapter 4)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
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
          <p className="text-sm text-muted">Loading targets...</p>
        ) : active.length === 0 ? (
          <p className="text-sm text-muted">No active targets. Add one above.</p>
        ) : (
          <ul className="space-y-4">
            {active.map((target) => (
              <li key={target.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-sm text-ink font-medium">{target.name}</p>
                    <p className="text-xs text-muted">
                      {target.subject}
                      {target.deadline ? ` · due ${target.deadline}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMutation.mutate(target.id)}
                    className="text-muted hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={target.progress_percent}
                    onChange={(e) =>
                      progressMutation.mutate({
                        id: target.id,
                        progress_percent: Number(e.target.value),
                      })
                    }
                    className="flex-1 accent-accent"
                  />
                  <span className="text-xs text-muted w-10 text-right">
                    {target.progress_percent}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {completed.length > 0 && (
        <Card title="Completed">
          <ul className="space-y-2">
            {completed.map((target) => (
              <li key={target.id} className="flex items-center justify-between text-sm">
                <span className="text-muted line-through">
                  {target.name} ({target.subject})
                </span>
                <button
                  onClick={() => deleteMutation.mutate(target.id)}
                  className="text-muted hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}