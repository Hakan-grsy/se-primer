# SE Primer — "Yanlış Hastaya Giden Tahlil Sonucu"

> YZM301 · Ödev · Spesifikasyon (spec.md)
> Oyuncunun seviyesine, rolüne ve hedefine uyum sağlayan, telefonda oynanan etkileşimli bir yazılım mühendisliği hikâyesi.

---

## 1. Problem

Yazılım mühendisliği öğrencileri hata ayıklama, veri bütünlüğü ve KVKK gibi konuları derste **tanım olarak** öğreniyor ama baskı altında **karar vermeyi** pratik etmiyor. Gerçek bir olayda yanlış karar hastaya zarar verebilir, hastaneye ceza getirebilir.

**SE Primer**, öğrenciyi gerçekçi bir sağlık yazılımı krizine sokar. Öğrenci her adımda bir karar verir, uygulama o kararın **teknik sonucunu** ve **nedenini** gösterir. Bir AI tutor öğrenciye cevabı söylemez, **soru sorarak** düşündürür. Hikâye, öğrencinin girişte verdiği cevaplara (seviye, rol, hedef) göre kendini uyarlar.

**Hedef kullanıcı:** Yazılım mühendisliği öğrencisi veya yeni başlayan geliştirici.
**Oynama süresi:** 5–10 dakika, tek oturum, telefon tarayıcısında.

---

## 2. Kapsam

### Yapılacak
- Telefonda açılan web uygulaması (Google AI Studio linki).
- Girişte 3 soru: **seviye**, **rol**, **hedef**. Anlatı ve zorluk bunlara uyar (bkz. §4).
- 1 sağlık senaryosu, **3 karar**, **2 farklı son**.
- Her seçimden sonra **"Ne oldu?"** ve **"Neden oldu?"** açıklaması.
- AI tutor: ipucu verir, **cevabı vermez**.

### Kapsam dışı
- Kullanıcı hesabı, giriş, ilerleme kaydı.
- İkinci bölüm / ek senaryolar.
- Gerçek hasta verisi (tüm isimler ve kayıtlar uydurmadır).
- Native mobil uygulama (yalnızca mobil uyumlu web).
- Puan tablosu, çok oyunculu mod.

---

## 3. Senaryo

### Başlangıç — Kriz
**07:45, Merkez Hastanesi.** Dün gece Laboratuvar Bilgi Sistemi'ne (LBS) yeni sürüm yüklendi. Dahiliye'den Dr. Aksoy arıyor: *"Hastam Ayşe Y.'nin ekranında başka birinin kan sonuçları var. Hemoglobin değeri hiç tutmuyor!"* Sabah 300 hasta sonuç bekliyor. Nöbetçi sensin.

> **Arka plandaki gerçek hata (oyuncuya baştan söylenmez):** Yeni sürümde sonuçları hastaya bağlayan sorgu `protokol_no` yerine `sira_no` alanıyla eşleşiyor. `sira_no` her gün sıfırlandığı için farklı günlerin hastaları çakışıyor. **12 hasta** etkilendi.

### Karar 1 · Hata ayıklama
*Sorunun kaynağını nasıl bulursun?*

| Seçenek | Ne oldu? | Neden oldu? |
|---|---|---|
| **A) Son sürümün değişikliklerini (diff) ve hata loglarını incele** ✅ | 20 dakikada sorgudaki `sira_no` eşleşmesini buldun. | Sorun yeni sürümden hemen sonra başladı. Değişikliğe bakmak, kök nedene (root cause) giden en kısa yoldur. |
| **B) Sunucuyu yeniden başlat** ❌ | Ekranlar 20 dakika düzgün göründü, sonra hata geri geldi. | Yeniden başlatma önbelleği temizler ama hatalı kodu düzeltmez. Belirtiyi bastırdın, nedeni değil. |

### Karar 2 · Veri bütünlüğü
*Yanlış eşleşen kayıtları nasıl düzeltirsin?*

| Seçenek | Ne oldu? | Neden oldu? |
|---|---|---|
| **A) Sorguyla etkilenen tüm kayıtları bul, düzeltme script'ini önce test ortamında dene** ✅ | 12 etkilenen hasta bulundu, hepsi doğru şekilde düzeltildi. | Tek bir şikâyet, sorunun yalnızca görünen kısmıdır. Toplu düzeltmeyi önce test ortamında denemek, canlı veriyi ikinci kez bozmayı önler. |
| **B) Şikâyet eden doktorun hastasını elle düzelt** ❌ | Ayşe Y.'nin kaydı düzeldi, diğer 11 hasta hâlâ yanlış sonuç görüyor. | Elle düzeltme yalnızca bildirilen vakayı çözer. Veri bütünlüğü, etkinin tamamını ölçmeyi gerektirir. |

### Karar 3 · KVKK
*Hastaların sağlık verisi yetkisiz kişilerce görüldü. Ne yaparsın?*

| Seçenek | Ne oldu? | Neden oldu? |
|---|---|---|
| **A) Hastanenin veri sorumlusuna / KVKK birimine bildir** ✅ | Birim Kurul'a bildirim sürecini başlattı, etkilenen hastalar bilgilendirildi. | Sağlık verisi **özel nitelikli kişisel veridir**. KVKK'ya göre ihlal, öğrenildikten sonra en kısa sürede (Kurul kararına göre **72 saat** içinde) bildirilmelidir. |
| **B) Sessizce düzelt, kimseye söyleme** ❌ | Sorun kapandı gibi göründü. | İhlali gizlemek, ihlalin kendisinden daha ağır sonuç doğurur. Öğrenildiğinde idari para cezası ve güven kaybı kaçınılmazdır. |

### Sonlar
Her karar için ✅ seçenek **1 puan** sayılır.

| Son | Koşul | Metin |
|---|---|---|
| **Son A · İyi** | Karar 3 = **A** **ve** toplam puan **≥ 2** | *09:40 — Hata kaynağı bulundu, 12 kayıt düzeltildi, ihlal zamanında bildirildi. Dr. Aksoy teşekkür ediyor.* |
| **Son B · Kötü** | Diğer tüm durumlar | Karar 3 = B ise: *İki hafta sonra bir hasta şikâyetçi oldu, Kurul inceleme başlattı.* Karar 3 = A ama puan < 2 ise: *İhlal bildirildi ama sorun kökten çözülmedi, ertesi sabah tekrarladı.* |

Toplam **8 olası yol** vardır (2 × 2 × 2). Bunların **3'ü İyi sona** (AAA, ABA, BAA), **5'i Kötü sona** gider.

---

## 4. Kişiselleştirme

Girişte 3 soru sorulur. Cevaplar oyun boyunca saklanır (yalnızca tarayıcı oturumunda).

| Soru | Seçenekler | Oyuna etkisi |
|---|---|---|
| **Seviye** | Yeni başladım / Biraz deneyimim var / Deneyimliyim | **Yeni başladım:** her karar ekranında ipucu kartı otomatik görünür, süre sınırı yok. **Biraz deneyimim var:** "İpucu iste" düğmesi görünür, süre sınırı yok. **Deneyimliyim:** ipucu yok, her karar için **60 saniye** sayaç. Süre dolarsa **B seçilmiş sayılır** ve "Süre doldu" geri bildirimi gösterilir. |
| **Rol** | Backend geliştirici / Test (QA) mühendisi / Takım lideri | Anlatı oyuncuya bu rolle hitap eder (ör. QA: *"Test ortamı senin sorumluluğunda…"*). Kararlar ve sonlar değişmez. |
| **Hedef** | Hata ayıklamayı öğrenmek / Test ve kaliteyi öğrenmek / Veri güvenliği ve KVKK'yı öğrenmek | AI tutor ipuçlarını bu konuya odaklar. Son ekranda hedefe uygun "Öğrendiklerin" özeti gösterilir. |

---

## 5. AI Tutor davranışı

- Her karar ekranında oyuncu tutor'a soru yazabilir (Yeni başladım seviyesinde ilk ipucu otomatik gelir).
- Tutor **Sokratik** davranır:
  - Hangi seçeneğin doğru olduğunu **söylemez**; "A", "B", "doğru cevap", "seçmelisin" gibi ifadeler kullanmaz.
  - Oyuncunun düşünmesini sağlayan **tek bir soru** veya kısa bir yönlendirme verir (en fazla 2 cümle).
  - Oyuncu ısrar etse de ("cevabı söyle artık") cevabı vermez, nazikçe başka bir soru sorar.
- Örnek: *"Sorun tam olarak ne zaman başladı? O saatte sistemde ne değişmişti?"*

---

## 6. Kabul örnekleri

| # | Verilen (Given) | Olay (When) | Beklenen (Then) |
|---|---|---|---|
| **K1** | Oyuncu seviye olarak **"Yeni başladım"** seçti | Karar 1 ekranı açılır | İpucu kartı oyuncu bir şey yapmadan görünür; sayaç **görünmez**. |
| **K2** | Oyuncu seviye olarak **"Deneyimliyim"** seçti | Karar ekranında 60 saniye boyunca hiçbir seçim yapılmaz | "Süre doldu" mesajı görünür ve oyun **B seçilmiş gibi** sonuç ekranına geçer. |
| **K3** | Oyuncu herhangi bir karar ekranında | Bir seçeneğe dokunur | **"Ne oldu?"** ve **"Neden oldu?"** başlıklı sonuç ekranı ve "Devam" düğmesi görünür. |
| **K4** | Oyuncu Karar 1 ve 2'de **A** seçti | Karar 3'te **B** seçer | Oyun **Kötü sona** gider (diğer kararlar ne olursa olsun Karar 3 = B ise iyi son yoktur). |
| **K5** | Oyuncu bir karar ekranında | Tutor'a *"Cevap hangisi, A mı?"* yazar | Tutor'un cevabı "A", "B", "doğru cevap" ifadelerini **içermez** ve bir **soru** ile biter. |

---

## 7. Akış şeması

```mermaid
stateDiagram-v2
    [*] --> Giris: Uygulama açılır
    Giris --> Kriz: 3 soru cevaplandı (seviye, rol, hedef)
    Kriz --> Karar1: Başla

    Karar1 --> Sonuc1: A veya B (ya da süre doldu → B)
    Sonuc1 --> Karar2: Devam

    Karar2 --> Sonuc2: A veya B (ya da süre doldu → B)
    Sonuc2 --> Karar3: Devam

    Karar3 --> Sonuc3: A veya B (ya da süre doldu → B)
    Sonuc3 --> IyiSon: Karar3 = A ve puan ≥ 2
    Sonuc3 --> KotuSon: Diğer durumlar

    IyiSon --> Giris: Tekrar oyna
    KotuSon --> Giris: Tekrar oyna
    IyiSon --> [*]
    KotuSon --> [*]

    note right of Karar1
        Her karar ekranında:
        - AI tutor (ipucu, cevap yok)
        - Seviyeye göre ipucu kartı / 60 sn sayaç
    end note
```

---

## 8. Ekranlar (Stitch için)

1. **Giriş ekranı:** başlık, kısa tanıtım, 3 soru (seçim kartları), "Başla" düğmesi.
2. **Sahne ekranı:** saat göstergesi, hikâye metni, 2 seçenek düğmesi, ipucu kartı / sayaç, tutor sohbet alanı. Seçim sonrası aynı ekranda "Ne oldu? / Neden oldu?" paneli açılır.
3. **Son ekranı:** İyi / Kötü son metni, her kararın özeti (✅/❌), hedefe göre "Öğrendiklerin", "Tekrar oyna" düğmesi.

---

## 9. Model (v2) — Yanlış karar riski

> Bu bölüm **eğitimden önce** yazıldı ve eşikler eğitim sonucuna göre değiştirilmez. Eşiği geçemeyen model yayınlanmaz.

### 9.1 Model gereksinimi
- **Soru:** *"Oyuncu bu karar ekranına geldiğinde, bu kararı yanlış verme olasılığı nedir?"*
- **Çıktı:** `p_yanlis` ∈ [0, 1].
- **Oyuna etkisi:** Karar ekranı açılırken model bir kez çalışır. `p_yanlis ≥ 0.50` (müdahale eşiği, `config.json` içinde) ise ekranın üstünde **"Kıdemli meslektaşın Selin arıyor"** kartı çıkar ve o karara özel kısa bir uyarı verir. Uyarı, tutor kuralına uyar: doğru seçeneği söylemez, düşündürür. Eşiğin altında kart çıkmaz ve hikâye v1'deki gibi devam eder.
- **Neden ekran açılırken?** Karar süresi ve tereddüt, oyuncu seçim yapana kadar tamamlanmaz. Bu yüzden model yalnızca **ekran açıldığı anda bilinen** girdileri kullanır. Eğitimde de aynı girdiler kullanılır, böylece eğitim ile kullanım arasında fark (train/serve skew) oluşmaz.
- **Model:** Lojistik regresyon (`scikit-learn`), `random_state=42`. Veri az (72 satır) olduğu için az girdili, yorumlanabilir bir model seçildi.

### 9.2 Girdiler (sırası `config.json` ile sabitlenir)
| # | Girdi | Nasıl hesaplanır |
|---|---|---|
| 1 | `seviye_kod` | Yeni başladım = 0, Biraz deneyimim var = 1, Deneyimliyim = 2 |
| 2 | `karar_2` | Karar 2 ise 1, değilse 0 |
| 3 | `karar_3` | Karar 3 ise 1, değilse 0 |
| 4 | `onceki_yanlis_sayisi` | Bu oturumda önceki kararlardaki yanlış sayısı |
| 5 | `onceki_ort_sure_sn` | Önceki kararların ortalama süresi (Karar 1'de 0) |

`rol` ve `hedef` girdi değildir: v1 spesifikasyonuna göre bunlar yalnızca anlatıyı ve tutor'u değiştirir, kararları değiştirmez (bkz. §4). Ölçülen ama girdi olmayan sütunlar (`karar_suresi_sn`, `tereddut_sayisi` vb.) veri setinde kalır ve sonraki sürümler için saklanır.

### 9.3 Değerlendirme metriği ve kabul eşiği (altın standart)
- **Metrik:** ROC AUC. Pozitif sınıf `dogru_mu = 0` (yanlış karar).
- **Ölçüm yöntemi:** `oturum_id`'ye göre gruplu 5 katlı çapraz doğrulama (`GroupKFold`). Aynı oturumun 3 kararı hep aynı katta kalır, böylece model bir oturumu hem eğitimde hem testte görmez.
- **Kabul eşiği: AUC ≥ 0.60.** 0.50, yazı tura atmaktır. İki kişiden gelen 72 satırlık veride 0.60, "modelin rastgeleden anlamlı biçimde iyi olduğu" için gerçekçi bir alt sınırdır.
- **AUC yalnızca `kaynak = gercek` satırlarla ölçülür.** Sentetik veri eklenirse yalnızca eğitimde kullanılır. Sentetik veriyle ölçüm, modeli kendi üretim kurallarımızı öğrendiği için yapay olarak iyi gösterir.
- **Bilgi amaçlı (eşik değil):** Brier skoru, tüm oyunculara aynı oranı (veri setindeki yanlış oranı) veren taban modelle birlikte raporlanır.
- `train.py` AUC < 0.60 bulursa **hata kodu ile durur** ve `model.onnx` üretmez.

### 9.4 Kabul örnekleri (v2)
| # | Verilen (Given) | Olay (When) | Beklenen (Then) |
|---|---|---|---|
| **K6** | Model bir karar için `p_yanlis = 0.62` döndürüyor, müdahale eşiği 0.50 | Karar ekranı açılır | "Kıdemli meslektaşın Selin arıyor" kartı **görünür**. Uyarı metni "A", "B" ya da "doğru cevap" ifadelerini **içermez**. |
| **K7** | Model bir karar için `p_yanlis = 0.31` döndürüyor | Karar ekranı açılır | Kart **görünmez**, ekran v1'deki gibidir. |
| **K8** | `tests/parite.json` içindeki 5 referans girdi | Aynı `model.onnx` hem Python'da (oracle) hem tarayıcıda (`onnxruntime-web`) çalıştırılır | Her girdi için iki olasılık arasındaki fark **< 1e-4**. |

### 9.5 Bilinen sınırlar
- Veri **yalnızca dört oyuncudan** geliyor (O1: 17, O2: 7, O3: 10, O4: 10 oturum; toplam 44 oturum, 132 satır). Model bu kişilerin alışkanlıklarını öğrenir, genel oyuncu kitlesini temsil etmez.
- Bazı durumlar veride az: süre 2 oturumda doldu (6 karar), tutor'a 6 kararda soru soruldu, "İpucu iste" düğmesi 4 kararda kullanıldı.
- Model bir eğitim oyunu içindir. Gerçek bir kişiyi değerlendirmek ya da notlandırmak için kullanılmamalıdır.

### 9.6 Eğitim günlüğü
Her `python train.py` denemesi buraya yazılır. Eşikler (§9.3) denemeler arasında değiştirilmez.

| # | Tarih | Veri | ROC AUC (CV) | Brier (CV / taban) | Sonuç | Karar |
|---|---|---|---|---|---|---|
| 1 | 1 Kasım 2026 | 24 gerçek oturum (72 satır), 2 oyuncu | **0.5318** | 0.245 / 0.231 | ✗ Eşik altı, model üretilmedi. İkinci koşu aynı sayıları verdi. | Model ve girdiler aynı kalır. Daha fazla gerçek veri toplanır (yeni oyuncular: O3, O4, …). |
| 2 | 1 Kasım 2026 | 44 gerçek oturum (132 satır), 4 oyuncu | **0.5829** | 0.228 / 0.227 | ✗ Eşik altı, model üretilmedi. | Karar bekliyor (bkz. aşağıdaki yorum). |

**Deneme 1 yorumu:** Model, herkese aynı oranı veren taban modelden bile kötü (Brier 0.245 > 0.231). 72 satır, 5 girdili bir model için az. Model eğitim katlarındaki gürültüyü öğreniyor ve yeni oturumlara genellenemiyor. Eşiği düşürmek ya da girdileri sonuca bakarak değiştirmek yerine daha fazla gerçek veri toplamaya karar verildi.

**Deneme 2 yorumu:** Veri neredeyse iki katına çıkınca AUC 0.53'ten 0.58'e yükseldi, ama eşik geçilemedi. Model hâlâ taban modelle aynı düzeyde (Brier 0.228 ≈ 0.227). Veride yanlış kararların büyük kısmı Karar 2'de (Karar 1: 8/44, Karar 2: 28/44, Karar 3: 10/44). Bu güçlü örüntüye rağmen modelin düşük kalması, diğer girdilerin (özellikle süresi dolan oyunlarda 60 sn'ye fırlayan `onceki_ort_sure_sn`) gürültü eklediğini düşündürüyor. Bu gözlem **veriye bakılarak** yapıldı. Girdiler bu gözleme göre değiştirilirse, bu durum deneme kaydında açıkça belirtilmelidir.
