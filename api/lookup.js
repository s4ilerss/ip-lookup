  export default async function handler(req, res) {
    const { address } = req.query;
    if (!address) return res.status(400).json({ error: "Missing address" });
    const r = await fetch(
      `https://api.api-ninjas.com/v1/iplookup?address=${encodeURIComponent(address)}`,
      { headers: { "X-Api-Key": process.env.API_KEY } }
    );
    res.status(r.status).json(await r.json());
  }