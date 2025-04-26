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
        appId: "d3c47d59-7e65-49d6-a331-4ae93e3423bb",
        allowLocalhostAsSecureOrigin: true, // For development only
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push", // current types are "push" & "category"
                autoPrompt: true,
                text: {
                  actionMessage: "Would you like to receive trading alerts and market updates?",
                  acceptButton: "Allow",
                  cancelButton: "Maybe Later"
                },
                delay: {
                  pageViews: 1,
                  timeDelay: 10
                }
              }
            ]
          }
        },
        notifyButton: {
          enable: true,
          size: 'medium',
          theme: 'default',
          position: 'bottom-right',
          offset: {
            bottom: '20px',
            right: '20px',
            left: '20px'
          },
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': "You're subscribed",
            'tip.state.blocked': "You've blocked notifications",
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribed': "Thanks for subscribing!",
            'message.action.resubscribed': "You're subscribed to notifications",
            'message.action.unsubscribed': "You won't receive notifications again",
          }
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
