// Veri toplama modu: adres çubuğunda ?veri=1 varsa açılır.
// Her karar bir satırdır; oturum bitince 3 satır birlikte sunucuya gönderilir
// ve sunucu bunları data/oturumlar.csv dosyasına ekler.
// Kişisel veri (ad, e-posta, cihaz, konum) tutulmaz; oturum kimliği rastgeledir.

export const VERI_MODU =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('veri') === '1';

// Anonim oyuncu kodu (O1, O2, ...): ?veri=1&oyuncu=O2. Verilmezse O1.
// Gerçek ad yerine kod kullanılır; hangi kodun kime ait olduğu hiçbir yere yazılmaz.
const oyuncuParam = typeof window !== 'undefined'
  ? new URLSearchParams(window.location.search).get('oyuncu') ?? ''
  : '';
export const OYUNCU_KODU = /^O\d{1,2}$/.test(oyuncuParam) ? oyuncuParam : 'O1';

export interface OturumSatiri {
  oturum_id: string;
  kaynak: 'gercek' | 'sentetik';
  oyuncu_kodu: string;
  seviye: string;
  rol: string;
  hedef: string;
  karar_no: number;
  onceki_yanlis_sayisi: number;
  onceki_ort_sure_sn: number;
  karar_suresi_sn: number;
  ipucu_acildi: 0 | 1;
  tereddut_sayisi: number;
  tutor_mesaj_sayisi: number;
  zaman_asimi: 0 | 1;
  secim: 'A' | 'B';
  dogru_mu: 0 | 1;
}

export function yeniOturumId(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return 'o-' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export interface OturumSayilari {
  toplam: number;
  oyuncu: number; // bu oyuncu kodunun oturum sayısı
}

function sayilariOku(data: any): OturumSayilari | null {
  return typeof data?.oturum_sayisi === 'number' && typeof data?.oyuncu_oturum_sayisi === 'number'
    ? { toplam: data.oturum_sayisi, oyuncu: data.oyuncu_oturum_sayisi }
    : null;
}

// Sunucuya gönderir; güncel oturum sayılarını döndürür (hata olursa null).
export async function oturumuKaydet(satirlar: OturumSatiri[]): Promise<OturumSayilari | null> {
  try {
    const r = await fetch('/api/oturum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ satirlar }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return sayilariOku(await r.json());
  } catch (err) {
    console.error('Oturum kaydedilemedi:', err);
    return null;
  }
}

export async function oturumSayisiniGetir(): Promise<OturumSayilari | null> {
  try {
    const r = await fetch(`/api/oturum?oyuncu=${OYUNCU_KODU}`);
    if (!r.ok) return null;
    return sayilariOku(await r.json());
  } catch {
    return null;
  }
}
