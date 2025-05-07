
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsSummary } from '@/services/analyticsAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Eye, 
  Clock, 
  CornerDownRight 
} from 'lucide-react';

interface AnalyticsSummaryCardProps {
  data: AnalyticsSummary | null;
  isLoading: boolean;
}

export const AnalyticsSummaryCard: React.FC<AnalyticsSummaryCardProps> = ({ 
  data, 
  isLoading 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className="text-2xl font-bold">{data?.total_visits?.toLocaleString() || '0'}</div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className="text-2xl font-bold">{data?.unique_visitors?.toLocaleString() || '0'}</div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {data?.avg_time_on_page 
                ? `${Math.round(data.avg_time_on_page)}s` 
                : '0s'}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm border border-primary/10 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          <CornerDownRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {data?.bounce_rate 
                ? `${Math.round(data.bounce_rate)}%` 
                : '0%'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
