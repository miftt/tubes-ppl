-- ============================================
-- Database Schema untuk Website Berita DANews
-- ============================================

-- Buat database
CREATE DATABASE IF NOT EXISTS danews_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE danews_db;

-- ============================================
-- TABEL: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE COMMENT 'Slug kategori (nasional, internasional, dll)',
    name VARCHAR(100) NOT NULL COMMENT 'Nama kategori (Nasional, Internasional, dll)',
    description TEXT COMMENT 'Deskripsi kategori',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Status aktif kategori',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABEL: articles
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500) NOT NULL COMMENT 'Judul artikel',
    slug VARCHAR(500) NOT NULL COMMENT 'Slug untuk URL',
    excerpt TEXT COMMENT 'Ringkasan artikel',
    content LONGTEXT COMMENT 'Konten lengkap artikel',
    content_snippet TEXT COMMENT 'Snippet konten',
    source_link VARCHAR(1000) NOT NULL COMMENT 'Link sumber artikel (CNN)',
    image_small VARCHAR(1000) COMMENT 'URL gambar kecil',
    image_large VARCHAR(1000) COMMENT 'URL gambar besar',
    category_id INT COMMENT 'ID kategori',
    author VARCHAR(200) COMMENT 'Penulis artikel',
    published_date DATETIME COMMENT 'Tanggal publikasi',
    iso_date VARCHAR(50) COMMENT 'ISO date string',
    view_count INT DEFAULT 0 COMMENT 'Jumlah view',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Apakah artikel featured',
    is_published BOOLEAN DEFAULT TRUE COMMENT 'Status publikasi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured),
    INDEX idx_published_date (published_date),
    INDEX idx_source_link (source_link(255)),
    FULLTEXT idx_search (title, excerpt, content_snippet)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABEL: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE COMMENT 'Username untuk login',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email pengguna',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hash password',
    role ENUM('Admin', 'Editor', 'Member') DEFAULT 'Member' COMMENT 'Role pengguna',
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif' COMMENT 'Status akun',
    full_name VARCHAR(200) COMMENT 'Nama lengkap',
    avatar VARCHAR(500) COMMENT 'URL avatar',
    last_login DATETIME COMMENT 'Waktu login terakhir',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABEL: subscribers
-- ============================================
CREATE TABLE IF NOT EXISTS subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email subscriber',
    status ENUM('Aktif', 'Nonaktif', 'Unsubscribed') DEFAULT 'Aktif' COMMENT 'Status subscription',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Tanggal subscribe',
    unsubscribed_at TIMESTAMP NULL COMMENT 'Tanggal unsubscribe',
    verification_token VARCHAR(100) COMMENT 'Token untuk verifikasi email',
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Apakah email sudah diverifikasi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_subscribed_at (subscribed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABEL: article_views
-- ============================================
CREATE TABLE IF NOT EXISTS article_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    ip_address VARCHAR(45) COMMENT 'IP address pengunjung',
    user_agent TEXT COMMENT 'User agent browser',
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    INDEX idx_article (article_id),
    INDEX idx_viewed_at (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABEL: popular_articles
-- ============================================
CREATE TABLE IF NOT EXISTS popular_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    view_count INT DEFAULT 0 COMMENT 'Jumlah view',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_article (article_id),
    INDEX idx_view_count (view_count DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABEL: search_logs
-- ============================================
CREATE TABLE IF NOT EXISTS search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query VARCHAR(500) NOT NULL COMMENT 'Kata kunci pencarian',
    results_count INT DEFAULT 0 COMMENT 'Jumlah hasil',
    ip_address VARCHAR(45) COMMENT 'IP address',
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_query (query(255)),
    INDEX idx_searched_at (searched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DATA AWAL: Categories
-- ============================================
INSERT INTO categories (slug, name, description, is_active) VALUES
('nasional', 'Nasional', 'Berita seputar dalam negeri Indonesia', TRUE),
('internasional', 'Internasional', 'Berita dari seluruh dunia', TRUE),
('ekonomi', 'Ekonomi', 'Berita ekonomi dan bisnis', TRUE),
('olahraga', 'Olahraga', 'Berita olahraga terkini', TRUE),
('teknologi', 'Teknologi', 'Berita teknologi dan digital', TRUE),
('hiburan', 'Hiburan', 'Berita hiburan dan selebriti', TRUE),
('gaya-hidup', 'Gaya Hidup', 'Berita gaya hidup dan lifestyle', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================
-- INSERT DATA AWAL: Admin User (password: admin123)
-- Password hash menggunakan bcrypt dengan cost 10
-- ============================================
INSERT INTO users (username, email, password_hash, role, status, full_name) VALUES
('admin', 'admin@danews.com', '$2b$10$rOzJqJqJqJqJqJqJqJqJqOqJqJqJqJqJqJqJqJqJqJqJqJqJqJq', 'Admin', 'Aktif', 'Administrator')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- ============================================
-- VIEWS untuk kemudahan query
-- ============================================

-- View: Artikel dengan kategori
CREATE OR REPLACE VIEW v_articles_with_category AS
SELECT 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.content_snippet,
    a.source_link,
    a.image_small,
    a.image_large,
    a.published_date,
    a.iso_date,
    a.view_count,
    a.is_featured,
    a.is_published,
    c.id AS category_id,
    c.slug AS category_slug,
    c.name AS category_name,
    a.created_at,
    a.updated_at
FROM articles a
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.is_published = TRUE;

-- View: Statistik dashboard
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE status = 'Aktif') AS total_users,
    (SELECT COUNT(*) FROM subscribers WHERE status = 'Aktif') AS total_subscribers,
    (SELECT COUNT(*) FROM articles WHERE is_published = TRUE) AS total_articles,
    (SELECT COUNT(*) FROM articles WHERE is_published = TRUE AND DATE(created_at) = CURDATE()) AS articles_today;

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Procedure: Update view count artikel
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_update_article_view(IN p_article_id INT, IN p_ip_address VARCHAR(45))
BEGIN
    -- Insert log view
    INSERT INTO article_views (article_id, ip_address, viewed_at) 
    VALUES (p_article_id, p_ip_address, NOW());
    
    -- Update view count di tabel articles
    UPDATE articles 
    SET view_count = view_count + 1 
    WHERE id = p_article_id;
    
    -- Update atau insert ke popular_articles
    INSERT INTO popular_articles (article_id, view_count, last_updated)
    VALUES (p_article_id, 1, NOW())
    ON DUPLICATE KEY UPDATE 
        view_count = view_count + 1,
        last_updated = NOW();
END //
DELIMITER ;

-- Procedure: Get popular articles
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_get_popular_articles(IN p_limit INT)
BEGIN
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.image_small,
        a.image_large,
        a.source_link,
        a.published_date,
        c.name AS category_name,
        pa.view_count
    FROM popular_articles pa
    INNER JOIN articles a ON pa.article_id = a.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.is_published = TRUE
    ORDER BY pa.view_count DESC, pa.last_updated DESC
    LIMIT p_limit;
END //
DELIMITER ;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Auto update popular_articles saat artikel dihapus
DELIMITER //
CREATE TRIGGER IF NOT EXISTS trg_article_delete_popular
AFTER DELETE ON articles
FOR EACH ROW
BEGIN
    DELETE FROM popular_articles WHERE article_id = OLD.id;
END //
DELIMITER ;

-- ============================================
-- Selesai
-- ============================================

