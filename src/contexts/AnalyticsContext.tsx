
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initializeAnalyticsTracking } from '@/services/analyticsTracker';

interface AnalyticsContextProps {
  isAdmin: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextProps>({
  isAdmin: false
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      
      if (session?.user) {
        setIsAdmin(true);
        initializeAnalyticsTracking(session.user.id);
      } else {
        setIsAdmin(false);
        initializeAnalyticsTracking();
      }
    };
    
    getSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setIsAdmin(true);
          initializeAnalyticsTracking(session.user.id);
        } else {
          setIsAdmin(false);
          initializeAnalyticsTracking();
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AnalyticsContext.Provider value={{ isAdmin }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
