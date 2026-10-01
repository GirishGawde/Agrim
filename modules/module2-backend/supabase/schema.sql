-- Supabase SQL schema for Goa Community Resilience (v2)
-- Run this in the Supabase SQL editor to create / recreate all tables.

-- ── Areas ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS areas (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    risk_level  VARCHAR(50),          -- Low | Medium | High | Unknown
    reason      TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ── Reports ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id          SERIAL PRIMARY KEY,
    type        VARCHAR(100) NOT NULL,  -- flood | landslide | fire | other
    location    VARCHAR(255),
    area_id     INT REFERENCES areas(id) ON DELETE SET NULL,
    status      VARCHAR(50)  DEFAULT 'Open',  -- Open | Assigned | Resolved
    photo_url   TEXT,
    latitude    FLOAT,
    longitude   FLOAT,
    description TEXT,
    verified    BOOLEAN      DEFAULT FALSE,
    submitted_by TEXT,                        -- user id from auth
    created_at  TIMESTAMP    DEFAULT NOW()
);

-- ── Alerts ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
    id             SERIAL PRIMARY KEY,
    area_id        INT REFERENCES areas(id) ON DELETE SET NULL,
    message        TEXT,
    language       VARCHAR(10) DEFAULT 'en',   -- en | kok | mr | hi
    hazard_type    VARCHAR(100),
    status         VARCHAR(50) DEFAULT 'Pending',  -- Pending | Approved | Sent
    whatsapp_link  TEXT,
    created_at     TIMESTAMP DEFAULT NOW()
);

-- ── Households ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS households (
    id       SERIAL PRIMARY KEY,
    address  TEXT,
    type     VARCHAR(100),   -- low-lying | farmer | fisherman | shop | tourist
    contact  VARCHAR(100),
    area_id  INT REFERENCES areas(id) ON DELETE SET NULL,
    language VARCHAR(10) DEFAULT 'en'
);

-- ── Resources ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resources (
    id                SERIAL PRIMARY KEY,
    type              VARCHAR(100),   -- boat | vehicle | water_tank | spare_room | medical
    provider_contact  VARCHAR(100),
    location          VARCHAR(255),
    area_id           INT REFERENCES areas(id) ON DELETE SET NULL,
    available         BOOLEAN  DEFAULT TRUE,
    capacity          INT
);

-- ── Incidents ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS incidents (
    id               SERIAL PRIMARY KEY,
    description      TEXT,
    lessons_learned  TEXT,
    area_id          INT REFERENCES areas(id) ON DELETE SET NULL,
    hazard_type      VARCHAR(100),
    date             DATE DEFAULT CURRENT_DATE,
    created_at       TIMESTAMP DEFAULT NOW()
);

-- ── Enable Realtime on key tables ────────────────────────────────────────────
-- Run these in the Supabase Dashboard → Database → Replication
-- ALTER TABLE reports  REPLICA IDENTITY FULL;
-- ALTER TABLE alerts   REPLICA IDENTITY FULL;
