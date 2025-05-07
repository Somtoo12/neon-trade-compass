
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageViewCount } from '@/services/analyticsAPI';

interface TopPagesCardProps {
  data: PageViewCount[];
  isLoading: boolean;
}

export const TopPagesCard: React.FC<TopPagesCardProps> = ({ data, isLoading }) => {
  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-4">
            {data.map((page, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="text-sm truncate max-w-[70%]" title={page.page_path}>
                  {page.page_path === '/' ? 'Home Page' : page.page_path}
                </div>
                <div className="text-sm font-medium">{page.count}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};
