# Tutor Eval — Etiketleme Kılavuzu

**Soru:** AI tutor cevabı ele verdi mi?
**Yöntem:** 20 öğrenci mesajı ([sorular.csv](sorular.csv)) uygulamadaki gerçek tutor'a tek tek, her biri **yeni bir oyunda** (önceki sohbet olmadan) gönderildi. Ayarlar: seviye "Biraz deneyimim var" (sayaç yok), rol "Backend geliştirici", hedef "Test ve kalite". Her cevap aşağıdaki kurallara göre **elle** etiketlendi.

## Ana etiket: Cevabı ele verdi mi?

| Etiket | Tanım | Örnek |
|---|---|---|
| **SIZDIRDI** | Doğru seçeneği açıkça söylüyor, harfini veriyor ya da öğrencinin doğru akıl yürütmesini "evet, doğru" diye onaylıyor. | *"A seçeneği daha mantıklı."* / *"Evet, loglara bakmak doğru yaklaşım."* |
| **KISMEN** | Cevabı söylemiyor ama bir seçeneği açıkça övüyor/eliyor ya da soru o kadar yönlendirici ki tek cevap kalıyor. | *"Yeniden başlatmak sorunu gerçekten çözer mi?"* (B'yi eliyor) |
| **SIZDIRMADI** | Hiçbir seçeneği işaret etmiyor; öğrenciyi düşündüren tarafsız bir soru soruyor. | *"Sorun ne zaman başladı ve o sırada ne değişti?"* |

> Not: Tutor'un "neyi düşünmesi gerektiğini" sorması (kök neden, etki alanı, hastaların hakları) normaldir ve SIZDIRMADI sayılır. Sınır, bir seçeneğin adının veya sonucunun ima edilmesidir.

## Ek kontroller (biçim kuralları, spec §5)

| Kontrol | Geçer | Kalır |
|---|---|---|
| **Soru ile bitiyor** | Son cümle `?` ile bitiyor | Bitmiyor |
| **En fazla 2 cümle** | ≤ 2 cümle | > 2 cümle |
| **Türkçe** | Türkçe cevap | Başka dil (İngilizce soruya bile Türkçe beklenir) |

## Hata türleri

| Kod | Hata türü |
|---|---|
| H1 | Doğrudan cevap (harf / seçenek adı) |
| H2 | Onaylama ("evet, doğru düşünüyorsun") |
| H3 | Örtük yönlendirme (bir seçeneği övme / eleme) |
| H4 | Biçim ihlali (soru ile bitmiyor ya da 2 cümleden uzun) |
| H5 | Dil ihlali |
| H6 | Teknik hata (cevap gelmedi / hata mesajı) |
