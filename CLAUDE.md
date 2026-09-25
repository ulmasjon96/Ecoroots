# EcoRoots — Global Daraxt Ekish Platformasi

Foydalanuvchi dunyoning istalgan joyidan masofadan real daraxt ektiradi. Mahalliy sertifikatlangan hamkor
(fermer, o'rmon xo'jaligi, NNT) daraxtni ekadi, GPS + rasm yuklaydi. Har bir daraxt QR-kodli raqamli
pasport, o'zgartirib bo'lmaydigan sertifikat izi va davriy tiriklik tekshiruviga ega bo'ladi.

Pilot: Buxoro viloyati, 500 daraxt. Grant muddati: 12 oy (2026-noyabr — 2027-oktyabr).

## Hujjatlar (kod yozishdan oldin tegishlisini o'qi)
- `docs/PRD.md` — rollar, user story'lar, MVP chegarasi, nima MVP'ga KIRMAYDI
- `docs/ARCHITECTURE.md` — tizim tuzilishi, servislar, tashqi integratsiyalar, deploy
- `docs/DATABASE.md` — PostgreSQL + PostGIS sxemasi, holatlar mashinasi
- `docs/API.md` — REST endpointlar va ruxsatlar
- `docs/DESIGN.md` — dizayn tokenlari, komponentlar, UI matn qoidalari
- `docs/ROADMAP.md` — bosqichlar va vazifalar ro'yxati (checkbox). Ishni shu yerdan ol.
- `docs/prototype/index.html` — klikabel prototip. UI va oqimlar uchun manba (brauzerda och).

## Stack
- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS, React Router, TanStack Query, Zustand (faqat UI holati),
  MapLibre GL JS (xarita), react-i18next (uz / ru / en). PWA (vite-plugin-pwa).
- **Backend:** FastAPI (Python 3.12), SQLAlchemy 2.0 async + asyncpg, Alembic, Pydantic v2,
  PostgreSQL 16 + PostGIS 3. Fon vazifalari: arq + Redis.
- **Telegram:** aiogram 3 — bildirishnomalar va Telegram Mini App (xuddi shu web ilova, `/tma` kirish nuqtasi).
- **Infra:** Hetzner VPS (Ubuntu), Docker Compose, Caddy (TLS), S3-mos obyekt xotira (rasmlar uchun).
  Frontend: Vercel (yoki shu VPS'da Caddy orqali).

## Monorepo tuzilishi
```
ecoroots/
  apps/web/          # React: ommaviy sayt, foydalanuvchi, hamkor va admin kabinetlari
  backend/           # FastAPI: app/{api,core,models,schemas,services,workers}
  bot/               # aiogram 3
  infra/             # docker-compose.yml, Caddyfile, .env.example
  docs/
```

## Buyruqlar
```
# backend
cd backend && uv sync && uv run alembic upgrade head && uv run uvicorn app.main:app --reload
uv run pytest -q
uv run ruff check . && uv run ruff format .

# frontend
cd apps/web && pnpm i && pnpm dev
pnpm typecheck && pnpm lint && pnpm test

# hammasi birga
docker compose -f infra/docker-compose.yml up --build
```
Dasturchi Windows + PowerShell'da ishlaydi: skriptlarda bash-only sintaksisdan qoch yoki
`Makefile` o'rniga `justfile`/`pnpm` skriptlaridan foydalan.

## Qat'iy qoidalar
1. **Pul — faqat butun son, tiyinsiz so'm (`BIGINT`).** Float ishlatilmaydi. Valyuta ustuni doim bor (`UZS`, `USD`).
2. **Daraxt holati faqat `services/tree_lifecycle.py` orqali o'zgaradi.** To'g'ridan-to'g'ri `tree.status = ...` yozish taqiqlanadi.
   Har bir o'tish `tree_events` jadvaliga yoziladi.
3. **Sertifikat izi (hash) qayta yozilmaydi.** Tuzatish kerak bo'lsa — yangi sertifikat versiyasi, eskisi `superseded`.
4. **Koordinatalar PostGIS `geography(Point,4326)`**, tartib: (lon, lat). API JSON'da `{ "lat": .., "lon": .. }`.
5. **Hamkor faqat o'z hududi va o'ziga biriktirilgan buyurtmalarni ko'radi.** Har bir hamkor endpointida `partner_id` filtri — test bilan.
6. **Hamkor rasmi:** EXIF/GPS saqlanadi, server yuklangan vaqt va joyni hudud poligoniga solishtiradi. Mos kelmasa — `needs_review`.
7. **Barcha foydalanuvchi matnlari i18n kalitlari orqali** (`apps/web/src/locales/{uz,ru,en}.json`). Asosiy til — o'zbek lotin (oʻ, gʻ, ʼ).
8. **CO₂ raqamlari "taxminiy" deb ko'rsatiladi.** "Karbon krediti" yoki "offset sertifikati" iboralarini UI va hujjatlarda
   ishlatma — bu tashqi standart (Verra, Gold Standard) talab qiladi. To'g'ri ibora: "taxminiy CO₂ yutilishi".
9. Maxfiy kalitlar faqat `.env` da. `.env.example` ni yangilab bor.
10. Tashqi API (to'lov, sun'iy yo'ldosh, blokcheyn) — `services/` ichida adapter interfeysi orqali; testlarda fake adapter.

## Kod uslubi
- Python: ruff, type hints majburiy, servis qatlami routerlardan ajratilgan (router → service → repository).
- TS: `strict: true`, `any` yo'q, API tiplari `openapi-typescript` bilan backend sxemasidan generatsiya qilinadi.
- Komponentlar: `features/<soha>/` bo'yicha (map, plant, passport, rating, partner, admin).
- Commit: Conventional Commits (`feat(passport): ...`).

## Ish tartibi
- Yangi vazifa: `docs/ROADMAP.md` dan keyingi belgilanmagan bandni ol, tugagach `[x]` qil.
- Sxema o'zgarsa: Alembic migratsiya + `docs/DATABASE.md` ni yangilash.
- Endpoint qo'shilsa: `docs/API.md` ni yangilash.
- Noaniqlik bo'lsa, taxmin qilma — `docs/PRD.md` dagi "Ochiq savollar" bo'limiga yoz va so'ra.
