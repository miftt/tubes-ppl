import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { NewsCard } from "@/components/news-card"
import { notFound } from "next/navigation"

// Force dynamic rendering for this page since it fetches live data
export const dynamic = 'force-dynamic'

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

const VALID_CATEGORIES = [
  "nasional",
  "internasional",
  "ekonomi",
  "olahraga",
  "teknologi",
  "hiburan",
  "gaya-hidup",
];

const CATEGORY_LABELS: Record<string, string> = {
  "nasional": "Nasional",
  "internasional": "Internasional",
  "ekonomi": "Ekonomi",
  "olahraga": "Olahraga",
  "teknologi": "Teknologi",
  "hiburan": "Hiburan",
  "gaya-hidup": "Gaya Hidup",
};

async function getCNNNewsByCategory(category: string): Promise<NewsItem[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/cnn/${category}`, {
      cache: "no-store",
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error(`Error fetching CNN news for category ${category}: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching CNN news for category ${category}:`, error);
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


export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params;

  // Validate category
  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const newsItems = await getCNNNewsByCategory(category);
  const categoryLabel = CATEGORY_LABELS[category] || category;

  // Get featured news (first item)
  const featuredNews = newsItems.length > 0 ? newsItems[0] : null;

  // Get recent news (items 1-24 for much more content)
  const recentNews = newsItems.slice(1, 25);

  // Get popular news titles (items 0-15 for more popular items)
  const popularNews = newsItems.slice(0, 15).map(item => ({
    title: item.title || "",
    link: item.link || "#",
  })).filter(item => item.title);

  // Get recommendations (items 25-35 for more recommendations)
  const recommendations = newsItems.slice(25, 36);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">{categoryLabel}</h1>
          <p className="text-muted-foreground">Berita terkini seputar {categoryLabel.toLowerCase()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Hero Section */}
            {featuredNews && (
              <NewsCard
                featured
                category={categoryLabel}
                date={formatDate(featuredNews.isoDate)}
                title={featuredNews.title || ""}
                excerpt={featuredNews.contentSnippet || featuredNews.content || ""}
                image={featuredNews.image?.large || featuredNews.image?.small || "/placeholder.svg"}
                link={featuredNews.link}
              />
            )}

            {/* Recent News Grid */}
            {recentNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {recentNews.map((news, index) => (
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
              <div className="text-center py-12 text-muted-foreground">
                <p>Tidak ada berita tersedia untuk kategori ini.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-12">
            {/* Popular List */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b pb-4 mb-6">Berita Terpopuler</h3>
              <div className="flex flex-col gap-6">
                {popularNews.map((item, i) => (
                  <Link
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 items-start"
                  >
                    <span className="text-3xl font-serif text-muted-foreground/30 font-bold leading-none">{i + 1}</span>
                    <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recommendations */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b pb-4 mb-4">Rekomendasi</h3>
              <div className="flex flex-col">
                {recommendations.map((news, index) => (
                  <NewsCard
                    key={news.link || index}
                    horizontal
                    date={formatDate(news.isoDate)}
                    title={news.title || ""}
                    image={news.image?.large || news.image?.small || "/placeholder.svg"}
                    link={news.link}
                  />
                ))}
              </div>
            </section>


            {/* Categories */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b pb-4 mb-4">Kategori</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { href: "/nasional", label: "Nasional" },
                  { href: "/internasional", label: "Internasional" },
                  { href: "/ekonomi", label: "Ekonomi" },
                  { href: "/olahraga", label: "Olahraga" },
                  { href: "/teknologi", label: "Teknologi" },
                  { href: "/hiburan", label: "Hiburan" },
                  { href: "/gaya-hidup", label: "Gaya Hidup" },
                ].map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${cat.href === `/${category}`
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-primary hover:text-primary-foreground"
                      }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </section>

            {/* More from Category */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b pb-4 mb-4">Lainnya dari {categoryLabel}</h3>
              <div className="flex flex-col gap-3">
                {newsItems.slice(36, 42).map((news, index) => (
                  <Link
                    key={news.link || index}
                    href={news.link || "#"}
                    target={news.link ? "_blank" : undefined}
                    rel={news.link ? "noopener noreferrer" : undefined}
                    className="group flex gap-3 items-start"
                  >
                    <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-sm bg-muted">
                      {news.image?.small ? (
                        <Image
                          src={news.image.small}
                          alt={news.title || ""}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">{formatDate(news.isoDate)}</p>
                      <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title || ""}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </aside>
        </div>
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

