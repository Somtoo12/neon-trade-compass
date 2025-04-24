
import React, { useState, useEffect } from 'react';
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
  const [allPairs, setAllPairs] = useState<string[]>([]);
  
  // Initialize the pairs when the component mounts
  useEffect(() => {
    try {
      // Safely handle the arrays with defaults if they're undefined
      const majors = Array.isArray(forexPairs.majors) ? forexPairs.majors : [];
      const minors = Array.isArray(forexPairs.minors) ? forexPairs.minors : [];
      const exotics = Array.isArray(forexPairs.exotics) ? forexPairs.exotics : [];
      const crypto = Array.isArray(cryptoPairs) ? cryptoPairs : [];
      
      // Set the consolidated array ensuring it's never undefined
      setAllPairs([...majors, ...minors, ...exotics, ...crypto]);
    } catch (error) {
      console.error("Error setting currency pairs:", error);
      // Ensure we at least have an empty array
      setAllPairs([]);
    }
  }, []);

  const direction = React.useMemo(() => {
    if (!entry || !takeProfit) return null;
    const entryNum = parseFloat(entry);
    const tpNum = parseFloat(takeProfit);
    
    // Only calculate direction if both values are valid numbers
    if (!isNaN(entryNum) && !isNaN(tpNum)) {
      return tpNum > entryNum ? "LONG 🔺" : "SHORT 🔻";
    }
    return null;
  }, [entry, takeProfit]);

  const resultClass = React.useMemo(() => {
    const num = parseFloat(result);
    if (isNaN(num)) return "";
    return num > 0 ? "text-green-500" : num < 0 ? "text-red-500" : "";
  }, [result]);

  const generateSummary = () => {
    // Safely handle potentially undefined or invalid values
    const safeResult = result || "";
    const safeEmoji = !isNaN(parseFloat(safeResult)) 
      ? (parseFloat(safeResult) > 0 ? "🔥" : parseFloat(safeResult) < 0 ? "😬" : "💡")
      : "💡";
    
    const safePair = pair || "";
    const safeDirection = direction || "";
    const safeEntry = entry || "";
    const safeTakeProfit = takeProfit || "";
    const safeStopLoss = stopLoss || "";
    const safeLotSize = lotSize || "";
    const safeNotes = notes || "";
    
    return `${safePair} • ${safeDirection} ${safeEmoji}
📈 Entry: ${safeEntry} | 🎯 TP: ${safeTakeProfit} | 🛑 SL: ${safeStopLoss}
🧠 Result: ${safeResult} pips | Lot Size: ${safeLotSize}
📝 "${safeNotes}"`;
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
                  {/* Ensure we only render the CommandGroup and items if allPairs is available */}
                  {Array.isArray(allPairs) && allPairs.length > 0 ? (
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
                  ) : (
                    <div className="p-2 text-sm text-center">Loading pairs...</div>
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
