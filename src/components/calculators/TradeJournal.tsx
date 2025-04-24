
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const TradeJournal = () => {
  const { toast } = useToast();
  const [pair, setPair] = useState<string>("EURUSD");
  const [entry, setEntry] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [lotSize, setLotSize] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generateSummary = () => {
    const resultNum = parseFloat(result);
    const emoji = resultNum > 0 ? "🔥" : resultNum < 0 ? "😬" : "💡";
    const direction = parseFloat(takeProfit) > parseFloat(entry) ? "LONG" : "SHORT";
    
    return `${pair} ${direction} @ ${entry} ➡️ ${takeProfit} 🎯
${emoji} ${result} pips | Lot Size: ${lotSize}
💬 "${notes}"`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSummary());
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Trade summary has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 neo-card">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Trade Journal Snapshot</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          
          <div className="space-y-2">
            <Label>Entry Price</Label>
            <Input 
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Stop Loss</Label>
            <Input 
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Take Profit</Label>
            <Input 
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Lot Size</Label>
            <Input 
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              className="input-glow"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Result (pips)</Label>
            <Input 
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="input-glow"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your trade notes here..."
            className="input-glow"
          />
        </div>

        <Card className="p-4 bg-card/30">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {generateSummary()}
          </pre>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="mt-4"
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy Summary
          </Button>
        </Card>
      </div>
    </Card>
  );
};

export default TradeJournal;
