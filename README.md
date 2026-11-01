# SE Primer v2 — Hikâyeye küçük bir model

YZM301 · Ödev 7. Geçen haftaki *SE Primer* oyununa (yanlış hastaya giden tahlil sonucu krizi), oyuncunun davranışından öğrenen küçük bir model eklendi. Model, oyuncunun bir kararı **yanlış verme olasılığını** tahmin eder. Risk yüksekse oyunda **"Kıdemli meslektaşın Selin arıyor"** kartı çıkar ve oyuncuyu cevabı söylemeden düşündürür.

## Linkler
- **GitHub repo:** https://github.com/Hakan-grsy/se-primer
- **Hugging Face modeli (commit'e sabit):** https://huggingface.co/Hakangrsy/se-primer-yanlis-karar-riski/tree/9b7ba463fd0fd4de4b98cbc52862cafebe189bfa
- **Canlı uygulama (GitHub Pages):** https://hakan-grsy.github.io/se-primer/
  Model tarayıcıda çalışır ve Hugging Face'teki sabit commit'ten indirilir. Sunucusuz yayın olduğu için AI tutor ve veri toplama burada kapalıdır; ikisi de yerel kurulumda çalışır. (v1, AI Studio: https://ai.studio/apps/af5726e6-29ac-45ee-b4fb-c9c934d50b2c)
- **Demo video (66 sn):** [e2e/cypress/videos/demo-v2-mobil.mp4](e2e/cypress/videos/demo-v2-mobil.mp4) _(YouTube linki eklenecek)_
  Canlı sitede iki oyuncu aynı sahnelerden geçer. Ekrandaki risk değerleri modelden o an okunur. Video, bu sürümün sınırını da gösterir: Karar 2'de iki oyuncuya farklı risk hesaplanır (0.650 / 0.609), ama ikisi de eşiğin üstünde kaldığı için kart kararı aynıdır. Yeniden çekmek için: `npm --prefix e2e run test:demo2` (Cypress), sonra telefon ekranına kırpma (ffmpeg).

## Kurulum (3 komut)
```bash
pip install -r requirements.txt
npm --prefix app install
npm --prefix app run dev
```
Uygulama http://localhost:3000 adresinde açılır. Model, Hugging Face'teki sabit commit'ten indirilir. AI tutor için `app/.env` içinde `GEMINI_API_KEY` gerekir; tutor olmadan da oyun ve model çalışır.

## Model akışı
| Adım | Komut / dosya | Sonuç |
|---|---|---|
| 1. Spec | [spec.md §9](spec.md) | Model gereksinimi, metrik, kabul eşiği (AUC ≥ 0.60) ve kabul örnekleri K6–K8. Eğitimden **önce** yazıldı. |
| 2. Veri | [data/oturumlar.csv](data/oturumlar.csv), [data/SOZLUK.md](data/SOZLUK.md) | 4 oyuncudan 44 gerçek oturum (132 karar). Veri toplama: `http://localhost:3000/?veri=1&oyuncu=O1` |
| 3. Eğitim | `python train.py` | Tek komut, sabit tohum. Oturuma göre gruplu 5 katlı CV, yalnızca gerçek veri. Eşik altıysa hata koduyla durur. |
| 4. Paket | [model/](model/) | `model.onnx`, `config.json` (girdi/çıktı sözleşmesi), `README.md` (model kartı) |
| 5. Yayın | `python scripts/hf_yayinla.py` | HF'e yükler, `v2.0` etiketi koyar, sabit adresten indirip SHA-256 doğrular. Ayrıntı: [RELEASE.md](RELEASE.md) |
| 6. Tüketim | [app/src/model/risk.ts](app/src/model/risk.ts) | Tarayıcıda `onnxruntime-web`. Model yüklenemezse oyun v1 gibi devam eder. |

**Eğitim günlüğü:** İlk iki deneme eşiğin altında kaldı (AUC 0.53 ve 0.58) ve model yayınlanmadı. Deneme 3'te girdiler sadeleştirildi, eşik değişmedi: AUC **0.62**. Ayrıntı ve dürüstlük notu: [spec.md §9.6](spec.md).

## Testler
Uygulama `localhost:3000`'de çalışırken:
```bash
python tests/parite.py           # Python oracle: 5 referans, tolerans 1e-4
npm --prefix e2e install
npm --prefix e2e run test:e2e    # 24 test: 8 yol, 8 kabul örneği, 6 model regresyonu, 2 parite
```
- **Diferansiyel test (parite):** [tests/parite.json](tests/parite.json) içindeki 5 girdi hem Python'da hem tarayıcıda (oyun arayüzü üzerinden) çalıştırılır. Fark < 1e-4 olmalı. Tarayıcının indirdiği `model.onnx`'in SHA-256 değeri de kontrol edilir.
- **Regresyon:** Geçen haftanın 16 testi aynen geçiyor. Yeni testler K6/K7'yi, model yüklenemediği durumu, geri dönüş anahtarını ve veri modu kapalıyken veri gönderilmediğini kontrol ediyor.
- Son koşu: **24/24** ([e2e/son-kosu.txt](e2e/son-kosu.txt)).

## Repo yapısı
| Dosya / klasör | İçerik |
|---|---|
| [spec.md](spec.md) | v1 oyun spesifikasyonu + §9 model spesifikasyonu ve eğitim günlüğü |
| [data/](data/) | `oturumlar.csv` (veri), `SOZLUK.md` (veri sözlüğü, KVKK) |
| [train.py](train.py), [requirements.txt](requirements.txt) | Tekrarlanabilir eğitim ve eval kapısı |
| [model/](model/) | `model.onnx`, `config.json`, `README.md` (model kartı) |
| [RELEASE.md](RELEASE.md) | v2.0 sürümü, geri dönüş planı, gölge/kanarya/kademeli dağıtım, ödünleşim matrisi |
| [yayin.json](yayin.json), [scripts/](scripts/) | Hugging Face yayın kaydı ve yayın betiği |
| [tests/](tests/) | `parite.json`, `parite.py` (Python oracle) |
| [e2e/](e2e/) | Cypress: parite, regresyon, geçen haftanın E2E testleri |
| [SINAV_TASARIMI.md](SINAV_TASARIMI.md) | Düşünce egzersizi: sınav tasarımı |
| [app/](app/) | Oyunun kaynak kodu (React + Express) |
| [DESIGN.md](DESIGN.md), [design/](design/), [ai-studio/](ai-studio/), [eval/](eval/) | v1: tasarım, AI Studio prompt'ları, tutor değerlendirmesi |

## Araç kullanımı ve elle düzeltmeler
**Kullanılan araçlar:**
- **Claude Code (Claude Opus 5.5):** Veri toplama modu, `train.py`, parite ve regresyon testleri, Hugging Face yayın betiği ve `RELEASE.md` taslağı. `SINAV_TASARIMI.md`'nin metni de bu araçla yazıldı; senaryo, soru türü ve çeldirici benim seçimim.
- **Geçen hafta (v1):** Stitch (tasarım), Google AI Studio (uygulama), Cypress (E2E).

**Benim verdiğim kararlar:**
- Modelin hedefini (yanlış karar riski) ve oyundaki etkisini (Selin kartı) seçtim.
- Veriyi uydurmak yerine gerçek oturum toplamaya karar verdim. Oyunları kendim ve 3 arkadaşım oynadık.
- Deneme 1 ve 2 eşiği geçemeyince eşiği düşürmek yerine önce daha fazla veri toplamayı, sonra girdileri sadeleştirmeyi seçtim.

**Elle yaptıklarım ve düzelttiklerim:**
- **Veri toplama:** 15 gerçek oturumu kendim oynadım, sonra 3 arkadaşıma oynattım. Bunu bir yapay zekâya uydurtmadım; `kaynak` sütunundaki her satır gerçek bir oyuna ait.
- **Veri etiketi düzeltmesi:** O2 kodlu oturumların ikisini yanlışlıkla kendim oynadığımı fark edip bildirdim. Kontrol edince o iki oturumun zaten O1 (benim kodum) altında kaydedildiği görüldü, yani etiketler doğru çıktı ve veri sözlüğüne bu şekilde yazıldı.
- **Hugging Face hesabı ve erişim anahtarı:** Girişi ve token oluşturmayı kendim yaptım. Anahtarı araca vermedim, yalnızca terminale girdim.
- **Yön kararları:** Model eşiği geçemediğinde eşiği düşürmek yerine daha fazla veri toplamayı ve sonra sade modeli seçtim. Demo videosunda sınırı gizlemek yerine açıkça göstermeyi seçtim.
- **Not:** Claude Code'un yazdığı kodu ve metinleri (README, RELEASE.md, SINAV_TASARIMI.md) satır satır elle düzeltmedim; okuyup onayladım. Düzeltme ve hata ayıklama, araca geri bildirim vererek yapıldı.
