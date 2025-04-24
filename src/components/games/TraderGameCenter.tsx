import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamepadIcon, Sword, Clock, Zap, ChartBar } from "lucide-react";
import PropChallenge from './PropChallenge';
import KillZoneReflex from './KillZoneReflex';
import NewsSentimentSniper from './NewsSentimentSniper';
import TradeAnatomyBuilder from './TradeAnatomyBuilder';
import GamePerformanceDashboard from './GamePerformanceDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

const TraderGameCenter = () => {
  const [activeGame, setActiveGame] = useState('prop-challenge');
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Trader Game Center</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Level up your trading mind. Play to stay sharp.</p>
        </div>
        <GamepadIcon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
      </div>
      
      <GamePerformanceDashboard />
      
      <Tabs 
        value={activeGame} 
        onValueChange={setActiveGame} 
        className="w-full"
      >
        <div className="relative w-full">
          <TabsList className="w-full overflow-x-auto flex whitespace-nowrap scrollbar-none pb-1 gap-2 bg-secondary/30">
            <TabsTrigger 
              value="prop-challenge" 
              className="flex items-center gap-2 px-4 py-2.5 min-w-[120px] hover:bg-secondary/50 data-[state=active]:bg-primary/20 data-[state=active]:shadow-glow transition-all duration-200"
            >
              <Sword className="w-[18px] h-[18px] md:w-5 md:h-5 shrink-0" />
              <span className="text-xs md:text-sm font-medium truncate">Prop Challenge</span>
            </TabsTrigger>
            <TabsTrigger 
              value="kill-zone" 
              className="flex items-center gap-2 px-4 py-2.5 min-w-[120px] hover:bg-secondary/50 data-[state=active]:bg-primary/20 data-[state=active]:shadow-glow transition-all duration-200"
            >
              <Clock className="w-[18px] h-[18px] md:w-5 md:h-5 shrink-0" />
              <span className="text-xs md:text-sm font-medium truncate">Kill Zone</span>
            </TabsTrigger>
            <TabsTrigger 
              value="news-sentiment" 
              className="flex items-center gap-2 px-4 py-2.5 min-w-[120px] hover:bg-secondary/50 data-[state=active]:bg-primary/20 data-[state=active]:shadow-glow transition-all duration-200"
            >
              <Zap className="w-[18px] h-[18px] md:w-5 md:h-5 shrink-0" />
              <span className="text-xs md:text-sm font-medium truncate">News Sentiment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trade-anatomy" 
              className="flex items-center gap-2 px-4 py-2.5 min-w-[120px] hover:bg-secondary/50 data-[state=active]:bg-primary/20 data-[state=active]:shadow-glow transition-all duration-200"
            >
              <ChartBar className="w-[18px] h-[18px] md:w-5 md:h-5 shrink-0" />
              <span className="text-xs md:text-sm font-medium truncate">Trade Builder</span>
            </TabsTrigger>
          </TabsList>
          <div className="absolute left-0 top-0 bottom-1 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
        </div>

        <TabsContent value="prop-challenge" className="mt-4">
          <Card className="border-secondary/30">
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                ⚔️ Prop Firm Challenge Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <PropChallenge />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kill-zone" className="mt-4">
          <Card className="border-secondary/30">
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">⏱️ Kill Zone Reflex Game</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <KillZoneReflex />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="news-sentiment" className="mt-4">
          <Card className="border-secondary/30">
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">📰 News Sentiment Sniper</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <NewsSentimentSniper />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trade-anatomy" className="mt-4">
          <Card className="border-secondary/30">
            <CardHeader className="p-3 md:p-6">
              <CardTitle className="text-base md:text-lg">📊 Trade Anatomy Builder</CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <TradeAnatomyBuilder />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TraderGameCenter;
