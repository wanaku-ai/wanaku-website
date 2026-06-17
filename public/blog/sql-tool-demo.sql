-- SQL Tool Demo: Product Catalog for MCP Helpdesk Assistant
-- PostgreSQL 14+

CREATE DATABASE product_catalog;
\c product_catalog;

-- Categories

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

INSERT INTO categories (name, description) VALUES
    ('Laptops', 'Portable computers for work and personal use'),
    ('Desktops', 'Desktop computers and workstations'),
    ('Monitors', 'External displays and screens'),
    ('Accessories', 'Peripherals, cables, and add-ons');

-- Products

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    brand VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description TEXT,
    specs JSONB
);

INSERT INTO products (name, category_id, brand, price, description, specs) VALUES
    ('ThinkPad E14 Gen 6',   1, 'Lenovo', 749.99,  '14" business laptop with AMD Ryzen 5', '{"cpu": "AMD Ryzen 5 7535HS", "ram_gb": 16, "storage_gb": 512, "display": "14\" FHD IPS"}'),
    ('MacBook Air M3',       1, 'Apple',  1099.00, '13.6" ultralight with Apple M3 chip',  '{"cpu": "Apple M3", "ram_gb": 16, "storage_gb": 256, "display": "13.6\" Liquid Retina"}'),
    ('Inspiron 15 3530',     1, 'Dell',   549.99,  '15.6" everyday laptop',                '{"cpu": "Intel Core i5-1335U", "ram_gb": 8, "storage_gb": 512, "display": "15.6\" FHD"}'),
    ('IdeaPad Slim 3',       1, 'Lenovo', 429.99,  '15.6" budget-friendly laptop',         '{"cpu": "AMD Ryzen 3 7320U", "ram_gb": 8, "storage_gb": 256, "display": "15.6\" FHD"}'),
    ('Pavilion Desktop TP01',2, 'HP',     699.99,  'Compact tower for home and office',     '{"cpu": "Intel Core i5-13400", "ram_gb": 16, "storage_gb": 512}'),
    ('OptiPlex 7010 Micro',  2, 'Dell',   879.00,  'Ultra-small form factor business PC',   '{"cpu": "Intel Core i5-13500T", "ram_gb": 16, "storage_gb": 256}'),
    ('UltraSharp U2723QE',   3, 'Dell',   519.99,  '27" 4K USB-C hub monitor',              '{"resolution": "3840x2160", "panel": "IPS Black", "size_inches": 27}'),
    ('ThinkVision T24i-30',  3, 'Lenovo', 219.99,  '23.8" FHD business monitor',            '{"resolution": "1920x1080", "panel": "IPS", "size_inches": 23.8}'),
    ('MX Keys S',            4, 'Logitech', 109.99,'Wireless illuminated keyboard',          '{"connectivity": "Bluetooth + USB", "backlit": true}'),
    ('MX Master 3S',         4, 'Logitech', 99.99, 'Advanced wireless mouse',                '{"connectivity": "Bluetooth + USB", "dpi": 8000}');

-- Inventory (stock per product per warehouse)

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_restocked DATE,
    UNIQUE (product_id, warehouse)
);

INSERT INTO inventory (product_id, warehouse, quantity, last_restocked) VALUES
    (1,  'us-east',  42,  '2026-06-01'),
    (1,  'us-west',  18,  '2026-05-28'),
    (2,  'us-east',  25,  '2026-06-10'),
    (2,  'us-west',  30,  '2026-06-05'),
    (3,  'us-east',  60,  '2026-06-12'),
    (3,  'us-west',   0,  '2026-04-15'),
    (4,  'us-east',  85,  '2026-06-08'),
    (5,  'us-east',  12,  '2026-05-20'),
    (5,  'us-west',   7,  '2026-06-01'),
    (6,  'us-east',   5,  '2026-06-14'),
    (7,  'us-east',  20,  '2026-06-03'),
    (7,  'us-west',  15,  '2026-05-30'),
    (8,  'us-east',  50,  '2026-06-11'),
    (9,  'us-east',  100, '2026-06-09'),
    (9,  'us-west',  75,  '2026-06-02'),
    (10, 'us-east',  90,  '2026-06-07'),
    (10, 'us-west',  65,  '2026-05-25');

-- Example queries the MCP tool might execute:

-- "What laptops do you have under $1000?"
-- SELECT p.name, p.brand, p.price, p.description
-- FROM products p JOIN categories c ON p.category_id = c.id
-- WHERE c.name = 'Laptops' AND p.price < 1000
-- ORDER BY p.price;

-- "Is the ThinkPad E14 in stock?"
-- SELECT p.name, i.warehouse, i.quantity, i.last_restocked
-- FROM products p JOIN inventory i ON p.id = i.product_id
-- WHERE p.name ILIKE '%ThinkPad E14%';

-- "What monitors do you carry?"
-- SELECT p.name, p.brand, p.price, p.specs->>'resolution' AS resolution
-- FROM products p JOIN categories c ON p.category_id = c.id
-- WHERE c.name = 'Monitors'
-- ORDER BY p.price;
