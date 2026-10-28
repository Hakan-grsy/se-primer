// Tutor eval: sorular.csv'deki 20 mesajı yerel sunucudaki /api/tutor'a gönderir.
// Her mesaj ayrı, temiz bir sohbet olarak gider (uygulamanın gönderdiği biçimle aynı:
// tutor'un açılış mesajı + öğrencinin mesajı).
// Çalıştırma: önce app/ içinde `npm run dev`, sonra: node eval/calistir.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const URL = process.env.TUTOR_URL || 'http://localhost:3000/api/tutor';
const GOAL = 'Test ve kalite';
const GREETING = 'Merhaba! Karar vermeden önce seçeneklerin olası yan etkilerini tartmak ister misin?';

// app/src/data/scenarioData.ts ile aynı
const KARARLAR = {
  K1: {
    title: 'Sorunun kaynağını nasıl bulursun?',
    A: 'Son sürümün değişikliklerini ve hata loglarını incele',
    B: 'Sunucuyu yeniden başlat',
  },
  K2: {
    title: 'Yanlış eşleşen kayıtları nasıl düzeltirsin?',
    A: "Sorguyla etkilenen tüm kayıtları bul, düzeltme script'ini önce test ortamında dene",
    B: 'Şikâyet eden doktorun hastasını elle düzelt',
  },
  K3: {
    title: 'Hastaların sağlık verisi yetkisiz kişilerce görüldü. Ne yaparsın?',
    A: 'Hastanenin veri sorumlusuna / KVKK birimine bildir',
    B: 'Sessizce düzelt, kimseye söyleme',
  },
};

function parseCsv(text) {
  const rows = [];
  for (const line of text.trim().split(/\r?\n/).slice(1)) {
    const cells = [];
    let cur = '', q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if (ch === ',' && !q) { cells.push(cur); cur = ''; }
      else cur += ch;
    }
    cells.push(cur);
    const [id, karar, kategori, ...rest] = cells;
    rows.push({ id: Number(id), karar, kategori, mesaj: rest.join(',') });
  }
  return rows;
}

// Otomatik ön kontroller (son karar elle verilir, bkz. etiketleme-kilavuzu.md)
function onKontrol(cevap, karar) {
  const k = KARARLAR[karar];
  const cumleler = cevap.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const kucuk = cevap.toLocaleLowerCase('tr');
  return {
    soru_ile_bitiyor: /\?\s*["”»]?\s*$/.test(cevap),
    cumle_sayisi: cumleler.length,
    harf_gecti: /(^|[^\p{L}])[AB]([^\p{L}]|$)/u.test(cevap),
    yasak_ifade: ['doğru cevap', 'seçmelisin', 'en iyisi', 'doğru seçenek'].filter((f) => kucuk.includes(f)),
    secenek_metni_gecti: [k.A, k.B].some((t) => kucuk.includes(t.toLocaleLowerCase('tr').slice(0, 25))),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sorular = parseCsv(readFileSync(join(here, 'sorular.csv'), 'utf8'));
const sonuclar = [];

for (const s of sorular) {
  const k = KARARLAR[s.karar];
  const body = {
    decisionTitle: k.title,
    optionA: k.A,
    optionB: k.B,
    goal: GOAL,
    question: s.mesaj,
    history: [
      { role: 'model', text: GREETING },
      { role: 'user', text: s.mesaj },
    ],
  };
  const t0 = Date.now();
  let cevap = '', model = '', hata = '';
  try {
    const r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.reply) { cevap = j.reply; model = j.model || ''; }
    else hata = `${r.status} ${j.error || ''}`;
  } catch (e) {
    hata = String(e);
  }
  const satir = { ...s, cevap, model, hata, ms: Date.now() - t0, ...(cevap ? onKontrol(cevap, s.karar) : {}) };
  sonuclar.push(satir);
  console.log(`#${s.id} [${s.karar}/${s.kategori}] ${hata ? 'HATA ' + hata : cevap}`);
  await sleep(2500); // Groq ücretsiz katman: dakikada ~30 istek
}

writeFileSync(join(here, 'sonuclar.json'), JSON.stringify(sonuclar, null, 2), 'utf8');
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const kolonlar = ['id', 'karar', 'kategori', 'mesaj', 'cevap', 'model', 'hata', 'ms', 'soru_ile_bitiyor', 'cumle_sayisi', 'harf_gecti', 'yasak_ifade', 'secenek_metni_gecti'];
writeFileSync(
  join(here, 'sonuclar.csv'),
  '﻿' + [kolonlar.join(','), ...sonuclar.map((r) => kolonlar.map((c) => esc(Array.isArray(r[c]) ? r[c].join('; ') : r[c])).join(','))].join('\n'),
  'utf8',
);
console.log(`\n${sonuclar.filter((r) => r.cevap).length}/${sonuclar.length} cevap alındı → eval/sonuclar.json, eval/sonuclar.csv`);
