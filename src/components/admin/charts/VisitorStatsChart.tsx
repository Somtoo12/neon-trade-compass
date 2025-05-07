
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';

interface VisitorData {
  date: string;
  count: number;
}

interface VisitorStatsChartProps {
  timeRange: string;
}

export const VisitorStatsChart: React.FC<VisitorStatsChartProps> = ({ timeRange }) => {
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        setIsLoading(true);
        
        // Get days based on selected time range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Format parameter based on time range
        const timeFormat = timeRange === '7d' ? 'Dy' : 'MM-DD';
        
        // Call the Supabase function to get visitor data by date
        const { data, error } = await supabase.rpc('get_visits_by_date', {
          time_format: timeFormat,
          start_date_param: startDate.toISOString(),
          end_date_param: new Date().toISOString()
        });
        
        if (error) throw error;
        
        setVisitorData(data || []);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
        // Fallback to demo data
        const demoData = generateDemoData(timeRange);
        setVisitorData(demoData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorData();
  }, [timeRange]);

  // Generate demo data if real data fails to load
  const generateDemoData = (range: string): VisitorData[] => {
    const data: VisitorData[] = [];
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let formattedDate = '';
      if (range === '7d') {
        formattedDate = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      }
      
      data.push({
        date: formattedDate,
        count: Math.floor(Math.random() * 100) + 10
      });
    }
    
    return data;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitor Statistics</CardTitle>
        <CardDescription>
          {timeRange === '7d' ? 'Daily' : 'Periodic'} visitor count for the selected time range
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[350px] w-full animate-pulse bg-muted rounded-md"></div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visitorData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Visitors"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
