
/**
 * OneSignal Web Push Notifications Setup
 * Documentation: https://documentation.onesignal.com/docs/web-push-quickstart
 */

// Initialize OneSignal with your appId
export const initializeOneSignal = () => {
  // OneSignal is now initialized directly in the HTML
  console.log('OneSignal initialization handled in HTML');
};

// Function to check if notifications are supported
export const areNotificationsSupported = () => {
  return (
    typeof window !== 'undefined' && 
    'Notification' in window && 
    'serviceWorker' in navigator && 
    'PushManager' in window
  );
};

// Function to check current notification permission
export const checkNotificationPermission = async () => {
  if (!areNotificationsSupported()) {
    return 'unsupported';
  }
  
  return Notification.permission;
};

// Function to request notifications permission
export const requestNotificationPermission = async () => {
  if (typeof window !== 'undefined' && window.OneSignal) {
    try {
      // First check if notifications are supported
      if (!areNotificationsSupported()) {
        console.log("Push notifications are not supported on this device/browser");
        return { 
          success: false, 
          reason: 'unsupported',
          message: 'Push notifications are not supported on this device or browser'
        };
      }
      
      const permission = await window.OneSignal.Notifications.requestPermission();
      console.log("Notification permission status:", permission);
      
      return { 
        success: permission, 
        reason: permission ? 'granted' : 'denied',
        message: permission ? 'Notifications enabled' : 'Notification permission denied'
      };
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return { 
        success: false, 
        reason: 'error',
        message: 'Error requesting permission: ' + (error instanceof Error ? error.message : String(error))
      };
    }
  }
  
  return { 
    success: false, 
    reason: 'unavailable',
    message: 'OneSignal not initialized' 
  };
};

// Function to show OneSignal slidedown prompt
export const showNotificationPrompt = async () => {
  if (typeof window !== 'undefined' && window.OneSignal) {
    try {
      // First check support
      if (!areNotificationsSupported()) {
        console.log("Push notifications are not supported on this device/browser");
        return { 
          success: false, 
          reason: 'unsupported' 
        };
      }
      
      // Check if the user has already subscribed
      const isEnabled = await window.OneSignal.Notifications.areEnabled();
      
      if (!isEnabled) {
        console.log("Showing OneSignal notification prompt");
        await window.OneSignal.Notifications.showSlidedownPrompt();
        return { success: true };
      } else {
        console.log("User already subscribed to notifications");
        return { 
          success: true, 
          reason: 'already-subscribed' 
        };
      }
    } catch (error) {
      console.error("Error showing notification prompt:", error);
      return { 
        success: false, 
        reason: 'error',
        message: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  return { 
    success: false, 
    reason: 'unavailable',
    message: 'OneSignal not initialized' 
  };
};

// Get a user-friendly message explaining why notifications aren't working
export const getNotificationSupportMessage = async () => {
  if (!areNotificationsSupported()) {
    // Device or browser doesn't support notifications
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    if (isMobile) {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return "Apple iOS devices don't support web push notifications. Please use our app for alerts.";
      } else {
        return "Please use Chrome browser on Android for notifications or install our app.";
      }
    } else {
      return "Your browser doesn't support web push notifications. Try Chrome, Firefox, or Edge.";
    }
  }
  
  const permission = await checkNotificationPermission();
  
  if (permission === 'denied') {
    return "Notifications are blocked. Please enable them in your browser settings.";
  }
  
  if (permission === 'default') {
    return "Please allow notifications when prompted to receive trading alerts.";
  }
  
  return "Notifications are enabled. You'll receive trading alerts.";
};

// Type declaration to prevent TypeScript errors
declare global {
  interface Window {
    OneSignal: any;
    OneSignalDeferred: any[];
  }
}
