
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Footer from './Footer';
import { useIsMobile } from '@/hooks/use-mobile';

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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {isMobile ? (
        <MobileNav activeSection={activeSection} setActiveSection={setActiveSection} />
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
