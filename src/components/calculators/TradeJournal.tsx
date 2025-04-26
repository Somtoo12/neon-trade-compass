import React, { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { ScreenshotButton } from '@/components/ui/screenshot-button';

const formattedForexPairs = forexPairs && forexPairs.majors 
  ? [
      ...(forexPairs.majors?.map(pair => pair.replace('/', '')) || []),
      ...(forexPairs.minors?.map(pair => pair.replace('/', '')) || []),
      ...(forexPairs.exotics?.map(pair => pair.replace('/', '')) || [])
    ]
  : [];

const indices = ['US30', 'NAS100', 'SPX500', 'UK100', 'GER40', 'JPN225'];
const metals = ['XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD'];
const energies = ['USOIL', 'UKOIL', 'NATGAS'];

const formattedCryptoPairs = cryptoPairs ? cryptoPairs.map(pair => pair.replace('/', '')) : [];

const allPairs = [...formattedForexPairs, ...metals, ...indices, ...energies, ...formattedCryptoPairs];

const calculateProfit = (pips: number, lotSize: number): number => {
  return pips * lotSize * 10;
};

const formatPair = (pair: string) => pair.replace('/', '').toUpperCase();

const TradeJournal: React.FC = () => {
  const isMobile = useIsMobile();
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
  
  const [pair, setPair] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [entryPrice, setEntryPrice] = useState<string>("");
  const [stopLoss, setStopLoss] = useState<string>("");
  const [takeProfit, setTakeProfit] = useState<string>("");
  const [lotSize, setLotSize] = useState<string>("");
  const [pips, setPips] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const filteredPairs = {
    majors: forexPairs.majors ? forexPairs.majors.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    minors: forexPairs.minors ? forexPairs.minors.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    exotics: forexPairs.exotics ? forexPairs.exotics.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    crypto: cryptoPairs ? cryptoPairs.filter(pair =>
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    others: [...indices, ...metals, ...energies].filter(pair =>
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const direction = useMemo(() => {
    const entry = parseFloat(entryPrice);
    const tp = parseFloat(takeProfit);
    if (isNaN(entry) || isNaN(tp)) return 'LONG';
    return tp > entry ? 'LONG' : 'SHORT';
  }, [entryPrice, takeProfit]);

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

  const winsLossesData = useMemo(() => {
    const wins = performanceMetrics.wins;
    const losses = performanceMetrics.losses;
    const breakeven = performanceMetrics.breakeven;
    
    return [
      { name: 'Wins', value: wins, color: '#10b981' },
      { name: 'Losses', value: losses, color: '#ef4444' },
      { name: 'Breakeven', value: breakeven, color: '#6b7280' }
    ].filter(item => item.value > 0);
  }, [performanceMetrics]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pair || !entryPrice || !stopLoss || !takeProfit || !lotSize || !pips) {
      return;
    }

    const entryPriceNum = parseFloat(entryPrice);
    const stopLossNum = parseFloat(stopLoss);
    const takeProfitNum = parseFloat(takeProfit);
    const lotSizeNum = parseFloat(lotSize);
    const pipsNum = parseFloat(pips);

    const profitAmount = calculateProfit(pipsNum, lotSizeNum);
    
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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (trade: Trade) => {
    const emoji = trade.pips > 0 ? "🟢" : trade.pips < 0 ? "🔴" : "⚪";
    const summary = `${trade.pair} • ${trade.direction} ${emoji} — ${format(new Date(trade.date), "yyyy-MM-dd")}\n` +
      `📈 Entry: ${trade.entryPrice} | 🎯 TP: ${trade.takeProfit} | 🛑 SL: ${trade.stopLoss}\n` +
      `📊 ${trade.pips > 0 ? '+' : ''}${trade.pips} pips | ${trade.lotSize} lots | 💵 ${trade.profit > 0 ? '+' : ''}$${trade.profit.toFixed(2)}\n` +
      `📝 "${trade.notes}"`;

    navigator.clipboard.writeText(summary);
  };

  return (
    <Card className="p-6 neo-card">
      {isMobile && (
        <div className="w-full bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🖥️</span>
            <p className="font-medium text-yellow-700/90 text-sm">
              For the best experience, we recommend using a PC or computer
            </p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            Trade Journal Tracker
          </h3>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 sm:flex-initial gap-1" 
              onClick={exportTradesAsCsv}
              disabled={filteredTrades.length === 0}
            >
              <FileDown className="h-4 w-4" /> Export CSV
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 sm:flex-initial gap-1 text-red-500 hover:text-red-600" 
              onClick={() => setShowClearDialog(true)}
              disabled={trades.length === 0}
            >
              <Trash className="h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="entry" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="entry" className="text-xs md:text-sm">Trade Entry</TabsTrigger>
            <TabsTrigger value="summary" className="text-xs md:text-sm">Summaries</TabsTrigger>
            <TabsTrigger value="log" className="text-xs md:text-sm">Trade Log</TabsTrigger>
            <TabsTrigger value="charts" className="text-xs md:text-sm">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entry" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Currency Pair</Label>
                  <Select 
                    value={pair} 
                    onValueChange={setPair}
                  >
                    <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                      <SelectValue placeholder="Select pair" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-input/40 max-h-[300px]">
                      <div className="flex items-center px-3 pb-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                          placeholder="Search pairs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <ScrollArea className="h-[200px]">
                        {filteredPairs.majors && filteredPairs.majors.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Major Pairs</SelectLabel>
                            {filteredPairs.majors.map((option) => (
                              <SelectItem key={option} value={option.replace('/', '')}>{option}</SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                        
                        {filteredPairs.minors && filteredPairs.minors.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Minor Pairs</SelectLabel>
                            {filteredPairs.minors.map((option) => (
                              <SelectItem key={option} value={option.replace('/', '')}>{option}</SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                        
                        {filteredPairs.exotics && filteredPairs.exotics.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Exotic Pairs</SelectLabel>
                            {filteredPairs.exotics.map((option) => (
                              <SelectItem key={option} value={option.replace('/', '')}>{option}</SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                        
                        {filteredPairs.crypto && filteredPairs.crypto.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Crypto Pairs</SelectLabel>
                            {filteredPairs.crypto.map((option) => (
                              <SelectItem key={option} value={option.replace('/', '')}>{option}</SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                        
                        {filteredPairs.others && filteredPairs.others.length > 0 && (
                          <SelectGroup>
                            <SelectLabel>Other Markets</SelectLabel>
                            {filteredPairs.others.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectGroup>
                        )}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                
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
                
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <div className={`h-10 px-3 py-2 rounded-md border flex items-center ${direction === 'LONG' ? 'text-green-500' : 'text-red-500'} bg-background/30`}>
                    {direction === 'LONG' ? '🔺 LONG' : '🔻 SHORT'} (Auto-detected)
                  </div>
                </div>
                
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
                
                <div className="space-y-2">
                  <Label>Profit/Loss (USD)</Label>
                  <div className={`h-10 px-3 py-2 rounded-md border flex items-center ${parseFloat(pips || '0') > 0 ? 'text-green-500' : parseFloat(pips || '0') < 0 ? 'text-red-500' : ''} bg-background/30`}>
                    {!isNaN(parseFloat(pips)) && !isNaN(parseFloat(lotSize)) 
                      ? `$${calculateProfit(parseFloat(pips), parseFloat(lotSize)).toFixed(2)}` 
                      : '$0.00'}
                  </div>
                </div>
                
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
          
          <TabsContent value="summary" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h4 className="text-lg font-medium">Trade Summaries</h4>
              <ScreenshotButton 
                targetId="summaries-tab-content" 
                filename="pipcraft-summary" 
              />
            </div>
            
            <div id="summaries-tab-content" className="space-y-6">
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
            </div>
          </TabsContent>
          
          <TabsContent value="log" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Trade Log</h4>
              <ScreenshotButton 
                targetId="trade-log-tab-content" 
                filename="pipcraft-tradelog" 
              />
            </div>
            
            <div id="trade-log-tab-content">
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
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Analytics</h4>
              <ScreenshotButton 
                targetId="analytics-tab-content" 
                filename="pipcraft-analytics" 
              />
            </div>
            
            <div id="analytics-tab-content">
              {filteredTrades.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
