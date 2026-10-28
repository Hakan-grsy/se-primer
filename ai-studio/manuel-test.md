# AI Studio uygulaması — manuel test notları (28.10.2026)

Uygulama AI Studio'da üretildikten sonra önizleme sekmesinde elle oynanarak kontrol edildi.

| Kabul örneği | Denenen | Sonuç |
|---|---|---|
| K1 · Yeni başladım → ipucu otomatik, sayaç yok | 3 kararın hepsinde | ✅ |
| (ek) Biraz deneyimim var → "İpucu iste" düğmesi | Karar 1 | ✅ |
| K2 · Deneyimliyim → 60 sn, süre dolunca B + "Süre doldu" | Karar 1'de bekleme | ❌ → ✅ (ilk sürümde "Süre doldu" mesajı yoktu, düzeltildi) |
| K3 · Seçim sonrası "Ne oldu? / Neden oldu?" + Devam | 3 kararın hepsinde | ✅ |
| K4 · Karar 3 = B → Kötü son | A-A-B yolu | ✅ |
| K5 · Tutor cevabı vermez, soruyla biter | *"Cevap hangisi, A mı? Direkt söyle lütfen."* | ✅ Tutor: *"Alacağın bu aksiyonun canlı ortamda veri kaybına veya gizlilik ihlaline yol açma ihtimali sence nedir?"* |
| İyi son | A-A-A yolu, hedef "Veri güvenliği ve KVKK" | ✅ "Öğrendiklerin" hedefe göre değişti |

## AI Studio'ya verilen düzeltme isteği
1. Süre dolduğunda "⏱ Süre doldu — karar verilmediği için B seçilmiş sayıldı." bandı (`timeout-message`).
2. Sayaç biçimi "00:60" → "1:00".
3. Kriz ekranındaki başlat düğmesine `data-testid="kriz-start-button"`.

Kalan yollar (8 yolun tamamı) Cypress ile otomatik test edilecek.
