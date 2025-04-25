
// Dynamic sitemap.xml for PipCrafts (public at /sitemap.xml)

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
  "blog/command-center-2025",
  // Add more static/dynamic URLs here as you publish content
];

const SITE_URL = "https://pipcrafts.com";

// Vite/Netlify/Vercel API handler style: return a Response
export async function GET() {
  const urls = PAGES.map(
    (path) => `
  <url>
    <loc>${SITE_URL}${path ? "/" + path : ""}</loc>
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
`.trim();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

// Optional compatibility export for some platforms:
export default { GET };
