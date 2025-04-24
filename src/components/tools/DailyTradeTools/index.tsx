
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TradingChecklist from './TradingChecklist';
import BreachRiskBar from './BreachRiskBar';
import KillZonesClock from './KillZonesClock';

const DailyTradeTools: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="sticky top-0 py-3 bg-background/80 backdrop-blur-lg z-10 border-b border-border/30 -mx-4 px-4 sm:px-6">
        <h2 className="text-xl font-bold font-poppins">
          Plan. Trade. Protect Your Capital.
        </h2>
        <p className="text-sm text-muted-foreground">
          Daily discipline tools to keep your trading on track
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="neo-card overflow-hidden neon-border shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">✅ Live Trading Checklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TradingChecklist />
          </CardContent>
        </Card>

        <Card className="neo-card overflow-hidden neon-border shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🚨 Breach Risk Bar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BreachRiskBar />
          </CardContent>
        </Card>

        <Card className="neo-card overflow-hidden neon-border shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">⏰ Kill Zones Clock</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KillZonesClock />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyTradeTools;
