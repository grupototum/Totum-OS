/**
 * Vercel Serverless — ADA Health Check
 * Testa se o Codeflow VPS está acessível
 * GET /api/ada/health
 */

const CODEFLOW_URL = process.env.CODEFLOW_URL || 'http://187.127.4.140:8002';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const upstream = await fetch(`${CODEFLOW_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return res.status(200).json({ online: upstream.ok, status: upstream.status });
  } catch {
    return res.status(200).json({ online: false, status: 0 });
  }
}
