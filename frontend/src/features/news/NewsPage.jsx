import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Newspaper, Trash2 } from "lucide-react";
import { getPreferences, addPreference, deletePreference, getArticles, deleteArticle } from "../../api/news";
import Card from "../../components/Card";

export default function NewsPage() {
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState("");

  const { data: preferences = [] } = useQuery({
    queryKey: ["news-preferences"],
    queryFn: getPreferences,
  });

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["news-articles"],
    queryFn: getArticles,
  });

  const addMutation = useMutation({
    mutationFn: addPreference,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news-preferences"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePreference,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news-preferences"] }),
  });

  const deleteArticleMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news-articles"] }),
  });

  function handleAddTopic(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    addMutation.mutate(topic.trim());
    setTopic("");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-xl text-ink flex items-center gap-2">
        <Newspaper size={20} className="text-accent" /> News Feed
      </h2>

      <Card title="Your topics">
        <form onSubmit={handleAddTopic} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Add a topic (e.g. AI, Bangladesh)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="bg-accent text-white rounded-md px-3 py-2 text-sm">
            <Plus size={16} />
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {preferences.map((pref) => (
            <span
              key={pref.id}
              className="flex items-center gap-1 bg-black/5 text-xs text-ink rounded-full px-3 py-1"
            >
              {pref.topic}
              <button onClick={() => deleteMutation.mutate(pref.id)}>
                <X size={12} className="text-muted hover:text-red-600" />
              </button>
            </span>
          ))}
          {preferences.length === 0 && (
            <p className="text-xs text-muted">
              No topics yet. Add one above, or tell the AI Assistant "give me news about X".
            </p>
          )}
        </div>
      </Card>

      <Card title="Latest">
        {isLoading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : articles.length === 0 ? (
          <p className="text-sm text-muted">
            No articles yet. They'll appear here after the news automation runs (see n8n setup).
          </p>
        ) : (
          <ul className="space-y-4">
            {articles.map((article) => (
              <li key={article.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink font-medium hover:text-accent"
                  <a>
                    {article.title}
                  </a>
                  <button
                    onClick={() => deleteArticleMutation.mutate(article.id)}
                    className="text-muted hover:text-red-600 shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {article.summary && <p className="text-xs text-muted mt-1">{article.summary}</p>}
                <p className="text-xs text-muted mt-1">
                  {article.source} {article.topic ? `· ${article.topic}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}