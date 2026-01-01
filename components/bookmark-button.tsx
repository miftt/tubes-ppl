"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookmarkButtonProps {
    articleLink: string;
    articleTitle: string;
    articleImage?: string;
    articleCategory?: string;
    articleDate?: string;
    variant?: "icon" | "button";
    className?: string;
}

export function BookmarkButton({
    articleLink,
    articleTitle,
    articleImage,
    articleCategory,
    articleDate,
    variant = "icon",
    className,
}: BookmarkButtonProps) {
    const { data: session, status } = useSession();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    // Cek status bookmark saat mount
    useEffect(() => {
        if (status === "authenticated" && articleLink) {
            checkBookmarkStatus();
        } else {
            setIsChecking(false);
        }
    }, [status, articleLink]);

    async function checkBookmarkStatus() {
        try {
            setIsChecking(true);
            const res = await fetch(
                `/api/user/bookmarks/check?articleLink=${encodeURIComponent(articleLink)}`
            );
            const data = await res.json();
            setIsBookmarked(data.isBookmarked);
        } catch (error) {
            console.error("Error checking bookmark:", error);
        } finally {
            setIsChecking(false);
        }
    }

    async function toggleBookmark(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (status !== "authenticated") {
            toast.info("Silakan login terlebih dahulu untuk menyimpan berita");
            window.location.href = "/login";
            return;
        }

        try {
            setIsLoading(true);
            const res = await fetch("/api/user/bookmarks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    articleLink,
                    articleTitle,
                    articleImage,
                    articleCategory,
                    articleDate,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setIsBookmarked(data.action === "added");
                if (data.action === "added") {
                    toast.success("Berita disimpan", {
                        description: "Lihat di menu Berita Tersimpan",
                    });
                } else {
                    toast.info("Berita dihapus dari simpanan");
                }
            } else {
                toast.error("Gagal menyimpan berita");
            }
        } catch (error) {
            console.error("Error toggling bookmark:", error);
            toast.error("Terjadi kesalahan", {
                description: "Silakan coba lagi nanti",
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Jangan tampilkan apapun jika belum login
    if (status === "unauthenticated") {
        return null;
    }

    // Loading state saat cek awal
    if (isChecking) {
        return (
            <button
                disabled
                className={cn(
                    "flex items-center justify-center transition-all",
                    variant === "icon"
                        ? "p-2 rounded-full bg-background/80 backdrop-blur"
                        : "px-4 py-2 rounded-md bg-muted",
                    className
                )}
            >
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </button>
        );
    }

    if (variant === "button") {
        return (
            <button
                onClick={toggleBookmark}
                disabled={isLoading}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                    isBookmarked
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80",
                    isLoading && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4" />
                ) : (
                    <Bookmark className="h-4 w-4" />
                )}
                <span>{isBookmarked ? "Tersimpan" : "Simpan"}</span>
            </button>
        );
    }

    return (
        <button
            onClick={toggleBookmark}
            disabled={isLoading}
            className={cn(
                "p-2 rounded-full transition-all",
                isBookmarked
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/80 backdrop-blur hover:bg-background",
                isLoading && "opacity-50 cursor-not-allowed",
                className
            )}
            title={isBookmarked ? "Hapus dari simpanan" : "Simpan berita"}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
            ) : (
                <Bookmark className="h-4 w-4" />
            )}
        </button>
    );
}
