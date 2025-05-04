
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

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
  isSubmitting: boolean;
}

export function useNotificationPrompt(): NotificationPromptState {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fingerprint, setFingerprint] = useState<string>("");
  const [initialDelay, setInitialDelay] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize on mount
  useEffect(() => {
    // Check for existing subscription
    const checkSubscriptionStatus = async () => {
      // First check local storage
      const hasSubscribedLocal = localStorage.getItem('notificationSubscribed') === 'true';
      
      if (hasSubscribedLocal) {
        setIsSubscribed(true);
        return true;
      }
      
      // Generate fingerprint for checking
      let savedFingerprint = localStorage.getItem('userFingerprint');
      if (!savedFingerprint) {
        savedFingerprint = generateFingerprint();
        localStorage.setItem('userFingerprint', savedFingerprint);
      }
      setFingerprint(savedFingerprint);
      
      // Try to check Supabase if this fingerprint exists
      try {
        const { data, error } = await supabase
          .from('early_access_emails')
          .select('id')
          .eq('fingerprint', savedFingerprint)
          .limit(1);
        
        // If we found a record, they're subscribed
        if (data && data.length > 0) {
          localStorage.setItem('notificationSubscribed', 'true');
          setIsSubscribed(true);
          return true;
        }
      } catch (err) {
        console.error('Failed to check subscription status in Supabase:', err);
        // Continue execution even if Supabase check fails
      }
      
      return false;
    };

    // Only proceed if not already subscribed
    checkSubscriptionStatus().then(subscribed => {
      if (!subscribed) {
        // Schedule initial delay (10 seconds)
        const initialDelayTimer = setTimeout(() => {
          setShowPrompt(true);
          setInitialDelay(false);
        }, 10000);
        
        return () => {
          clearTimeout(initialDelayTimer);
        };
      }
    });
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
    if (isSubmitting) return Promise.reject(new Error('Already submitting'));
    
    setIsSubmitting(true);
    
    try {
      // Attempt to get client IP (this will be undefined in many environments due to browser security)
      // We'll send it to Supabase where available, but it's not critical
      let ipAddress = undefined;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        }
      } catch (error) {
        console.log('Could not fetch IP address, continuing without it');
      }
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('early_access_emails')
        .insert([
          {
            email,
            fingerprint,
            ip_address: ipAddress,
            user_agent: navigator.userAgent
          }
        ])
        .select('id')
        .single();
      
      if (error) {
        // Check if it's a duplicate email error
        if (error.code === '23505') { // PostgreSQL unique constraint violation
          // This is not really an error - the user is already subscribed
          // Just update their local state to reflect this
          localStorage.setItem('notificationSubscribed', 'true');
          localStorage.setItem('notificationEmail', email);
          
          toast({
            title: "You're already subscribed!",
            description: "We already have your email. You'll be notified of any updates.",
          });
          
          setIsSubscribed(true);
          return Promise.resolve();
        }
        
        throw error;
      }
      
      // Save to local storage for client-side reference
      localStorage.setItem('notificationEmail', email);
      localStorage.setItem('notificationSubscribed', 'true');
      localStorage.setItem('notificationFingerprint', fingerprint);
      
      // Log success (console only)
      console.log('Notification subscription saved to Supabase:', {
        email,
        fingerprint,
        timestamp: new Date().toISOString()
      });
      
      setIsSubscribed(true);
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to submit email to Supabase:', error);
      toast({
        title: "Subscription failed",
        description: "There was a problem saving your email. Please try again later.",
        variant: "destructive",
      });
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [fingerprint, isSubmitting, toast]);

  return {
    showPrompt,
    dismissPrompt,
    submitEmail,
    isSubscribed,
    isSubmitting
  };
}
