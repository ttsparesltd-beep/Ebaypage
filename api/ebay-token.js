module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const clientId     = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'eBay credentials not configured. Check Vercel environment variables (EBAY_CLIENT_ID, EBAY_CLIENT_SECRET) and redeploy.'
    });
  }

  const { grant_type, code, redirect_uri, refresh_token } = req.body || {};
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  let formBody;
  if (grant_type === 'authorization_code') {
    if (!code || !redirect_uri) return res.status(400).json({ error: 'Missing code or redirect_uri' });
    formBody = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri }).toString();
  } else if (grant_type === 'refresh_token') {
    if (!refresh_token) return res.status(400).json({ error: 'Missing refresh_token' });
    formBody = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      scope: 'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly'
    }).toString();
  } else {
    return res.status(400).json({ error: 'Invalid grant_type' });
  }

  try {
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: formBody
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
