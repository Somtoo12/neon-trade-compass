
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeOneSignal } from './utils/oneSignal';

// Initialize OneSignal when the app starts
document.addEventListener('DOMContentLoaded', () => {
  // Ensure OneSignal initialization happens after DOM is fully loaded
  setTimeout(() => {
    initializeOneSignal();
  }, 1000); // Small delay to ensure everything is ready
});

createRoot(document.getElementById("root")!).render(<App />);
