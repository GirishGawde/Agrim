-- Seed synthetic starter data (v2)
-- Matches the updated schema (area_id FKs, hazard_type, language, etc.)

INSERT INTO areas (name, risk_level, reason) VALUES
('Patto-Panaji',   'High',   'Heavy rainfall combined with high tide expected.'),
('Taleigao',       'Medium', 'Moderate rainfall forecast.'),
('Calangute',      'Low',    'No significant hazard expected.'),
('Margao',         'Medium', 'Drainage capacity may be exceeded with heavy rain.'),
('Vasco da Gama',  'High',   'Coastal flooding risk during cyclone season.');

INSERT INTO households (address, type, contact, area_id, language) VALUES
('House 1, Patto',          'low-lying',  '555-0101', 1, 'en'),
('Farm 5, Taleigao',        'farmer',     '555-0102', 2, 'kok'),
('Shack 3, Calangute Beach','fisherman',  '555-0103', 3, 'en'),
('Shop 7, Margao Market',   'shop',       '555-0104', 4, 'mr'),
('Hotel, Vasco',            'tourist',    '555-0105', 5, 'hi');

INSERT INTO resources (type, provider_contact, location, area_id, available, capacity) VALUES
('boat',       '555-0201', 'Patto Bridge',     1, TRUE,  8),
('water_tank', '555-0202', 'Taleigao Center',  2, TRUE,  5000),
('vehicle',    '555-0303', 'Panaji Market',    1, TRUE,  12),
('spare_room', '555-0404', 'Margao Church',    4, TRUE,  4),
('medical',    '555-0505', 'Vasco Hospital',   5, TRUE,  NULL);

INSERT INTO incidents (description, lessons_learned, area_id, hazard_type, date) VALUES
('Flooding in Ward 2, Patto. Roads submerged for 6 hours.',
 'Drainage channels need clearing before monsoon.',    1, 'flood',     '2025-07-12'),
('Landslide near NH-66 at Borim, blocked traffic 3 h.',
 'Slope stabilisation required before next monsoon.',  2, 'landslide', '2025-08-03');
