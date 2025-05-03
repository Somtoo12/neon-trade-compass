
import { useState, useEffect, useCallback } from 'react';

// Utility to generate a simple browser fingerprint
const generateFingerprint = (): string => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Create a hash from these values
  const fingerprint = btoa(`${userAgent}-${screenWidth}-${screenHeight}-${colorDepth}-${timeZone}`);
  return fingerprint.substring(0, 32); // Return first 32 chars as fingerprint
};

interface NotificationPromptState {
  showPrompt: boolean;
  dismissPrompt: () => void;
  submitEmail: (email: string) => Promise<void>;
  isSubscribed: boolean;
}

export function useNotificationPrompt(): NotificationPromptState {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [fingerprint, setFingerprint] = useState<string>("");
  const [initialDelay, setInitialDelay] = useState<boolean>(true);

  // Initialize on mount
  useEffect(() => {
    // Check for existing subscription
    const checkSubscriptionStatus = () => {
      const hasSubscribed = localStorage.getItem('notificationSubscribed') === 'true';
      setIsSubscribed(hasSubscribed);
      return hasSubscribed;
    };

    const generateAndStoreFingerprint = () => {
      let savedFingerprint = localStorage.getItem('userFingerprint');
      
      if (!savedFingerprint) {
        savedFingerprint = generateFingerprint();
        localStorage.setItem('userFingerprint', savedFingerprint);
      }
      
      setFingerprint(savedFingerprint);
    };

    // Only proceed if not already subscribed
    if (!checkSubscriptionStatus()) {
      generateAndStoreFingerprint();
      
      // Schedule initial delay (10 seconds)
      const initialDelayTimer = setTimeout(() => {
        setShowPrompt(true);
        setInitialDelay(false);
      }, 10000);
      
      return () => {
        clearTimeout(initialDelayTimer);
      };
    }
  }, []);
  
  // Setup recurring prompt if dismissed
  useEffect(() => {
    // Don't show again if subscribed
    if (isSubscribed) {
      return;
    }
    
    // Only run this after initial delay
    if (!initialDelay && !showPrompt) {
      // Get last dismissed time
      const lastDismissed = localStorage.getItem('notificationLastDismissed');
      const now = Date.now();
      
      // If lastDismissed exists and 10 minutes haven't passed
      if (lastDismissed && now - parseInt(lastDismissed) < 10 * 60 * 1000) {
        // Set timer for remainder of 10 minutes
        const remainingTime = 10 * 60 * 1000 - (now - parseInt(lastDismissed));
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, remainingTime);
        
        return () => {
          clearTimeout(timer);
        };
      } else {
        // If 10 minutes have passed or no record exists, show immediately
        setShowPrompt(true);
      }
    }
  }, [initialDelay, showPrompt, isSubscribed]);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    // Record dismissal time
    localStorage.setItem('notificationLastDismissed', Date.now().toString());
  }, []);

  const submitEmail = useCallback(async (email: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Store email and fingerprint in local storage for demo purposes
        // In production, this would be an API call to your backend
        localStorage.setItem('notificationEmail', email);
        localStorage.setItem('notificationSubscribed', 'true');
        localStorage.setItem('notificationFingerprint', fingerprint);
        
        // Log the submission for demonstration (to console only)
        console.log('Notification subscription:', {
          email,
          fingerprint,
          timestamp: new Date().toISOString()
        });
        
        setIsSubscribed(true);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }, [fingerprint]);

  return {
    showPrompt,
    dismissPrompt,
    submitEmail,
    isSubscribed
  };
}
