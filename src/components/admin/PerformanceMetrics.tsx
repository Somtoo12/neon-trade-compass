
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
}

const metrics: PerformanceMetric[] = [
  { name: 'Page Load Time', value: 1.8, target: 2, unit: 's' },
  { name: 'First Contentful Paint', value: 0.9, target: 1.5, unit: 's' },
  { name: 'Time to Interactive', value: 2.3, target: 3, unit: 's' },
  { name: 'Server Response', value: 0.3, target: 0.5, unit: 's' },
  { name: 'Uptime', value: 99.95, target: 99.9, unit: '%' }
];

export const PerformanceMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium">{metric.name}</span>
            <span className="text-sm text-muted-foreground">
              {metric.value} {metric.unit} 
              <span className="text-xs ml-1">
                (Target: {metric.target} {metric.unit})
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={(metric.value / metric.target) * 100} 
              className="h-2"
              // Green if better than target, amber if close, red if worse
              color={
                metric.name === 'Uptime' || metric.name === 'Score' ?
                (metric.value >= metric.target ? 'bg-green-500' : (metric.value >= metric.target * 0.9 ? 'bg-amber-500' : 'bg-red-500')) :
                (metric.value <= metric.target ? 'bg-green-500' : (metric.value <= metric.target * 1.2 ? 'bg-amber-500' : 'bg-red-500'))
              }
            />
          </div>
        </div>
      ))}
      
      <div className="border-t pt-4 mt-4">
        <div className="text-sm font-medium mb-2">System Health</div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-sm">All systems operational</span>
        </div>
      </div>
    </div>
  );
};
