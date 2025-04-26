
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

// Function to show OneSignal slidedown prompt
export const showNotificationPrompt = () => {
  if (typeof window !== 'undefined' && window.OneSignal) {
    try {
      // Check if the user has already subscribed
      window.OneSignal.Notifications.areEnabled().then((isEnabled: boolean) => {
        if (!isEnabled) {
          console.log("Showing OneSignal notification prompt");
          window.OneSignal.Notifications.showSlidedownPrompt();
        } else {
          console.log("User already subscribed to notifications");
        }
      });
    } catch (error) {
      console.error("Error showing notification prompt:", error);
    }
  }
};

// Type declaration to prevent TypeScript errors
declare global {
  interface Window {
    OneSignal: any;
    OneSignalDeferred: any[];
  }
}
