# EcoRoots — Mahsulot talablari (PRD)

## 1. Muammo

Daraxt ekish xayriyalarida odamlar pul qayerga ketganini, daraxt haqiqatan ekilganini va tirik qolganini ko'ra olmaydi.
Shu bilan birga O'zbekistonda (Orol tubi, Qizilqum, Qoraqum chekkalari) cho'llanish jiddiy muammo, mahalliy fermerlarda esa
ko'kalamzorlashtirishdan daromad olish yo'li kam.

## 2. Yechim

Uch tomonni bog'lovchi platforma: **daraxt ektiruvchi** (shaxs, kompaniya, maktab) → **platforma** → **mahalliy hamkor** (ekuvchi).
Ishonch uch narsa bilan quriladi: GPS + rasm bilan ekish dalili, o'zgartirib bo'lmaydigan sertifikat izi, davriy tiriklik tekshiruvi.

## 3. Rollar

| Rol         | Kim                       | Asosiy ishlari                                                                         |
| ----------- | ------------------------- | -------------------------------------------------------------------------------------- |
| `guest`     | Har kim                   | Xaritani, reytingni, daraxt pasportini (QR orqali) ko'radi                             |
| `user`      | Ro'yxatdan o'tgan shaxs   | Buyurtma beradi, to'laydi, o'z daraxtlarini kuzatadi, sovg'a qiladi                    |
| `org_admin` | Kompaniya / maktab vakili | Tashkilot nomidan buyurtma, xodimlarni qo'shish, hisobot yuklab olish                  |
| `partner`   | Fermer / NNT a'zosi       | Buyurtmani qabul qiladi, ekadi, GPS + rasm yuklaydi, parvarish rasmlarini qo'shadi     |
| `verifier`  | Platforma xodimi          | Shubhali ekish dalillarini ko'rib chiqadi, dron/sun'iy yo'ldosh natijasini tasdiqlaydi |
| `admin`     | Platforma                 | Hududlar, turlar, narxlar, hamkorlar, to'lovlar, qaytarishlar                          |

## 4. Asosiy oqimlar (prototipda bor)

1. **Daraxt ekish:** hudud → tur va soni → kimning nomidan (o'zim / sovg'a / kompaniya) → to'lov → buyurtma hamkorga ketadi.
2. **Hamkor ekadi:** hamkor kabinetida buyurtma → "Ekildi" → GPS avtomatik + kamera rasmi → daraxtlar yaratiladi, egasiga xabar.
3. **Pasport:** `/t/{tree_code}` ommaviy sahifa: egasi, sana, joy, tur, rasmlar tarixi, tekshiruvlar, QR, sertifikat izi, "Haqiqiyligini tekshirish".
4. **Tekshiruv:** ekilgandan keyin sun'iy yo'ldosh (maydon darajasida) va hamkor/dron rasmlari (daraxt darajasida) → holat yangilanadi.
5. **Reyting:** shaxslar, kompaniyalar, ta'lim muassasalari, hududlar. Metrika: daraxtlar soni + tirik qolish ulushi.
6. **Xarita:** barcha daraxtlar (klaster), cho'llanish xavfi qatlami, hududlar ro'yxati.

## 5. MVP chegarasi (pilot, 1-6 oylar)

**Kiradi:** web (PWA) + Telegram Mini App, uz/ru/en, Payme va Click, Buxoro hududlari, hamkor kabineti,
QR-pasport, SHA-256 zanjirli sertifikat, sun'iy yo'ldosh NDVI (maydon darajasida), reyting, admin panel, Telegram bot bildirishnomalari.

**KIRMAYDI (keyingi bosqich):** native iOS/Android (Expo), xalqaro to'lov, xalqaro hamkorlar, dron tasvirlarini AI bilan
avtomatik tahlil qilish, korporativ API, challenj mexanikasi (faqat reyting bor), ommaviy blokcheynga yozish (faqat tayyor interfeys).

## 6. Biznes qoidalari

- Narx = ko'chat + ekish + 2 yil parvarish. Hamkor ulushi har bir **tasdiqlangan** daraxt uchun to'lanadi
  (masalan 50% ekishda, 50% 12-oyda tirikligi tasdiqlangach) — foizlar admin sozlamasi.
- Daraxt 24 oy ichida nobud bo'lsa, hamkor bepul qayta ekadi (`replanted`), yangi daraxt eski pasportga bog'lanadi.
- Buyurtma 30 kun ichida ekilmasa → avtomatik boshqa hamkorga yoki pul qaytarish.
- Ekish mavsumi: hudud uchun `planting_windows` (masalan, mart-aprel, oktyabr-noyabr). Mavsumdan tashqari buyurtma "navbatda" holatida.
- Bitta buyurtmada 1-1000 daraxt. 100+ bo'lsa hamkor bir nechta partiyada eka oladi.

## 7. Funksional bo'lmagan talablar

- Pasport sahifasi (QR) mobil 3G'da 2 soniyada ochilsin: server-side render yoki statik keshlangan JSON.
- Xarita 100 000 nuqtada ham ishlasin: vektor tile yoki server klasterlash.
- Hamkor ilovasi offline: rasm va GPS navbatga yoziladi, internet paydo bo'lganda yuboriladi.
- Shaxsiy ma'lumot: pasportda to'liq ism emas, foydalanuvchi tanlagan ko'rinadigan ism.

## 8. Ochiq savollar

- Xalqaro to'lov qabul qilish yo'li (O'zbekistondagi yuridik shaxs uchun qaysi provayder mavjud — tekshirish kerak).
- Ommaviy blokcheyn tanlovi: TON (Telegram bilan yaqin) yoki Polygon. Byudjet va tranzaksiya narxi bo'yicha qaror.
- Cho'llanish qatlami uchun aniq dataset va litsenziyasi.
- Hamkorni sertifikatlash mezonlari (hujjatlar, sinov ekishi).
- Tekshiruvchi `needs_review` daraxtni tasdiqlasa, u qaysi holatga o'tadi? `DATABASE.md` bo'yicha `planted` (keyin sun'iy
  yo'ldosh tekshiruvi → `verified_alive`), prototipda esa to'g'ridan-to'g'ri "Tirik" (`verified_alive`). Qaysi biri to'g'ri?
- Xalqaro hududlar (Senegal, Mo'g'uliston) qaysi bosqichda ochiladi? `ROADMAP.md` da xalqaro hamkor 6-bosqichda,
  prototip modalida esa "4-bosqichda ochiladi" deb yozilgan (4-bosqich — Buxoroda pilot ekish).
