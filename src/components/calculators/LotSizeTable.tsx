
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LotSizeTable = () => {
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<string>("1");
  const [stopLoss, setStopLoss] = useState<number>(20);
  const [pair, setPair] = useState<string>("EURUSD");

  const calculateLotSize = (slPips: number) => {
    const riskAmount = (accountSize * parseFloat(riskPercent)) / 100;
    const lotSize = (riskAmount / slPips / 10).toFixed(2);
    return { lotSize, riskAmount: riskAmount.toFixed(2) };
  };

  const generateTableRows = () => {
    const rows = [];
    for (let sl = 5; sl <= 50; sl += 5) {
      const { lotSize, riskAmount } = calculateLotSize(sl);
      const isRecommended = sl === stopLoss;
      rows.push({ sl, lotSize, riskAmount, isRecommended });
    }
    return rows;
  };

  return (
    <Card className="p-6 neo-card">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Lot Size Risk Table</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Account Size (USD)</Label>
            <Input 
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(Number(e.target.value))}
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
                {["0.5", "1", "2", "3"].map((value) => (
                  <SelectItem key={value} value={value}>{value}%</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Stop Loss (pips)</Label>
            <Input 
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
              className="input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Currency Pair</Label>
            <Select value={pair} onValueChange={setPair}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["EURUSD", "GBPUSD", "USDJPY", "AUDUSD"].map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Stop Loss (pips)</TableHead>
              <TableHead>Lot Size</TableHead>
              <TableHead>Risk (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {generateTableRows().map((row) => (
              <TableRow 
                key={row.sl}
                className={row.isRecommended ? "bg-primary/20" : ""}
              >
                <TableCell>{row.sl}</TableCell>
                <TableCell>
                  {row.isRecommended ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2">
                          {row.lotSize} <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Recommended lot size for your settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : row.lotSize}
                </TableCell>
                <TableCell>${row.riskAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default LotSizeTable;
