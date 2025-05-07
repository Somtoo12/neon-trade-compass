
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Generate a unique session ID for each visitor
const SESSION_ID = uuidv4();
let visitId: string | null = null;
let isTracking = false;

// Extract UTM parameters from URL
const getUTMParams = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content')
  };
};

// Get device and browser information
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  
  // Device type detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Tablet|PlayBook/i.test(userAgent);
  
  let deviceType = 'desktop';
  if (isTablet) deviceType = 'tablet';
  else if (isMobile) deviceType = 'mobile';
  
  // Browser detection
  let browser = 'unknown';
  
  if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) browser = 'IE';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';
  
  // OS detection
  let os = 'unknown';
  let osVersion = 'unknown';
  
  if (/Windows/.test(userAgent)) {
    os = 'Windows';
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (match) osVersion = match[1];
  } else if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) {
    os = 'MacOS';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
    const match = userAgent.match(/Android (\d+(\.\d+)?)/);
    if (match) osVersion = match[1];
  } else if (/iOS|iPhone|iPad|iPod/.test(userAgent)) {
    os = 'iOS';
    const match = userAgent.match(/OS (\d+[_]\d+)/);
    if (match) osVersion = match[1].replace('_', '.');
  } else if (/Linux/.test(userAgent)) {
    os = 'Linux';
  }
  
  return {
    deviceType,
    browser,
    os,
    osVersion,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  };
};

// Track page view and get visit ID
export const trackPageView = async (userId?: string) => {
  if (isTracking) return visitId;
  
  isTracking = true;
  const pagePath = window.location.pathname;
  const referrer = document.referrer;
  const utmParams = getUTMParams();
  const deviceInfo = getDeviceInfo();
  
  const enteredAt = new Date().toISOString();
  
  // Insert visit record
  const { data, error } = await supabase
    .from('analytics_visits')
    .insert([
      { 
        user_id: userId || null,
        session_id: SESSION_ID,
        page_path: pagePath,
        referrer,
        ...utmParams,
        ...deviceInfo,
        entered_at: enteredAt
      }
    ])
    .select();
  
  if (error) {
    console.error('Error tracking page view:', error);
    return null;
  }
  
  if (data && data[0]) {
    visitId = data[0].id;
    
    // Set up exit tracking
    window.addEventListener('beforeunload', () => {
      if (visitId) {
        // Calculate time on page
        const timeOnPage = Math.floor((new Date().getTime() - new Date(enteredAt).getTime()) / 1000);
        
        // We use navigator.sendBeacon for more reliable data sending on page unload
        const exitData = {
          exited_at: new Date().toISOString(),
          time_on_page: timeOnPage,
          is_bounce: timeOnPage < 10 // Define bounce as less than 10 seconds
        };
        
        // Use direct URL instead of supabaseUrl property
        const apiEndpoint = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/analytics_visits?id=eq.${visitId}`;
        const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        navigator.sendBeacon(
          apiEndpoint,
          JSON.stringify(exitData),
          {
            headers: {
              'Content-Type': 'application/json',
              'ApiKey': apiKey,
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );
      }
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    document.addEventListener('scroll', () => {
      if (!visitId) return;
      
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      
      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        trackEvent('scroll', null, { scrollDepth: maxScrollDepth });
      }
    });
    
    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target) {
        const element = target.closest('button, a, .clickable, [role="button"]') as HTMLElement;
        
        if (element) {
          trackEvent('click', element, {
            x: e.clientX,
            y: e.clientY
          });
        }
      }
    });
  }
  
  return visitId;
};

// Track user events
export const trackEvent = async (
  eventType: string, 
  element: HTMLElement | null, 
  extraData: Record<string, any> = {}
) => {
  if (!visitId) return;
  
  const eventData: any = {
    visit_id: visitId,
    session_id: SESSION_ID,
    event_type: eventType,
    page_path: window.location.pathname,
  };
  
  // Add element data if available
  if (element) {
    eventData.element_id = element.id || null;
    eventData.element_class = element.className || null;
    eventData.element_text = element.textContent?.trim().substring(0, 100) || null;
  }
  
  // Add extra data
  if (extraData.x && extraData.y) {
    eventData.x_position = extraData.x;
    eventData.y_position = extraData.y;
  }
  
  if (extraData.scrollDepth) {
    eventData.scroll_depth = extraData.scrollDepth;
  }
  
  await supabase.from('analytics_events').insert([eventData]);
};

// Initialize tracking
export const initializeAnalyticsTracking = (userId?: string) => {
  if (typeof window !== 'undefined') {
    trackPageView(userId);
  }
};
