"use client";

import { useState, useEffect } from "react";
import { getLinkedInPosts, createLinkedInPost, deleteLinkedInPost } from "@/actions/linkedin";
import { Rss, PlusCircle, Trash2, Loader2, ExternalLink } from "lucide-react";

export default function LinkedInAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const result = await getLinkedInPosts();
      if (result.success && result.data) setPosts(result.data as any[]);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const result = await createLinkedInPost(embedUrl);
    if (!result.success) {
      setError(result.error);
    } else {
      setPosts([...posts, result.data]);
      setEmbedUrl("");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this post from the feed?")) return;
    const result = await deleteLinkedInPost(id);
    if (result.success) setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <main className="p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-surrey-blue">LinkedIn Feed</h1>
        <p className="text-text-muted mt-1">Manage the LinkedIn posts shown on the homepage feed.</p>
      </header>

      {/* Add Post Form */}
      <div className="bg-white p-8 rounded-2xl border border-surrey-grey/40 shadow-sm mb-10">
        <h2 className="text-lg font-bold text-surrey-blue mb-2 flex items-center gap-2">
          <PlusCircle size={20} className="text-surrey-gold" /> Add a Post
        </h2>
        <p className="text-sm text-text-muted mb-6">
          On LinkedIn, open the post → click <strong>···</strong> → <strong>Embed this post</strong> → copy the full embed code and paste it below.
        </p>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            placeholder='Paste the full embed code: <iframe src="https://www.linkedin.com/embed/..." ...>'
            className="flex-1 bg-surrey-light border border-surrey-grey/60 text-surrey-blue rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-surrey-gold/50 focus:border-surrey-gold transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-surrey-gold text-surrey-light px-6 py-2.5 rounded-lg font-bold hover:bg-surrey-gold/90 transition-colors flex items-center gap-2 disabled:opacity-70 whitespace-nowrap"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
            Add Post
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-2xl border border-surrey-grey/40 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-surrey-grey/30 bg-surrey-light flex items-center gap-2">
          <Rss size={18} className="text-[#0A66C2]" />
          <h3 className="font-bold text-surrey-blue">Current Feed Posts ({posts.length})</h3>
        </div>

        {isLoading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-text-muted">
            <Loader2 size={18} className="animate-spin" /> Loading...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-10 text-center text-text-muted italic">
            No posts added yet. Add one above to get started.
          </div>
        ) : (
          <ul className="divide-y divide-surrey-grey/20">
            {posts.map((post, i) => (
              <li key={post.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-surrey-light/50 transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-text-muted w-5 shrink-0">#{i + 1}</span>
                  <p className="text-sm text-surrey-blue truncate">{post.embedUrl}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={post.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-text-muted hover:text-surrey-blue hover:bg-surrey-grey/20 rounded-md transition-colors"
                    title="Preview"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
