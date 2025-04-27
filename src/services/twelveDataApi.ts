
interface PriceResponse {
  price: string;
  symbol: string;
  timestamp: number;
  status: string;
}

export const formatSymbolForTwelveData = (symbol: string): string => {
  // Handle special cases first
  if (symbol === 'NAS100') return 'NDAQ/USD';
  if (symbol === 'US30') return 'DJI/USD';
  
  // Handle currency pairs
  if (symbol.includes('/')) return symbol;
  
  // Convert EURUSD format to EUR/USD format
  if (symbol.length === 6) {
    return `${symbol.substring(0, 3)}/${symbol.substring(3, 6)}`;
  }
  
  // For any other format, append /USD if not already there
  if (!symbol.includes('/')) {
    return `${symbol}/USD`;
  }
  
  return symbol;
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
    throw new Error('Price temporarily unavailable. Please try again later.');
  }
};
