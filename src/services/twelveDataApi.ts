
interface PriceResponse {
  price: string;
  symbol: string;
  timestamp: number;
  status: string;
  message?: string;
}

// Define instrument types and their characteristics
export enum InstrumentType {
  FOREX_STANDARD = 'FOREX_STANDARD',     // Most forex pairs like EUR/USD
  FOREX_JPY = 'FOREX_JPY',               // JPY pairs like USD/JPY
  METALS = 'METALS',                     // Gold (XAU/USD) and Silver (XAG/USD)
  INDICES = 'INDICES',                   // Stock indices like NAS100, US30
  CRYPTO = 'CRYPTO'                      // Cryptocurrencies like BTC/USD
}

interface InstrumentConfig {
  type: InstrumentType;
  pipDecimalPlaces: number;
  pipSize: number;
  pointSize: number;
  contractMultiplier: number;
}

// Map to store configuration for each instrument type
const instrumentConfigs: Record<InstrumentType, InstrumentConfig> = {
  [InstrumentType.FOREX_STANDARD]: {
    type: InstrumentType.FOREX_STANDARD,
    pipDecimalPlaces: 4,
    pipSize: 0.0001,
    pointSize: 0.00001,
    contractMultiplier: 100000 // Standard lot size
  },
  [InstrumentType.FOREX_JPY]: {
    type: InstrumentType.FOREX_JPY,
    pipDecimalPlaces: 2,
    pipSize: 0.01,
    pointSize: 0.001,
    contractMultiplier: 100000 // Standard lot size
  },
  [InstrumentType.METALS]: {
    type: InstrumentType.METALS,
    pipDecimalPlaces: 2,
    pipSize: 0.01,
    pointSize: 0.01,
    contractMultiplier: 100 // For gold and silver
  },
  [InstrumentType.INDICES]: {
    type: InstrumentType.INDICES,
    pipDecimalPlaces: 1,
    pipSize: 0.1,
    pointSize: 0.1,
    contractMultiplier: 1 // For indices
  },
  [InstrumentType.CRYPTO]: {
    type: InstrumentType.CRYPTO,
    pipDecimalPlaces: 1,
    pipSize: 0.1,
    pointSize: 0.1,
    contractMultiplier: 1 // For crypto
  }
};

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

export const getInstrumentType = (symbol: string): InstrumentType => {
  const normalizedSymbol = symbol.toUpperCase().replace('/', '');
  
  if (normalizedSymbol.includes('XAU') || normalizedSymbol.includes('XAG')) {
    return InstrumentType.METALS;
  }
  
  if (normalizedSymbol === 'NAS100' || normalizedSymbol === 'US30' || normalizedSymbol === 'SPX500') {
    return InstrumentType.INDICES;
  }
  
  if (normalizedSymbol.includes('BTC') || normalizedSymbol.includes('ETH') || 
      normalizedSymbol.includes('XRP') || normalizedSymbol.includes('LTC')) {
    return InstrumentType.CRYPTO;
  }
  
  // Check if it's a JPY pair
  if (normalizedSymbol.endsWith('JPY') || normalizedSymbol.startsWith('JPY')) {
    return InstrumentType.FOREX_JPY;
  }
  
  // Default to standard forex
  return InstrumentType.FOREX_STANDARD;
};

export const getInstrumentConfig = (symbol: string): InstrumentConfig => {
  const instrumentType = getInstrumentType(symbol);
  return instrumentConfigs[instrumentType];
};

// Get pip size based on instrument type
export const getPipSize = (symbol: string): number => {
  return getInstrumentConfig(symbol).pipSize;
};

// Calculate accurate pip value based on current price and lot size
export const calculatePipValue = (currentPrice: number, lotSize: number, symbol: string): number => {
  const config = getInstrumentConfig(symbol);
  
  if (config.type === InstrumentType.FOREX_STANDARD || config.type === InstrumentType.FOREX_JPY) {
    // For forex pairs: Pip Value = (pip size / current price) × contract size × lot size
    return (config.pipSize / currentPrice) * config.contractMultiplier * lotSize;
  } else if (config.type === InstrumentType.METALS) {
    // For metals: Gold pip value = $1 per 0.01 move for 1 oz
    return config.pipSize * config.contractMultiplier * lotSize;
  } else if (config.type === InstrumentType.INDICES) {
    // For indices: Each point is worth a fixed amount
    const pointValue = config.type === InstrumentType.INDICES ? 1 : 1;
    return pointValue * lotSize;
  } else if (config.type === InstrumentType.CRYPTO) {
    // For crypto: Each 0.1 move is worth 0.1 * lot size
    return config.pipSize * lotSize;
  }
  
  // Default case
  return 0;
};

// Calculate pips difference (normalized to standard pips for the instrument)
export const calculatePipsDifference = (
  entryPrice: number,
  exitPrice: number,
  symbol: string
): number => {
  const config = getInstrumentConfig(symbol);
  return (exitPrice - entryPrice) / config.pipSize;
};

// Calculate total PnL based on entry, exit, current price
export const calculateTotalPnL = (
  entryPrice: number, 
  exitPrice: number, 
  currentPrice: number,
  lotSize: number,
  symbol: string
): number => {
  const priceDifference = exitPrice - entryPrice;
  const config = getInstrumentConfig(symbol);
  
  if (config.type === InstrumentType.FOREX_STANDARD || config.type === InstrumentType.FOREX_JPY) {
    // Standard forex calculation
    const pipDifference = priceDifference / config.pipSize;
    const pipValue = calculatePipValue(currentPrice, lotSize, symbol);
    return pipDifference * pipValue;
  } else if (config.type === InstrumentType.METALS) {
    // For Gold (XAU/USD): Each $1 move = $100 per 1 oz
    // For 0.01 lot (1 oz), each $1 move = $1
    return priceDifference * 100 * lotSize;
  } else if (config.type === InstrumentType.INDICES) {
    // For indices, each point is worth a fixed dollar amount
    let pointValue = 1;
    if (symbol === 'NAS100') pointValue = 20;
    if (symbol === 'US30') pointValue = 5;
    if (symbol === 'SPX500') pointValue = 50;
    return priceDifference * pointValue * lotSize;
  } else if (config.type === InstrumentType.CRYPTO) {
    // For crypto, the P/L is simply price difference * lot size
    return priceDifference * lotSize;
  }
  
  // Default fallback
  return priceDifference * lotSize;
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

// Get a description of the pip size for the given instrument
export const getPipDescription = (symbol: string): string => {
  const config = getInstrumentConfig(symbol);
  
  switch (config.type) {
    case InstrumentType.FOREX_STANDARD:
      return "1 pip = 0.0001";
    case InstrumentType.FOREX_JPY:
      return "1 pip = 0.01";
    case InstrumentType.METALS:
      if (symbol.includes('XAU')) return "1 pip = $0.01 in Gold price";
      if (symbol.includes('XAG')) return "1 pip = $0.01 in Silver price";
      return "1 pip = 0.01";
    case InstrumentType.INDICES:
      if (symbol === 'NAS100') return "1 pip = 0.1 point ($2 per point with standard contract)";
      if (symbol === 'US30') return "1 pip = 0.1 point ($0.5 per point with standard contract)";
      return "1 pip = 0.1 point";
    case InstrumentType.CRYPTO:
      return "1 pip = $0.1 in price";
    default:
      return "Standard pip value";
  }
};

// Format pip display based on instrument type
export const formatPipDisplay = (pips: number, symbol: string): string => {
  const config = getInstrumentConfig(symbol);
  
  if (config.type === InstrumentType.FOREX_STANDARD || config.type === InstrumentType.FOREX_JPY) {
    return pips.toFixed(1);
  } else if (config.type === InstrumentType.METALS) {
    return pips.toFixed(0);
  } else if (config.type === InstrumentType.INDICES || config.type === InstrumentType.CRYPTO) {
    return pips.toFixed(1);
  }
  
  return pips.toFixed(1);
};
