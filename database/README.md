# Database Schema - DANews Website

Dokumentasi database MySQL untuk website berita DANews.

## Instalasi

1. Pastikan MySQL/MariaDB sudah terinstall
2. Import schema database:
```bash
mysql -u root -p < schema.sql
```

Atau menggunakan MySQL Workbench:
- Buka MySQL Workbench
- File > Open SQL Script
- Pilih file `schema.sql`
- Jalankan script

## Struktur Database

### Tabel Utama

#### 1. `categories`
Menyimpan kategori berita.

**Kolom:**
- `id` - Primary key
- `slug` - Slug kategori (nasional, internasional, dll)
- `name` - Nama kategori
- `description` - Deskripsi kategori
- `is_active` - Status aktif
- `created_at`, `updated_at` - Timestamp

#### 2. `articles`
Menyimpan artikel/berita.

**Kolom:**
- `id` - Primary key
- `title` - Judul artikel
- `slug` - Slug untuk URL
- `excerpt` - Ringkasan artikel
- `content` - Konten lengkap
- `content_snippet` - Snippet konten
- `source_link` - Link sumber (CNN)
- `image_small`, `image_large` - URL gambar
- `category_id` - Foreign key ke categories
- `author` - Penulis
- `published_date`, `iso_date` - Tanggal publikasi
- `view_count` - Jumlah view
- `is_featured` - Apakah featured
- `is_published` - Status publikasi
- `created_at`, `updated_at` - Timestamp

#### 3. `users`
Menyimpan data pengguna/admin.

**Kolom:**
- `id` - Primary key
- `username` - Username untuk login
- `email` - Email pengguna
- `password_hash` - Hash password (bcrypt)
- `role` - Role (Admin, Editor, Member)
- `status` - Status (Aktif, Nonaktif)
- `full_name` - Nama lengkap
- `avatar` - URL avatar
- `last_login` - Waktu login terakhir
- `created_at`, `updated_at` - Timestamp

#### 4. `subscribers`
Menyimpan data subscriber newsletter.

**Kolom:**
- `id` - Primary key
- `email` - Email subscriber
- `status` - Status (Aktif, Nonaktif, Unsubscribed)
- `subscribed_at` - Tanggal subscribe
- `unsubscribed_at` - Tanggal unsubscribe
- `verification_token` - Token verifikasi
- `is_verified` - Status verifikasi
- `created_at`, `updated_at` - Timestamp

#### 5. `article_views`
Menyimpan log view artikel.

**Kolom:**
- `id` - Primary key
- `article_id` - Foreign key ke articles
- `ip_address` - IP address pengunjung
- `user_agent` - User agent browser
- `viewed_at` - Waktu view

#### 6. `popular_articles`
Menyimpan data artikel populer.

**Kolom:**
- `id` - Primary key
- `article_id` - Foreign key ke articles
- `view_count` - Jumlah view
- `last_updated` - Waktu update terakhir

#### 7. `search_logs`
Menyimpan log pencarian.

**Kolom:**
- `id` - Primary key
- `query` - Kata kunci pencarian
- `results_count` - Jumlah hasil
- `ip_address` - IP address
- `searched_at` - Waktu pencarian

## Views

### `v_articles_with_category`
View untuk mendapatkan artikel beserta kategori.

### `v_dashboard_stats`
View untuk statistik dashboard (total users, subscribers, articles).

## Stored Procedures

### `sp_update_article_view(article_id, ip_address)`
Update view count artikel dan insert log.

### `sp_get_popular_articles(limit)`
Mendapatkan artikel populer berdasarkan view count.

## Indexes

Database sudah dioptimasi dengan indexes untuk:
- Foreign keys
- Kolom yang sering digunakan untuk filter/search
- Full-text search pada title, excerpt, content_snippet

## Data Awal

Schema sudah termasuk data awal:
- 7 kategori berita (nasional, internasional, ekonomi, olahraga, teknologi, hiburan, gaya-hidup)
- 1 user admin default (username: admin, password: admin123 - **GANTI PASSWORD SETELAH INSTALASI!**)

## Koneksi Database

### Install Dependencies

Pertama, install package `mysql2` untuk koneksi database:

```bash
npm install mysql2
# atau
pnpm add mysql2
# atau
yarn add mysql2
```

### Konfigurasi Environment Variables

Buat file `.env.local` di root project dengan konfigurasi berikut:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=danews_db
DB_USER=root
DB_PASSWORD=your_password
```

### Menggunakan Database Helper

File `lib/db.ts` sudah disediakan untuk membantu koneksi database. Contoh penggunaan:

```typescript
import { query, queryOne } from '@/lib/db';

// Query multiple rows
const articles = await query(
  'SELECT * FROM articles WHERE is_published = ?',
  [true]
);

// Query single row
const article = await queryOne(
  'SELECT * FROM articles WHERE id = ?',
  [articleId]
);
```

## Catatan Keamanan

1. **Ganti password default admin** setelah instalasi
2. Gunakan prepared statements untuk mencegah SQL injection
3. Hash password menggunakan bcrypt dengan cost minimal 10
4. Backup database secara berkala
5. Gunakan SSL untuk koneksi database di production

## Backup & Restore

### Backup
```bash
mysqldump -u root -p danews_db > backup_$(date +%Y%m%d).sql
```

### Restore
```bash
mysql -u root -p danews_db < backup_20250101.sql
```

