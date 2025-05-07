
import { supabase } from "@/integrations/supabase/client";

// Types for analytics data
export interface AnalyticsSummary {
  total_visits: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
}

export interface VisitData {
  id: string;
  session_id: string;
  page_path: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  entered_at: string;
  exited_at: string | null;
  time_on_page: number | null;
  is_bounce: boolean;
  created_at: string;
}

export interface EventData {
  id: string;
  visit_id: string;
  session_id: string;
  event_type: string;
  element_id: string | null;
  element_class: string | null;
  element_text: string | null;
  page_path: string;
  x_position: number | null;
  y_position: number | null;
  scroll_depth: number | null;
  created_at: string;
}

export interface PageViewCount {
  page_path: string;
  count: number;
}

export interface DeviceStat {
  device_type: string;
  count: number;
}

export interface BrowserStat {
  browser: string;
  count: number;
}

export interface CountryStat {
  country: string;
  count: number;
}

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

// Get analytics summary
export const getAnalyticsSummary = async (params?: DateRangeParams): Promise<AnalyticsSummary | null> => {
  try {
    let query = supabase.rpc('get_analytics_summary');
    
    if (params?.startDate && params?.endDate) {
      query = supabase.rpc('get_analytics_summary', {
        start_date: params.startDate,
        end_date: params.endDate
      });
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data?.[0] || null;
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return null;
  }
};

// Get all visits with pagination
export const getVisits = async (
  page = 1, 
  limit = 10, 
  params?: DateRangeParams
): Promise<{ data: VisitData[], count: number }> => {
  try {
    let query = supabase
      .from('analytics_visits')
      .select('*', { count: 'exact' });
    
    if (params?.startDate && params?.endDate) {
      query = query.gte('created_at', params.startDate)
        .lte('created_at', params.endDate);
    }
    
    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    
    if (error) throw error;
    
    return {
      data: data as VisitData[],
      count: count || 0
    };
  } catch (error) {
    console.error('Error fetching visits:', error);
    return { data: [], count: 0 };
  }
};

// Get events for a specific visit
export const getEventsForVisit = async (visitId: string): Promise<EventData[]> => {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('visit_id', visitId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data as EventData[];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

// Get top pages
export const getTopPages = async (params?: DateRangeParams): Promise<PageViewCount[]> => {
  try {
    let query = supabase
      .from('analytics_visits')
      .select('page_path, count');
    
    if (params?.startDate && params?.endDate) {
      query = query.gte('created_at', params.startDate)
        .lte('created_at', params.endDate);
    }
    
    // Execute as a raw SQL query instead of using groupBy
    const { data, error } = await supabase.rpc('get_top_pages', params ? {
      start_date: params.startDate,
      end_date: params.endDate
    } : {});
    
    if (error) {
      // Fallback if RPC not available
      const { data: fallbackData, error: fallbackError } = await supabase.from('top_pages_view').select('*');
      if (fallbackError) throw fallbackError;
      return fallbackData as unknown as PageViewCount[];
    }
    
    return data as unknown as PageViewCount[];
  } catch (error) {
    console.error('Error fetching top pages:', error);
    return [];
  }
};

// Get device statistics
export const getDeviceStats = async (params?: DateRangeParams): Promise<DeviceStat[]> => {
  try {
    // Execute as a raw SQL query instead of using groupBy
    const { data, error } = await supabase.rpc('get_device_stats', params ? {
      start_date: params.startDate,
      end_date: params.endDate
    } : {});
    
    if (error) {
      // Fallback if RPC not available
      const { data: fallbackData, error: fallbackError } = await supabase.from('device_stats_view').select('*');
      if (fallbackError) throw fallbackError;
      return fallbackData as unknown as DeviceStat[];
    }
    
    return data as unknown as DeviceStat[];
  } catch (error) {
    console.error('Error fetching device stats:', error);
    return [];
  }
};

// Get browser statistics
export const getBrowserStats = async (params?: DateRangeParams): Promise<BrowserStat[]> => {
  try {
    // Execute as a raw SQL query instead of using groupBy
    const { data, error } = await supabase.rpc('get_browser_stats', params ? {
      start_date: params.startDate,
      end_date: params.endDate
    } : {});
    
    if (error) {
      // Fallback if RPC not available
      const { data: fallbackData, error: fallbackError } = await supabase.from('browser_stats_view').select('*');
      if (fallbackError) throw fallbackError;
      return fallbackData as unknown as BrowserStat[];
    }
    
    return data as unknown as BrowserStat[];
  } catch (error) {
    console.error('Error fetching browser stats:', error);
    return [];
  }
};

// Get country statistics
export const getCountryStats = async (params?: DateRangeParams): Promise<CountryStat[]> => {
  try {
    // Execute as a raw SQL query instead of using groupBy
    const { data, error } = await supabase.rpc('get_country_stats', params ? {
      start_date: params.startDate,
      end_date: params.endDate
    } : {});
    
    if (error) {
      // Fallback if RPC not available
      const { data: fallbackData, error: fallbackError } = await supabase.from('country_stats_view').select('*');
      if (fallbackError) throw fallbackError;
      return fallbackData as unknown as CountryStat[];
    }
    
    return data as unknown as CountryStat[];
  } catch (error) {
    console.error('Error fetching country stats:', error);
    return [];
  }
};

// Get visits by date for trend chart
export const getVisitsByDate = async (
  interval: 'day' | 'hour' | 'week' | 'month' = 'day',
  params?: DateRangeParams
): Promise<any[]> => {
  try {
    let timeFormat: string;
    
    switch (interval) {
      case 'hour':
        timeFormat = 'YYYY-MM-DD HH24:00';
        break;
      case 'week':
        timeFormat = 'YYYY-IW';
        break;
      case 'month':
        timeFormat = 'YYYY-MM';
        break;
      case 'day':
      default:
        timeFormat = 'YYYY-MM-DD';
    }
    
    // Use a more generic approach instead of relying on get_visits_by_date rpc
    const { data, error } = await supabase.from('analytics_visits')
      .select('created_at')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return processVisitsForGraph(data, interval);
  } catch (error) {
    console.error('Error fetching visits by date:', error);
    return [];
  }
};

// Process visits data for graph if the server function is not available
const processVisitsForGraph = (
  visits: any[],
  interval: 'day' | 'hour' | 'week' | 'month'
): any[] => {
  const visitsByDate: Record<string, number> = {};
  
  visits.forEach(visit => {
    const date = new Date(visit.created_at);
    let dateKey: string;
    
    switch (interval) {
      case 'hour':
        dateKey = `${date.toISOString().slice(0, 13)}:00`;
        break;
      case 'week':
        // Get week number
        const weekNum = getWeekNumber(date);
        dateKey = `${date.getFullYear()}-W${weekNum}`;
        break;
      case 'month':
        dateKey = date.toISOString().slice(0, 7);
        break;
      case 'day':
      default:
        dateKey = date.toISOString().slice(0, 10);
    }
    
    if (visitsByDate[dateKey]) {
      visitsByDate[dateKey]++;
    } else {
      visitsByDate[dateKey] = 1;
    }
  });
  
  return Object.entries(visitsByDate).map(([date, count]) => ({
    date,
    count
  })).sort((a, b) => a.date.localeCompare(b.date));
};

// Helper to get week number
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};
