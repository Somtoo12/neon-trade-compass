
/**
 * OneSignal Web Push Notifications Setup
 * Documentation: https://documentation.onesignal.com/docs/web-push-quickstart
 */

// Track OneSignal initialization status
let isOneSignalInitialized = false;

// Initialize OneSignal - mostly handled in HTML head now
export const initializeOneSignal = () => {
  // OneSignal is initialized directly in the HTML
  console.log('OneSignal initialization handled in HTML head');
  
  // Check if OneSignal is available in the window object
  if (typeof window !== 'undefined') {
    // Set up a way to check when OneSignal is fully initialized
    const checkInitialization = () => {
      if (window.OneSignal && typeof window.OneSignal.Notifications !== 'undefined') {
        isOneSignalInitialized = true;
        console.log('OneSignal is now initialized and ready to use in utils');
        return true;
      }
      return false;
    };

    // Try immediately
    if (checkInitialization()) return;
    
    // If not ready yet, set up an interval to check
    const intervalId = setInterval(() => {
      if (checkInitialization()) {
        clearInterval(intervalId);
      }
    }, 500);
    
    // Timeout after 15 seconds to prevent infinite checking
    setTimeout(() => {
      clearInterval(intervalId);
      if (!isOneSignalInitialized) {
        console.error('OneSignal failed to initialize within timeout period');
      }
    }, 15000);
  }
};

// Function to check if OneSignal is initialized
export const isOneSignalReady = () => {
  return typeof window !== 'undefined' && 
    window.OneSignal !== undefined && 
    isOneSignalInitialized;
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

// Function to check if the device is iOS - fixed TypeScript error
export const isIOSDevice = () => {
  return (
    typeof window !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream // Using type assertion to fix TypeScript error
  );
};

// Function to check current notification permission
export const checkNotificationPermission = async () => {
  if (!areNotificationsSupported()) {
    return 'unsupported';
  }
  
  return Notification.permission;
};

// Safely access OneSignal with error handling
const safelyAccessOneSignal = () => {
  if (!isOneSignalReady()) {
    console.error('OneSignal not initialized yet. Try again later.');
    return { error: true, message: 'OneSignal not initialized' };
  }
  return { error: false, oneSignal: window.OneSignal };
};

// Send a test notification
export const sendTestNotification = async () => {
  try {
    const { error, oneSignal } = safelyAccessOneSignal();
    if (error) return { success: false, message: 'OneSignal not initialized' };
    
    // Check if we're subscribed first
    const isPushEnabled = await oneSignal.Notifications.areEnabled();
    if (!isPushEnabled) {
      return { 
        success: false, 
        message: 'User is not subscribed to notifications' 
      };
    }
    
    // This is just for testing - in production you'd send from your backend
    console.log('Attempting to trigger a test notification');
    
    return { success: true, message: 'Test notification request sent' };
  } catch (error) {
    console.error('Error sending test notification:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : String(error)
    };
  }
};

// Function to request notifications permission
export const requestNotificationPermission = async () => {
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
    
    // iOS specific handling - can't support web push notifications
    if (isIOSDevice()) {
      return {
        success: false,
        reason: 'ios_device',
        message: 'iOS devices require you to add this site to your home screen to receive notifications'
      };
    }
    
    // Check if OneSignal is ready
    const { error, message, oneSignal } = safelyAccessOneSignal();
    if (error) {
      return { 
        success: false, 
        reason: 'unavailable',
        message 
      };
    }
    
    // Request permission using OneSignal
    const permission = await oneSignal.Notifications.requestPermission();
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
};

// Function to show OneSignal slidedown prompt
export const showNotificationPrompt = async () => {
  try {
    // First check support
    if (!areNotificationsSupported()) {
      console.log("Push notifications are not supported on this device/browser");
      return { 
        success: false, 
        reason: 'unsupported' 
      };
    }
    
    // iOS specific handling
    if (isIOSDevice()) {
      return {
        success: false,
        reason: 'ios_device',
        message: 'iOS devices require you to add this site to your home screen to receive notifications'
      };
    }
    
    // Check if OneSignal is ready
    const { error, message, oneSignal } = safelyAccessOneSignal();
    if (error) {
      return { 
        success: false, 
        reason: 'unavailable',
        message 
      };
    }
    
    // Check if the user has already subscribed
    const isEnabled = await oneSignal.Notifications.areEnabled();
    
    if (!isEnabled) {
      console.log("Showing OneSignal notification prompt");
      await oneSignal.Notifications.showSlidedownPrompt();
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
};

// Get a user-friendly message explaining why notifications aren't working
export const getNotificationSupportMessage = async () => {
  if (!areNotificationsSupported()) {
    // Device or browser doesn't support notifications
    if (isIOSDevice()) {
      return "iOS devices don't support web push directly. Add this site to your Home Screen for the best experience.";
    } else if (/Android/i.test(navigator.userAgent)) {
      return "Please use Chrome browser on Android for notifications or add to Home Screen.";
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
  
  return "Notifications are enabled. You'll receive persistent trading alerts.";
};

// For testing: Check OneSignal status and get debug info
export const getOneSignalDebugInfo = async () => {
  if (!isOneSignalReady()) {
    return { ready: false, message: 'OneSignal not initialized' };
  }

  try {
    const oneSignal = window.OneSignal;
    const permission = await checkNotificationPermission();
    const isEnabled = await oneSignal.Notifications.areEnabled();
    
    return {
      ready: true,
      permission,
      isEnabled,
      hasId: !!oneSignal.getExternalUserId?.(),
      appId: "d3c47d59-7e65-49d6-a331-4ae93e3423bb" // For verification
    };
  } catch (error) {
    return {
      ready: true,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

// Type declaration to prevent TypeScript errors
declare global {
  interface Window {
    OneSignal: any;
    OneSignalDeferred: any[];
  }
}
