
import { utilityToolsData } from "@/data/utilityToolsData";
import { toolsData } from "@/data/toolsData";
import { Routes, Route } from "react-router-dom";
import React from "react";
import App from "../App";

interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function generateSitemap() {
  const baseUrl = "https://pipcrafts.com";
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Collect all routes from App.tsx
  const urls: SitemapURL[] = extractRoutesFromApp();
  
  // Add homepage with highest priority
  urls.unshift({
    loc: baseUrl,
    changefreq: "weekly",
    priority: 1.0,
    lastmod: currentDate
  });
  
  // Build the XML content
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `
    <priority>${url.priority.toFixed(1)}</priority>` : ''}
  </url>`).join('\n')}
</urlset>
`;

  // Save to public folder
  const fs = require('fs');
  fs.writeFileSync('public/sitemap.xml', xmlContent);
  
  // Ping search engines
  pingSearchEngines();
  
  return xmlContent;
}

function extractRoutesFromApp(): SitemapURL[] {
  const baseUrl = "https://pipcrafts.com";
  const currentDate = new Date().toISOString().split('T')[0];
  const routes: SitemapURL[] = [];
  
  // Manual routes (in case we can't extract them automatically)
  const manualRoutes = [
    "/calculators",
    "/forex-calculator",
    "/crypto-calculator",
    "/futures-calculator",
    "/max-lot-size",
    "/daily-trade-tools",
    "/session-clock",
    "/currency-heatmap",
    "/risk-management",
    "/trade-journal",
    "/challenge-blueprint",
    "/economic-calendar",
    "/focus-mode",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/disclaimer"
  ];
  
  // Add manual routes
  manualRoutes.forEach(route => {
    routes.push({
      loc: `${baseUrl}${route}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: currentDate
    });
  });
  
  // Add utility tools routes
  utilityToolsData.forEach(tool => {
    routes.push({
      loc: `${baseUrl}${tool.path}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: currentDate
    });
  });
  
  // Add other tools routes
  toolsData.forEach(tool => {
    routes.push({
      loc: `${baseUrl}${tool.path}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: currentDate
    });
  });
  
  // Remove duplicates
  const uniqueRoutes = Array.from(new Set(routes.map(route => route.loc)))
    .map(loc => routes.find(route => route.loc === loc));
  
  return uniqueRoutes as SitemapURL[];
}

async function pingSearchEngines() {
  try {
    const sitemapUrl = "https://pipcrafts.com/sitemap.xml";
    // In a browser environment, we need to use fetch
    if (typeof window !== 'undefined') {
      // Ping Google
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { mode: 'no-cors' });
      // Ping Bing
      await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, { mode: 'no-cors' });
      console.log("Successfully pinged search engines");
    } else {
      console.log("Not in browser environment, skipping search engine pinging");
    }
  } catch (error) {
    console.error("Error pinging search engines:", error);
  }
}
