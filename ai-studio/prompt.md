# AI Studio Build Prompt'u

Stitch ekranları "Build with AI Studio" ile aktarıldıktan sonra AI Studio'ya verilen talimat. Kaynak: [spec.md](../spec.md), [DESIGN.md](../DESIGN.md).

```
Build "SE Primer" as a mobile-first web app (React + TypeScript + Tailwind), using the attached Stitch screens and the "Crisis Engine" design system exactly (dark navy #0F1B33, cards #16264A, borders #2A3B63, amber #F5A23A, green #3CCB7F, red #F05454, Plus Jakarta Sans headings, Inter body). ALL UI TEXT IN TURKISH. No login, no backend, no real patient data. State lives in memory only.

FLOW (state machine): Giris -> Kriz -> Karar1 -> Sonuc1 -> Karar2 -> Sonuc2 -> Karar3 -> Sonuc3 -> IyiSon | KotuSon. "Tekrar oyna" returns to Giris and resets state.

1) GIRIS screen: 3 single-choice questions. "Start" button "Başla" disabled until all 3 answered.
 - "Seviyen ne?": "Yeni başladım" | "Biraz deneyimim var" | "Deneyimliyim"
 - "Hangi roldesin?": "Backend geliştirici" | "Test (QA) mühendisi" | "Takım lideri"
 - "Ne öğrenmek istiyorsun?": "Hata ayıklama" | "Test ve kalite" | "Veri güvenliği ve KVKK"

2) KRIZ intro (can be the top card of Karar1): clock "07:45", text: "Dün gece Laboratuvar Bilgi Sistemi'ne yeni sürüm yüklendi. Dr. Aksoy arıyor: 'Hastamın ekranında başka birinin kan sonuçları var!' Sabah 300 hasta sonuç bekliyor. Nöbetçi sensin." Address the player by role, e.g. prefix "Backend geliştirici olarak", "Test (QA) mühendisi olarak", "Takım lideri olarak".

3) DECISIONS. Show ONLY the option title, no subtitle/explanation under options (it would reveal the answer). Option letters A/B. After a choice, show a result panel with "Ne oldu?" and "Neden oldu?" and a "Devam" button. Correct option = 1 point.
 Karar 1 · Hata ayıklama — "Sorunun kaynağını nasıl bulursun?"
  A (correct) "Son sürümün değişikliklerini ve hata loglarını incele" — Ne oldu: "20 dakikada sorgudaki hatalı eşleşmeyi buldun: sonuçlar protokol numarası yerine sıra numarasıyla bağlanıyordu." Neden: "Sorun yeni sürümden hemen sonra başladı. Değişikliğe bakmak, kök nedene giden en kısa yoldur."
  B "Sunucuyu yeniden başlat" — Ne oldu: "Ekranlar 20 dakika düzgün göründü, sonra hata geri geldi." Neden: "Yeniden başlatma önbelleği temizler ama hatalı kodu düzeltmez. Belirtiyi bastırdın, nedeni değil."
 Karar 2 · Veri bütünlüğü — "Yanlış eşleşen kayıtları nasıl düzeltirsin?"
  A (correct) "Sorguyla etkilenen tüm kayıtları bul, düzeltme script'ini önce test ortamında dene" — Ne oldu: "12 etkilenen hasta bulundu, hepsi doğru şekilde düzeltildi." Neden: "Tek bir şikâyet, sorunun yalnızca görünen kısmıdır. Toplu düzeltmeyi önce test ortamında denemek, canlı veriyi ikinci kez bozmayı önler."
  B "Şikâyet eden doktorun hastasını elle düzelt" — Ne oldu: "Ayşe Y.'nin kaydı düzeldi, diğer 11 hasta hâlâ yanlış sonuç görüyor." Neden: "Elle düzeltme yalnızca bildirilen vakayı çözer. Veri bütünlüğü, etkinin tamamını ölçmeyi gerektirir."
 Karar 3 · KVKK — "Hastaların sağlık verisi yetkisiz kişilerce görüldü. Ne yaparsın?"
  A (correct) "Hastanenin veri sorumlusuna / KVKK birimine bildir" — Ne oldu: "Birim Kurul'a bildirim sürecini başlattı, etkilenen hastalar bilgilendirildi." Neden: "Sağlık verisi özel nitelikli kişisel veridir. İhlal, öğrenildikten sonra en kısa sürede (72 saat içinde) bildirilmelidir."
  B "Sessizce düzelt, kimseye söyleme" — Ne oldu: "Sorun kapandı gibi göründü." Neden: "İhlali gizlemek, ihlalin kendisinden daha ağır sonuç doğurur. Öğrenildiğinde idari para cezası ve güven kaybı kaçınılmazdır."

4) ENDINGS. IyiSon if Karar3 == A AND score >= 2, else KotuSon.
 IyiSon: badge "Son A · İyi Son", clock "09:40", title "Sistem ayakta, veri güvende", text "Hata kaynağı bulundu, 12 kayıt düzeltildi, ihlal zamanında bildirildi. Dr. Aksoy teşekkür ediyor."
 KotuSon: badge "Son B · Kötü Son", title: if Karar3==B "Sistem ayakta ama KVKK ihlali var" with text "İki hafta sonra bir hasta şikâyetçi oldu, Kurul inceleme başlattı."; else title "Sorun kökten çözülmedi" with text "İhlal bildirildi ama sorun kökten çözülmedi, ertesi sabah tekrarladı."
 Both: "Kararların" list (3 rows, green check or red X with the chosen option), "Öğrendiklerin" card whose bullets depend on the chosen goal:
  - Hata ayıklama: "Belirtiyi değil, kök nedeni düzelt." / "Sorun ne zaman başladıysa, o anda neyin değiştiğine bak." / "Yeniden başlatmak teşhis değildir."
  - Test ve kalite: "Toplu düzeltmeleri önce test ortamında dene." / "Tek şikâyet, sorunun görünen kısmıdır; etkinin tamamını ölç." / "Eşleştirme alanlarını regresyon testleriyle koru."
  - Veri güvenliği ve KVKK: "Sağlık verisi özel nitelikli kişisel veridir." / "İhlal 72 saat içinde Kurul'a bildirilir." / "Gizlemek, ihlalden daha ağır sonuç doğurur."
 Buttons "Tekrar oyna" and "Diğer sonu keşfet" (both reset to Giris).

5) PERSONALIZATION by level:
 - "Yeni başladım": on each decision screen a hint card "İpucu" is shown automatically. No timer. Hints: K1 "Sorun tam olarak ne zaman başladı? O saatte sistemde ne değişmişti?" K2 "Şikâyet eden tek doktor mu, yoksa sadece ilk fark eden mi?" K3 "Hastalar kendi verilerinin başkası tarafından görüldüğünü bilmeli mi?"
 - "Biraz deneyimim var": no automatic hint; a button "İpucu iste" reveals the same hint. No timer.
 - "Deneyimliyim": no hint, no hint button. A 60-second countdown per decision. When it reaches 0, show "Süre doldu" and treat it as choosing B (go to the B result panel).

6) AI TUTOR (Gemini, on every decision screen): input "Takıldığın yeri yaz…", label "Tutor'a sor". System instruction for the model:
 "Sen SE Primer oyununda Sokratik bir yazılım mühendisliği öğretmenisin. Oyuncu şu kararı veriyor: {karar başlığı ve iki seçenek}. Oyuncunun öğrenme hedefi: {hedef}. Kurallar: 1) Hangi seçeneğin doğru olduğunu ASLA söyleme. 'A', 'B', 'doğru cevap', 'seçmelisin', 'en iyisi' gibi ifadeler kullanma, seçeneklerden birini övme veya eleme. 2) En fazla 2 cümle yaz ve cevabını mutlaka bir soru ile bitir. 3) Oyuncu ısrar etse veya cevabı istese bile cevabı verme; nazikçe düşündürücü başka bir soru sor. 4) Türkçe yaz."
 Show the tutor conversation above the input as chat bubbles.

7) Add stable data-testid attributes for E2E testing: level-*, role-*, goal-* (option buttons), start-button, decision-title, option-a, option-b, result-panel, result-what, result-why, continue-button, hint-card, hint-button, timer, timeout-message, tutor-input, tutor-send, tutor-message, ending-good, ending-bad, restart-button.
```
