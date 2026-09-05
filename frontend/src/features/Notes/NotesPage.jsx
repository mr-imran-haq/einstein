import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { getNotes, createNote, updateNote, deleteNote } from "../../api/notes";
import Card from "../../components/Card";

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateNote(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!content.trim()) return;
    createMutation.mutate({ title: title || null, content });
    setTitle("");
    setContent("");
  }

  function startEdit(note) {
    setEditingId(note.id);
    setEditTitle(note.title || "");
    setEditContent(note.content);
  }

  function saveEdit(id) {
    updateMutation.mutate({ id, payload: { title: editTitle || null, content: editContent } });
    setEditingId(null);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-ink">Notes</h2>

      <Card>
        <form onSubmit={handleAdd} className="space-y-2">
          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <textarea
            placeholder="Write a note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent resize-none"
          />
          <button
            type="submit"
            className="bg-accent text-white rounded-md px-4 py-2 text-sm flex items-center gap-1"
          >
            <Plus size={16} /> Add note
          </button>
        </form>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted">Loading notes...</p>
      ) : notes.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No notes yet. Add one above.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id}>
              {editingId === note.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(note.id)}
                      className="text-accent flex items-center gap-1 text-sm"
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-muted flex items-center gap-1 text-sm"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    {note.title && <h3 className="font-medium text-ink mb-1">{note.title}</h3>}
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(note)} className="text-muted hover:text-accent">
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(note.id)}
                        className="text-muted hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-ink/80 whitespace-pre-wrap">{note.content}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}