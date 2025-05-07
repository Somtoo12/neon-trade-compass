
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { 
  Home, 
  Calculator, 
  Clock, 
  BarChart2, 
  ChevronsLeft, 
  ChevronsRight,
  Hash,
  Settings,
  BarChart
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapsed }) => {
  const location = useLocation();
  const { isAdmin } = useAnalytics();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Calculators', path: '/calculators', icon: <Calculator size={20} /> },
    { name: 'Session Clock', path: '/session-clock', icon: <Clock size={20} /> },
    { name: 'Tools', path: '/tools', icon: <Hash size={20} /> },
    // Only show analytics to admin users
    ...(isAdmin ? [{ name: 'Analytics', path: '/analytics', icon: <BarChart size={20} /> }] : [])
  ];
  
  return (
    <div 
      className={cn(
        "border-r border-border h-screen bg-background text-foreground flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex justify-between items-center p-4 border-b border-border">
        {!collapsed && <h1 className="font-bold text-xl">PipCraft</h1>}
        <button 
          onClick={toggleCollapsed}
          className="p-1 rounded-full hover:bg-muted transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors hover:bg-muted",
                  isActive(item.path) ? "bg-muted font-medium" : "",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? item.name : ""}
              >
                <span className={collapsed ? "mx-0" : "mr-3"}>{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <Link
          to="/settings"
          className={cn(
            "flex items-center px-3 py-2 rounded-md transition-colors hover:bg-muted",
            collapsed ? "justify-center" : "justify-start"
          )}
          title={collapsed ? "Settings" : ""}
        >
          <span className={collapsed ? "mx-0" : "mr-3"}><Settings size={20} /></span>
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
