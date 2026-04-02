const crypto = require('crypto');

module.exports = async function handler(req, res) {
  const VERIFICATION_TOKEN = process.env.EBAY_VERIFICATION_TOKEN;
  const ENDPOINT_URL = process.env.EBAY_ENDPOINT_URL;

  // ── GET: eBay challenge verification ──────────────────────────────
  // eBay sends ?challenge_code=xxx to verify the endpoint is real.
  // We must respond with SHA-256(challengeCode + verificationToken + endpointUrl)
  if (req.method === 'GET') {
    const challengeCode = req.query.challenge_code;

    if (!challengeCode) {
      return res.status(200).json({ message: 'Deletion notification endpoint active' });
    }

    if (!VERIFICATION_TOKEN || !ENDPOINT_URL) {
      console.error('Missing EBAY_VERIFICATION_TOKEN or EBAY_ENDPOINT_URL env vars');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const hash = crypto
      .createHash('sha256')
      .update(challengeCode + VERIFICATION_TOKEN + ENDPOINT_URL)
      .digest('hex');

    return res.status(200).json({ challengeResponse: hash });
  }

  // ── POST: actual deletion notification ────────────────────────────
  if (req.method === 'POST') {
    console.log('eBay deletion notification received:', JSON.stringify(req.body));
    return res.status(200).json({ acknowledged: true });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
