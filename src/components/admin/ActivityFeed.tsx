
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Demo data for the activity feed
const activities = [
  {
    id: '1',
    user: { name: 'John Doe', avatar: null, initials: 'JD' },
    action: 'visited',
    target: 'forex-calculator page',
    timestamp: '2 minutes ago',
    type: 'page-view'
  },
  {
    id: '2',
    user: { name: 'Sarah Kim', avatar: null, initials: 'SK' },
    action: 'clicked',
    target: 'risk management calculator button',
    timestamp: '15 minutes ago',
    type: 'click'
  },
  {
    id: '3',
    user: { name: 'Mark Johnson', avatar: null, initials: 'MJ' },
    action: 'signed up',
    target: '',
    timestamp: '35 minutes ago',
    type: 'auth'
  },
  {
    id: '4',
    user: { name: 'Emma Wilson', avatar: null, initials: 'EW' },
    action: 'completed',
    target: 'KillZone game with score 95',
    timestamp: '1 hour ago',
    type: 'game'
  },
  {
    id: '5',
    user: { name: 'Anonymous User', avatar: null, initials: 'AU' },
    action: 'viewed',
    target: 'homepage for 3 minutes',
    timestamp: '1.5 hours ago',
    type: 'page-view'
  },
  {
    id: '6',
    user: { name: 'Robert Chen', avatar: null, initials: 'RC' },
    action: 'downloaded',
    target: 'trading checklist PDF',
    timestamp: '2 hours ago',
    type: 'download'
  },
  {
    id: '7',
    user: { name: 'Lisa Morgan', avatar: null, initials: 'LM' },
    action: 'saved',
    target: 'challenge blueprint settings',
    timestamp: '3 hours ago',
    type: 'action'
  }
];

export const ActivityFeed: React.FC = () => {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'auth': return 'default';
      case 'page-view': return 'secondary';
      case 'click': return 'outline';
      case 'game': return 'destructive';
      case 'download': return 'success';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-2 rounded-md hover:bg-accent/10 transition-colors">
              <Avatar className="h-8 w-8">
                {activity.user.avatar ? (
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                ) : (
                  <AvatarFallback>{activity.user.initials}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{activity.user.name}</span>
                  <Badge variant={getBadgeVariant(activity.type) as any} className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} {activity.target}
                </p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="flex justify-center">
        <Button variant="outline" size="sm">Load More</Button>
      </div>
    </div>
  );
};
