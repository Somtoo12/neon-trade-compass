
/**
 * OneSignal Web Push Notifications Setup
 * Documentation: https://documentation.onesignal.com/docs/web-push-quickstart
 */

// Initialize OneSignal with your appId
export const initializeOneSignal = () => {
  // Check if window is defined (for SSR/SSG compatibility)
  if (typeof window !== 'undefined') {
    // Make sure OneSignal is available
    if (window.OneSignal) {
      window.OneSignal.init({
        appId: "YOUR_ONESIGNAL_APP_ID", // Replace with your actual OneSignal App ID
        allowLocalhostAsSecureOrigin: true, // For development only
        notifyButton: {
          enable: true, // Set to false to hide the notify button
          size: 'medium', // 'small', 'medium', or 'large'
          theme: 'default', // 'default' or 'inverse'
          position: 'bottom-right', // 'bottom-left', 'bottom-right'
          offset: {
            bottom: '20px',
            right: '20px',
            left: '20px'
          },
          showCredit: false
        },
      });
    }
  }
};

// Function to request notifications permission
export const requestNotificationPermission = async () => {
  if (typeof window !== 'undefined' && window.OneSignal) {
    try {
      const permission = await window.OneSignal.Notifications.requestPermission();
      console.log("Notification permission status:", permission);
      return permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }
  return false;
};

// Type declaration to prevent TypeScript errors
declare global {
  interface Window {
    OneSignal: any;
  }
}
