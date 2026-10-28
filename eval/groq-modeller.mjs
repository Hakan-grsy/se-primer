// Groq hesabında kullanılabilir modelleri listeler (anahtarı yazdırmaz).
// Çalıştırma: node eval/groq-modeller.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', '.env');
const line = readFileSync(envPath, 'utf8').split(/\r?\n/).find((l) => l.startsWith('GROQ_API_KEY='));
const key = line ? line.slice('GROQ_API_KEY='.length).trim().replace(/^"|"$/g, '') : '';
if (!key) throw new Error('app/.env içinde GROQ_API_KEY yok');

const r = await fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: `Bearer ${key}` } });
const j = await r.json();
if (!r.ok) throw new Error(`Groq ${r.status}: ${JSON.stringify(j).slice(0, 200)}`);
for (const m of j.data.sort((a, b) => a.id.localeCompare(b.id))) {
  console.log(`${m.id}  (${m.owned_by}, bağlam ${m.context_window ?? '?'})`);
}
