
import React from 'react';
import { Bell } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNotificationPrompt } from '@/hooks/use-notification-prompt';

const NotificationBadge: React.FC = () => {
  const { isSubscribed } = useNotificationPrompt();

  if (!isSubscribed) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg flex items-center space-x-1.5">
              <Bell size={16} />
              <span className="text-xs font-medium">Subscribed</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>You'll be notified of new tools and updates</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NotificationBadge;
