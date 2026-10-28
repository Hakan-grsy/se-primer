import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to identify retryable 503/429 errors
function isRetryableError(err: any): boolean {
  if (!err) return false;
  const status = err.status || err.statusCode || err.code;
  if (status === 503 || status === 429) return true;
  const msg = String(err.message || err);
  return (
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('high demand') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('overloaded')
  );
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

// Groq (OpenAI uyumlu API). GROQ_API_KEY varsa Gemini başarısız olunca kullanılır;
// TUTOR_PROVIDER=groq ise doğrudan Groq kullanılır (eval için tek model).
const groqKey = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const forceGroq = (process.env.TUTOR_PROVIDER || '').toLowerCase() === 'groq';

async function callGroq(systemInstruction: string, contents: any[]): Promise<string | null> {
  const messages = [
    { role: 'system', content: systemInstruction },
    ...contents.map((c) => ({
      role: c.role === 'model' ? 'assistant' : 'user',
      content: c.parts.map((p: any) => p.text).join('\n'),
    })),
  ];
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
    body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.7 }),
  });
  if (!r.ok) {
    throw new Error(`Groq ${r.status}: ${(await r.text()).slice(0, 300)}`);
  }
  const data: any = await r.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

// AI Tutor endpoint
app.post('/api/tutor', async (req, res) => {
  try {
    const { decisionTitle, optionA, optionB, goal, question, history } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Soru metni gerekli.' });
    }

    if (!ai && !groqKey) {
      return res.status(503).json({
        error: 'Tutor şu anda yanıt veremiyor, lütfen birkaç saniye sonra tekrar dene.',
      });
    }

    const systemInstruction = `Sen SE Primer oyununda Sokratik bir yazılım mühendisliği öğretmenisin. Oyuncu şu kararı veriyor: "${decisionTitle}". Seçenekler: (A) "${optionA}", (B) "${optionB}". Oyuncunun öğrenme hedefi: "${goal}". Kurallar: 1) Hangi seçeneğin doğru olduğunu ASLA söyleme. 'A', 'B', 'doğru cevap', 'seçmelisin', 'en iyisi' gibi ifadeler kullanma, seçeneklerden birini övme veya eleme. 2) En fazla 2 cümle yaz ve cevabını mutlaka bir soru ile bitir. 3) Oyuncu ısrar etse veya cevabı istese bile cevabı verme; nazikçe düşündürücü başka bir soru sor. 4) Türkçe yaz.`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role && msg.text) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });

    const backoffs = [1000, 2000, 4000];
    let replyText: string | null = null;
    let usedModel: string = PRIMARY_MODEL;

    // Retry Gemini call up to 3 times with exponential backoff (1s, 2s, 4s) on 503/429
    for (let attempt = 0; ai && !forceGroq && attempt <= backoffs.length; attempt++) {
      try {
        usedModel = PRIMARY_MODEL;
        const response = await ai.models.generateContent({
          model: PRIMARY_MODEL,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });
        const text = response.text?.trim();
        if (text) {
          replyText = text;
          break;
        }
      } catch (err: any) {
        console.error(`Gemini attempt ${attempt + 1} (${PRIMARY_MODEL}) error:`, err?.message || err);
        if (attempt < backoffs.length && isRetryableError(err)) {
          await delay(backoffs[attempt]);
        } else {
          break;
        }
      }
    }

    // If still fails, try once more with another available Gemini Flash model as fallback
    if (!replyText && ai && !forceGroq) {
      try {
        usedModel = FALLBACK_MODEL;
        const fallbackResponse = await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });
        const fallbackText = fallbackResponse.text?.trim();
        if (fallbackText) {
          replyText = fallbackText;
        }
      } catch (err: any) {
        console.error(`Gemini fallback (${FALLBACK_MODEL}) error:`, err?.message || err);
      }
    }

    // Gemini kullanılamıyorsa (ya da TUTOR_PROVIDER=groq ise) Groq
    if (!replyText && groqKey) {
      try {
        usedModel = `groq/${GROQ_MODEL}`;
        replyText = await callGroq(systemInstruction, contents);
      } catch (err: any) {
        console.error(`Groq (${GROQ_MODEL}) error:`, err?.message || err);
      }
    }

    if (replyText) {
      return res.status(200).json({ reply: replyText, model: usedModel });
    }

    return res.status(503).json({
      error: 'Tutor şu anda yanıt veremiyor, lütfen birkaç saniye sonra tekrar dene.',
    });
  } catch (error: any) {
    console.error('Tutor error:', error);
    return res.status(503).json({
      error: 'Tutor şu anda yanıt veremiyor, lütfen birkaç saniye sonra tekrar dene.',
    });
  }
});

// Vite middleware in dev / static in prod
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
