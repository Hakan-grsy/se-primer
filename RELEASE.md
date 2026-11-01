# RELEASE — SE Primer v2.0

## Özet
| | |
|---|---|
| **Sürüm** | v2.0 (ilk model sürümü; v1 = modelsiz oyun) |
| **Tarih** | 1 Kasım 2026 |
| **Model** | Yanlış karar riski — StandardScaler + LogisticRegression, 3 girdi ([spec.md §9](spec.md)) |
| **Hugging Face** | [`Hakangrsy/se-primer-yanlis-karar-riski`](https://huggingface.co/Hakangrsy/se-primer-yanlis-karar-riski/tree/9b7ba463fd0fd4de4b98cbc52862cafebe189bfa), etiket `v2.0` |
| **Sabitlenen commit** | `9b7ba463fd0fd4de4b98cbc52862cafebe189bfa` |
| **model.onnx SHA-256** | `4946970249c2983da0e6a46c26db4a5dbfdb11cc69b42cb132452f557a139fce` |
| **Metrikler (gerçek veri, gruplu 5 katlı CV)** | ROC AUC **0.6218** (eşik ≥ 0.60), Brier 0.202 (taban 0.227) |
| **Testler** | Python parite 5/5; Cypress 24/24 ([e2e/son-kosu.txt](e2e/son-kosu.txt)) |

Uygulamanın modeli indirdiği adres (commit'e sabit):
```
https://huggingface.co/Hakangrsy/se-primer-yanlis-karar-riski/resolve/9b7ba463fd0fd4de4b98cbc52862cafebe189bfa/model.onnx
```

## v2.0'da ne değişti?
- **Oyun:** Karar ekranı açılınca model, oyuncunun bu kararı yanlış verme olasılığını (`p_yanlis`) hesaplar. `p_yanlis ≥ 0.50` ise "Kıdemli meslektaşın Selin arıyor" kartı çıkar ve oyuncuyu, cevabı söylemeden düşündürür. Şu anki modelde bu kart **her seviyede yalnızca Karar 2'de** çıkar (Karar 2'de risk 0.61–0.65, diğerlerinde 0.18–0.24).
- **Model:** Tarayıcıda `onnxruntime-web` ile çalışır. Model yüklenemezse oyun çökmez, v1 gibi devam eder.
- **Veri:** 4 oyuncudan 44 gerçek oturum (132 karar). Veri toplama modu (`?veri=1`) yalnızca yerelde açıktır ([data/SOZLUK.md](data/SOZLUK.md)).
- **Süreç:** İlk iki eğitim denemesi kabul eşiğinin altında kaldı ve model yayınlanmadı. Deneme 3'te girdiler sadeleştirildi, eşik değiştirilmedi ([spec.md §9.6](spec.md)).

## Neden `main` değil, commit?
`.../resolve/main/model.onnx` adresi, HF reposuna her yükleme yapıldığında başka bir dosyayı gösterir. Bu durumda yayındaki uygulama, kimse fark etmeden test edilmemiş bir modele geçebilir. Commit'e sabit adres ise hiç değişmez. Yeni bir model, ancak uygulamadaki adres bilerek değiştirilip testlerden geçtikten sonra devreye girer. Parite testi, uygulamanın gerçekten indirdiği dosyanın SHA-256 değerini Python'un kullandığı dosyayla karşılaştırır.

## Geri dönüş (rollback) planı
**Ne zaman geri dönülür?**
- Selin kartı yanlış kararda çıkıyor ya da cevabı veriyor (K6/K7 ihlali).
- Model yüklenirken oyun yavaşlıyor ya da hata veriyor.
- Parite testi kırılıyor (tarayıcı ile Python arasındaki fark ≥ 1e-4).
- Oyuncu geri bildirimi: kart dikkat dağıtıyor ya da oyunu bozuyor.

**Nasıl geri dönülür?** v2.0 ilk model sürümü olduğu için önceki sürüm "modelsiz oyun"dur (v1).

| Seçenek | Ne yapılır | Etki | Süre |
|---|---|---|---|
| **1. Modeli kapat** (önerilen) | `VITE_MODEL_KAPALI=1` ile yeniden derle ve yayınla | Model hiç indirilmez, oyun v1 gibi çalışır. Testli: `model-regresyon.cy.js` | Bir derleme + yayın |
| **2. Önceki model sürümüne dön** (v2.1 ve sonrası için) | `app/src/model/yayin.json` dosyasındaki commit'i [yayin.json](yayin.json) geçmişindeki bir önceki sürümün commit'iyle değiştir (ya da o commit'i `git revert` et), testleri çalıştır, yayınla | Uygulama eski modeli indirir. HF'teki eski commit'ler silinmediği için eski adres her zaman çalışır | Bir derleme + yayın |
| **3. Kod düzeyinde geri dönüş** | Uygulamayı v1 commit'ine (`6f6f8e1`) döndür | Veri toplama modu dahil tüm v2 değişiklikleri gider | Bir derleme + yayın |

**Kural:** HF'te yayınlanmış bir commit ya da etiket **silinmez** ve üzerine yazılmaz. Düzeltme her zaman yeni bir sürümdür (v2.0.1, v2.1).

## Yeni sürümü güvenli devreye alma
v2.0 öğrenci projesi olarak doğrudan yayınlandı, çünkü uygulamanın kullanıcı trafiğini bölecek bir sunucusu yok. Aşağıdaki plan, oyunun gerçek oyunculara açıldığı durum (ör. bir derste 100 öğrenci) için yazıldı. Bu aşamalar **henüz kodda uygulanmadı**; uygulanması için gereken değişiklikler her aşamada belirtildi.

### 1. Gölge dağıtım (Shadow Deployment)
- **Ne:** Yeni model herkes için çalışır ve `p_yanlis` hesaplanıp kaydedilir, ama Selin kartı **gösterilmez**. Oyuncu v1 deneyimini yaşar.
- **Bizim senaryoda neden önemli:** Selin kartı kararı etkilediği anda modelin tahmini kendi sonucunu bozar: kart çıktığı için oyuncu doğru seçer ve model "yanıldı" gibi görünür. Gölge modda kart çıkmadığı için modelin tahmini oyuncunun **doğal** kararıyla karşılaştırılabilir. Gerçek dünyadaki AUC'yi ölçmenin temiz yolu budur.
- **Gereken:** Veri toplama modundaki satıra `p_yanlis` sütunu eklenir, kart gizlenir (ör. `?model=golge`).
- **Geçiş kriteri:** En az 30 yeni oturumda, yeni oyuncularla ölçülen AUC ≥ 0.60.

### 2. Kanarya dağıtım (Canary Deployment)
- **Ne:** Oyuncuların yaklaşık %5'i yeni sürümü (Selin kartı açık) görür, geri kalanı eski sürümde kalır.
- **Nasıl seçilir:** Rastgele `oturum_id`'nin özetine göre (ör. `hash(oturum_id) % 100 < 5`). Hesap ya da kişisel veri gerekmez.
- **İzlenen:** Karar 2'deki doğru oranı (kart burada çıkıyor), oyunu bitirme oranı, model yükleme hatası oranı.
- **Geri çekme kriteri:** Model hata oranı > %1 ya da bitirme oranı eski sürüme göre belirgin şekilde düşük.

### 3. Kademeli yayılım (Progressive Rollout)
- **Adımlar:** %5 → %25 → %50 → %100. Her adımda en az bir ders oturumu boyunca bekle ve kanaryadaki ölçütlere bak.
- **Bizim senaryoda başarı:** Kart gösterilen grupta Karar 2'deki doğru oranı, gösterilmeyen gruba göre artıyor; bitirme oranı düşmüyor.
- **Sorun olursa:** Oran bir önceki adıma çekilir. Ciddi bir sorunda yukarıdaki geri dönüş planındaki 1. seçenek uygulanır.

## Mimari karar: model nerede çalışmalı? (ödünleşim matrisi)
Ölçümler: `model.onnx` 492 bayt; tarayıcıda onnxruntime WASM dosyası ~3.2 MB (bir kez indirilir, önbelleğe alınır); HF'ten ilk indirme `config.json` ~0.4 sn, `model.onnx` ~0.8 sn; tek tahmin < 0.1 ms.

| Soru | Tarayıcı (`onnxruntime-web`) ✅ seçildi | Cihaz içi mobil (React Native/Expo, `onnxruntime-react-native`) | Kendi sunucumuz (Render.com, Rails API / FastAPI) |
|---|---|---|---|
| **1. İnternet ve gecikme** | İlk açılışta model ve WASM bir kez indirilir (~3.2 MB, ölçülen HF indirmesi < 1 sn). Sonra her tahmin cihazda, < 0.1 ms. Sayfa açıldıktan sonra internet gerekmez. | Model uygulamanın içinde gelir, ilk açılıştan itibaren internetsiz çalışır. Uygulama boyutu, native çalışma zamanı kadar büyür. | Her karar ekranında bir ağ isteği gerekir (on–yüzlerce ms). Ücretsiz katmanda sunucu uykudan uyanırken ilk istek çok uzun sürebilir. İnternet yoksa model çalışmaz. |
| **2. Veri cihazdan çıkıyor mu? (KVKK)** | Hayır. Seviye ve karar numarası tarayıcıda kalır. | Hayır. | Evet. Her istekte girdiler ve sunucu kayıtlarında IP adresi gider. Bugünkü girdiler hassas değil, ama sonraki sürümlerde süre ve tereddüt gibi davranış verisi gidecek. |
| **3. Model gizli kalıyor mu? (tersine mühendislik)** | Hayır. `model.onnx` herkese açık ve katsayılar okunabilir. | Hayır. Model uygulama paketinden çıkarılabilir. | Dosya gizli kalır. Ama bu modelin yalnızca **9 olası girdisi** var (3 seviye × 3 karar). 9 istekle tüm davranışı birebir kopyalanabilir, yani gizlilik pratikte yok. |
| **Bakım ve maliyet** | Ücretsiz statik yayın (AI Studio / GitHub Pages). Sunucu yok. | Mağaza yayını ve sürüm onayı gerekir. Model güncellemesi uygulama güncellemesi ister (ya da indirme mantığı yazılır). | Ücretsiz katman sınırlı. Sunucu bakımı, izleme ve güvenlik güncellemesi gerekir. |

**Karar: tarayıcı.** Uygulama zaten mobil uyumlu bir web oyunu. Tarayıcı seçeneği gecikmede en iyisi, veriyi cihazda tutuyor (KVKK) ve ücretsiz. Modelin gizli kalmaması bir kayıp değil: model eğitim amaçlı ve herkese açık yayınlanıyor, bilinen tek "sırrı" da Karar 2'nin zor olduğu. Kartın çıkması oyuncuya hangi kararın zor olduğunu gösterir, ama cevabı söylemez.

**Bu kararı ne değiştirir?** Model büyür (MB'larca) ya da gizli tutulması gereken bilgi taşırsa sunucu tarafı düşünülür. Oyun internetin zayıf olduğu yerlerde dağıtılırsa cihaz içi mobil uygulama öne çıkar.

## Yeni sürüm yayınlama kontrol listesi
```bash
python train.py                               # eşik altıysa durur, yayın yapılmaz
python tests/parite.py --uret                 # yeni referanslar
python tests/parite.py
python scripts/hf_yayinla.py --etiket v2.1    # yükler, etiketler, indirip doğrular, yayin.json'u günceller
npm --prefix e2e run test:e2e                 # uygulama localhost:3000'de çalışırken
```
Sonra bu dosyaya yeni sürümün bölümü eklenir ve uygulama yayınlanır. Dağıtım, yukarıdaki gölge → kanarya → kademeli sırasıyla yapılır.

## Bilinen sınırlar (v2.0)
- Veri 4 kişiden geliyor (44 oturum). Model bu kişilerin alışkanlıklarını öğrenir.
- Ölçülen AUC (0.62) eşiğin hemen üstünde. Girdiler önceki denemeye bakılarak seçildiği için biraz iyimser olabilir. Gölge dağıtımda yeni oyuncularla yeniden ölçülmeli.
- Model oyuncuya göre değil, kararın zorluğuna göre tepki veriyor. Oyuncu davranışını kullanan girdiler (önceki hatalar, süre, tereddüt) v2.1'de daha fazla veriyle yeniden denenecek.
