
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import BackButton from './BackButton';
import { useIsMobile } from '@/hooks/use-mobile';
import ThemeToggle from '../theme/ThemeToggle';

interface AppLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  activeSection, 
  setActiveSection 
}) => {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Desktop theme toggle */}
      {!isMobile && <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>}

      {isMobile ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Back button and mobile navigation */}
          <div className="flex items-center justify-between py-2 px-4 pt-safe">
            <BackButton />
            {activeSection && setActiveSection ? (
              <MobileNav activeSection={activeSection} setActiveSection={setActiveSection} />
            ) : (
              <div></div>
            )}
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16">
            {children}
          </main>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-0'}`}>
            <div className="mb-4">
              <BackButton />
            </div>
            {children}
          </main>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default AppLayout;
