module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const { days = 1, offset = 0 } = req.query;
  const from = new Date(Date.now() - days * 86400000).toISOString();
  const filter = `creationdate:[${from}..],orderfulfillmentstatus:{NOT_STARTED|IN_PROGRESS}`;

  const params = new URLSearchParams({
    filter,
    limit: 200,
    offset,
    fieldgroups: 'TAX_BREAKDOWN'
  });

  try {
    const response = await fetch(`https://api.ebay.com/sell/fulfillment/v1/order?${params}`, {
      headers: {
        'Authorization': authHeader,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
