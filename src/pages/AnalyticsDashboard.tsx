
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';
import {
  getAnalyticsSummary,
  getVisits,
  getTopPages,
  getDeviceStats,
  getBrowserStats,
  getCountryStats,
  getVisitsByDate
} from '@/services/analyticsAPI';
import { AnalyticsSummaryCard } from '@/components/analytics/AnalyticsSummaryCard';
import { VisitsChart } from '@/components/analytics/VisitsChart';
import { TopPagesCard } from '@/components/analytics/TopPagesCard';
import { DeviceStatsCard, BrowserStatsCard, CountryStatsCard } from '@/components/analytics/StatisticsCards';
import { VisitsTable } from '@/components/analytics/VisitsTable';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DownloadIcon, RefreshCw, Lock } from 'lucide-react';

// Import DateRange type and component when they become available
interface DateRange {
  from: Date;
  to: Date;
}

const DateRangeFilter: React.FC<{
  value: DateRange;
  onChange: (range: DateRange) => void;
}> = ({ value, onChange }) => {
  // Placeholder component
  return (
    <div>
      <Select defaultValue="30days">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
          <SelectItem value="3months">Last 3 months</SelectItem>
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAnalytics();
  
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 29)),
    to: new Date(),
  });
  
  const [chartInterval, setChartInterval] = React.useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  
  const dateParams = React.useMemo(() => {
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString()
    };
  }, [dateRange]);
  
  // Get the session and user data
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // Redirect to home if not authenticated
        navigate('/');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Analytics summary
  const summaryQuery = useQuery({
    queryKey: ['analytics-summary', dateParams],
    queryFn: () => getAnalyticsSummary(dateParams),
    enabled: isAdmin,
  });
  
  // Visits data for table
  const visitsQuery = useQuery({
    queryKey: ['visits', currentPage, pageSize, dateParams],
    queryFn: () => getVisits(currentPage, pageSize, dateParams),
    enabled: isAdmin,
  });
  
  // Top pages
  const topPagesQuery = useQuery({
    queryKey: ['top-pages', dateParams],
    queryFn: () => getTopPages(dateParams),
    enabled: isAdmin,
  });
  
  // Device stats
  const deviceStatsQuery = useQuery({
    queryKey: ['device-stats', dateParams],
    queryFn: () => getDeviceStats(dateParams),
    enabled: isAdmin,
  });
  
  // Browser stats
  const browserStatsQuery = useQuery({
    queryKey: ['browser-stats', dateParams],
    queryFn: () => getBrowserStats(dateParams),
    enabled: isAdmin,
  });
  
  // Country stats
  const countryStatsQuery = useQuery({
    queryKey: ['country-stats', dateParams],
    queryFn: () => getCountryStats(dateParams),
    enabled: isAdmin,
  });
  
  // Visits by date for chart
  const visitsChartQuery = useQuery({
    queryKey: ['visits-by-date', chartInterval, dateParams],
    queryFn: () => getVisitsByDate(chartInterval, dateParams),
    enabled: isAdmin,
  });
  
  // Handle refresh
  const handleRefresh = () => {
    summaryQuery.refetch();
    visitsQuery.refetch();
    topPagesQuery.refetch();
    deviceStatsQuery.refetch();
    browserStatsQuery.refetch();
    countryStatsQuery.refetch();
    visitsChartQuery.refetch();
  };
  
  // Create CSV export
  const exportCSV = async () => {
    try {
      // Get all visits (without pagination)
      const { data: visits } = await supabase
        .from('analytics_visits')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!visits || visits.length === 0) return;
      
      // Convert to CSV
      const headers = Object.keys(visits[0]).join(',');
      const rows = visits.map(visit => 
        Object.values(visit)
          .map(value => 
            typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          )
          .join(',')
      );
      const csv = [headers, ...rows].join('\n');
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `analytics-export-${new Date().toISOString().split('T')[0]}.csv`);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };
  
  // If not admin, redirect or show access denied
  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Lock className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold">Access Restricted</h1>
          <p className="text-muted-foreground mt-2 mb-4">
            You need to be authenticated to view this page.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <SEO
        title="Analytics Dashboard | PipCraft"
        description="Private website analytics dashboard showing visitor statistics and insights"
      />
      
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-muted-foreground">
              Track website traffic, visitor behavior and performance metrics
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-2">
              <DateRangeFilter
                value={dateRange}
                onChange={setDateRange}
              />
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                onClick={exportCSV}
                className="flex gap-2 items-center whitespace-nowrap"
              >
                <DownloadIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="space-y-6">
          {/* Summary cards */}
          <AnalyticsSummaryCard
            data={summaryQuery.data}
            isLoading={summaryQuery.isLoading}
          />
          
          {/* Chart Section */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="col-span-4 md:col-span-2 lg:col-span-3">
              <Tabs defaultValue="visits">
                <TabsList className="mb-4">
                  <TabsTrigger value="visits">Visits</TabsTrigger>
                  {/* Additional tabs for future metrics */}
                  <TabsTrigger value="events" disabled>Events</TabsTrigger>
                  <TabsTrigger value="conversions" disabled>Conversions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visits">
                  <div className="flex justify-end mb-2">
                    <Select
                      value={chartInterval}
                      onValueChange={(value: 'hour' | 'day' | 'week' | 'month') => setChartInterval(value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Hourly</SelectItem>
                        <SelectItem value="day">Daily</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="month">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <VisitsChart
                    data={visitsChartQuery.data || []}
                    isLoading={visitsChartQuery.isLoading}
                    interval={chartInterval}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Top Pages */}
            <div className="col-span-4 md:col-span-2 lg:col-span-1">
              <TopPagesCard
                data={topPagesQuery.data || []}
                isLoading={topPagesQuery.isLoading}
              />
            </div>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DeviceStatsCard 
              data={deviceStatsQuery.data || []} 
              isLoading={deviceStatsQuery.isLoading} 
            />
            <BrowserStatsCard 
              data={browserStatsQuery.data || []} 
              isLoading={browserStatsQuery.isLoading} 
            />
            <CountryStatsCard 
              data={countryStatsQuery.data || []} 
              isLoading={countryStatsQuery.isLoading} 
            />
          </div>
          
          {/* Visits Table */}
          <VisitsTable
            data={visitsQuery.data?.data || []}
            count={visitsQuery.data?.count || 0}
            isLoading={visitsQuery.isLoading}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
    </AppLayout>
  );
};

export default AnalyticsDashboard;
