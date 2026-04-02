# 📦 Warehouse Manager

A single-page web app combining your eBay pick list (sorted by warehouse walk order) and stock check tool. Hosted on Vercel.

---

## 🚀 Deploy to Vercel (free, ~10 minutes)

### 1. Get your eBay API credentials

1. Go to [developer.ebay.com](https://developer.ebay.com) and sign in with your seller account
2. Open your application (or create one — set **Application Type** to **Confidential**)
3. Note your **Client ID** and **Client Secret**
4. Under **OAuth → User Tokens → Redirect URIs**, add your future Vercel URL:
   - e.g. `https://my-warehouse.vercel.app/`
   - You can update this after deploying once you know your URL

### 2. Deploy to Vercel

**Option A — Drag & drop (easiest):**
1. Go to [vercel.com](https://vercel.com) and create a free account
2. From the dashboard: **Add New → Project → Upload**
3. Drag this entire `warehouse-vercel` folder in
4. Click **Deploy** — your site will be live in ~30 seconds

**Option B — GitHub (recommended for updates):**
1. Push this folder to a GitHub repo
2. In Vercel: **Add New → Project → Import Git Repository**
3. Select your repo and deploy

### 3. Add environment variables

In Vercel: **Project → Settings → Environment Variables → Add**

| Name | Value |
|---|---|
| `EBAY_CLIENT_ID` | Your eBay Client ID |
| `EBAY_CLIENT_SECRET` | Your eBay Client Secret |

Then go to **Deployments → Redeploy** (with "Use existing build cache" unchecked).

### 4. Update your eBay Redirect URI

Back in [developer.ebay.com](https://developer.ebay.com), set your Redirect URI to your Vercel URL (e.g. `https://my-warehouse.vercel.app/`)

### 5. Connect in the app

1. Open your Vercel URL
2. Go to **⚙️ Settings**
3. Enter your **Client ID**
4. Click **Connect eBay Account** and approve access

---

## 📱 Daily Use

**Pick List tab:**
- Select a time range (Today, Last 2 days, etc.)
- Click **↻ Fetch Orders**
- Items grouped by warehouse location, sorted in walk order
- Tick each item as you pick it
- 🖨 Print for a paper copy

**Stock Check tab:**
- 785 locations pre-loaded from your eBay listings
- Search by SKU or item name
- Tick items off as you count
- Filter Pending / Done

---

## 🔒 Security

- Your **Client Secret never touches the browser** — it stays in Vercel's environment variables
- The `/api/ebay-token` serverless function handles all token exchange server-side
- Access tokens are stored in localStorage and auto-refresh via refresh token
- Refresh tokens last 18 months

---

## Project Structure

```
warehouse-vercel/
├── index.html          # Main app (stock data embedded)
├── vercel.json         # Vercel config
├── api/
│   └── ebay-token.js   # Secure server-side token exchange
└── README.md           # This file
```
