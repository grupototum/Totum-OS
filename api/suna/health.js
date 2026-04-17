/**
 * GET /api/suna/health — verifica se Suna está acessível
 */
const SUNA_URL = process.env.VITE_SUNA_URL || process.env.SUNA_URL || '';
const SUNA_KEY = process.env.VITE_SUNA_API_KEY || process.env.SUNA_API_KEY || '';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!SUNA_URL) {
    return res.status(200).json({ configured: false, online: false });
  }

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 6000);

    const upstream = await fetch(`${SUNA_URL}/api/health`, {
      headers: SUNA_KEY ? { Authorization: `Bearer ${SUNA_KEY}` } : {},
      signal: controller.signal,
    });

    const data = await upstream.json().catch(() => ({}));
    return res.status(200).json({ configured: true, online: upstream.ok, ...data });
  } catch {
    return res.status(200).json({ configured: true, online: false });
  }
}
