
/**
 * OneSignal Web Push Notifications Setup
 * Documentation: https://documentation.onesignal.com/docs/web-push-quickstart
 */

// Initialize OneSignal with your appId
export const initializeOneSignal = () => {
  // OneSignal is now initialized directly in the HTML
  console.log('OneSignal initialization handled in HTML');
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
    OneSignalDeferred: any[];
  }
}
