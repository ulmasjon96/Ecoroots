# REST API (v1)

Bazaviy yo'l: `/api/v1`. Autentifikatsiya: `Authorization: Bearer <jwt>`. Xatolar formati:
`{ "error": { "code": "ORDER_NOT_PAYABLE", "message": "...", "details": {} } }`.
Ro'yxatlar: `?limit=&cursor=` (cursor-pagination). Til: `Accept-Language: uz|ru|en`.

## Auth
| Metod | Yo'l | Kim | Izoh |
|---|---|---|---|
| POST | `/auth/otp/request` | guest | `{phone}` |
| POST | `/auth/otp/verify` | guest | `{phone, code}` → tokenlar |
| POST | `/auth/telegram` | guest | `{init_data}` Mini App |
| POST | `/auth/refresh` | cookie | |
| GET | `/me` | user | profil, rollar, tashkilotlar |

## Katalog (ommaviy)
| GET | `/regions?active=true` | hududlar, risk, hamkor soni |
| GET | `/regions/{code}/species` | tur, narx, CO₂ |
| GET | `/stats` | jami daraxt, tirik %, taxminiy CO₂, hamkorlar |

## Buyurtma va to'lov
| POST | `/orders` | user | `{region_code, species_code, quantity, dedication_type, display_name, message?, org_id?}` → `pending_payment`, narx serverda |
| GET | `/orders` | user | o'z buyurtmalari |
| GET | `/orders/{code}` | owner | holat, biriktirilgan hamkor, daraxtlar |
| POST | `/orders/{code}/pay` | owner | `{provider}` → `{checkout_url}` |
| POST | `/payments/payme/callback` | Payme | JSON-RPC, Basic auth tekshiruvi |
| POST | `/payments/click/prepare`, `/complete` | Click | imzo tekshiruvi |

## Daraxtlar va xarita
| GET | `/trees/{code}` | guest | pasport: public maydonlar, rasmlar, tekshiruvlar, sertifikat |
| GET | `/trees/{code}/certificate/proof` | guest | `{record, hash, prev_hash, merkle_proof, anchor}` |
| GET | `/me/trees` | user | |
| GET | `/map/trees.geojson?bbox=&zoom=` | guest | klasterlangan |
| GET | `/map/tiles/{z}/{x}/{y}.pbf` | guest | 2-bosqich |
| GET | `/leaderboard?type=people|company|edu|region&period=all|year` | guest | |

## Hamkor
| GET | `/partner/orders?status=assigned` | partner | faqat o'z buyurtmalari |
| POST | `/partner/uploads/presign` | partner | `{content_type}` → `{url, s3_key}` |
| POST | `/partner/orders/{code}/plantings` | partner | `{items:[{lat, lon, accuracy_m, s3_key, taken_at}]}` → daraxtlar yaratiladi |
| POST | `/partner/trees/{code}/photos` | partner | parvarish rasmi |
| GET | `/partner/payouts` | partner | |

## Verifier / Admin
| GET | `/admin/review-queue` | verifier | `needs_review` daraxtlar |
| POST | `/admin/trees/{code}/decision` | verifier | `{decision: approve|reject, reason}` |
| CRUD | `/admin/regions`, `/admin/species`, `/admin/partners`, `/admin/region-species` | admin | |
| POST | `/admin/orders/{code}/reassign`, `/refund` | admin | |
