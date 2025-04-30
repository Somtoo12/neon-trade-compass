
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeOneSignal } from './utils/oneSignal';
import { generateSitemap } from './utils/sitemapGenerator';

// Initialize OneSignal when the app starts
initializeOneSignal();

// Generate or update the sitemap
if (import.meta.env.PROD) {
  // Only generate sitemap in production
  try {
    generateSitemap();
    console.log("Sitemap generated successfully");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
