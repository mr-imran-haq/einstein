import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Brain } from "lucide-react";
import { getMemories, deleteMemory, clearMemories } from "../../api/memories";
import Card from "../../components/Card";

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: memories = [], isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: getMemories,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMemory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories"] }),
  });

  const clearMutation = useMutation({
    mutationFn: clearMemories,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories"] }),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-ink">Settings</h2>

      <Card
        title="AI Memory"
        icon={<Brain size={18} className="text-accent" />}
        action={
          memories.length > 0 && (
            <button
              onClick={() => clearMutation.mutate()}
              className="text-xs text-muted hover:text-red-600"
            >
              Clear all
            </button>
          )
        }
      >
        <p className="text-xs text-muted mb-4">
          Things Einstein has remembered about you from past conversations.
        </p>

        {isLoading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : memories.length === 0 ? (
          <p className="text-sm text-muted">
            No memories yet. Chat with the assistant to build some.
          </p>
        ) : (
          <ul className="space-y-2">
            {memories.map((mem) => (
              <li
                key={mem.id}
                className="flex items-start justify-between gap-3 text-sm border-b border-border last:border-0 pb-2 last:pb-0"
              >
                <div>
                  <span className="text-xs text-accent uppercase tracking-wide">
                    {mem.category}
                  </span>
                  <p className="text-ink">{mem.content}</p>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(mem.id)}
                  className="text-muted hover:text-red-600 shrink-0"
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