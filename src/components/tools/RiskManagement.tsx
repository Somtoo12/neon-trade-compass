
import React from 'react';
import BasicRiskCalculator from '@/components/calculators/BasicRiskCalculator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RiskManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="cyber-blueprint border-2 border-neon-green shadow-lg bg-background/30 backdrop-blur-md">
        <CardHeader className="pb-2 border-b border-neon-green/30">
          <CardTitle className="text-xl flex items-center">
            <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              TACTICAL RISK CONSOLE v3.7
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <BasicRiskCalculator />
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagement;
