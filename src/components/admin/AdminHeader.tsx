
import React from 'react';
import { CalendarDays, Settings, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="border-b mb-6 pb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="text-primary" />
            Admin Control Panel
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <CalendarDays className="w-4 h-4" />
            {currentDate}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            View Site
          </Button>
          <Button variant="destructive" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="text-xs">
          <Users className="h-3 w-3 mr-1" />
          Online: 3
        </Button>
        <span className="text-muted-foreground">•</span>
        <Button variant="ghost" size="sm" className="text-xs">
          <Settings className="h-3 w-3 mr-1" />
          System Status: Online
        </Button>
      </div>
    </div>
  );
};
