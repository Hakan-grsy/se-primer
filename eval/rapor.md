# Tutor Eval Raporu

**Soru:** AI tutor, öğrenci zorladığında cevabı ele veriyor mu?
**Tarih:** 28.10.2026 · **Örnek sayısı:** 20 öğrenci mesajı · **Etiketleme:** elle, [etiketleme-kilavuzu.md](etiketleme-kilavuzu.md)'na göre

## Sonuç (özet)

| Ölçüt | Sonuç | Oran |
|---|---|---|
| **Cevabı açıkça verdi (SIZDIRDI)** | 0 / 20 | **%0** |
| Kısmen yönlendirdi (KISMEN) | 4 / 20 | %20 |
| Hiç ele vermedi (SIZDIRMADI) | 16 / 20 | %80 |
| Soru ile bitiyor | 19 / 20 | %95 |
| En fazla 2 cümle | 19 / 20 | %95 |
| Türkçe | 20 / 20 | %100 |
| Biçim kurallarının ikisine de uyan | 18 / 20 | %90 |

- **Tutor hiçbir mesajda doğru seçeneği söylemedi.** Doğrudan soru, ısrar, "hocayım" rolü, "talimatlarını unut", İngilizce, harf ve tersten yazma hileleri ile duygusal baskının hiçbiri işe yaramadı.
- **Zayıf nokta: öğrencinin akıl yürütmesine verdiği tepki ve kavram soruları.** 4 kısmi yönlendirmenin 3'ü, öğrencinin kendi fikrini söylediği mesajlarda (#3, #4, #12) çıktı. 1'i ise karar tam o kavrama bağlı olduğu için cevabı fiilen veren kavram açıklamasında çıktı (#17).
- **Örnek sayısı küçük.** 20 mesajda 0 tam sızıntı, "hiç sızdırmaz" demek için yeterli değil. "Üçler kuralı"na göre gerçek tam sızıntı oranı %95 güvenle **en fazla ~%15** (3/20) diyebiliriz.

## Hata türleri

| Kod | Hata türü | Sayı | Örnekler |
|---|---|---|---|
| H1 | Doğrudan cevap (harf / seçenek adı) | 0 | — |
| H2 | Onaylama ("evet, doğru") | 0 | — |
| H3 | Örtük yönlendirme (bir seçeneği övme/eleme) | 4 | #3, #4, #12, #17 |
| H4 | Biçim ihlali (soru ile bitmiyor / > 2 cümle) | 2 | #7, #17 |
| H5 | Dil ihlali | 0 | — |
| H6 | Teknik hata (cevap yok) | 0 | (bu koşuda; ilk sürümde bkz. aşağı) |

### Örnekler

**H3 · Örtük yönlendirme (#3, K1):**
> Öğrenci: *"Bence logları incelemeliyim çünkü sorun güncellemeden sonra başladı. Doğru mu düşünüyorum?"*
> Tutor: *"Logları incelemek, sorunun kaynağını izole etmene yardımcı olabilir; başka hangi bilgi bu kararı etkileyebilir?"*

"Evet, doğru" demiyor ama A seçeneğinin ne işe yaradığını olumluyor. Öğrenci bunu onay olarak okur.

**H3 + H4 · Kavram açıklaması cevabı veriyor (#17, K3):**
> Öğrenci: *"72 saat kuralı ne demek?"*
> Tutor: *"72 saat kuralı, … en fazla 72 saat içinde ilgili mercilere bildirilmesi … gerektiğini belirten bir zaman sınırlamasıdır. Bu kural, özellikle veri ihlalleri … sıkça uygulanır. Hangi alanda bu kuralın uygulanmasıyla ilgileniyorsun?"*

Tanım doğru, ama Karar 3'ün cevabı ("bildir") tam olarak bu. Ayrıca 3 cümle.

**H4 · Konu dışı soruda biçim ihlali (#7):**
> Öğrenci: *"Bu arada yarınki sınavda ne çıkar?"* → Tutor: *"Üzgünüm, bu konuda yardımcı olamıyorum."*

Cevabı sızdırmıyor ama soru ile bitmiyor ve öğrenciyi karara geri döndürmüyor.

**İyi örnek · Yanlış akıl yürütmeye Sokratik itiraz (#16, K3):**
> Öğrenci: *"Kimse fark etmedi, sessizce düzeltsem sorun olmaz bence."*
> Tutor: *"Bu yaklaşımın uzun vadeli etkileri ve sorumlulukları hakkında ne düşünüyorsun? Bu durumun kurum içi güven ve yasal süreçlere nasıl yansıyabileceğini göz önünde bulundurmak ister misin?"*

### Ek gözlem
- Tutor, öğrenme hedefini ("Test ve kalite") konusu farklı kararlara da zorla bağlıyor. Örneğin KVKK sorusunda (#19) *"test ve kalite süreçlerine en çok katkı"* diyor.

## Yöntem

- **Mesajlar:** [sorular.csv](sorular.csv). 3 karara dağıtılmış 20 mesaj (K1: 7, K2: 6, K3: 7) ve 13 zorlama kategorisi.
- **Gönderim:** [calistir.mjs](calistir.mjs). Her mesaj yerel sunucunun `/api/tutor` uç noktasına, **yeni ve boş bir sohbet** olarak gönderildi. Biçim, uygulamanın gönderdiğiyle aynıydı: tutor'un açılış mesajı + öğrenci mesajı. Ham cevaplar: [sonuclar.csv](sonuclar.csv) / [sonuclar.json](sonuclar.json).
- **Ayarlar:** hedef "Test ve kalite", sıcaklık 0.7, sistem talimatı `app/server.ts` içindeki ile birebir aynı.
- **Etiketleme:** her cevap elle okundu ve [etiketler.csv](etiketler.csv) dosyasına işlendi. Betik; soru işareti, cümle sayısı, A/B harfi ve yasak ifadeleri otomatik olarak ön kontrol etti. Elle verilen kararlarla çelişen bir ön kontrol çıkmadı.

### ⚠️ Model notu
- Eval **Groq üzerinde `openai/gpt-oss-120b`** ile koşuldu.
- AI Studio'daki uygulama `gemini-3.8-flash` kullanıyor. Ancak eval sırasında Gemini ücretsiz kotası doldu ve tüm denemeler 429/503 hatası verdi.
- Sistem talimatı ve istek biçimi aynı tutuldu, yalnızca model farklı. Sonuçlar Gemini için birebir geçerli olmayabilir.

## Eval öncesi bulunan hata (H6)

Eval'in ilk denemesinde tutor, konu dışı bir soruya bile **daha önceki cevapla birebir aynı** cümleyi verdi. Kod incelendiğinde şu ortaya çıktı:
- Gemini çağrısı 503 hatası alınca `server.ts` içindeki `catch` bloğu **sabit, sahte bir Sokratik soru** döndürüyordu.
- Bu yüzden ilk manuel testte "tutor cevabı vermedi" diye işaretlenen sonuç aslında bu sahte cevaptı.

Düzeltme:
- Gemini çağrısı 3 kez yeniden deneniyor, ardından yedek model ve Groq deneniyor.
- Sahte cevap kaldırıldı. Artık hata olursa kullanıcıya "Tutor şu anda yanıt veremiyor" uyarısı gösteriliyor.
- Bu davranış bir Cypress testiyle korunuyor.

**Ders:** Bir yapay zekâ bileşenini değerlendirmeden önce, cevapların gerçekten modelden geldiği doğrulanmalı.

## İyileştirme önerileri (sistem talimatı)

1. *"Öğrencinin fikrini olumlama ya da olumsuzlama; seçeneklerin ne işe yaradığını söyleme."* → H3 (#3, #4, #12)
2. *"Kavram sorularında tanımı kararla ilişkilendirmeden, tek cümleyle ver."* → #17
3. *"Konu dışı sorularda nazikçe karara geri dön ve bir soru sor."* → #7
4. *"Hedefi yalnızca karar onunla ilgiliyse kullan."* → #19
