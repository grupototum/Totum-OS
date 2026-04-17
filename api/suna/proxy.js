/**
 * Vercel Serverless — Suna Proxy
 * Proxia chamadas ao Suna self-hosted (evita CORS + expõe API Key)
 *
 * POST /api/suna/proxy
 * Body: { path: string, method?: string, body?: any }
 */

const SUNA_URL   = process.env.VITE_SUNA_URL   || process.env.SUNA_URL   || '';
const SUNA_KEY   = process.env.VITE_SUNA_API_KEY || process.env.SUNA_API_KEY || '';
const TIMEOUT_MS = 120_000;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (!SUNA_URL) {
    return res.status(503).json({
      error: 'Suna não configurado. Defina SUNA_URL nas variáveis de ambiente.',
      configured: false,
    });
  }

  const { path, method = 'GET', body } = req.body || {};
  if (!path) return res.status(400).json({ error: 'Campo "path" obrigatório' });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const upstream = await fetch(`${SUNA_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(SUNA_KEY ? { Authorization: `Bearer ${SUNA_KEY}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }
    const text = await upstream.text();
    return res.status(upstream.status).send(text);

  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return res.status(isTimeout ? 504 : 502).json({
      error: isTimeout
        ? 'Timeout: Suna demorou mais de 120s'
        : `Suna inacessível: ${err.message}`,
    });
  }
}
