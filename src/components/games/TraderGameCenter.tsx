
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamepadIcon } from "lucide-react";
import PropChallenge from './PropChallenge';

const TraderGameCenter = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trader Game Center</h2>
          <p className="text-sm text-muted-foreground">Level up your trading mind. Play to stay sharp.</p>
        </div>
        <GamepadIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚔️ Prop Firm Challenge Simulator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PropChallenge />
          </CardContent>
        </Card>
        
        {/* We'll implement these next */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle>🧠 Candle Memory Game</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle>⏱️ Kill Zone Reflex Game</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TraderGameCenter;
