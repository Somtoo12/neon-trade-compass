
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Legend
} from 'recharts';
import { DeviceStat, BrowserStat, CountryStat } from '@/services/analyticsAPI';

interface StatisticsCardProps<T> {
  title: string;
  data: T[];
  isLoading: boolean;
  dataKey: string;
  nameKey: string;
}

// Generate colors based on the primary theme color
const generateColors = (count: number) => {
  const colors = [];
  // Use theme colors with different opacities
  const baseColors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    '#5D5FEF',
    '#7B61FF',
    '#4F46E5',
    '#7C3AED',
    '#8B5CF6',
    '#6D28D9',
    '#6366F1'
  ];
  
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  
  return colors;
};

// Custom active shape for the pie chart
const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-15} textAnchor="middle" fill={fill} className="text-xs">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill={fill} className="text-xs font-medium">
        {payload.value} ({((payload.percent || 0) * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export function StatisticsCard<T>({ 
  title, 
  data, 
  isLoading,
  dataKey,
  nameKey
}: StatisticsCardProps<T>) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const colors = React.useMemo(() => generateColors(data.length), [data.length]);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const total = React.useMemo(() => {
    if (!data.length) return 0;
    return data.reduce((sum, item) => sum + (Number((item as any)[dataKey]) || 0), 0);
  }, [data, dataKey]);

  // Format data for pie chart
  const pieData = React.useMemo(() => {
    return data.map(item => ({
      name: (item as any)[nameKey] || 'Unknown',
      value: Number((item as any)[dataKey]) || 0,
      percent: Number((item as any)[dataKey]) / total || 0
    }));
  }, [data, nameKey, dataKey, total]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : data.length > 0 ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  innerRadius={55}
                  outerRadius={70}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const DeviceStatsCard: React.FC<{ 
  data: DeviceStat[]; 
  isLoading: boolean 
}> = ({ data, isLoading }) => {
  return (
    <StatisticsCard<DeviceStat>
      title="Devices"
      data={data}
      isLoading={isLoading}
      dataKey="count"
      nameKey="device_type"
    />
  );
};

export const BrowserStatsCard: React.FC<{ 
  data: BrowserStat[]; 
  isLoading: boolean 
}> = ({ data, isLoading }) => {
  return (
    <StatisticsCard<BrowserStat>
      title="Browsers"
      data={data}
      isLoading={isLoading}
      dataKey="count"
      nameKey="browser"
    />
  );
};

export const CountryStatsCard: React.FC<{ 
  data: CountryStat[]; 
  isLoading: boolean 
}> = ({ data, isLoading }) => {
  return (
    <StatisticsCard<CountryStat>
      title="Countries"
      data={data}
      isLoading={isLoading}
      dataKey="count"
      nameKey="country"
    />
  );
};
