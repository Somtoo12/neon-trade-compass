
import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '../theme/ThemeToggle';

interface AppLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeSection, 
  setActiveSection 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {!isMobile && <ThemeToggle />}
      {isMobile ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <MobileNav activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AppLayout;
