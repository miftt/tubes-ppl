import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { BookmarkData, CreateBookmarkRequest } from "@/types/bookmark";

// GET: Ambil semua bookmark user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Ambil user ID dari email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Ambil semua bookmark user
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                articleLink: true,
                articleTitle: true,
                articleImage: true,
                articleCategory: true,
                articleDate: true,
                createdAt: true
            }
        });

        // Transform to match expected format
        const data = bookmarks.map((bookmark: BookmarkData) => ({
            id: bookmark.id,
            article_link: bookmark.articleLink,
            article_title: bookmark.articleTitle,
            article_image: bookmark.articleImage,
            article_category: bookmark.articleCategory,
            article_date: bookmark.articleDate,
            created_at: bookmark.createdAt
        }));

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json(
            { error: "Gagal mengambil bookmark" },
            { status: 500 }
        );
    }
}

// POST: Toggle bookmark (add/remove)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body: CreateBookmarkRequest = await request.json();
        const { articleLink, articleTitle, articleImage, articleCategory, articleDate } = body;

        if (!articleLink || !articleTitle) {
            return NextResponse.json(
                { error: "articleLink dan articleTitle wajib diisi" },
                { status: 400 }
            );
        }

        // Ambil user ID dari email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Cek apakah sudah di-bookmark
        const existing = await prisma.bookmark.findFirst({
            where: {
                userId: user.id,
                articleLink: articleLink
            }
        });

        if (existing) {
            // Hapus bookmark (toggle off)
            await prisma.bookmark.delete({
                where: { id: existing.id }
            });

            return NextResponse.json({
                success: true,
                action: "removed",
                message: "Bookmark dihapus",
            });
        } else {
            // Tambah bookmark (toggle on)
            await prisma.bookmark.create({
                data: {
                    userId: user.id,
                    articleLink,
                    articleTitle,
                    articleImage: articleImage || null,
                    articleCategory: articleCategory || null,
                    articleDate: articleDate || null
                }
            });

            return NextResponse.json({
                success: true,
                action: "added",
                message: "Berita disimpan",
            });
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
        return NextResponse.json(
            { error: "Gagal menyimpan bookmark" },
            { status: 500 }
        );
    }
}

// DELETE: Hapus bookmark berdasarkan article link
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const articleLink = searchParams.get("articleLink");

        if (!articleLink) {
            return NextResponse.json(
                { error: "articleLink wajib diisi" },
                { status: 400 }
            );
        }

        // Ambil user ID
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        await prisma.bookmark.deleteMany({
            where: {
                userId: user.id,
                articleLink: articleLink
            }
        });

        return NextResponse.json({
            success: true,
            message: "Bookmark dihapus",
        });
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        return NextResponse.json(
            { error: "Gagal menghapus bookmark" },
            { status: 500 }
        );
    }
}
