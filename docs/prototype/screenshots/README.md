# Prototip skrinshotlari

`before/` — dizayn tizimi kiritilishidan oldingi holat, `after/` — keyingi holat.
Fayl nomi: `<ko'rinish>-<kenglik>.jpg`, kengliklar: 360, 390, 768, 1024, 1280, 1440 px.

Ko'rinishlar: `home`, `map`, `plant1`–`plant4` (wizard bosqichlari), `my`, `rating`, `partner`,
`admin`, `org`, `tree` (pasport), `modal-cert`, `modal-share`.

Har bir papkadagi `audit.json` — avtomatik tekshiruv natijasi (bo'sh obyekt = muammo yo'q):
gorizontal scroll, konteynerdan chiqqan elementlar, qatorga bo'lingan tugma/yorliqlar,
so'z o'rtasidan bo'linish, header balandligi (64px), pastki navigatsiya kontentni yopishi.

Mobil full-page skrinshotlarda pastki navigatsiya sahifa o'rtasida ko'rinadi — bu `position: fixed`
elementni full-page rejimda suratga olishning xususiyati, sahifadagi xato emas.

Qayta yaratish (Playwright kerak):

```
node shoot.js "file:///<to'liq yo'l>/docs/prototype/index.html" ./after
```
