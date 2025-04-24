
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamepadIcon } from "lucide-react";
import PropChallenge from './PropChallenge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TraderGameCenter = () => {
  const [activeGame, setActiveGame] = useState('prop-challenge');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Trader Game Center</h2>
          <p className="text-sm text-muted-foreground">Level up your trading mind. Play to stay sharp.</p>
        </div>
        <GamepadIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <Tabs value={activeGame} onValueChange={setActiveGame} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prop-challenge">⚔️ Prop Challenge</TabsTrigger>
          <TabsTrigger value="kill-zone">⏱️ Kill Zone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prop-challenge">
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
        </TabsContent>
        
        <TabsContent value="kill-zone">
          <Card>
            <CardHeader>
              <CardTitle>⏱️ Kill Zone Reflex Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TraderGameCenter;
