
import React from 'react';
import BasicRiskCalculator from '@/components/calculators/BasicRiskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const RiskManagement: React.FC = () => {
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
            <BasicRiskCalculator />
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagement;
