# Prototip skrinshotlari

**Skrinshotlar lokal yaratiladi, repo'ga kirmaydi** (`*.jpg`, `*.png` — `.gitignore` da).
Repo'da faqat skript (`shoot.js`), shu README va tekshiruv natijalari (`*/audit.json`) saqlanadi.

`before/` — dizayn tizimi kiritilishidan oldingi holat, `after/` — keyingi holat.
Fayl nomi: `<ko'rinish>-<kenglik>.jpg`, kengliklar: 360, 390, 768, 1024, 1280, 1440 px.

Ko'rinishlar: `home`, `map`, `plant1`–`plant4` (wizard bosqichlari), `my`, `rating`, `partner`,
`admin`, `org`, `tree` (pasport), `modal-cert`, `modal-share`.

`audit.json` — avtomatik tekshiruv natijasi (bo'sh obyekt = muammo yo'q): konsol xatolari,
gorizontal scroll, konteynerdan chiqqan elementlar, qatorga bo'lingan tugma/yorliqlar,
so'z o'rtasidan bo'linish, header balandligi (64px), pastki navigatsiya kontentni yopishi.

Mobil full-page skrinshotlarda pastki navigatsiya sahifa o'rtasida ko'rinadi — bu `position: fixed`
elementni full-page rejimda suratga olishning xususiyati, sahifadagi xato emas.

## Qayta yaratish

Prototip xarita ma'lumotini `fetch` bilan yuklaydi, shuning uchun `file://` emas, lokal server kerak.
Playwright o'rnatilgan bo'lishi kerak.

```
cd docs/prototype
python3 -m http.server 8765
# boshqa terminalda:
node screenshots/shoot.js "http://localhost:8765/index.html" screenshots/after
```

Uchinchi va to'rtinchi argumentlar ixtiyoriy: kengliklar (`360,1280`) va ko'rinishlar (`home,tree`).
