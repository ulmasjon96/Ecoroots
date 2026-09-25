# Yo'l xaritasi va vazifalar

Grant kalendar rejasiga bog'langan. Claude Code: yuqoridan pastga, bitta bandni tugatib `[x]` qo'yib bor.
Har bir band tugashi = testlar o'tadi + tegishli hujjat yangilangan.

## 0-bosqich · Poydevor (2026 noyabr)
- [ ] Monorepo: `apps/web`, `backend`, `bot`, `infra`; `.env.example`; README
- [ ] `infra/docker-compose.yml`: postgis, redis, api, worker, bot, caddy
- [ ] Backend skeleti: FastAPI, config (pydantic-settings), async SQLAlchemy, Alembic, `/healthz`, ruff, pytest
- [ ] Web skeleti: Vite + React + TS + Tailwind (DESIGN.md tokenlari), Router, TanStack Query, i18next (uz/ru/en)
- [ ] CI: GitHub Actions — lint, typecheck, test (backend + web)
- [ ] Hetzner'da staging deploy (Caddy + TLS)

## 1-bosqich · Web platforma va admin (2026 dekabr — 2027 yanvar)
- [ ] Migratsiyalar: users, organizations, partners, regions, species, region_species, plots
- [ ] Seed: Buxoro pilot hududlari (poligonlar), 5 tur (saksovul, jiyda, tut, pista, yong'oq), 1-2 hamkor
- [ ] Auth: SMS OTP + JWT; Telegram `initData`
- [ ] Katalog endpointlari + `/stats`
- [ ] Buyurtma yaratish (narx serverda) + holatlar
- [ ] To'lov adapteri: Payme (sandbox), Click (sandbox), idempotent callbacklar, testlar
- [ ] Web: bosh sahifa, "Daraxt ekish" 4 bosqichli oqim, "Mening daraxtlarim" (prototip bo'yicha)
- [ ] Admin: hududlar, turlar/narxlar, hamkorlar, buyurtmalar, qaytarish

## 2-bosqich · Hamkor ilovasi, pasport, xarita (2027 yanvar — fevral)
- [ ] `tree_lifecycle` servisi + `ALLOWED_TRANSITIONS` + `tree_events` + testlar
- [ ] Hamkor kabineti (PWA): buyurtmalar, kamera rasmi, GPS, offline navbat (IndexedDB)
- [ ] Presigned yuklash, EXIF o'qish, `ST_Within` tekshiruvi → `planted` / `needs_review`
- [ ] Verifier navbati (admin)
- [ ] Pasport sahifasi `/t/:code` + QR (server tomonda SVG) + OG-rasm (ulashish uchun)
- [ ] Xarita: MapLibre, klasterlangan GeoJSON, hududlar paneli, filtrlar
- [ ] Cho'llanish qatlami: dataset tanlash (tadqiqot), GeoJSON/PMTiles tayyorlash skripti
- [ ] Telegram Mini App kirish nuqtasi

## 3-bosqich · Sertifikat va bot (2027 mart)
- [ ] `certificates` zanjiri: canonical JSON, sha256, prev_hash; har planted daraxtga avtomatik
- [ ] Kunlik Merkle ildizi worker'i + `anchors`; `/certificate/proof` + brauzerda tekshirish
- [ ] Blokcheyn adapteri interfeysi (`none` implementatsiyasi); TON/Polygon — qaror qabul qilingach
- [ ] Bot: buyurtma to'landi / daraxt ekildi / tekshiruv natijasi / sovg'a havolasi xabarlari

## 4-bosqich · Pilot ekish (2027 aprel) — ⚠ AI'dan oldin
- [ ] 500 daraxt Buxoroda real ekiladi, hamkor ilovasi dala sharoitida sinovdan o'tadi
- [ ] Har bir daraxt rasm + GPS bilan; dron bilan birinchi ortofoto
- [ ] Topilgan muammolar bo'yicha hamkor ilovasini tuzatish

## 5-bosqich · Monitoring (2027 may — iyun)
- [ ] Sentinel-2 adapteri (Copernicus Data Space): `plots` bo'yicha NDVI vaqt qatori, oylik worker
- [ ] Pilot rasmlari va dron tasvirlari asosida daraxt aniqlash modelini sinash (baseline: tayyor detektor + fine-tune)
- [ ] Tekshiruv natijalari pasportda
- [ ] Reyting: materialized view, tablar, "tirik qolish %"

## 6-bosqich · Rasmiylashtirish va o'sish (2027 may — oktyabr)
- [ ] DGU ro'yxati uchun hujjatlar (kod arxivi, tavsif)
- [ ] ru/en tarjimalar to'liq; korporativ hisobot (PDF)
- [ ] Maktab/universitet challenj mexanikasi
- [ ] Native ilova (Expo) — agar PWA yetarli bo'lmasa
- [ ] Xalqaro to'lov va birinchi xorijiy hamkor
