// Yanlış karar riski modeli (model/model.onnx) — tarayıcıda onnxruntime-web ile çalışır.
// Girdi sırası ve kodlama config.json'dan okunur; Python tarafı: train.py -> girdi_vektoru().
import * as ort from 'onnxruntime-web';
import { Level } from '../types';

// Model dosyalarının adresi. Varsayılan: uygulama sunucusundaki /model.
// Yayında Hugging Face'teki commit'e sabitlenmiş adres verilir:
//   VITE_MODEL_BASE_URL=https://huggingface.co/<kullanici>/<repo>/resolve/<commit>
const MODEL_BASE_URL = (import.meta.env.VITE_MODEL_BASE_URL as string | undefined) || '/model';

// WASM dosyaları, kurulu paketle aynı sürümden CDN'den yüklenir.
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/';
ort.env.wasm.numThreads = 1;

export interface ModelConfig {
  features: { name: string }[];
  seviye_kod: Record<string, number>;
  mudahale_esigi: number;
  onnx: { input: string; p_yanlis_sutunu: number };
  deneme: number;
}

interface YukluModel {
  session: ort.InferenceSession;
  config: ModelConfig;
}

let yukleniyor: Promise<YukluModel | null> | null = null;

// Modeli bir kez yükler. Hata olursa null döner; oyun modelsiz (v1 gibi) devam eder.
export function modeliYukle(): Promise<YukluModel | null> {
  if (!yukleniyor) {
    yukleniyor = (async () => {
      try {
        const r = await fetch(`${MODEL_BASE_URL}/config.json`);
        if (!r.ok) throw new Error(`config.json HTTP ${r.status}`);
        const config = (await r.json()) as ModelConfig;
        const session = await ort.InferenceSession.create(`${MODEL_BASE_URL}/model.onnx`, {
          executionProviders: ['wasm'],
        });
        return { session, config };
      } catch (err) {
        console.warn('Risk modeli yüklenemedi, oyun modelsiz devam ediyor:', err);
        return null;
      }
    })();
  }
  return yukleniyor;
}

// Karar ekranı açıldığı anda bilinen bilgilerden girdi vektörü (spec.md §9.2).
export function girdiVektoru(config: ModelConfig, seviye: Level, kararNo: number): number[] {
  const degerler: Record<string, number> = {
    seviye_kod: config.seviye_kod[seviye],
    karar_2: kararNo === 2 ? 1 : 0,
    karar_3: kararNo === 3 ? 1 : 0,
  };
  return config.features.map((f) => {
    const v = degerler[f.name];
    if (v === undefined) throw new Error(`Bilinmeyen model girdisi: ${f.name}`);
    return v;
  });
}

// Ham girdi vektörüyle p_yanlis hesaplar (parite testleri de bunu kullanır).
export async function olasilikHesapla(girdi: number[]): Promise<number | null> {
  const m = await modeliYukle();
  if (!m) return null;
  const tensor = new ort.Tensor('float32', Float32Array.from(girdi), [1, girdi.length]);
  const sonuc = await m.session.run({ [m.config.onnx.input]: tensor }, ['probabilities']);
  const p = sonuc.probabilities.data as Float32Array;
  return p[m.config.onnx.p_yanlis_sutunu];
}

export interface RiskSonucu {
  pYanlis: number;
  mudahale: boolean;
}

export async function riskHesapla(seviye: Level, kararNo: number): Promise<RiskSonucu | null> {
  const m = await modeliYukle();
  if (!m) return null;
  const p = await olasilikHesapla(girdiVektoru(m.config, seviye, kararNo));
  if (p === null) return null;
  return { pYanlis: p, mudahale: p >= m.config.mudahale_esigi };
}

// Test ve konsol için: window.primerRisk(girdi) -> p_yanlis
if (typeof window !== 'undefined') {
  (window as any).primerRisk = olasilikHesapla;
}
