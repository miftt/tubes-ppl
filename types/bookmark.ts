// Type untuk data bookmark dari Prisma select
export type BookmarkData = {
    id: number;
    articleLink: string;
    articleTitle: string;
    articleImage: string | null;
    articleCategory: string | null;
    articleDate: string | null;
    createdAt: Date;
};

// Type untuk response bookmark (snake_case format)
export type BookmarkResponse = {
    id: number;
    article_link: string;
    article_title: string;
    article_image: string | null;
    article_category: string | null;
    article_date: string | null;
    created_at: Date;
};

// Type untuk request body saat menambah bookmark
export type CreateBookmarkRequest = {
    articleLink: string;
    articleTitle: string;
    articleImage?: string;
    articleCategory?: string;
    articleDate?: string;
};
