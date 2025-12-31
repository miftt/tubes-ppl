-- ============================================
-- Seed Data untuk Database DANews
-- File ini berisi contoh data untuk testing
-- ============================================

USE danews_db;

-- ============================================
-- INSERT: Contoh Users
-- ============================================
-- Password untuk semua user: password123
-- Hash bcrypt: $2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq
INSERT INTO users (username, email, password_hash, role, status, full_name) VALUES
('miftt_admin', 'miftt@admin.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Admin', 'Aktif', 'Miftah Admin'),
('zidni_editor', 'zidni@news.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Editor', 'Aktif', 'Zidni Editor'),
('budi_user', 'budi123@gmail.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Member', 'Nonaktif', 'Budi User')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- ============================================
-- INSERT: Contoh Subscribers
-- ============================================
INSERT INTO subscribers (email, status, subscribed_at, is_verified) VALUES
('pembaca_setia@gmail.com', 'Aktif', '2024-01-10 08:00:00', TRUE),
('info_bisnis@yahoo.com', 'Aktif', '2024-01-12 09:30:00', TRUE),
('news_lover@outlook.com', 'Aktif', '2024-01-15 10:15:00', FALSE),
('test@example.com', 'Nonaktif', '2024-01-08 14:20:00', TRUE)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- ============================================
-- INSERT: Contoh Articles
-- ============================================
-- Note: Data artikel sebenarnya akan diisi dari RSS feed CNN
-- Ini hanya contoh untuk testing

INSERT INTO articles (
    title, 
    slug, 
    excerpt, 
    content_snippet,
    source_link,
    image_small,
    image_large,
    category_id,
    published_date,
    iso_date,
    is_featured,
    is_published,
    view_count
) VALUES
(
    'Contoh Berita Nasional Terkini',
    'contoh-berita-nasional-terkini',
    'Ini adalah contoh excerpt berita nasional yang menarik perhatian pembaca.',
    'Ini adalah contoh content snippet yang lebih panjang dari excerpt dan memberikan informasi lebih detail tentang berita nasional terkini.',
    'https://www.cnnindonesia.com/nasional/contoh-berita',
    'https://example.com/image-small.jpg',
    'https://example.com/image-large.jpg',
    (SELECT id FROM categories WHERE slug = 'nasional' LIMIT 1),
    NOW() - INTERVAL 1 DAY,
    NOW() - INTERVAL 1 DAY,
    TRUE,
    TRUE,
    150
),
(
    'Berita Teknologi Terbaru',
    'berita-teknologi-terbaru',
    'Teknologi terus berkembang dengan inovasi terbaru yang mengubah cara kita hidup.',
    'Content snippet yang menjelaskan lebih detail tentang perkembangan teknologi terbaru dan dampaknya terhadap kehidupan sehari-hari.',
    'https://www.cnnindonesia.com/teknologi/contoh-berita',
    'https://example.com/tech-small.jpg',
    'https://example.com/tech-large.jpg',
    (SELECT id FROM categories WHERE slug = 'teknologi' LIMIT 1),
    NOW() - INTERVAL 2 HOUR,
    NOW() - INTERVAL 2 HOUR,
    FALSE,
    TRUE,
    89
),
(
    'Update Berita Olahraga',
    'update-berita-olahraga',
    'Berita terkini dari dunia olahraga yang patut untuk diketahui.',
    'Snippet berita olahraga yang memberikan informasi lengkap tentang perkembangan terbaru di dunia olahraga.',
    'https://www.cnnindonesia.com/olahraga/contoh-berita',
    'https://example.com/sport-small.jpg',
    'https://example.com/sport-large.jpg',
    (SELECT id FROM categories WHERE slug = 'olahraga' LIMIT 1),
    NOW() - INTERVAL 5 HOUR,
    NOW() - INTERVAL 5 HOUR,
    FALSE,
    TRUE,
    67
)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- ============================================
-- UPDATE: Popular Articles
-- ============================================
-- Update popular_articles berdasarkan view_count dari articles
INSERT INTO popular_articles (article_id, view_count, last_updated)
SELECT id, view_count, updated_at
FROM articles
WHERE is_published = TRUE
ON DUPLICATE KEY UPDATE 
    view_count = VALUES(view_count),
    last_updated = VALUES(last_updated);

-- ============================================
-- INSERT: Contoh Search Logs
-- ============================================
INSERT INTO search_logs (query, results_count, ip_address) VALUES
('teknologi', 15, '192.168.1.100'),
('nasional', 23, '192.168.1.101'),
('olahraga', 8, '192.168.1.102'),
('ekonomi', 12, '192.168.1.103')
ON DUPLICATE KEY UPDATE query=VALUES(query);

-- ============================================
-- Selesai
-- ============================================
SELECT 'Seed data berhasil diinsert!' AS message;

