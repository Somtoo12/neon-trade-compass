
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';

interface VisitsChartProps {
  data: any[];
  isLoading: boolean;
  interval: 'hour' | 'day' | 'week' | 'month';
}

const formatDate = (dateStr: string, interval: 'hour' | 'day' | 'week' | 'month') => {
  try {
    switch (interval) {
      case 'hour':
        return dateStr.split('T')[1].substring(0, 5);
      case 'week':
        return `Week ${dateStr.split('-W')[1]}`;
      case 'month':
        const date = new Date(dateStr);
        return date.toLocaleString('default', { month: 'short' });
      case 'day':
      default:
        const [year, month, day] = dateStr.split('-');
        return `${month}/${day}`;
    }
  } catch (e) {
    return dateStr;
  }
};

export const VisitsChart: React.FC<VisitsChartProps> = ({ data, isLoading, interval }) => {
  // Format data for chart
  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: formatDate(item.date, interval),
    }));
  }, [data, interval]);

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-md shadow-md border border-border">
          <p className="font-medium">{payload[0]?.payload.date}</p>
          <p className="text-sm">
            <span className="font-medium">Visits: </span>
            {payload[0]?.value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Visitor Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10}
                />
                <YAxis
                  width={40}
                  tickMargin={10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  activeDot={{ r: 8 }}
                  name="Visits"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
