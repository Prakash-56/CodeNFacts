"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Pencil,
  Search,
  Clock,
  User,
  Calendar,
  Trash2,
  Edit3,
  X,
  Image as ImageIcon,
  BookOpen,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";

// ---------- Types ----------
interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string; // in real app this would come from auth
  publishedAt: string; // ISO string
  image: string | null;
  category: string;
  readingTime: number;
}

// ---------- Constants ----------
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80";

const CATEGORIES = [
  "All",
  "Technology",
  "Design",
  "Lifestyle",
  "Business",
  "Tutorial",
  "Opinion",
];

const CURRENT_USER = {
  id: "user-1",
  name: "You",
};

// ---------- Helper functions ----------
function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function createExcerpt(text: string, maxLength = 140): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function canEditOrDelete(publishedAt: string): boolean {
  const published = new Date(publishedAt).getTime();
  const now = Date.now();
  return now - published < 24 * 60 * 60 * 1000; // 24 hours
}

// ---------- Initial seed blogs (team blogs) ----------
const SEED_BLOGS: Blog[] = [
  {
    id: "seed-1",
    title: "Welcome to Our Community Blog",
    content:
      "This is the official space where our team and community members share knowledge, stories, and ideas. Feel free to write your own posts — everyone can read them here.",
    excerpt: "This is the official space where our team and community members share knowledge...",
    author: "Team",
    authorId: "team",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    image: null,
    category: "Lifestyle",
    readingTime: 2,
  },
  {
    id: "seed-2",
    title: "How We Built Dark Mode Support",
    content:
      "Supporting both light and dark themes is no longer optional. In this post we walk through the CSS variables, Tailwind config, and the small UX details that make the experience feel native.",
    excerpt: "Supporting both light and dark themes is no longer optional...",
    author: "Engineering",
    authorId: "team",
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    category: "Technology",
    readingTime: 4,
  },
];

// ---------- Component ----------
export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Modal states
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("Technology");
  const [formImage, setFormImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // ---------- Load from localStorage ----------
  useEffect(() => {
    const saved = localStorage.getItem("community-blogs");
    if (saved) {
      try {
        setBlogs(JSON.parse(saved));
      } catch {
        setBlogs(SEED_BLOGS);
      }
    } else {
      setBlogs(SEED_BLOGS);
    }
    setIsLoading(false);
  }, []);

  // ---------- Persist ----------
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("community-blogs", JSON.stringify(blogs));
    }
  }, [blogs, isLoading]);

  // ---------- Toast helper ----------
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3200);
  };

  // ---------- Filtered & sorted blogs ----------
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.content.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    result.sort((a, b) => {
      const timeA = new Date(a.publishedAt).getTime();
      const timeB = new Date(b.publishedAt).getTime();
      return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [blogs, searchQuery, selectedCategory, sortOrder]);

  // ---------- Image upload handler ----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormImage(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  // ---------- Open write modal ----------
  const openWriteModal = () => {
    setEditingBlog(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("Technology");
    setFormImage(null);
    setImagePreview(null);
    setIsWriteOpen(true);
  };

  // ---------- Open edit modal ----------
  const openEditModal = (blog: Blog) => {
    if (!canEditOrDelete(blog.publishedAt)) {
      showToast("error", "You can only edit posts within 24 hours of publishing");
      return;
    }
    setEditingBlog(blog);
    setFormTitle(blog.title);
    setFormContent(blog.content);
    setFormCategory(blog.category);
    setFormImage(blog.image);
    setImagePreview(blog.image);
    setIsWriteOpen(true);
  };

  // ---------- Submit (create or update) ----------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formContent.trim()) {
      showToast("error", "Title and content are required");
      return;
    }

    if (editingBlog) {
      // Update
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === editingBlog.id
            ? {
                ...b,
                title: formTitle.trim(),
                content: formContent.trim(),
                excerpt: createExcerpt(formContent.trim()),
                category: formCategory,
                image: formImage,
                readingTime: calculateReadingTime(formContent),
              }
            : b
        )
      );
      showToast("success", "Blog updated successfully");
    } else {
      // Create
      const newBlog: Blog = {
        id: `blog-${Date.now()}`,
        title: formTitle.trim(),
        content: formContent.trim(),
        excerpt: createExcerpt(formContent.trim()),
        author: CURRENT_USER.name,
        authorId: CURRENT_USER.id,
        publishedAt: new Date().toISOString(),
        image: formImage,
        category: formCategory,
        readingTime: calculateReadingTime(formContent),
      };
      setBlogs((prev) => [newBlog, ...prev]);
      showToast("success", "Blog published! You can edit or delete it for 24 hours.");
    }

    setIsWriteOpen(false);
  };

  // ---------- Delete ----------
  const handleDelete = (id: string) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return;

    if (!canEditOrDelete(blog.publishedAt)) {
      showToast("error", "You can only delete posts within 24 hours of publishing");
      setDeleteConfirmId(null);
      return;
    }

    setBlogs((prev) => prev.filter((b) => b.id !== id));
    setDeleteConfirmId(null);
    showToast("success", "Blog deleted");
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Header section of the page */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                Community Blog
              </h1>
              <p className="mt-1 text-zinc-500 dark:text-zinc-400 text-sm">
                Stories, tutorials & ideas from the team and the community
              </p>
            </div>

            <button
              onClick={openWriteModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Pencil className="w-4 h-4" />
              Write a blog
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search blogs by title, content or author…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer min-w-[160px]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>

        {/* Blog grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No blogs found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              {searchQuery || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Be the first to write something!"}
            </p>
            <button
              onClick={openWriteModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              <Pencil className="w-4 h-4" />
              Write the first blog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => {
              const isEditable = canEditOrDelete(blog.publishedAt);
              const isOwner = blog.authorId === CURRENT_USER.id;

              return (
                <article
                  key={blog.id}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Cover image */}
                  <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
  src={blog.image || DEFAULT_IMAGE}
  alt={blog.title}
  fill
  unoptimized          // ← add this
  className="object-cover"
/>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur text-zinc-700 dark:text-zinc-300">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-semibold leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {blog.title}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {blog.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {blog.readingTime} min
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatRelativeTime(blog.publishedAt)}
                      </span>
                    </div>

                    {/* Owner actions (only within 24h) */}
                    {isOwner && (
                      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                        <button
                          onClick={() => openEditModal(blog)}
                          disabled={!isEditable}
                          title={
                            isEditable
                              ? "Edit blog"
                              : "Editing only allowed within 24 hours"
                          }
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition ${
                            isEditable
                              ? "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                              : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed"
                          }`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(blog.id)}
                          disabled={!isEditable}
                          title={
                            isEditable
                              ? "Delete blog"
                              : "Deleting only allowed within 24 hours"
                          }
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition ${
                            isEditable
                              ? "bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/70 text-red-600 dark:text-red-400"
                              : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating pencil button (mobile friendly) */}
      <button
        onClick={openWriteModal}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 lg:hidden"
        aria-label="Write a blog"
      >
        <Pencil className="w-6 h-6" />
      </button>

      {/* ========== WRITE / EDIT MODAL ========== */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsWriteOpen(false)}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
              <h2 className="text-xl font-semibold">
                {editingBlog ? "Edit blog" : "Write a new blog"}
              </h2>
              <button
                onClick={() => setIsWriteOpen(false)}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Give your blog a clear title"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Content</label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write your thoughts here… Markdown is supported in a real editor."
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y min-h-[180px]"
                  required
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Cover image <span className="text-zinc-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 cursor-pointer transition bg-zinc-50 dark:bg-zinc-800">
                    <ImageIcon className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm">Choose image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormImage(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {imagePreview ? (
                  <div className="mt-3 relative h-40 rounded-xl overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-zinc-400">
                    No image selected → a default cover will be used automatically.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/20 transition"
                >
                  {editingBlog ? "Save changes" : "Publish blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== DELETE CONFIRMATION ========== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-950/50">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold">Delete this blog?</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  This action cannot be undone. The post will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== TOAST ========== */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-4">
          <div
            className={`flex items-center gap-2.5 px-5 py-3 rounded-full shadow-lg text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}