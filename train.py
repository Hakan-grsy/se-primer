"""SE Primer v2 — "yanlış karar riski" modelini eğitir, ölçer ve paketler.

Kullanım (proje kökünden, tek komut):
    python train.py

Ne yapar (spec.md §9):
  1. data/oturumlar.csv dosyasını okur, her karar satırından 5 girdiyi üretir.
  2. Yalnızca kaynak=gercek satırlarla, oturum_id'ye göre gruplu 5 katlı çapraz
     doğrulama yapar ve ROC AUC hesaplar (pozitif sınıf: yanlış karar).
  3. AUC < KABUL_ESIGI ise hata koduyla durur; model dosyası üretilmez.
  4. Geçerse modeli tüm veriyle eğitir ve model/ klasörüne yazar:
     model.onnx, config.json (sözleşme), README.md (model kartı).
  5. ONNX çıktısı sklearn'den 1e-4'ten fazla saparsa hata koduyla durur.

Sabit tohum (SEED) sayesinde aynı veriyle her makinede aynı sonuç çıkar.
"""

import csv
import json
import sys
from pathlib import Path

import numpy as np
import sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss, roc_auc_score
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

KOK = Path(__file__).resolve().parent
VERI = KOK / "data" / "oturumlar.csv"
MODEL_DIR = KOK / "model"

SEED = 42
KABUL_ESIGI = 0.60      # spec.md §9.3 — eğitimden önce yazıldı, değiştirilmez
MUDAHALE_ESIGI = 0.50   # p_yanlis bu değere eşit/büyükse Selin kartı çıkar (spec.md §9.1)
ONNX_TOLERANS = 1e-4
KAT_SAYISI = 5

SEVIYE_KOD = {"Yeni başladım": 0, "Biraz deneyimim var": 1, "Deneyimliyim": 2}

# Sıra önemli: model.onnx girdisi bu sırayla beklenir (config.json -> features).
OZELLIKLER = [
    ("seviye_kod", "Seviye (0 = Yeni başladım, 1 = Biraz deneyimim var, 2 = Deneyimliyim)"),
    ("karar_2", "Karar 2 mi? (0/1)"),
    ("karar_3", "Karar 3 mü? (0/1)"),
    ("onceki_yanlis_sayisi", "Bu oturumda önceki yanlış karar sayısı"),
    ("onceki_ort_sure_sn", "Önceki kararların ortalama süresi (sn); Karar 1'de 0"),
]


def girdi_vektoru(satir: dict) -> list[float]:
    """Bir CSV satırını model girdisine çevirir. Uygulamadaki karşılığı aynı kuralı izlemeli."""
    karar_no = int(satir["karar_no"])
    return [
        float(SEVIYE_KOD[satir["seviye"]]),
        1.0 if karar_no == 2 else 0.0,
        1.0 if karar_no == 3 else 0.0,
        float(satir["onceki_yanlis_sayisi"]),
        float(satir["onceki_ort_sure_sn"]),
    ]


def veriyi_oku():
    with open(VERI, encoding="utf-8", newline="") as f:
        satirlar = list(csv.DictReader(f))
    if not satirlar:
        sys.exit(f"✗ {VERI} boş.")
    X = np.array([girdi_vektoru(s) for s in satirlar], dtype=np.float64)
    y = np.array([1 - int(s["dogru_mu"]) for s in satirlar], dtype=np.int64)  # 1 = yanlış karar
    gruplar = np.array([s["oturum_id"] for s in satirlar])
    gercek = np.array([s["kaynak"] == "gercek" for s in satirlar])
    oyuncular = sorted({s["oyuncu_kodu"] for s in satirlar if s["kaynak"] == "gercek"})
    return X, y, gruplar, gercek, oyuncular


def yeni_model() -> Pipeline:
    return Pipeline([
        ("scaler", StandardScaler()),
        ("lr", LogisticRegression(random_state=SEED)),
    ])


def capraz_dogrulama(X, y, gruplar, gercek):
    """Gruplu k katlı doğrulama. Test katları yalnızca gerçek satırlardan oluşur;
    sentetik satırlar (varsa) yalnızca eğitim katlarına eklenir."""
    Xg, yg, gg = X[gercek], y[gercek], gruplar[gercek]
    Xs, ys = X[~gercek], y[~gercek]
    oof = np.zeros(len(yg))
    for egitim, test in GroupKFold(n_splits=KAT_SAYISI).split(Xg, yg, gg):
        X_tr = np.vstack([Xg[egitim], Xs])
        y_tr = np.concatenate([yg[egitim], ys])
        model = yeni_model().fit(X_tr, y_tr)
        oof[test] = model.predict_proba(Xg[test])[:, 1]
    taban = np.full(len(yg), yg.mean())
    return {
        "roc_auc_cv": round(float(roc_auc_score(yg, oof)), 4),
        "brier_cv": round(float(brier_score_loss(yg, oof)), 4),
        "brier_taban": round(float(brier_score_loss(yg, taban)), 4),
        "dogruluk_cv_esik_0_5": round(float(((oof >= MUDAHALE_ESIGI) == yg).mean()), 4),
        "mudahale_orani_cv": round(float((oof >= MUDAHALE_ESIGI).mean()), 4),
    }


def onnx_aktar(model: Pipeline, X_ornek: np.ndarray) -> float:
    """model.onnx yazar ve sklearn ile farkını döndürür (başlangıç reposundaki sözleşme).

    Girdi: float32 [n, 5] tensörü 'input'. Çıktı: 'label' [n] ve 'probabilities' [n, 2]
    (zipmap kapalı). probabilities[:, 1] = p_yanlis.
    """
    import onnxruntime as ort
    from skl2onnx import to_onnx
    from skl2onnx.common.data_types import FloatTensorType

    onx = to_onnx(
        model,
        initial_types=[("input", FloatTensorType([None, X_ornek.shape[1]]))],
        options={id(model): {"zipmap": False}},
        target_opset=17,
    )
    yol = MODEL_DIR / "model.onnx"
    yol.write_bytes(onx.SerializeToString())

    X32 = X_ornek.astype(np.float32)
    oturum = ort.InferenceSession(str(yol), providers=["CPUExecutionProvider"])
    p_onnx = oturum.run(["probabilities"], {"input": X32})[0]
    fark = float(np.abs(p_onnx - model.predict_proba(X32)).max())
    if fark > ONNX_TOLERANS:
        yol.unlink()
        sys.exit(f"✗ ONNX çıktısı sklearn'den sapıyor (maks fark {fark:.2e} > {ONNX_TOLERANS}). model.onnx silindi.")
    return fark


def model_karti(config: dict) -> str:
    m = config["metrics"]
    v = config["veri"]
    katsayilar = "\n".join(
        f"| `{ad}` | {k:+.3f} |" for ad, k in config["katsayilar_olcekli"].items()
    )
    return f"""---
library_name: onnx
tags:
- tabular-classification
- sklearn
- education
---

# SE Primer v2 — Yanlış karar riski

**Amaç:** SE Primer eğitim oyununda, oyuncu bir karar ekranına geldiğinde o kararı **yanlış verme olasılığını** (`p_yanlis`) tahmin eder. `p_yanlis ≥ {config['mudahale_esigi']}` ise oyunda "Kıdemli meslektaşın Selin arıyor" kartı çıkar ve oyuncuyu cevabı söylemeden düşündürür.

**Model:** `StandardScaler` + `LogisticRegression` (scikit-learn {config['sklearn_version']}, tohum {config['seed']}). Dosya: `model.onnx` (opset 17).

## Girdi / çıktı sözleşmesi
- **Girdi:** `input`, float32 `[n, {len(config['features'])}]`, sıra aşağıdaki gibi (bkz. `config.json` → `features`).
- **Çıktı:** `probabilities`, float32 `[n, 2]`. Sütun 1 = `p_yanlis`. Ayrıca `label` (0 = doğru, 1 = yanlış; eşik 0,5).

| # | Girdi | Açıklama |
|---|---|---|
""" + "\n".join(
        f"| {i + 1} | `{o['name']}` | {o['label']} |" for i, o in enumerate(config["features"])
    ) + f"""

## Veri
- `data/oturumlar.csv`: {v['gercek_oturum']} gerçek oturum ({v['gercek_satir']} karar), {v['oyuncu_sayisi']} oyuncu ({', '.join(v['oyuncular'])}). Sentetik satır: {v['sentetik_satir']}.
- Yanlış karar oranı (gerçek veri): {v['yanlis_orani']:.2f}.
- Sütunların anlamı: `data/SOZLUK.md`. Kişisel veri yoktur.

## Değerlendirme
Oturuma göre gruplu {config['kabul']['kat_sayisi']} katlı çapraz doğrulama, yalnızca gerçek satırlar.

| Metrik | Değer |
|---|---|
| ROC AUC (kabul eşiği ≥ {config['kabul']['min']}) | **{m['roc_auc_cv']}** |
| Brier skoru (düşük daha iyi) | {m['brier_cv']} |
| Brier, taban model (herkese aynı oran) | {m['brier_taban']} |
| Doğruluk, eşik 0,5 | {m['dogruluk_cv_esik_0_5']} |
| Selin kartının çıkma oranı | {m['mudahale_orani_cv']} |

## Katsayılar (ölçeklenmiş girdiler üzerinde)
Pozitif katsayı, yanlış yapma olasılığını artırır.

| Girdi | Katsayı |
|---|---|
{katsayilar}

## Sınırlar
- Veri yalnızca {v['oyuncu_sayisi']} kişiden geliyor. Model bu kişilerin alışkanlıklarını öğrenir, genel oyuncu kitlesini temsil etmez.
- Veri çok az ({v['gercek_satir']} satır). Metrikler belirsizdir; yeni bir oyuncuyla değerler belirgin şekilde değişebilir.
- Model yalnızca bu oyundaki 3 karar için anlamlıdır. Başka bir senaryoya taşınamaz.

## Kullanılmaması gereken durumlar
- Gerçek bir kişiyi (öğrenci, çalışan, aday) değerlendirmek, notlandırmak ya da sıralamak.
- Gerçek hastane veya sağlık sistemi kararları. Senaryo ve tüm kayıtlar kurgusaldır.
"""


def main():
    X, y, gruplar, gercek, oyuncular = veriyi_oku()
    n_gercek_oturum = len(set(gruplar[gercek]))
    print(f"Veri: {len(y)} satır ({int(gercek.sum())} gerçek, {int((~gercek).sum())} sentetik), "
          f"{n_gercek_oturum} gerçek oturum, oyuncular: {', '.join(oyuncular)}")

    metrikler = capraz_dogrulama(X, y, gruplar, gercek)
    print(f"Çapraz doğrulama ({KAT_SAYISI} kat, oturuma göre gruplu, yalnızca gerçek veri):")
    for k, v in metrikler.items():
        print(f"  {k}: {v}")

    if metrikler["roc_auc_cv"] < KABUL_ESIGI:
        sys.exit(f"✗ KABUL EDİLMEDİ: ROC AUC {metrikler['roc_auc_cv']} < {KABUL_ESIGI}. "
                 f"Model yayınlanmaz, model/ klasörüne dokunulmadı.")
    print(f"✓ Kabul eşiği geçildi (ROC AUC {metrikler['roc_auc_cv']} ≥ {KABUL_ESIGI})")

    model = yeni_model().fit(X, y)
    MODEL_DIR.mkdir(exist_ok=True)
    fark = onnx_aktar(model, X)
    print(f"✓ model/model.onnx yazıldı (sklearn ile maks fark {fark:.1e})")

    Xg = X[gercek]
    ornek_satir = Xg[np.argmax(model.predict_proba(Xg)[:, 1])]
    config = {
        "title": "SE Primer v2 — yanlış karar riski",
        "description": "Oyuncunun bir karar ekranında yanlış seçim yapma olasılığı (p_yanlis). "
                       "Yalnızca eğitim oyunu içindir; kişileri değerlendirmek için KULLANILMAZ.",
        "target": "yanlis",
        "class_labels": {"0": "doğru karar", "1": "yanlış karar"},
        "classes": [str(c) for c in model.classes_],
        "onnx": {"input": "input", "outputs": ["label", "probabilities"], "p_yanlis_sutunu": 1},
        "features": [
            {"name": ad, "label": etiket, "example": float(ornek_satir[i])}
            for i, (ad, etiket) in enumerate(OZELLIKLER)
        ],
        "seviye_kod": SEVIYE_KOD,
        "mudahale_esigi": MUDAHALE_ESIGI,
        "kabul": {"metric": "roc_auc_cv", "min": KABUL_ESIGI, "kat_sayisi": KAT_SAYISI,
                  "yontem": "GroupKFold (oturum_id), yalnızca kaynak=gercek"},
        "metrics": metrikler,
        "katsayilar_olcekli": {
            ad: round(float(k), 4) for (ad, _), k in zip(OZELLIKLER, model.named_steps["lr"].coef_[0])
        },
        "veri": {
            "dosya": "data/oturumlar.csv",
            "gercek_satir": int(gercek.sum()),
            "sentetik_satir": int((~gercek).sum()),
            "gercek_oturum": n_gercek_oturum,
            "oyuncular": oyuncular,
            "oyuncu_sayisi": len(oyuncular),
            "yanlis_orani": round(float(y[gercek].mean()), 4),
        },
        "seed": SEED,
        "sklearn_version": sklearn.__version__,
        "python_version": f"{sys.version_info.major}.{sys.version_info.minor}",
    }
    (MODEL_DIR / "config.json").write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (MODEL_DIR / "README.md").write_text(model_karti(config), encoding="utf-8")
    print(f"✓ model/config.json ve model/README.md yazıldı")


if __name__ == "__main__":
    main()
