
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const RiskManagement: React.FC = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (typeof window !== 'undefined' && calculatorRef.current) {
      // Create script for remote widgets
      const remoteWidgetScript = document.createElement('script');
      remoteWidgetScript.src = 'https://www.cashbackforex.com/Content/remote/remote-widgets.js';
      remoteWidgetScript.async = true;
      
      // Create script for calculator configuration
      const calculatorScript = document.createElement('script');
      calculatorScript.textContent = `
        if (typeof RemoteCalc === 'function') {
          RemoteCalc({
            "Url":"https://www.cashbackforex.com",
            "TopPaneStyle":"YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KCMzNDM1NDAgMCUsICMyNDI4MzEgMTAwJSk7CmNvbG9yOiB3aGl0ZTsKYm9yZGVyLWJvdHRvbTogbm9uZTsKCg==",
            "BottomPaneStyle":"YmFja2dyb3VuZDogIzE1MTgxZDsKYm9yZGVyOiBzb2xpZCAwcHggIzJhMmUzOTsKY29sb3I6ICM5MTk0YTE7Cgo=",
            "ButtonStyle":"YmFja2dyb3VuZDogIzAwRkY1QTsgCmNvbG9yOiBibGFjazsgCmJvcmRlci1yYWRpdXM6IDhweDsgCmZvbnQtd2VpZ2h0OiBib2xkOwo=",
            "TitleStyle":"dGV4dC1hbGlnbjogbGVmdDsgCmZvbnQtc2l6ZTogMzBweDsgCmZvbnQtd2VpZ2h0OiA2MDA7IApjb2xvcjogd2hpdGU7Cg==",
            "TextboxStyle":"Cgo=",
            "ContainerWidth": "${isMobile ? window.innerWidth - 40 : Math.min(window.innerWidth - 100, 700)}",
            "HighlightColor":"rgba(0,0,0,1.0)",
            "IsDisplayTitle":false,
            "IsShowChartLinks":true,
            "IsShowEmbedButton":true,
            "CompactType":"${isMobile ? 'small' : 'large'}",
            "Calculator":"profit-calculator",
            "ContainerId":"profit-calculator-12454"
          });
        } else {
          console.error('RemoteCalc is not defined. Make sure the script is loaded properly.');
        }
      `;

      // Clear previous content and append scripts
      calculatorRef.current.innerHTML = '<div id="profit-calculator-12454" class="mx-auto"></div>';
      calculatorRef.current.appendChild(remoteWidgetScript);
      
      // Add calculator script after remote widget script is loaded
      remoteWidgetScript.onload = () => {
        calculatorRef.current?.appendChild(calculatorScript);
      };

      // Cleanup on unmount
      return () => {
        if (calculatorRef.current) {
          calculatorRef.current.innerHTML = '';
        }
      };
    }
  }, [isMobile]);

  return (
    <div className="relative space-y-6">
      {/* Cyber grid background effect */}
      <div 
        className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10"
        style={{ backgroundPosition: '50%' }}
      />
      
      <Card className="relative overflow-hidden border-2 border-neon-cyan backdrop-blur-md bg-background/30 shadow-neon-cyan">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-neon-blue/5 to-neon-cyan/10" />
        
        <CardHeader className="pb-2 border-b border-neon-cyan/30">
          <CardTitle className="text-xl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <Trophy className="h-5 w-5 text-neon-cyan" />
              <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent animate-pulse-text">
                TACTICAL RISK CONSOLE v3.7
              </span>
            </motion.div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10 p-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Calculator Container with responsive width */}
            <div 
              ref={calculatorRef} 
              className="calculator-container min-h-[400px] flex items-center justify-center overflow-x-auto w-full"
            >
              <div className="text-muted-foreground flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
                Loading calculator...
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagement;
