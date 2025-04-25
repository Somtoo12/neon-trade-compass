
import { Request, Response } from "express";

// List your important routes here. Add new ones if new pages are published:
const PAGES = [
  "",
  "calculators",
  "forex-calculator",
  "crypto-calculator",
  "futures-calculator",
  "risk-management",
  "trade-journal",
  "trader-games",
  "challenge-blueprint",
  "max-lot-size",
  "economic-calendar",
  "props",
  "focus-mode",
  "about",
  "contact",
  "terms",
  "privacy",
  "disclaimer",
  // Sample blog post route
  "blog/command-center-2025",
  // Add more static/dynamic URLs here as you publish content
];

// Set the site url:
const SITE_URL = "https://pipcrafts.com";

// Vite/Remix/Next.js: this file will be served at /sitemap.xml
export default function handler(req: Request, res: Response) {
  const urls = PAGES.map(
    (path) => `
  <url>
    <loc>${SITE_URL}/${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
  ).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  ${urls}
</urlset>
`;

  res.set("Content-Type", "application/xml");
  res.send(sitemap);
}
