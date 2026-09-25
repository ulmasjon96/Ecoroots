# Arxitektura

```
            ┌───────────── Telegram ─────────────┐
            │  bot (aiogram 3)   Mini App (web)  │
            └──────┬─────────────────┬───────────┘
                   │                 │
 Brauzer / PWA ────┼──── apps/web (React, Vite) ────┐
                   │                                 │ REST (JSON)
                   ▼                                 ▼
              ┌─────────────── backend (FastAPI) ───────────────┐
              │ api/  services/  models/  adapters/             │
              └───┬───────────────┬──────────────┬──────────────┘
                  │               │              │
          PostgreSQL+PostGIS    Redis (arq)   S3 obyekt xotira (rasmlar)
                                  │
                        workers: verification, anchoring,
                        notifications, payouts, tiles
                                  │
       Tashqi: Payme, Click · Copernicus/Sentinel-2 · blokcheyn (keyin) · Telegram API
```

## Servislar

| Servis   | Vazifa                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------- |
| `api`    | REST, autentifikatsiya, biznes mantiq                                                                             |
| `worker` | arq navbatlari: `verify_plot`, `anchor_certificates`, `send_notification`, `expire_orders`, `rebuild_leaderboard` |
| `bot`    | Bildirishnomalar, `/start` → Mini App, sovg'a qilingan daraxt havolasi                                            |
| `web`    | Bitta React ilova, rolga qarab marshrutlar: `/`, `/map`, `/plant`, `/my`, `/t/:code`, `/partner/*`, `/admin/*`    |

## Autentifikatsiya

- Web: telefon + SMS OTP (Eskiz.uz yoki shunga o'xshash) yoki Google. JWT access (15 daq) + refresh (httpOnly cookie).
- Telegram Mini App: `initData` HMAC tekshiruvi → shu foydalanuvchiga JWT.
- Rollar: `users.role` + `organization_members`, `partner_members`. Tekshiruv FastAPI dependency'lari bilan.

## To'lov

- Adapter interfeysi: `PaymentProvider.create_invoice()`, `handle_callback()`.
- Payme Merchant API (JSON-RPC callback), Click SHOP API (prepare/complete). Callbacklar idempotent, `payments.provider_txn_id` UNIQUE.
- Buyurtma faqat `payments.status = paid` bo'lganda `paid` ga o'tadi. Summa serverda qayta hisoblanadi, frontenddan kelgan narxga ishonilmaydi.

## Ekish dalili (hamkor)

1. Hamkor ilovasi kamera orqali rasm oladi (galereya yopiq), `navigator.geolocation` aniqligi ≤ 25 m.
2. Rasm to'g'ridan-to'g'ri S3'ga presigned URL bilan yuklanadi, backend EXIF va GPS'ni o'qiydi.
3. `ST_Within(point, region.boundary)` va vaqt farqi ≤ 24 soat → `planted`, aks holda `needs_review` (verifier ko'radi).

## Tiriklik tekshiruvi — halol chegaralar

- **Sentinel-2 (10 m piksel) bitta ko'chatni ko'rmaydi.** U faqat ekish maydoni (`plots`, poligon) bo'yicha NDVI tendensiyasini beradi.
  Shuning uchun daraxtlar `plots` ga guruhlanadi va sun'iy yo'ldosh natijasi maydon darajasida saqlanadi.
- Bitta daraxt darajasida dalil: hamkorning davriy rasmlari (3, 6, 12 oy) va pilotda dron tasvirlari.
- AI moduli (2-bosqich): dron ortofotosida daraxt tojlarini sanash / tekshirish. Pilotdagi 500 daraxtning rasmlari o'qitish va sinov uchun ma'lumot bo'ladi —
  shuning uchun AI ishi pilot ekishdan **keyin** rejalashtirilgan.
- Manba: Copernicus Data Space Ecosystem (Sentinel Hub Statistical API) — `adapters/satellite.py`.

## Sertifikat va "blokcheyn"

- MVP: har bir sertifikat `hash = sha256(canonical_json(record) + prev_hash)` — zanjir. `canonical_json` = kalitlar saralangan, bo'shliqsiz.
- Kunlik worker barcha yangi hashlardan Merkle ildizini hisoblaydi va `anchors` jadvaliga yozadi.
- 2-bosqich: Merkle ildizi ommaviy blokcheynga (TON yoki Polygon) yoziladi, `anchors.tx_hash` pasportda havola bo'lib chiqadi.
  Bu usulda har bir daraxt uchun alohida tranzaksiya kerak emas — xarajat kuniga bitta tranzaksiya.
- Pasportdagi "Haqiqiyligini tekshirish": record + Merkle isboti qaytariladi, brauzer o'zi hisoblab solishtiradi.

## Xarita

- MapLibre GL JS, asos xarita: OpenFreeMap yoki MapTiler (kalit `.env` da).
- Daraxtlar: `GET /map/trees.geojson?bbox=` (klasterlangan) yoki 10 000+ bo'lsa `ST_AsMVT` vektor tile'lar.
- Cho'llanish qatlami: oldindan tayyorlangan GeoJSON/PMTiles (manba ROADMAP'da tanlanadi), statik fayl sifatida xizmat qiladi.

## Deploy (Hetzner)

- `infra/docker-compose.yml`: `caddy`, `api`, `worker`, `bot`, `postgres` (postgis/postgis:16-3.4), `redis`.
- Zaxira: har kecha `pg_dump` → obyekt xotiraga, 14 kun saqlanadi.
- Monitoring: Sentry (backend + web), `/healthz` endpoint, Uptime Kuma.
