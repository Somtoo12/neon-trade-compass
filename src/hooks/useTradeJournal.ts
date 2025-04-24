
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Trade {
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

export const useTradeJournal = () => {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Load trades from localStorage on component mount
  useEffect(() => {
    const storedTrades = localStorage.getItem('pipcraft_trades');
    if (storedTrades) {
      try {
        // Parse stored trades and convert date strings back to Date objects
        const parsedTrades = JSON.parse(storedTrades).map((trade: any) => ({
          ...trade,
          date: new Date(trade.date)
        }));
        setTrades(parsedTrades);
      } catch (error) {
        console.error('Failed to parse stored trades:', error);
        toast({
          title: 'Error loading trades',
          description: 'Could not load your saved trades. The data may be corrupted.',
          variant: 'destructive'
        });
      }
    }
  }, [toast]);

  // Save trades to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pipcraft_trades', JSON.stringify(trades));
  }, [trades]);

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
    const losses = filteredTrades.filter(t => t.pips < 0).length;
    const breakeven = filteredTrades.filter(t => t.pips === 0).length;
    const winRate = total > 0 ? (wins / total * 100).toFixed(1) : "0.0";
    const totalPips = filteredTrades.reduce((sum, t) => sum + t.pips, 0);
    const totalProfit = filteredTrades.reduce((sum, t) => sum + t.profit, 0);
    const avgProfit = total > 0 ? (totalProfit / total).toFixed(2) : "0.00";
    
    // Find best and worst trades
    const bestTrade = [...filteredTrades].sort((a, b) => b.profit - a.profit)[0];
    const worstTrade = [...filteredTrades].sort((a, b) => a.profit - b.profit)[0];
    
    return { 
      total, 
      wins,
      losses,
      breakeven,
      winRate, 
      totalPips, 
      totalProfit, 
      avgProfit,
      bestTrade,
      worstTrade
    };
  }, [filteredTrades]);

  // Calculate trade data for charts
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

  // Generate ID for trades
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Add a new trade
  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade = { ...trade, id: generateId() };
    setTrades(prev => [...prev, newTrade as Trade]);
    toast({
      title: 'Trade added',
      description: `${trade.pair} trade has been added to your journal`
    });
  };

  // Update an existing trade
  const updateTrade = (trade: Trade) => {
    setTrades(prev => prev.map(t => t.id === trade.id ? trade : t));
    toast({
      title: 'Trade updated',
      description: `${trade.pair} trade has been updated`
    });
  };

  // Delete a trade
  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
    toast({
      title: 'Trade deleted',
      description: 'Trade has been removed from your journal'
    });
  };

  // Clear all trades
  const clearAllTrades = () => {
    setTrades([]);
    toast({
      title: 'All trades cleared',
      description: 'Your trade journal has been reset'
    });
  };

  // Export trades as CSV
  const exportTradesAsCsv = () => {
    const headers = ['Date', 'Pair', 'Direction', 'Entry', 'TP', 'SL', 'Lot Size', 'Pips', 'Profit ($)', 'Notes'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTrades.map(trade => [
        new Date(trade.date).toISOString().split('T')[0],
        trade.pair,
        trade.direction,
        trade.entryPrice,
        trade.takeProfit,
        trade.stopLoss,
        trade.lotSize,
        trade.pips,
        trade.profit.toFixed(2),
        `"${trade.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trade-journal-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    toast({
      title: 'Trades exported',
      description: 'Your trade journal has been exported as CSV'
    });
  };

  return {
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
  };
};
