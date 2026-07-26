-- HealthCheck Monitor - Base de Données

-- Table: users
CREATE TABLE IF NOT EXISTS users (
                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                     username TEXT UNIQUE NOT NULL,
                                     password TEXT NOT NULL,
                                     role TEXT NOT NULL,
                                     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: services
CREATE TABLE IF NOT EXISTS services (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        name TEXT NOT NULL,
                                        description TEXT,
                                        url TEXT NOT NULL,
                                        method TEXT DEFAULT 'GET',
                                        headers TEXT,
                                        body TEXT,
                                        expected_status_codes TEXT DEFAULT '200',
                                        timeout INTEGER DEFAULT 30,
                                        check_frequency INTEGER DEFAULT 60,
                                        latency_threshold INTEGER DEFAULT 2000,
                                        failure_threshold INTEGER DEFAULT 3,
                                        keyword TEXT,
                                        alerts_enabled BOOLEAN DEFAULT 1,
                                        maintenance BOOLEAN DEFAULT 0,
                                        is_active BOOLEAN DEFAULT 1,
                                        current_status TEXT DEFAULT 'UP',
                                        last_check_at DATETIME,
                                        last_response_time INTEGER,
                                        uptime_percentage REAL DEFAULT 100.0,
                                        failure_count INTEGER DEFAULT 0,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: alert_recipients
CREATE TABLE IF NOT EXISTS alert_recipients (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                service_id INTEGER NOT NULL,
                                                email TEXT NOT NULL,
                                                FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

-- Table: check_results
CREATE TABLE IF NOT EXISTS check_results (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             service_id INTEGER NOT NULL,
                                             status TEXT NOT NULL,
                                             response_time INTEGER,
                                             http_status INTEGER,
                                             error_message TEXT,
                                             checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                             FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

-- Table: incidents
CREATE TABLE IF NOT EXISTS incidents (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         service_id INTEGER NOT NULL,
                                         started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                         ended_at DATETIME,
                                         duration INTEGER,
                                         reason TEXT,
                                         FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    );

-- Table: smtp_settings
CREATE TABLE IF NOT EXISTS smtp_settings (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             host TEXT DEFAULT 'smtp.gmail.com',
                                             port INTEGER DEFAULT 587,
                                             username TEXT,
                                             password TEXT,
                                             tls BOOLEAN DEFAULT 1,
                                             ssl BOOLEAN DEFAULT 0,
                                             from_email TEXT DEFAULT 'noreply@healthcheck.com'
);

-- Données initiales
-- Admin (password: admin123)
INSERT OR IGNORE INTO users (username, password, role) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'ADMIN');

-- Services d'exemple
INSERT OR IGNORE INTO services (name, description, url, method, check_frequency) VALUES
('Google', 'Moteur de recherche', 'https://www.google.com', 'GET', 60),
('GitHub API', 'API GitHub', 'https://api.github.com', 'GET', 120);

SELECT '✅ Base de données initialisée avec succès !';