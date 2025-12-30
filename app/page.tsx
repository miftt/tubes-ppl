import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { NewsCard } from "@/components/news-card"

const POPULAR_NEWS = [
  "Indonesia dan Mesir Tandatangani Kontrak Dagang Rp 12,8 Triliun",
  "Eduardo Almeida Resmi Latih RANS Nusantara FC",
  "9 Minuman Penurun Berat Badan, Apa Saja?",
  "Desa Wisata di Lombok Mulai Bersiap Sambut MotoGP 2023",
  "New Balance Bangun Pabrik di Cirebon, Menteri Luhut Sebut Indonesia Bersiap",
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Hero Section */}
            <NewsCard
              featured
              category="Health"
              date="Jun 12, 2025"
              title="6 Makanan Terbaik Saat Masuk Angin, Bikin Cepat Sembuh"
              excerpt="Sedang tidak enak badan atau masuk angin? Ini rekomendasi makanan terbaik agar pulih lebih cepat. Nutrisi yang tepat sangat krusial untuk mempercepat proses penyembuhan tubuh Anda."
              image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
            />

            {/* Recent News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
              <NewsCard
                date="Jun 10, 2025"
                category="Sport"
                title="Respons PSSI Usai AFA Resmi Umumkan Indonesia vs Argentina 19 Juni"
                excerpt="PSSI memberikan respons usai Federasi Sepak Bola Argentina (AFA) mengumumkan jadwal Argentina vs Indonesia di Jakarta pada 19 Juni."
                image="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop"
              />
              <NewsCard
                date="Jun 08, 2025"
                category="Nasional"
                title="Gibran Usai Dipanggil DPP PDIP: Saya Tegak Lurus Arahan Ketua Umum"
                excerpt="Wali Kota Solo sekaligus kader PDIP, Gibran Rakabuming menegaskan akan tegak lurus terhadap arahan Ketua Umum Megawati Soekarnoputri."
                image="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop"
              />
              <NewsCard
                date="Jun 05, 2025"
                category="Tech"
                title="Kominfo Klarifikasi Soal Dugaan Bocoran Data BSI yang Beredar"
                excerpt="Kementerian Komunikasi dan Informatika mengklarifikasi soal dugaan kebocoran data nasabah Bank Syariah Indonesia (BSI)."
                image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop"
              />
              <NewsCard
                date="Jun 03, 2025"
                category="Nasional"
                title="Transformasi Digital UMKM: Peluang dan Tantangan di Era Modern"
                excerpt="Bagaimana UMKM lokal beradaptasi dengan perubahan teknologi yang begitu cepat untuk tetap relevan di pasar global."
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-12">
            {/* Popular List */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b pb-4 mb-6">Berita Terpopuler</h3>
              <div className="flex flex-col gap-6">
                {POPULAR_NEWS.map((title, i) => (
                  <Link key={i} href="#" className="group flex gap-4 items-start">
                    <span className="text-3xl font-serif text-muted-foreground/30 font-bold leading-none">{i + 1}</span>
                    <p className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                      {title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recommendations */}
            <section>
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b pb-4 mb-4">Rekomendasi</h3>
              <div className="flex flex-col">
                <NewsCard
                  horizontal
                  date="May 30"
                  title="Strategi Baru Pemerintah Tekan Inflasi di Daerah"
                  image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=200&auto=format&fit=crop"
                />
                <NewsCard
                  horizontal
                  date="May 28"
                  title="Tips Menjaga Kesehatan Mental di Lingkungan Kerja"
                  image="https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=200&auto=format&fit=crop"
                />
                <NewsCard
                  horizontal
                  date="May 25"
                  title="Inovasi Mobil Listrik Buatan Anak Bangsa Dipamerkan"
                  image="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=200&auto=format&fit=crop"
                />
              </div>
            </section>

            {/* Newsletter */}
            <div className="bg-primary p-8 text-primary-foreground rounded-sm">
              <h3 className="font-serif text-2xl mb-2 italic">Briefing Pagi.</h3>
              <p className="text-sm text-primary-foreground/70 mb-6">
                Dapatkan berita terpenting setiap pagi langsung di email Anda.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="bg-primary-foreground/10 border-primary-foreground/20 rounded-none px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-foreground/30 placeholder:text-primary-foreground/40"
                />
                <button className="bg-primary-foreground text-primary py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary-foreground/90 transition-colors">
                  Langganan
                </button>
              </div>
            </div>
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
