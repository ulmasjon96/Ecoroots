# Vendor fayllar

npm paketlaridan o'zgarishsiz olingan (`npm pack`). Qo'lda tahrirlanmaydi va formatlanmaydi
(`.prettierignore` da).

| Fayl | Paket | Manba fayl | Litsenziya |
|---|---|---|---|
| `d3.min.js` | `d3@7.9.0` | `dist/d3.min.js` | ISC |
| `topojson-client.min.js` | `topojson-client@3.1.0` | `dist/topojson-client.min.js` | ISC |
| `qrcode.js` | `qrcode-generator@1.4.4` | `qrcode.js` (paketda minified versiya yo'q) | MIT |
| `countries-110m.json` | `world-atlas@2.0.2` | `countries-110m.json` | ISC (Natural Earth ma'lumotlari — public domain) |

Yangilash: `npm pack <paket>@<versiya>`, arxivdan yuqoridagi faylni shu papkaga ko'chiring
va jadvaldagi versiyani yangilang.
