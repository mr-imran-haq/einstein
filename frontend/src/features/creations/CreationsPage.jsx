import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, ChevronDown, ChevronUp, FolderOpen } from "lucide-react";
import { getCreations, deleteCreation } from "../../api/creations";
import Card from "../../components/Card";

function formatTypeLabel(type) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function CreationsPage() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState(null);

  const { data: creations = [], isLoading } = useQuery({
    queryKey: ["creations"],
    queryFn: getCreations,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCreation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["creations"] }),
  });

  const grouped = creations.reduce((acc, item) => {
    (acc[item.type] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-ink flex items-center gap-2">
        <FolderOpen size={20} className="text-accent" /> My Creations
      </h2>

      {isLoading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : creations.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            Nothing saved yet. Ask the AI Assistant to create something and save it —
            e.g. "Make me a study plan and save it."
          </p>
        </Card>
      ) : (
        Object.entries(grouped).map(([type, items]) => (
          <Card key={type} title={formatTypeLabel(type)}>
            <ul className="space-y-2">
              {items.map((item) => {
                const isOpen = expandedId === item.id;
                return (
                  <li key={item.id} className="border-b border-border last:border-0 pb-2 last:pb-0">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedId(isOpen ? null : item.id)}
                    >
                      <span className="text-sm text-ink">{item.title}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMutation.mutate(item.id);
                          }}
                          className="text-muted hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                        {isOpen ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                      </div>
                    </div>
                    {isOpen && (
                      <p className="text-sm text-muted mt-2 whitespace-pre-wrap">
                        {item.content?.text || JSON.stringify(item.content, null, 2)}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        ))
      )}
    </div>
  );
}