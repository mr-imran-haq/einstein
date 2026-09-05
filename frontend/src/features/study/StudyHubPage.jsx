import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, BookOpen } from "lucide-react";
import { getTargets, createTarget, updateTarget } from "../../api/targets";
import Card from "../../components/Card";

export default function StudyHubPage() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");

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

  function handleAdd(e) {
    e.preventDefault();
    if (!subject.trim() || !name.trim()) return;
    createMutation.mutate({ subject, name, progress_percent: 0 });
    setSubject("");
    setName("");
  }

  const grouped = targets.reduce((acc, t) => {
    (acc[t.subject] ??= []).push(t);
    return acc;
  }, {});

  const subjectStats = Object.entries(grouped).map(([subject, items]) => {
    const avg = Math.round(items.reduce((sum, i) => sum + i.progress_percent, 0) / items.length);
    return { subject, items, avg };
  });

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="font-display text-xl text-ink flex items-center gap-2">
        <BookOpen size={20} className="text-accent" /> Study Hub
      </h2>

      <Card>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-40 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            type="text"
            placeholder="Target (e.g. Finish chapter 3)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="bg-accent text-white rounded-md px-4 py-2 text-sm flex items-center gap-1">
            <Plus size={16} /> Add
          </button>
        </form>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : subjectStats.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No subjects yet. Add a target above to get started.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjectStats.map(({ subject, items, avg }) => (
            <Card key={subject} title={subject}>
              <p className="text-xs text-muted mb-3">Overall progress: {avg}%</p>
              <div className="h-1.5 bg-black/5 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-accent rounded-full" style={{ width: `${avg}%` }} />
              </div>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-ink">{item.name}</span>
                      <span className="text-muted">{item.progress_percent}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={item.progress_percent}
                      onChange={(e) =>
                        progressMutation.mutate({ id: item.id, progress_percent: Number(e.target.value) })
                      }
                      className="w-full accent-accent"
                    />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}