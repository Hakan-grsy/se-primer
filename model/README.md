---
library_name: onnx
tags:
- tabular-classification
- sklearn
- education
---

# SE Primer v2 — Yanlış karar riski

**Amaç:** SE Primer eğitim oyununda, oyuncu bir karar ekranına geldiğinde o kararı **yanlış verme olasılığını** (`p_yanlis`) tahmin eder. `p_yanlis ≥ 0.5` ise oyunda "Kıdemli meslektaşın Selin arıyor" kartı çıkar ve oyuncuyu cevabı söylemeden düşündürür.

**Model:** `StandardScaler` + `LogisticRegression` (scikit-learn 1.9.1, tohum 42). Dosya: `model.onnx` (opset 17).

## Girdi / çıktı sözleşmesi
- **Girdi:** `input`, float32 `[n, 3]`, sıra aşağıdaki gibi (bkz. `config.json` → `features`).
- **Çıktı:** `probabilities`, float32 `[n, 2]`. Sütun 1 = `p_yanlis`. Ayrıca `label` (0 = doğru, 1 = yanlış; eşik 0,5).

| # | Girdi | Açıklama |
|---|---|---|
| 1 | `seviye_kod` | Seviye (0 = Yeni başladım, 1 = Biraz deneyimim var, 2 = Deneyimliyim) |
| 2 | `karar_2` | Karar 2 mi? (0/1) |
| 3 | `karar_3` | Karar 3 mü? (0/1) |

## Veri
- `data/oturumlar.csv`: 44 gerçek oturum (132 karar), 4 oyuncu (O1, O2, O3, O4). Sentetik satır: 0.
- Yanlış karar oranı (gerçek veri): 0.35.
- Sütunların anlamı: `data/SOZLUK.md`. Kişisel veri yoktur.

## Değerlendirme
Oturuma göre gruplu 5 katlı çapraz doğrulama, yalnızca gerçek satırlar.

| Metrik | Değer |
|---|---|
| ROC AUC (kabul eşiği ≥ 0.6) | **0.6218** |
| Brier skoru (düşük daha iyi) | 0.2021 |
| Brier, taban model (herkese aynı oran) | 0.227 |
| Doğruluk, eşik 0,5 | 0.7424 |
| Selin kartının çıkma oranı | 0.3333 |

## Katsayılar (ölçeklenmiş girdiler üzerinde)
Pozitif katsayı, yanlış yapma olasılığını artırır.

| Girdi | Katsayı |
|---|---|
| `seviye_kod` | -0.066 |
| `karar_2` | +0.919 |
| `karar_3` | +0.096 |

## Sınırlar
- Veri yalnızca 4 kişiden geliyor. Model bu kişilerin alışkanlıklarını öğrenir, genel oyuncu kitlesini temsil etmez.
- Veri çok az (132 satır). Metrikler belirsizdir; yeni bir oyuncuyla değerler belirgin şekilde değişebilir.
- Model yalnızca bu oyundaki 3 karar için anlamlıdır. Başka bir senaryoya taşınamaz.
- Model büyük ölçüde "Karar 2 diğer kararlardan daha riskli" bilgisini taşır. Bu yüzden Selin kartı çoğunlukla Karar 2'de çıkar; oyuncunun davranışına göre kişiselleşme sınırlıdır.
- Bu model 3. denemedir. İlk iki deneme kabul eşiğinin altında kaldı. Girdiler, önceki denemenin sonucuna bakılarak sadeleştirildi; ölçülen AUC bu yüzden biraz iyimser olabilir (bkz. `spec.md` §9.6).

## Kullanılmaması gereken durumlar
- Gerçek bir kişiyi (öğrenci, çalışan, aday) değerlendirmek, notlandırmak ya da sıralamak.
- Gerçek hastane veya sağlık sistemi kararları. Senaryo ve tüm kayıtlar kurgusaldır.
