-- ============================================
-- Migration: Add Bookmarks Table
-- ============================================

-- Buat tabel bookmarks untuk menyimpan berita yang disimpan user
CREATE TABLE IF NOT EXISTS bookmarks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL COMMENT 'ID user yang menyimpan',
    article_link VARCHAR(1000) NOT NULL COMMENT 'Link artikel (unique per user)',
    article_title VARCHAR(500) NOT NULL COMMENT 'Judul artikel saat disimpan',
    article_image VARCHAR(1000) COMMENT 'URL gambar artikel',
    article_category VARCHAR(100) COMMENT 'Kategori artikel',
    article_date VARCHAR(50) COMMENT 'Tanggal artikel',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_article (user_id, article_link(255)),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
