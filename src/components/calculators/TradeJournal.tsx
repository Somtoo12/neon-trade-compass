
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
import { 
  CalendarIcon, CheckCircle2, Copy, Edit2, Trash2,
  PieChart, BarChart3, Filter, Plus, Search, ChevronDown,
  FileDown, RefreshCw, Trash, AlertTriangle
} from 'lucide-react';
import { format } from "date-fns";
import { forexPairs, cryptoPairs } from "@/constants/currencyPairs";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { useTradeJournal, type Trade } from '@/hooks/useTradeJournal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Format forex pairs to match expected format - with null checks
const formattedForexPairs = forexPairs && forexPairs.majors 
  ? [
      ...(forexPairs.majors?.map(pair => pair.replace('/', '')) || []),
      ...(forexPairs.minors?.map(pair => pair.replace('/', '')) || []),
      ...(forexPairs.exotics?.map(pair => pair.replace('/', '')) || [])
    ]
  : [];

// Add additional pairs
const indices = ['US30', 'NAS100', 'SPX500', 'UK100', 'GER40', 'JPN225'];
const metals = ['XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD'];
const energies = ['USOIL', 'UKOIL', 'NATGAS'];

// Process crypto pairs to match format
const formattedCryptoPairs = cryptoPairs ? cryptoPairs.map(pair => pair.replace('/', '')) : [];

// Combine all pairs for the dropdown
const allPairs = [...formattedForexPairs, ...metals, ...indices, ...energies, ...formattedCryptoPairs];

// Calculate profit based on pips and lot size
const calculateProfit = (pips: number, lotSize: number): number => {
  return pips * lotSize * 10;
};

// Format pairs to match expected format and handle custom pairs
const formatPair = (pair: string) => pair.replace('/', '').toUpperCase();

const TradeJournal: React.FC = () => {
  const {
    trades,
    filteredTrades,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    performanceMetrics,
    chartData,
    addTrade,
    updateTrade,
    deleteTrade,
    clearAllTrades,
    exportTradesAsCsv
  } = useTradeJournal();
  
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
  
  // UI state
  const [openCommandMenu, setOpenCommandMenu] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Detect direction based on entry and take profit
  const direction = useMemo(() => {
    const entry = parseFloat(entryPrice);
    const tp = parseFloat(takeProfit);
    if (isNaN(entry) || isNaN(tp)) return 'LONG';
    return tp > entry ? 'LONG' : 'SHORT';
  }, [entryPrice, takeProfit]);

  // Auto-calculate pips if entry and TP are provided
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

  // Wins vs Losses data for pie chart
  const winsLossesData = useMemo(() => {
    const wins = performanceMetrics.wins;
    const losses = performanceMetrics.losses;
    const breakeven = performanceMetrics.breakeven;
    
    return [
      { name: 'Wins', value: wins, color: '#10b981' },
      { name: 'Losses', value: losses, color: '#ef4444' },
      { name: 'Breakeven', value: breakeven, color: '#6b7280' }
    ].filter(item => item.value > 0); // Only show segments with values
  }, [performanceMetrics]);

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
    const tradeData = {
      ...(editingId ? { id: editingId } : {}),
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
    } as Trade;

    if (editingId) {
      updateTrade(tradeData);
    } else {
      addTrade(tradeData);
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

  // Copy trade summary to clipboard
  const copyToClipboard = (trade: Trade) => {
    const emoji = trade.pips > 0 ? "🟢" : trade.pips < 0 ? "🔴" : "⚪";
    const summary = `${trade.pair} • ${trade.direction} ${emoji} — ${format(new Date(trade.date), "yyyy-MM-dd")}\n` +
      `📈 Entry: ${trade.entryPrice} | 🎯 TP: ${trade.takeProfit} | 🛑 SL: ${trade.stopLoss}\n` +
      `📊 ${trade.pips > 0 ? '+' : ''}${trade.pips} pips | ${trade.lotSize} lots | 💵 ${trade.profit > 0 ? '+' : ''}$${trade.profit.toFixed(2)}\n` +
      `📝 "${trade.notes}"`;

    navigator.clipboard.writeText(summary);
  };

  // Process all predefined pairs
  const predefinedPairs = useMemo(() => {
    return allPairs.map(formatPair);
  }, []);

  // Filtered pairs based on user input
  const [filteredPairs, setFilteredPairs] = useState<string[]>(predefinedPairs);
  
  // Filter pairs based on user input
  const handlePairSearch = (searchTerm: string) => {
    const term = searchTerm.toUpperCase();
    const filtered = predefinedPairs.filter(pair => 
      pair.includes(term)
    );
    setFilteredPairs(filtered);
  };

  return (
    <Card className="p-6 neo-card">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Trade Journal Tracker</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1" 
              onClick={exportTradesAsCsv}
              disabled={filteredTrades.length === 0}
            >
              <FileDown className="h-4 w-4" /> Export CSV
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1 text-red-500 hover:text-red-600" 
              onClick={() => setShowClearDialog(true)}
              disabled={trades.length === 0}
            >
              <Trash className="h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>
        
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
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
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
          
          {/* Trade Summaries */}
          <TabsContent value="summary" className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <h4 className="text-lg font-medium">Trade Summaries</h4>
              
              <div className="ml-auto flex gap-2">
                {/* Date Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" /> 
                      {startDate && endDate
                        ? `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`
                        : "Filter Dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Filter by Date Range</h4>
                      <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              {startDate ? format(startDate, "PPP") : "Select start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              {endDate ? format(endDate, "PPP") : "Select end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setStartDate(undefined);
                            setEndDate(undefined);
                          }}
                        >
                          Clear Filter
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Performance Summary Box */}
            {filteredTrades.length > 0 && (
              <Card className="p-4 bg-gradient-to-r from-secondary/30 to-accent/20 border border-accent/30">
                <div className="flex flex-wrap gap-4 justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Trades:</span>
                    <span className="ml-2 font-medium">{performanceMetrics.total}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span className={`ml-2 font-medium ${parseFloat(performanceMetrics.winRate) > 50 ? 'text-green-500' : 'text-red-500'}`}>
                      {performanceMetrics.winRate}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Pips:</span>
                    <span className={`ml-2 font-medium ${performanceMetrics.totalPips > 0 ? 'text-green-500' : performanceMetrics.totalPips < 0 ? 'text-red-500' : ''}`}>
                      {performanceMetrics.totalPips > 0 ? '+' : ''}{performanceMetrics.totalPips}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total P/L:</span>
                    <span className={`ml-2 font-medium ${performanceMetrics.totalProfit > 0 ? 'text-green-500' : performanceMetrics.totalProfit < 0 ? 'text-red-500' : ''}`}>
                      {performanceMetrics.totalProfit > 0 ? '+' : ''}${performanceMetrics.totalProfit.toFixed(2)} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg P/L per Trade:</span>
                    <span className={`ml-2 font-medium ${parseFloat(performanceMetrics.avgProfit) > 0 ? 'text-green-500' : parseFloat(performanceMetrics.avgProfit) < 0 ? 'text-red-500' : ''}`}>
                      ${performanceMetrics.avgProfit} USD
                    </span>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Trade Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTrades.length > 0 ? (
                filteredTrades.map((trade) => (
                  <Card 
                    key={trade.id} 
                    className={`p-4 relative overflow-hidden ${
                      trade.pips > 0 
                        ? 'border-green-500/30 bg-gradient-to-br from-green-950/20 to-transparent' 
                        : trade.pips < 0 
                          ? 'border-red-500/30 bg-gradient-to-br from-red-950/20 to-transparent' 
                          : ''
                    }`}
                  >
                    {/* Trade Heading */}
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-base font-medium flex items-center gap-2">
                        {trade.pair} • {trade.direction} {trade.pips > 0 ? '🔺' : trade.pips < 0 ? '🔻' : '▪️'} 
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(trade.date), "yyyy-MM-dd")}
                        </span>
                      </h5>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => copyToClipboard(trade)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleEdit(trade)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => deleteTrade(trade.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Trade Details */}
                    <div className="text-sm space-y-1">
                      <p className="flex flex-wrap gap-2">
                        <span>📈 Entry: {trade.entryPrice}</span>
                        <span>|</span>
                        <span>🎯 TP: {trade.takeProfit}</span>
                        <span>|</span>
                        <span>🛑 SL: {trade.stopLoss}</span>
                      </p>
                      <p className="flex flex-wrap gap-2">
                        <span className={`${trade.pips > 0 ? 'text-green-500' : trade.pips < 0 ? 'text-red-500' : ''}`}>
                          📊 {trade.pips > 0 ? '+' : ''}{trade.pips} pips
                        </span>
                        <span>|</span>
                        <span>{trade.lotSize} lots</span>
                        <span>|</span>
                        <span className={`${trade.profit > 0 ? 'text-green-500' : trade.profit < 0 ? 'text-red-500' : ''}`}>
                          💵 {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </span>
                      </p>
                      {trade.notes && (
                        <p className="italic mt-2 text-muted-foreground">
                          📝 "{trade.notes}"
                        </p>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-10 text-muted-foreground">
                  No trades recorded yet. Add trades using the Trade Entry tab.
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Trade Log Table */}
          <TabsContent value="log" className="space-y-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Entry/TP/SL</TableHead>
                    <TableHead>Pips</TableHead>
                    <TableHead>Lot Size</TableHead>
                    <TableHead>P/L ($)</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrades.length > 0 ? (
                    filteredTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{format(new Date(trade.date), "yyyy-MM-dd")}</TableCell>
                        <TableCell>{trade.pair}</TableCell>
                        <TableCell>{trade.direction}</TableCell>
                        <TableCell className="text-xs">
                          {trade.entryPrice} / {trade.takeProfit} / {trade.stopLoss}
                        </TableCell>
                        <TableCell className={`${trade.pips > 0 ? 'text-green-500' : trade.pips < 0 ? 'text-red-500' : ''}`}>
                          {trade.pips > 0 ? '+' : ''}{trade.pips}
                        </TableCell>
                        <TableCell>{trade.lotSize}</TableCell>
                        <TableCell className={`${trade.profit > 0 ? 'text-green-500' : trade.profit < 0 ? 'text-red-500' : ''}`}>
                          {trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate" title={trade.notes}>
                          {trade.notes || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0" 
                              onClick={() => handleEdit(trade)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 p-0" 
                              onClick={() => deleteTrade(trade.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                        No trades recorded yet. Add trades using the Trade Entry tab.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Analytics/Charts */}
          <TabsContent value="charts" className="space-y-6">
            {filteredTrades.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Wins vs Losses Pie Chart */}
                  <Card className="p-4">
                    <h4 className="text-base font-medium mb-4 flex items-center">
                      <PieChart className="h-4 w-4 mr-2" /> Win/Loss Ratio
                    </h4>
                    <div className="flex justify-center h-[250px]">
                      <RePieChart width={250} height={250}>
                        <Pie
                          data={winsLossesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {winsLossesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </RePieChart>
                    </div>
                  </Card>
                  
                  {/* Pairs Performance Bar Chart */}
                  <Card className="p-4">
                    <h4 className="text-base font-medium mb-4 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" /> Currency Pairs Performance (Pips)
                    </h4>
                    <div className="h-[250px] w-full overflow-x-auto">
                      <BarChart
                        width={Math.max(500, chartData.length * 50)}
                        height={250}
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                      >
                        <XAxis 
                          dataKey="pair" 
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar 
                          dataKey="pips" 
                          name="Pips" 
                          fill="#8884d8"
                          radius={[4, 4, 0, 0]}
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.pips > 0 ? '#10b981' : '#ef4444'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </div>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No trades recorded yet. Add trades using the Trade Entry tab to see analytics.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Clear all trades?
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete all your saved trades. This cannot be undone.
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={clearAllTrades}
            >
              Delete All Trades
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TradeJournal;
