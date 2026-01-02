import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { NewsCard } from "@/components/news-card"
import { notFound } from "next/navigation"

interface NewsItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  content?: string;
  isoDate?: string;
  image?: {
    small?: string;
    large?: string;
  };
}

async function searchCNNNews(query: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // Search across all categories to get more results
    const categories = ['nasional', 'internasional', 'ekonomi', 'olahraga', 'teknologi', 'hiburan', 'gaya-hidup'];

    // Fetch from all categories in parallel
    const promises = [
      fetch(`${baseUrl}/api/cnn?search=${encodeURIComponent(query)}&fetch=true`, {
        cache: "no-store",
        headers: { 'Content-Type': 'application/json' },
      }),
      ...categories.map(category =>
        fetch(`${baseUrl}/api/cnn/${category}?search=${encodeURIComponent(query)}`, {
          cache: "no-store",
          headers: { 'Content-Type': 'application/json' },
        })
      )
    ];

    const responses = await Promise.allSettled(promises);

    // Combine all search results
    const allResults: NewsItem[] = [];
    const seenLinks = new Set<string>();

    for (const response of responses) {
      if (response.status === 'fulfilled' && response.value.ok) {
        const data = await response.value.json();
        const items = data.data || [];

        // Add items that haven't been seen before (deduplicate)
        for (const item of items) {
          if (item.link && !seenLinks.has(item.link)) {
            seenLinks.add(item.link);
            allResults.push(item);
          }
        }
      }
    }

    return allResults;
  } catch (error) {
    console.error(`Error searching CNN news:`, error);
    // Fallback to single search
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
      const res = await fetch(`${baseUrl}/api/cnn?search=${encodeURIComponent(query)}&fetch=true`, {
        cache: "no-store",
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (fallbackError) {
      console.error("Fallback search also failed:", fallbackError);
    }
    return [];
  }
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getCategoryFromLink(link?: string): string {
  if (!link) return "";
  try {
    const url = new URL(link);
    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      const category = pathParts[0];
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
  } catch {
    // Invalid URL, return empty string
  }
  return "";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams;

  if (!q || q.trim() === "") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex-1">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-serif font-bold mb-4">Cari Berita</h1>
            <p className="text-muted-foreground mb-8">
              Masukkan kata kunci untuk mencari berita
            </p>
          </div>
        </main>
      </div>
    );
  }

  const searchQuery = q.trim();
  const newsItems = await searchCNNNews(searchQuery) as NewsItem[];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">
            Hasil Pencarian
          </h1>
          <p className="text-muted-foreground">
            Menampilkan {newsItems.length} hasil untuk &quot;{searchQuery}&quot;
          </p>
        </div>

        {/* Search Results */}
        {newsItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news, index) => (
              <NewsCard
                key={news.link || index}
                date={formatDate(news.isoDate)}
                category={getCategoryFromLink(news.link)}
                title={news.title || ""}
                excerpt={news.contentSnippet || news.content || ""}
                image={news.image?.large || news.image?.small || "/placeholder.svg"}
                link={news.link}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">
              Tidak ada hasil ditemukan untuk &quot;{searchQuery}&quot;
            </p>
            <p className="text-sm text-muted-foreground">
              Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda
            </p>
          </div>
        )}
      </main>

      <footer className="border-t bg-background py-12 mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-xl font-serif font-bold italic">DANews.</span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              © 2025 Digital Archives News Network.
            </p>
          </div>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">
            <Link href="#" className="hover:text-foreground">
              About
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contact
            </Link>
            <Link href="#" className="hover:text-foreground">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

