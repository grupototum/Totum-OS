/**
 * Vercel Serverless Function — ADA Proxy
 * Proxia chamadas ao Codeflow (HTTP) server-side,
 * resolvendo o bloqueio de Mixed Content no browser.
 *
 * Route: POST /api/ada/analyze
 * Body:  { repo: "owner/repo" }
 */

const CODEFLOW_URL = process.env.CODEFLOW_URL || 'http://187.127.4.140:8002/api/parse';
const TIMEOUT_MS = 30_000;

export default async function handler(req, res) {
  // CORS — permite só o domínio do app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repo } = req.body || {};
  if (!repo || typeof repo !== 'string') {
    return res.status(400).json({ error: 'Campo "repo" obrigatório (ex: owner/repo)' });
  }

  // Sanitiza: remove URL completa do GitHub se colada
  const cleanRepo = repo
    .replace(/https?:\/\/github\.com\//i, '')
    .replace(/\.git$/, '')
    .trim();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const upstream = await fetch(CODEFLOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo: cleanRepo }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => 'Erro desconhecido');
      return res.status(upstream.status).json({
        error: `Codeflow retornou ${upstream.status}`,
        detail: text,
      });
    }

    const data = await upstream.json();
    return res.status(200).json(data);

  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    return res.status(isTimeout ? 504 : 502).json({
      error: isTimeout
        ? 'Timeout: Codeflow demorou mais de 30s para responder'
        : `Não foi possível alcançar o Codeflow: ${err.message}`,
    });
  }
}
