
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from 'lucide-react';

const DailyRisk = () => {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<string>("1");
  const [trades, setTrades] = useState<string>("3");

  const calculation = useMemo(() => {
    const riskPerTrade = (balance * parseFloat(riskPercent)) / 100;
    const totalRisk = riskPerTrade * parseInt(trades);
    const totalRiskPercent = (totalRisk / balance) * 100;
    const isHighRisk = totalRiskPercent > 5;

    return {
      riskPerTrade: riskPerTrade.toFixed(2),
      totalRisk: totalRisk.toFixed(2),
      totalRiskPercent: totalRiskPercent.toFixed(1),
      isHighRisk
    };
  }, [balance, riskPercent, trades]);

  return (
    <Card className="p-6 neo-card">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Daily Risk Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Account Balance (USD)</Label>
            <Input 
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Risk % per trade</Label>
            <Select value={riskPercent} onValueChange={setRiskPercent}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["0.5", "1", "2", "3", "4", "5"].map((value) => (
                  <SelectItem key={value} value={value}>{value}%</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Number of trades</Label>
            <Select value={trades} onValueChange={setTrades}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 10}, (_, i) => (i + 1).toString()).map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 bg-card/30">
              <p className="text-sm text-muted-foreground">Risk per trade</p>
              <p className="text-2xl font-semibold">${calculation.riskPerTrade}</p>
            </Card>
            
            <Card className="p-4 bg-card/30">
              <p className="text-sm text-muted-foreground">Total Daily Risk</p>
              <p className="text-2xl font-semibold">${calculation.totalRisk}</p>
            </Card>
          </div>

          {calculation.isHighRisk && (
            <Card className="p-4 bg-destructive/20 border-destructive">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-sm">
                  Warning: Total risk ({calculation.totalRiskPercent}%) exceeds recommended daily limit of 5%
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DailyRisk;
