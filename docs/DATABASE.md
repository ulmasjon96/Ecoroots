# Ma'lumotlar bazasi (PostgreSQL 16 + PostGIS)

Barcha jadvallarda: `id UUID PK DEFAULT gen_random_uuid()`, `created_at timestamptz DEFAULT now()`, `updated_at timestamptz`.
Pul: `BIGINT` (so'mda, tiyinsiz) + `currency CHAR(3)`.

## Foydalanuvchi va tashkilotlar
```
users(id, phone UNIQUE NULL, email UNIQUE NULL, telegram_id BIGINT UNIQUE NULL,
      display_name, locale ('uz'|'ru'|'en'), role ('user'|'verifier'|'admin'), is_active)
organizations(id, name, type ('company'|'school'|'university'|'ngo'), inn NULL, logo_url, public_slug UNIQUE)
organization_members(org_id FK, user_id FK, role ('owner'|'member'), PK(org_id,user_id))
```

## Hamkorlar va hududlar
```
partners(id, name, type ('farmer'|'forestry'|'ngo'|'youth'), status ('pending'|'certified'|'suspended'),
         contact_phone, payout_details_encrypted, rating NUMERIC(3,2))
partner_members(partner_id FK, user_id FK, role ('owner'|'planter'))
regions(id, code UNIQUE ('uz-bx-qorakol'), name_i18n JSONB, country CHAR(2),
        boundary geography(MultiPolygon,4326), risk_level ('medium'|'high'|'very_high'), is_active)
region_partners(region_id FK, partner_id FK, capacity_per_month INT)
planting_windows(region_id FK, month_from SMALLINT, month_to SMALLINT)
species(id, code UNIQUE, name_i18n JSONB, latin_name, co2_kg_per_year NUMERIC(6,2), notes_i18n JSONB)
region_species(region_id FK, species_id FK, price BIGINT, currency, partner_share_pct SMALLINT, is_active)
plots(id, region_id FK, partner_id FK, boundary geography(Polygon,4326), name)   -- sun'iy yo'ldosh tekshiruvi birligi
```

## Buyurtma va to'lov
```
orders(id, code UNIQUE ('ORD-...'), buyer_user_id FK, buyer_org_id FK NULL,
       region_id FK, species_id FK, quantity INT CHECK (quantity BETWEEN 1 AND 1000),
       unit_price BIGINT, total BIGINT, currency,
       dedication_type ('self'|'gift'|'company'), display_name, dedication_message NULL,
       status ('pending_payment'|'paid'|'assigned'|'partially_planted'|'planted'|'cancelled'|'refunded'),
       assigned_partner_id FK NULL, assigned_at, due_at)
payments(id, order_id FK, provider ('payme'|'click'|'uzum'|'intl'), provider_txn_id UNIQUE,
         amount BIGINT, currency, status ('created'|'paid'|'failed'|'refunded'), raw JSONB)
```

## Daraxtlar
```
trees(id, code UNIQUE ('ECR-UZ-BX-000123'), order_id FK, species_id FK, region_id FK, plot_id FK NULL,
      partner_id FK, owner_user_id FK NULL, owner_org_id FK NULL, display_owner,
      location geography(Point,4326), gps_accuracy_m NUMERIC(5,1), planted_at timestamptz,
      status (qarang: holatlar), replaces_tree_id FK NULL, is_public BOOLEAN DEFAULT true)
tree_events(id, tree_id FK, from_status, to_status, actor_user_id FK NULL, reason, payload JSONB)   -- append-only
tree_photos(id, tree_id FK, uploaded_by FK, s3_key, taken_at, exif_lat, exif_lon, source ('partner'|'drone'|'user'),
            check_result ('ok'|'mismatch_location'|'mismatch_time'|'no_exif'))
verifications(id, plot_id FK NULL, tree_id FK NULL, method ('satellite_ndvi'|'drone'|'photo'|'manual'),
              result ('alive'|'uncertain'|'dead'), score NUMERIC, details JSONB, verified_by FK NULL)
```
GIST indekslar: `trees.location`, `regions.boundary`, `plots.boundary`.

### Daraxt holatlari (faqat `services/tree_lifecycle.py` o'zgartiradi)
```
planted ──► verified_alive ──► (davriy) verified_alive
   │              │
   ├─► needs_review ──► planted | rejected
   │              └─► dead ──► replanted (yangi tree, replaces_tree_id)
```
Ruxsat etilgan o'tishlar jadvali kodda `ALLOWED_TRANSITIONS` dict sifatida saqlanadi va test bilan qoplanadi.

## Sertifikatlar
```
certificates(id, tree_id FK, version INT, record JSONB, prev_hash CHAR(64), hash CHAR(64) UNIQUE,
             status ('active'|'superseded'), anchor_id FK NULL)
anchors(id, merkle_root CHAR(64), leaf_count INT, chain ('none'|'ton'|'polygon'), tx_hash NULL, anchored_at)
```
`hash = sha256(canonical_json(record) || prev_hash)`; `prev_hash` — oldingi yaratilgan sertifikat hashi (global zanjir).

## Reyting va boshqalar
```
leaderboard_mv  -- MATERIALIZED VIEW: entity_type, entity_id, name, trees_total, trees_alive, survival_pct, period
notifications(id, user_id FK, channel ('telegram'|'email'|'push'), template, payload JSONB, sent_at, status)
partner_payouts(id, partner_id FK, period, trees_count, amount BIGINT, status ('pending'|'paid'))
audit_log(id, actor_user_id, action, entity, entity_id, diff JSONB)
```
