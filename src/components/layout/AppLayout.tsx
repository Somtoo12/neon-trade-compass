
import React from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import BackButton from './BackButton';
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
      {/* Desktop theme toggle */}
      {!isMobile && <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>}

      {isMobile ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Back button and mobile navigation */}
          <div className="flex items-center justify-between py-2 px-3">
            <BackButton />
            <MobileNav activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>
          <main className="flex-1 overflow-y-auto p-3 md:p-4 pt-16">
            {children}
          </main>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <main className="flex-1 overflow-y-auto p-4">
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
