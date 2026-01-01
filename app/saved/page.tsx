"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Bookmark, Trash2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface BookmarkItem {
    id: number;
    article_link: string;
    article_title: string;
    article_image: string | null;
    article_category: string | null;
    article_date: string | null;
    created_at: string;
}

export default function SavedArticlesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            fetchBookmarks();
        }
    }, [status, router]);

    async function fetchBookmarks() {
        try {
            setIsLoading(true);
            const res = await fetch("/api/user/bookmarks");
            const data = await res.json();
            if (data.success) {
                setBookmarks(data.data);
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function removeBookmark(articleLink: string, id: number) {
        try {
            setDeletingId(id);
            const res = await fetch(
                `/api/user/bookmarks?articleLink=${encodeURIComponent(articleLink)}`,
                { method: "DELETE" }
            );
            const data = await res.json();
            if (data.success) {
                setBookmarks((prev) => prev.filter((b) => b.id !== id));
                toast.success("Berita dihapus dari simpanan");
            } else {
                toast.error("Gagal menghapus berita");
            }
        } catch (error) {
            console.error("Error removing bookmark:", error);
            toast.error("Terjadi kesalahan");
        } finally {
            setDeletingId(null);
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Memuat berita tersimpan...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="container mx-auto px-4 py-12 flex-1">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Bookmark className="h-6 w-6 text-primary" />
                        <h1 className="text-3xl font-serif font-bold">Berita Tersimpan</h1>
                    </div>
                    <p className="text-muted-foreground">
                        {bookmarks.length > 0
                            ? `${bookmarks.length} berita disimpan`
                            : "Belum ada berita yang disimpan"}
                    </p>
                </div>

                {/* Empty State */}
                {bookmarks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                            <Bookmark className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Belum Ada Berita Tersimpan</h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Simpan berita yang menarik untuk dibaca nanti dengan mengklik ikon bookmark pada kartu berita.
                        </p>
                        <Link
                            href="/"
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                            Jelajahi Berita
                        </Link>
                    </div>
                )}

                {/* Bookmarks Grid */}
                {bookmarks.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((bookmark) => (
                            <article
                                key={bookmark.id}
                                className="group relative bg-card rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative aspect-video bg-muted">
                                    {bookmark.article_image ? (
                                        <Image
                                            src={bookmark.article_image}
                                            alt={bookmark.article_title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Bookmark className="h-12 w-12 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    {bookmark.article_category && (
                                        <span className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            {bookmark.article_category}
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            {bookmark.article_date && (
                                                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                                    {bookmark.article_date}
                                                </span>
                                            )}
                                            <h3 className="font-serif font-bold text-lg leading-tight mt-1 line-clamp-2">
                                                {bookmark.article_title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                                        <Link
                                            href={bookmark.article_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            <span>Baca</span>
                                        </Link>
                                        <button
                                            onClick={() => removeBookmark(bookmark.article_link, bookmark.id)}
                                            disabled={deletingId === bookmark.id}
                                            className="flex items-center justify-center p-2 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
                                            title="Hapus dari simpanan"
                                        >
                                            {deletingId === bookmark.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t bg-background py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2025 DANews. Digital Archives News Network.
                </div>
            </footer>
        </div>
    );
}
