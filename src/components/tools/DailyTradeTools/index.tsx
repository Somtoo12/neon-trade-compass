
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TradingChecklist from './TradingChecklist';
import KillZonesClock from './KillZonesClock';

const DailyTradeTools: React.FC = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="sticky top-0 py-2 md:py-3 bg-background/90 backdrop-blur-lg z-10 border-b border-border/30 -mx-3 md:-mx-4 px-3 md:px-4">
        <h2 className="text-lg md:text-xl font-bold font-poppins">
          Plan. Trade. Protect Your Capital.
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Daily discipline tools to keep your trading on track
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card className="neo-card overflow-hidden neon-border shadow-lg">
          <CardHeader className="p-3 md:p-6 pb-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <span>✅ Live Trading Checklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-2">
            <TradingChecklist />
          </CardContent>
        </Card>

        <Card className="neo-card overflow-hidden neon-border shadow-lg">
          <CardHeader className="p-3 md:p-6 pb-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <span>⏰ Kill Zones Clock</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-2">
            <KillZonesClock />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyTradeTools;
