"""Parite testi — Python tarafı (Test Kahini / Oracle).

Aynı model/model.onnx dosyasını Python'da onnxruntime ile çalıştırır.
Tarayıcıdaki uygulama (onnxruntime-web) aynı girdiler için aynı olasılığı
1e-4 toleransla vermelidir; bunu e2e/cypress/e2e/parite.cy.js kontrol eder.

Kullanım (proje kökünden):
    python tests/parite.py --uret   # 5 referansı hesaplar, tests/parite.json'a yazar
    python tests/parite.py          # parite.json'u bugünkü modelle doğrular

Doğrulama şunları kontrol eder:
  1. model.onnx değişmemiş mi? (SHA-256 parite.json'dakiyle aynı)
  2. Girdi vektörü, train.py'deki girdi_vektoru() ile aynı mı? (özellik kodlaması)
  3. Python'un bugünkü çıktısı, kayıtlı olasılıkla 1e-4 içinde mi?
  4. Müdahale kararı (p >= mudahale_esigi) kayıtlı beklentiyle aynı mı?
"""

import hashlib
import json
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort

KOK = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(KOK))
from train import girdi_vektoru  # noqa: E402  (eğitimdeki kodlamanın aynısı)

MODEL = KOK / "model" / "model.onnx"
CONFIG = KOK / "model" / "config.json"
PARITE = KOK / "tests" / "parite.json"
TOLERANS = 1e-4

# 5 referans durum: her seviye en az bir kez, her karar en az bir kez,
# Selin kartının hem çıktığı hem çıkmadığı durumlar.
REFERANSLAR = [
    {"ad": "yeni-k1", "seviye": "Yeni başladım", "karar_no": 1},
    {"ad": "yeni-k2", "seviye": "Yeni başladım", "karar_no": 2},
    {"ad": "biraz-k2", "seviye": "Biraz deneyimim var", "karar_no": 2},
    {"ad": "biraz-k3", "seviye": "Biraz deneyimim var", "karar_no": 3},
    {"ad": "deneyimli-k1", "seviye": "Deneyimliyim", "karar_no": 1},
]


def sha256(yol: Path) -> str:
    return hashlib.sha256(yol.read_bytes()).hexdigest()


def python_olasilik(oturum: ort.InferenceSession, girdi: list[float], sutun: int) -> float:
    x = np.array([girdi], dtype=np.float32)
    return float(oturum.run(["probabilities"], {"input": x})[0][0, sutun])


def main():
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    sutun = config["onnx"]["p_yanlis_sutunu"]
    esik = config["mudahale_esigi"]
    oturum = ort.InferenceSession(str(MODEL), providers=["CPUExecutionProvider"])

    if "--uret" in sys.argv:
        durumlar = []
        for r in REFERANSLAR:
            girdi = girdi_vektoru(r)
            p = python_olasilik(oturum, girdi, sutun)
            durumlar.append({**r, "girdi": girdi, "p_yanlis": round(p, 8), "mudahale": p >= esik})
        PARITE.write_text(json.dumps({
            "aciklama": "Python (onnxruntime) referans olasılıkları. Tarayıcı aynı girdilerle "
                        f"{TOLERANS} toleransla aynı sonucu vermeli.",
            "model_sha256": sha256(MODEL),
            "girdi_sirasi": [f["name"] for f in config["features"]],
            "mudahale_esigi": esik,
            "tolerans": TOLERANS,
            "durumlar": durumlar,
        }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"✓ {len(durumlar)} referans yazıldı → {PARITE.relative_to(KOK)}")
        for d in durumlar:
            print(f"  {d['ad']:13} girdi={d['girdi']}  p_yanlis={d['p_yanlis']:.6f}  Selin={d['mudahale']}")
        return

    parite = json.loads(PARITE.read_text(encoding="utf-8"))
    hatalar = []
    if parite["model_sha256"] != sha256(MODEL):
        hatalar.append("model.onnx değişmiş: parite.json'u 'python tests/parite.py --uret' ile yeniden üret")
    for d in parite["durumlar"]:
        girdi = girdi_vektoru(d)
        if girdi != d["girdi"]:
            hatalar.append(f"{d['ad']}: girdi kodlaması değişmiş ({girdi} != {d['girdi']})")
        p = python_olasilik(oturum, girdi, sutun)
        fark = abs(p - d["p_yanlis"])
        durum = "✓" if fark < TOLERANS else "✗"
        print(f"  {durum} {d['ad']:13} p_yanlis={p:.6f}  kayıtlı={d['p_yanlis']:.6f}  fark={fark:.1e}")
        if fark >= TOLERANS:
            hatalar.append(f"{d['ad']}: fark {fark:.1e} >= {TOLERANS}")
        if (p >= esik) != d["mudahale"]:
            hatalar.append(f"{d['ad']}: müdahale kararı değişmiş")

    if hatalar:
        sys.exit("✗ PARİTE HATASI:\n  " + "\n  ".join(hatalar))
    print(f"✓ Python parite testi geçti ({len(parite['durumlar'])} durum, tolerans {TOLERANS})")


if __name__ == "__main__":
    main()
