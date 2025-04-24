import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  CalendarIcon, CheckCircle2, Copy, Edit2, Trash2,
  PieChart, BarChart3, Filter, Plus, Search, ChevronDown
} from 'lucide-react';
import { forexPairs as importedForexPairs, cryptoPairs } from "@/constants/currencyPairs";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Cell, PieChart as RePieChart, Pie } from 'recharts';

// Add additional pairs for indices, metals, etc.
const indices = ['US30', 'NAS100', 'SPX500', 'UK100', 'GER40', 'JPN225'];
const metals = ['XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD'];
const energies = ['USOIL', 'UKOIL', 'NATGAS'];

// Format forex pairs to match expected format - with null checks
const forexPairs = [
  ...(importedForexPairs && importedForexPairs.majors ? importedForexPairs.majors.map(pair => pair.replace('/', '')) : []),
  ...(importedForexPairs && importedForexPairs.minors ? importedForexPairs.minors.map(pair => pair.replace('/', '')) : []),
  ...(importedForexPairs && importedForexPairs.exotics ? importedForexPairs.exotics.map(pair => pair.replace('/', '')) : []),
  ...metals,
  ...indices,
  ...energies
];

// Process crypto pairs to match format
const formattedCryptoPairs = cryptoPairs ? cryptoPairs.map(pair => pair.replace('/', '')) : [];

// Combine all pairs for the dropdown
const allPairs = [...forexPairs, ...formattedCryptoPairs];

// Type for trade data
interface Trade {
  id: string;
  pair: string;
  date: Date;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  pips: number;
  profit: number;
  direction: 'LONG' | 'SHORT';
  notes: string;
}

// Calculate profit based on pips and lot size
const calculateProfit = (pips: number, lotSize: number): number => {
  return pips * lotSize * 10;
};

// Generate random ID for trades
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Format pairs to match expected format and handle custom pairs
const formatPair = (pair: string) => pair.replace('/', '').toUpperCase();

const TradeJournal: React.FC = () => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  
  // Form state
  const [pair, setPair] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [lotSize, setLotSize] = useState<string>("");
  const [pips, setPips] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Filter state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [openCommandMenu, setOpenCommandMenu] = useState(false);

  // Detect direction based on entry and take profit
  const direction = useMemo(() => {
    const entry = parseFloat(entryPrice);
    const tp = parseFloat(takeProfit);
    if (isNaN(entry) || isNaN(tp)) return 'LONG';
    return tp > entry ? 'LONG' : 'SHORT';
  }, [entryPrice, takeProfit]);

  // Auto-calculate pips if entry, SL, and TP are provided
  useEffect(() => {
    if (entryPrice && takeProfit && !editingId) {
      const entry = parseFloat(entryPrice);
      const tp = parseFloat(takeProfit);
      
      if (!isNaN(entry) && !isNaN(tp)) {
        const calculatedPips = direction === 'LONG' 
          ? (tp - entry) * 10000 
          : (entry - tp) * 10000;
        
        setPips(calculatedPips.toFixed(0));
      }
    }
  }, [entryPrice, takeProfit, direction, editingId]);

  // Filter trades by date range
  const filteredTrades = useMemo(() => {
    if (!startDate && !endDate) return trades;
    
    return trades.filter(trade => {
      if (startDate && endDate) {
        return trade.date >= startDate && trade.date <= endDate;
      } else if (startDate) {
        return trade.date >= startDate;
      } else if (endDate) {
        return trade.date <= endDate;
      }
      return true;
    });
  }, [trades, startDate, endDate]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    const total = filteredTrades.length;
    const wins = filteredTrades.filter(t => t.pips > 0).length;
    const winRate = total > 0 ? (wins / total * 100).toFixed(1) : "0.0";
    const totalPips = filteredTrades.reduce((sum, t) => sum + t.pips, 0);
    const totalProfit = filteredTrades.reduce((sum, t) => sum + t.profit, 0);
    const avgProfit = total > 0 ? (totalProfit / total).toFixed(2) : "0.00";
    
    return { total, winRate, totalPips, totalProfit, avgProfit };
  }, [filteredTrades]);

  // Chart data preparation
  const chartData = useMemo(() => {
    const pairData: Record<string, { pair: string; count: number; pips: number; profit: number }> = {};
    
    filteredTrades.forEach(trade => {
      if (!pairData[trade.pair]) {
        pairData[trade.pair] = { pair: trade.pair, count: 0, pips: 0, profit: 0 };
      }
      pairData[trade.pair].count += 1;
      pairData[trade.pair].pips += trade.pips;
      pairData[trade.pair].profit += trade.profit;
    });
    
    return Object.values(pairData);
  }, [filteredTrades]);

  // Wins vs Losses data for pie chart
  const winsLossesData = useMemo(() => {
    const wins = filteredTrades.filter(t => t.pips > 0).length;
    const losses = filteredTrades.filter(t => t.pips < 0).length;
    const breakeven = filteredTrades.filter(t => t.pips === 0).length;
    
    return [
      { name: 'Wins', value: wins, color: '#10b981' },
      { name: 'Losses', value: losses, color: '#ef4444' },
      { name: 'Breakeven', value: breakeven, color: '#6b7280' }
    ];
  }, [filteredTrades]);

  // Reset form fields
  const resetForm = () => {
    setPair("");
    setEntryPrice("");
    setStopLoss("");
    setTakeProfit("");
    setLotSize("");
    setPips("");
    setNotes("");
    setEditingId(null);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!pair || !entryPrice || !stopLoss || !takeProfit || !lotSize || !pips) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Parse numeric values
    const entryPriceNum = parseFloat(entryPrice);
    const stopLossNum = parseFloat(stopLoss);
    const takeProfitNum = parseFloat(takeProfit);
    const lotSizeNum = parseFloat(lotSize);
    const pipsNum = parseFloat(pips);

    // Calculate profit
    const profitAmount = calculateProfit(pipsNum, lotSizeNum);
    
    // Create or update trade
    const tradeData: Trade = {
      id: editingId || generateId(),
      pair,
      date,
      entryPrice: entryPriceNum,
      stopLoss: stopLossNum,
      takeProfit: takeProfitNum,
      lotSize: lotSizeNum,
      pips: pipsNum,
      profit: profitAmount,
      direction,
      notes
    };

    if (editingId) {
      // Update existing trade
      setTrades(prevTrades => 
        prevTrades.map(trade => trade.id === editingId ? tradeData : trade)
      );
      toast({
        title: "Trade updated",
        description: `${pair} trade has been updated`
      });
    } else {
      // Add new trade
      setTrades(prevTrades => [...prevTrades, tradeData]);
      toast({
        title: "Trade added",
        description: `${pair} trade has been added to your journal`
      });
    }
    
    resetForm();
  };

  // Load trade data for editing
  const handleEdit = (trade: Trade) => {
    setPair(trade.pair);
    setDate(new Date(trade.date));
    setEntryPrice(trade.entryPrice.toString());
    setStopLoss(trade.stopLoss.toString());
    setTakeProfit(trade.takeProfit.toString());
    setLotSize(trade.lotSize.toString());
    setPips(trade.pips.toString());
    setNotes(trade.notes);
    setEditingId(trade.id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete trade
  const handleDelete = (id: string) => {
    setTrades(prevTrades => prevTrades.filter(trade => trade.id !== id));
    toast({
      title: "Trade deleted",
      description: "Trade has been removed from your journal"
    });
  };

  // Copy trade summary to clipboard
  const copyToClipboard = (trade: Trade) => {
    const emoji = trade.pips > 0 ? "🟢" : trade.pips < 0 ? "🔴" : "⚪";
    const summary = `${trade.pair} • ${trade.direction} ${emoji} — ${format(trade.date, "yyyy-MM-dd")}\n` +
      `📈 Entry: ${trade.entryPrice} | 🎯 TP: ${trade.takeProfit} | 🛑 SL: ${trade.stopLoss}\n` +
      `📊 ${trade.pips > 0 ? '+' : ''}${trade.pips} pips | ${trade.lotSize} lots | 💵 ${trade.profit > 0 ? '+' : ''}$${trade.profit.toFixed(2)}\n` +
      `📝 "${trade.notes}"`;

    navigator.clipboard.writeText(summary);
    toast({
      title: "Copied to clipboard",
      description: "Trade summary has been copied to your clipboard"
    });
  };

  // Prepare predefined pairs with proper null checking
  const predefinedPairs = useMemo(() => {
    return allPairs.map(formatPair);
  }, []);

  // Filtered pairs based on user input
  const [filteredPairs, setFilteredPairs] = useState<string[]>(predefinedPairs || []);
  
  // Filter pairs based on user input
  const handlePairSearch = (searchTerm: string) => {
    const term = searchTerm.toUpperCase();
    if (!predefinedPairs) {
      setFilteredPairs([]);
      return;
    }
    
    const filtered = predefinedPairs.filter(pair => 
      pair.includes(term)
    );
    setFilteredPairs(filtered);
  };

  return (
    <Card className="p-6 neo-card">
      <div className="space-y-8">
        <h3 className="text-2xl font-semibold">Trade Journal Tracker</h3>
        
        <Tabs defaultValue="entry" className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="entry">Trade Entry</TabsTrigger>
            <TabsTrigger value="summary">Summaries</TabsTrigger>
            <TabsTrigger value="log">Trade Log</TabsTrigger>
            <TabsTrigger value="charts">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Trade Entry Form */}
          <TabsContent value="entry" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Currency Pair Input with Autocomplete */}
                <div className="space-y-2">
                  <Label>Currency Pair</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={pair}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setPair(value);
                        handlePairSearch(value);
                        setOpenCommandMenu(true);
                      }}
                      placeholder="Type to search or enter custom pair..."
                      className="input-glow"
                    />
                    <Popover open={openCommandMenu} onOpenChange={setOpenCommandMenu}>
                      <PopoverTrigger className="absolute right-2 top-2.5">
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search pairs..." 
                            value={pair}
                            onValueChange={(value) => {
                              setPair(value);
                              handlePairSearch(value);
                            }}
                          />
                          <CommandEmpty>No matches found. You can use this custom pair.</CommandEmpty>
                          {filteredPairs && filteredPairs.length > 0 && (
                            <CommandGroup className="max-h-[200px] overflow-auto">
                              {filteredPairs.map((item) => (
                                <CommandItem
                                  key={item}
                                  value={item}
                                  onSelect={(value) => {
                                    setPair(value);
                                    setOpenCommandMenu(false);
                                  }}
                                >
                                  {item}
                                  {item === pair && <CheckCircle2 className="ml-auto h-4 w-4" />}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Rest of form fields */}
                {/* Entry Price */}
                <div className="space-y-2">
                  <Label>Entry Price</Label>
                  <Input
                    type="number"
                    step="0.00001"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="input-glow"
                    placeholder="0.00000"
                  />
                </div>
                
                {/* Stop Loss */}
                <div className="space-y-2">
                  <Label>Stop Loss (SL)</Label>
                  <Input
                    type="number"
                    step="0.00001"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="input-glow"
                    placeholder="0.00000"
                  />
                </div>
                
                {/* Take Profit */}
                <div className="space-y-2">
                  <Label>Take Profit (TP)</Label>
                  <Input
                    type="number"
                    step="0.00001"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="input-glow"
                    placeholder="0.00000"
                  />
                </div>
                
                {/* Direction (Auto-detected) */}
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <div className={`h-10 px-3 py-2 rounded-md border flex items-center ${direction === 'LONG' ? 'text-green-500' : 'text-red-500'} bg-background/30`}>
                    {direction === 'LONG' ? '🔺 LONG' : '🔻 SHORT'} (Auto-detected)
                  </div>
                </div>
                
                {/* Lot Size */}
                <div className="space-y-2">
                  <Label>Lot Size</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={lotSize}
                    onChange={(e) => setLotSize(e.target.value)}
                    className="input-glow"
                    placeholder="0.01"
                  />
                </div>
                
                {/* Result in Pips */}
                <div className="space-y-2">
                  <Label>Result (Pips)</Label>
                  <Input
                    type="number"
                    value={pips}
                    onChange={(e) => setPips(e.target.value)}
                    className="input-glow"
                    placeholder="0"
                  />
                </div>
                
                {/* Profit (Auto-calculated) */}
                <div className="space-y-2">
                  <Label>Profit/Loss (USD)</Label>
                  <div className={`h-10 px-3 py-2 rounded-md border flex items-center ${parseFloat(pips || '0') > 0 ? 'text-green-500' : parseFloat(pips || '0') < 0 ? 'text-red-500' : ''} bg-background/30`}>
                    {!isNaN(parseFloat(pips)) && !isNaN(parseFloat(lotSize)) 
                      ? `$${calculateProfit(parseFloat(pips), parseFloat(lotSize)).toFixed(2)}` 
                      : '$0.00'}
                  </div>
                </div>
                
                {/* Notes */}
                <div className="space-y-2 col-span-full">
                  <Label>Trade Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your trade notes here..."
                    className="input-glow min-h-[100px]"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  type="submit"
                  className="gap-2"
                >
                  {editingId ? (
                    <>
                      <Edit2 className="h-4 w-4" /> Update Trade
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Add Trade
                    </>
                  )}
                </Button>
                
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Editing
                  </Button>
                )}
              </div>
            </form>
          </TabsContent>
          
          {/* Other tabs */}
          <TabsContent value="summary">
            <div>Summary content will go here</div>
          </TabsContent>
          
          <TabsContent value="log">
            <div>Log content will go here</div>
          </TabsContent>
          
          <TabsContent value="charts">
            <div>Charts content will go here</div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default TradeJournal;
