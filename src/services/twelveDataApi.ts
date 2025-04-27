
interface PriceResponse {
  price: string;
  symbol: string;
  timestamp: number;
  status: string;
  message?: string;
}

export const formatSymbolForTwelveData = (symbol: string): string => {
  // Handle special cases first
  if (symbol === 'NAS100') return 'NDAQ/USD';
  if (symbol === 'US30') return 'DJI/USD';
  
  // Handle forex pairs formats like EUR/USD
  if (symbol.includes('/')) return symbol;
  
  // Convert EURUSD format to EUR/USD format
  if (symbol.length === 6) {
    return `${symbol.substring(0, 3)}/${symbol.substring(3, 6)}`;
  }
  
  // For crypto, metals, indices that don't have a / already
  if (!symbol.includes('/')) {
    return `${symbol}/USD`;
  }
  
  return symbol;
};

export const isJPYPair = (symbol: string): boolean => {
  const formattedSymbol = symbol.replace('/', '');
  return formattedSymbol.endsWith('JPY') || formattedSymbol.includes('JPY');
};

export const getPipSize = (symbol: string): number => {
  return isJPYPair(symbol) ? 0.01 : 0.0001;
};

// Calculate accurate pip value based on current price and lot size
export const calculatePipValue = (currentPrice: number, lotSize: number, symbol: string): number => {
  const standardLotSize = 100000; // Standard lot size for forex
  const pipSize = getPipSize(symbol);
  
  // For JPY pairs: Pip Value = (0.01 / current price) × 100,000 × lot size
  // For other pairs: Pip Value = (0.0001 / current price) × 100,000 × lot size
  return (pipSize / currentPrice) * standardLotSize * lotSize;
};

// Calculate total PnL based on entry, exit, current price for accurate pip value
export const calculateTotalPnL = (
  entryPrice: number, 
  exitPrice: number, 
  currentPrice: number,
  lotSize: number,
  symbol: string
): number => {
  const pipSize = getPipSize(symbol);
  const pipDifference = (exitPrice - entryPrice) / pipSize;
  const pipValue = calculatePipValue(currentPrice, lotSize, symbol);
  
  return pipDifference * pipValue;
};

export const fetchLivePrice = async (symbol: string): Promise<number> => {
  const apiKey = '81df7d5abd3845cb8f6063fe1a2942f2';
  const formattedSymbol = formatSymbolForTwelveData(symbol);
  
  try {
    const response = await fetch(`https://api.twelvedata.com/price?symbol=${formattedSymbol}&apikey=${apiKey}`);
    
    if (!response.ok) {
      throw new Error('Price data not available');
    }
    
    const data = await response.json() as PriceResponse;
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Price data not available');
    }
    
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw new Error('Unable to fetch live market price right now. Please try again later.');
  }
};
