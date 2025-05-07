
import React from 'react';
import {
  Home,
  LayoutDashboard,
  Settings,
  BarChart,
  Calculator,
  Gamepad2,
  Waves,
  TrendingUp,
  BarChart2,
  ClipboardList,
  Activity,
  Calendar,
  LucideIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '../theme/ThemeToggle';

interface SidebarLink {
  title: string;
  icon: LucideIcon;
  path: string;
}

const Sidebar: React.FC = () => {
  const { theme } = useTheme();

  const sidebarLinks: SidebarLink[] = [
    {
      title: "Home",
      icon: Home,
      path: "/",
    },
    {
      title: "Focus Mode",
      icon: LayoutDashboard,
      path: "/focus-mode",
    },
    {
      title: "Tools",
      icon: Settings,
      path: "/tools",
    },
    {
      title: "Forex Calculator",
      icon: Calculator,
      path: "/forex-calculator",
    },
    {
      title: "Crypto Calculator",
      icon: Waves,
      path: "/crypto-calculator",
    },
    {
      title: "Futures Calculator",
      icon: TrendingUp,
      path: "/futures-calculator",
    },
    {
      title: "Session Clock",
      icon: Activity,
      path: "/session-clock",
    },
    {
      title: "Currency Heatmap",
      icon: BarChart2,
      path: "/currency-heatmap",
    },
    {
      title: "Risk Management",
      icon: ClipboardList,
      path: "/risk-management",
    },
    {
      title: "Max Lot Size",
      icon: LayoutDashboard,
      path: "/max-lot-size",
    },
    {
      title: "Trade Journal",
      icon: ClipboardList,
      path: "/trade-journal",
    },
    {
      title: "Daily Trade Tools",
      icon: Settings,
      path: "/daily-trade-tools",
    },
    {
      title: "Challenge Blueprint",
      icon: Settings,
      path: "/challenge-blueprint",
    },
    {
      title: "Economic Calendar",
      icon: Calendar,
      path: "/economic-calendar",
    },
    {
      title: "Trader Games",
      icon: Gamepad2,
      path: "/trader-games",
    },
    {
      title: "Analytics Dashboard",
      icon: BarChart,
      path: "/analytics",
    },
  ];

  return (
    <aside
      className={`
        flex flex-col
        w-full md:w-64
        h-screen
        px-4 py-8
        border-r
        ${theme === 'dark' ? 'bg-secondary' : 'bg-white shadow-md'}
        transition-all duration-300 ease-in-out
        fixed top-0 left-0 z-40
      `}
    >
      <div className="flex items-center justify-between mb-8">
        <NavLink to="/" className="text-2xl font-bold">
          PipCraft
        </NavLink>
        <ThemeToggle />
      </div>

      <nav className="flex-1 space-y-1">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.title}
            to={link.path}
            className={({ isActive }) =>
              `group flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground text-foreground/80'
              }`
            }
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
          </NavLink>
        ))}
      </nav>

      <Separator className="my-4 opacity-30" />

      <div className="text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} PipCraft. All rights reserved.
      </div>
    </aside>
  );
};

export default Sidebar;
