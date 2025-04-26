
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeOneSignal } from './utils/oneSignal';

// Initialize OneSignal when the app starts
// Using both DOMContentLoaded and direct call for maximum reliability
document.addEventListener('DOMContentLoaded', () => {
  // Ensure OneSignal initialization happens after DOM is fully loaded
  initializeOneSignal();
  
  // Log successful initialization
  console.log("Main.tsx: OneSignal initialization called on DOMContentLoaded");
});

// Also call directly to ensure it runs even if DOMContentLoaded already fired
initializeOneSignal();
console.log("Main.tsx: OneSignal direct initialization called");

createRoot(document.getElementById("root")!).render(<App />);
