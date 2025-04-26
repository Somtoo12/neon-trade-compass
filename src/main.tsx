
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeOneSignal } from './utils/oneSignal';

// Initialize OneSignal when the app starts
document.addEventListener('DOMContentLoaded', () => {
  // Ensure OneSignal is initialized after the DOM is fully loaded
  initializeOneSignal();
});

createRoot(document.getElementById("root")!).render(<App />);
