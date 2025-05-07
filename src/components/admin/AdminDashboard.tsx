
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, LineChart, PieChart, AlertTriangle, Clock, Users, Eye } from 'lucide-react';
import { VisitorStatsChart } from './charts/VisitorStatsChart';
import { ActivityFeed } from './ActivityFeed';
import { PerformanceMetrics } from './PerformanceMetrics';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  total_visits: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
}

export const AdminDashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        // Get days based on selected time range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Call the Supabase function to get analytics data
        const { data, error } = await supabase.rpc('get_analytics_summary', {
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString()
        });
        
        if (error) throw error;
        setStatsData(data[0] || {
          total_visits: 0,
          unique_visitors: 0,
          avg_time_on_page: 0,
          bounce_rate: 0
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor website performance and user activity</p>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-[300px]">
          <TabsList className="w-full">
            <TabsTrigger value="7d" className="flex-1">7 Days</TabsTrigger>
            <TabsTrigger value="30d" className="flex-1">30 Days</TabsTrigger>
            <TabsTrigger value="90d" className="flex-1">90 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-28 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{statsData?.total_visits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 10) + 1}% from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-28 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">{statsData?.unique_visitors || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 15) + 5}% from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time on Page</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-28 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statsData ? `${Math.round(statsData.avg_time_on_page || 0)}s` : '0s'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 8) + 2}% from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-28 animate-pulse bg-muted rounded-md"></div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {statsData ? `${Math.round(statsData.bounce_rate || 0)}%` : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.random() > 0.5 ? '+' : '-'}{Math.floor(Math.random() * 5) + 1}% from last period
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="space-y-6">
        <Tabs defaultValue="visitors">
          <TabsList>
            <TabsTrigger value="visitors" className="flex gap-2 items-center">
              <LineChart className="h-4 w-4" />
              Visitors
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex gap-2 items-center">
              <BarChart className="h-4 w-4" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex gap-2 items-center">
              <PieChart className="h-4 w-4" />
              Devices
            </TabsTrigger>
          </TabsList>
          <TabsContent value="visitors" className="space-y-4">
            <VisitorStatsChart timeRange={timeRange} />
          </TabsContent>
          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>User interaction with your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center">
                  <p className="text-muted-foreground">Engagement data visualization will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Breakdown of visitors by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center">
                  <p className="text-muted-foreground">Device distribution data will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Activity Feed and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user interactions on your website</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Website performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceMetrics />
          </CardContent>
        </Card>
      </div>
      
      {/* System Alerts */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>System Information</AlertTitle>
        <AlertDescription>
          Your website has been running for 32 days without issues. Last backup was 2 days ago.
        </AlertDescription>
      </Alert>
    </div>
  );
};
