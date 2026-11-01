"""model/ klasörünü Hugging Face'e yayınlar ve commit'e sabitlenmiş adresi kaydeder.

Kullanım (proje kökünden, önce bir kez: hf auth login):
    python scripts/hf_yayinla.py                 # varsayılan repo adı ve etiket v2.0
    python scripts/hf_yayinla.py --etiket v2.1   # yeni sürüm

Ne yapar:
  1. Yayın öncesi kontrol: model/ eksiksiz mi, tests/parite.json bu modelle mi üretilmiş?
  2. Public model reposu açar (varsa kullanır), model/ klasörünü yükler.
  3. Yükleme commit'ine sürüm etiketi koyar (ör. v2.0).
  4. Doğrulama: commit'e sabit adresten model.onnx'i indirir, SHA-256 yereldekiyle aynı mı?
  5. Sonucu iki yere yazar:
       yayin.json                   — sürüm geçmişi (RELEASE.md bunu referans alır)
       app/src/model/yayin.json     — uygulamanın modeli indirdiği sabit adres
"""

import argparse
import hashlib
import json
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from huggingface_hub import HfApi
from huggingface_hub.errors import HfHubHTTPError

KOK = Path(__file__).resolve().parent.parent
MODEL_DIR = KOK / "model"
GECMIS = KOK / "yayin.json"
UYGULAMA_AYARI = KOK / "app" / "src" / "model" / "yayin.json"
PARITE = KOK / "tests" / "parite.json"
GEREKLI = ["model.onnx", "config.json", "README.md"]


def sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo-adi", default="se-primer-yanlis-karar-riski")
    ap.add_argument("--etiket", default="v2.0")
    args = ap.parse_args()

    # 1) Yayın öncesi kontrol
    eksik = [f for f in GEREKLI if not (MODEL_DIR / f).exists()]
    if eksik:
        sys.exit(f"✗ model/ eksik: {eksik}. Önce: python train.py")
    yerel_sha = sha256_bytes((MODEL_DIR / "model.onnx").read_bytes())
    parite = json.loads(PARITE.read_text(encoding="utf-8"))
    if parite["model_sha256"] != yerel_sha:
        sys.exit("✗ tests/parite.json başka bir modelle üretilmiş. Önce: python tests/parite.py --uret")
    config = json.loads((MODEL_DIR / "config.json").read_text(encoding="utf-8"))

    api = HfApi()
    try:
        kullanici = api.whoami()["name"]
    except Exception:
        sys.exit("✗ Hugging Face girişi yok. Önce terminalde: hf auth login")
    repo = f"{kullanici}/{args.repo_adi}"

    # 2) Repo ve yükleme
    api.create_repo(repo, repo_type="model", private=False, exist_ok=True)
    m = config["metrics"]
    bilgi = api.upload_folder(
        repo_id=repo,
        repo_type="model",
        folder_path=MODEL_DIR,
        allow_patterns=GEREKLI,
        commit_message=f"{args.etiket}: yanlış karar riski (deneme {config.get('deneme')}, "
                       f"CV AUC {m['roc_auc_cv']})",
    )
    commit = bilgi.oid
    print(f"✓ Yüklendi: {repo} @ {commit}")

    # 3) Sürüm etiketi
    try:
        api.create_tag(repo, tag=args.etiket, revision=commit, repo_type="model")
        print(f"✓ Etiket: {args.etiket} → {commit[:12]}")
    except HfHubHTTPError as e:
        sys.exit(f"✗ Etiket konamadı ({args.etiket} zaten var olabilir; yeni sürüm için --etiket ver): {e}")

    # 4) Commit'e sabit adresten doğrulama
    taban = f"https://huggingface.co/{repo}/resolve/{commit}"
    with urllib.request.urlopen(f"{taban}/model.onnx") as r:
        uzak_sha = sha256_bytes(r.read())
    if uzak_sha != yerel_sha:
        sys.exit(f"✗ İndirilen model.onnx yereldekinden farklı ({uzak_sha} != {yerel_sha})")
    print("✓ Sabit adresten indirilen model.onnx, yereldekiyle birebir aynı (SHA-256)")

    # 5) Kayıtlar
    kayit = {
        "etiket": args.etiket,
        "repo": repo,
        "commit": commit,
        "model_base_url": taban,
        "model_onnx_url": f"{taban}/model.onnx",
        "sayfa": f"https://huggingface.co/{repo}/tree/{commit}",
        "model_sha256": yerel_sha,
        "deneme": config.get("deneme"),
        "metrics": m,
        "tarih": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    gecmis = json.loads(GECMIS.read_text(encoding="utf-8")) if GECMIS.exists() else {"surumler": []}
    gecmis["surumler"].append(kayit)
    GECMIS.write_text(json.dumps(gecmis, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    UYGULAMA_AYARI.write_text(json.dumps({
        "etiket": args.etiket,
        "model_base_url": taban,
        "model_sha256": yerel_sha,
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"✓ yayin.json ve app/src/model/yayin.json güncellendi")
    print(f"\nSabit model adresi:\n  {kayit['model_onnx_url']}")


if __name__ == "__main__":
    main()
