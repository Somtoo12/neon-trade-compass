
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Copy, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { forexPairs, cryptoPairs } from "@/constants/currencyPairs";
import { cn } from "@/lib/utils";

const TradeJournal = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [pair, setPair] = useState<string>("EURUSD");
  const [entry, setEntry] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [lotSize, setLotSize] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Ensure allPairs is always an array
  const allPairs = [...forexPairs.majors, ...forexPairs.minors, ...forexPairs.exotics, ...cryptoPairs];

  const direction = React.useMemo(() => {
    if (!entry || !takeProfit) return null;
    return parseFloat(takeProfit) > parseFloat(entry) ? "LONG 🔺" : "SHORT 🔻";
  }, [entry, takeProfit]);

  const resultClass = React.useMemo(() => {
    const num = parseFloat(result);
    if (isNaN(num)) return "";
    return num > 0 ? "text-green-500" : num < 0 ? "text-red-500" : "";
  }, [result]);

  const generateSummary = () => {
    const emoji = parseFloat(result) > 0 ? "🔥" : parseFloat(result) < 0 ? "😬" : "💡";
    
    return `${pair} • ${direction || ""} ${emoji}
📈 Entry: ${entry} | 🎯 TP: ${takeProfit} | 🛑 SL: ${stopLoss}
🧠 Result: ${result} pips | Lot Size: ${lotSize}
📝 "${notes}"`;
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

  const resetForm = () => {
    setEntry("");
    setStopLoss("");
    setTakeProfit("");
    setLotSize("");
    setResult("");
    setNotes("");
  };

  return (
    <Card className="p-6 neo-card">
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Trade Journal Snapshot</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Currency Pair</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {pair || "Select pair..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search pair..." className="h-9" />
                  <CommandEmpty>No pair found.</CommandEmpty>
                  {/* Ensure we only render CommandGroup if allPairs is defined and not empty */}
                  {allPairs && allPairs.length > 0 && (
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {allPairs.map((p) => (
                        <CommandItem
                          key={p}
                          value={p}
                          onSelect={(currentValue) => {
                            setPair(currentValue);
                            setOpen(false);
                          }}
                        >
                          {p}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Entry Price</Label>
            <Input 
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="input-glow font-mono"
              placeholder="1.1050"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Stop Loss</Label>
            <Input 
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              className="input-glow font-mono"
              placeholder="1.1000"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Take Profit</Label>
            <Input 
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              className="input-glow font-mono"
              placeholder="1.1100"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Lot Size</Label>
            <Input 
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              className="input-glow font-mono"
              placeholder="0.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Result (pips)</Label>
            <Input 
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className={cn("input-glow font-mono", resultClass)}
              placeholder="+50"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your trade notes here..."
            className="input-glow resize-none"
          />
        </div>

        <Card className="p-4 bg-black/30 border border-white/10">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {generateSummary()}
          </pre>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="gap-2"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              Copy Summary
            </Button>
            <Button
              onClick={resetForm}
              variant="outline"
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Clear Form
            </Button>
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default TradeJournal;
