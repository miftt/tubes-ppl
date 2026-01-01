# Migrasi ke Prisma ORM

Project ini sudah dimigrasi dari raw MySQL queries ke Prisma ORM untuk type-safety dan developer experience yang lebih baik.

## Setup Prisma

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root project dengan konfigurasi database:

```env
DATABASE_URL="mysql://user:password@localhost:3306/danews_db"

# Atau format lengkap:
# DATABASE_URL="mysql://root:password@localhost:3306/danews_db?schema=public"
```

### 3. Push Schema ke Database

Untuk development (sync schema tanpa migration files):

```bash
npm run db:push
```

Atau untuk production (dengan migration files):

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

Client akan otomatis ter-generate setelah `npm install` atau `db:push`.

## Available Scripts

- `npm run db:push` - Sync Prisma schema ke database (development)
- `npm run db:studio` - Buka Prisma Studio untuk manage data
- `npm run prisma:generate` - Generate Prisma Client
- `npm run db:migrate` - Jalankan SQL migrations (legacy)

## Prisma Studio

Untuk melihat dan mengedit data dengan GUI:

```bash
npm run db:studio
```

Akan membuka browser di `http://localhost:5555`

## Migration Notes

### Yang Sudah Dimigrasi:
- ✅ Bookmark API (`/api/user/bookmarks`)
- ✅ Bookmark Check API (`/api/user/bookmarks/check`)

### Yang Masih Menggunakan Raw Queries:
- Auth API (register, login)
- Admin API (subscribers, dashboard stats)
- Dashboard data

### Keuntungan Prisma:
1. **Type Safety** - Auto-completion dan type checking
2. **Migrations** - Version control untuk database schema
3. **Prisma Studio** - GUI untuk manage data
4. **Better DX** - Lebih mudah dibaca dan maintain
5. **Auto Relations** - Relasi antar tabel otomatis ter-handle

## Troubleshooting

### Error: Prisma Client belum di-generate
```bash
npm run prisma:generate
```

### Error: Database connection
Pastikan `DATABASE_URL` di `.env` sudah benar dan MySQL server running.

### Reset Database
```bash
npx prisma db push --force-reset
```
⚠️ **Warning**: Ini akan menghapus semua data!
