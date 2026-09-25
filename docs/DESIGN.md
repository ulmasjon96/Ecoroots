# Dizayn tizimi

Manba: `docs/prototype/index.html`. Yangi ekran qilishdan oldin prototipdagi mos ekranni ochib ko'r.

## G'oya
Cho'l va unga qarshi o'sayotgan yashillik. Asosiy "qahramon" — to'q archa-yashil fondagi xarita: qum rangidagi cho'llanish
dog'lari va ularning ichida yashil nuqtalar (daraxtlar). Qolgan hamma narsa sokin va tartibli. Aksent rangi — Buxoro koshinlari firuzasi.

## Ranglar (Tailwind `theme.extend.colors`)
| Token | Light | Dark | Qayerda |
|---|---|---|---|
| `bg` | #EEF1EA | #0F1712 | sahifa foni |
| `surface` | #FFFFFF | #16211A | kartalar, panellar |
| `surface2` | #F6F8F3 | #1B2820 | ichki bloklar |
| `ink` | #1C2B22 | #E4EBE1 | asosiy matn |
| `muted` | #5B6B60 | #98A89C | ikkinchi darajali matn |
| `line` | #D5DCD0 | #2A3B30 | chegaralar |
| `juniper` | #173326 | #0B1811 | xarita foni, hero, faol tab |
| `land` | #27493B | #1E3B2F | xaritadagi quruqlik |
| `turq` | #16807F | #3FB3B0 | asosiy tugma, havolalar, fokus |
| `leaf` | #3F9A45 | #62B865 | "tirik" holat, hamkor tugmasi |
| `sand` | #D2A94F | #D9B25E | cho'llanish, "tekshiruvda" |
| `danger` | #B5452F | #E0775F | nobud / xato |

Xaritada daraxt nuqtasi: tirik `#7ED281`, tekshiruvda `#D9B25E`, foydalanuvchining o'zi `#5FD3CF` + oq chegara.

## Shriftlar
- Sarlavhalar: **Unbounded** 500–700 (kirill ham bor — ru lokalizatsiya uchun).
- Matn: **Onest** 400–600 (kirill ham bor).
- Shkala: h1 `clamp(1.9rem, 4.4vw, 3.1rem)`, h2 `clamp(1.35rem, 2.6vw, 1.8rem)`, h3 1.05rem, matn 16px / 1.55.
- Katta harflar bilan yozilgan yorliqlar ishlatilmaydi.

## Komponentlar
- Tugmalar: `primary` (turq), `ghost` (chegara), `leaf` (hamkor harakatlari). Radius 12px.
- Paneller: radius 18px, soya yo'q, 1px `line` chegara. Hero va xarita: radius 20–26px.
- Holat belgisi (pill): `alive`, `check`, `pending`, `dead` — nuqta + matn, rangga tayanib qolmaslik uchun doim matn bor.
- Mobil (< 860px): yuqori menyu yashiriladi, pastki navigatsiya (5 ta ikonka).

## Matn qoidalari
- O'zbek lotin: `oʻ gʻ` (U+02BB) va tutuq `ʼ` (U+02BC). Oddiy apostrof `'` UI'da ishlatilmaydi.
- Tugma nima qilishini aytadi: "Daraxt ekish", "Ekildi deb belgilash", "Havolani nusxalash". Natija xabari o'sha fe'lni takrorlaydi: "Ekildi".
- Bo'sh holat — harakatga chaqiruv: "Hali daraxt ekmadingiz" + "Daraxt ekish" tugmasi.
- CO₂ har doim "taxminiy" yoki "≈" bilan.

## Kirish qulayligi
Klaviatura fokusi ko'rinadi (turq 3px), `prefers-reduced-motion` hurmat qilinadi, rang kontrasti AA, xarita uchun matnli ro'yxat alternativasi (hududlar paneli).
