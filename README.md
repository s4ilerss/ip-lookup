# IP Lookup

A small React app that takes an IP address and shows where it is. Country, region, city, timezone and coordinates.

**Live:** https://ip-lookup-delta.vercel.app/

## How it works

Enter an ip address, you can view the information about that specific address.

## Stack

- React 19 + Vite
- Vercel serverless function for the API proxy
- Plain CSS, no UI library

## Running it locally

```bash
npm install
npm run dev
```

Set `API_KEY` to your API Ninjas key — in `.env` for local runs, and in the Vercel project settings (Environment Variables) for the deployed site.

Vite doesn't run Vercel functions on its own, so `vite.config.js` mounts `api/lookup.js` on `/api/lookup` during dev. That way `npm run dev` behaves like the deployed site and you don't need the Vercel CLI.