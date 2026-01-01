import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// GET: Check if a specific article is bookmarked by current user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ isBookmarked: false });
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
            return NextResponse.json({ isBookmarked: false });
        }

        // Cek apakah sudah di-bookmark
        const bookmark = await prisma.bookmark.findFirst({
            where: {
                userId: user.id,
                articleLink: articleLink
            }
        });

        return NextResponse.json({
            isBookmarked: !!bookmark,
        });
    } catch (error) {
        console.error("Error checking bookmark:", error);
        return NextResponse.json({ isBookmarked: false });
    }
}
