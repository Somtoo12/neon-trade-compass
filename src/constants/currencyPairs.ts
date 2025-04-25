export const cryptoPairs = [
  'BTC/USD', 'ETH/USD', 'BNB/USD', 'XRP/USD', 'ADA/USD', 
  'DOGE/USD', 'SOL/USD', 'DOT/USD', 'AVAX/USD', 'MATIC/USD',
  'LINK/USD', 'UNI/USD', 'ATOM/USD', 'LTC/USD', 'ETC/USD',
  'FIL/USD', 'XLM/USD', 'ALGO/USD', 'VET/USD', 'AAVE/USD',
  'SHIB/USD', 'TRX/USD', 'XMR/USD', 'EOS/USD', 'THETA/USD',
  'ICP/USD', 'XTZ/USD', 'MANA/USD', 'SAND/USD', 'AXS/USD',
  'CRO/USD', 'NEAR/USD', 'ZEC/USD', 'EGLD/USD', 'FLOW/USD',
  'KSM/USD', 'NEO/USD', 'KLAY/USD', 'WAVES/USD', 'CHZ/USD',
  'BTT/USD', 'MKR/USD', 'DASH/USD', 'ENJ/USD', 'CAKE/USD',
  'AR/USD', 'ONE/USD', 'HOT/USD', 'BAT/USD', 'ZIL/USD'
].slice(0, 100); // Ensure we never exceed 100 pairs

export const forexPairs = {
  majors: [
    'XAU/USD', 'XAG/USD', // Metals at the top for easy access
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'USD/CAD', 
    'AUD/USD', 'NZD/USD'
  ],
  minors: [
    'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 'EUR/AUD', 'GBP/AUD',
    'AUD/JPY', 'EUR/CAD', 'GBP/CAD', 'CAD/JPY', 'EUR/NZD',
    'GBP/NZD', 'EUR/CHF', 'GBP/CHF', 'AUD/CAD', 'AUD/CHF',
    'AUD/NZD', 'CAD/CHF', 'NZD/JPY', 'NZD/CHF'
  ],
  indices: [
    'US30', 'NAS100', 'SPX500'
  ],
  metals: [
    'XAU/USD', 'XAG/USD'
  ],
  crypto: [
    'BTC/USD', 'ETH/USD'
  ],
  exotics: [
    'EUR/TRY', 'USD/TRY', 'USD/MXN', 'USD/ZAR', 'USD/THB',
    'USD/SGD', 'USD/SEK', 'USD/NOK', 'USD/DKK', 'USD/PLN',
    'EUR/HUF', 'EUR/PLN', 'EUR/CZK', 'EUR/SEK', 'EUR/NOK',
    'GBP/PLN', 'USD/HKD', 'USD/CNH', 'USD/INR', 'USD/BRL'
  ]
};

export const futuresContracts = {
  'ES': {
    'Mini': { 
      name: 'E-mini S&P 500',
      symbol: 'ES',
      contractSize: 50,
      tickSize: 0.25,
      tickValue: 12.50,
      description: 'E-mini S&P 500 ($12.50/tick)'
    },
    'Micro': {
      name: 'Micro E-mini S&P 500',
      symbol: 'MES',
      contractSize: 5,
      tickSize: 0.25,
      tickValue: 1.25,
      description: 'Micro E-mini S&P 500 ($1.25/tick)'
    }
  },
  'NQ': {
    'Mini': {
      name: 'E-mini Nasdaq 100',
      symbol: 'NQ',
      contractSize: 20,
      tickSize: 0.25,
      tickValue: 5.00,
      description: 'E-mini Nasdaq 100 ($5.00/tick)'
    },
    'Micro': {
      name: 'Micro E-mini Nasdaq 100',
      symbol: 'MNQ',
      contractSize: 2,
      tickSize: 0.25,
      tickValue: 0.50,
      description: 'Micro E-mini Nasdaq 100 ($0.50/tick)'
    }
  },
  'YM': {
    'Mini': {
      name: 'E-mini Dow',
      symbol: 'YM',
      contractSize: 5,
      tickSize: 1.00,
      tickValue: 5.00,
      description: 'E-mini Dow ($5.00/tick)'
    },
    'Micro': {
      name: 'Micro E-mini Dow',
      symbol: 'MYM',
      contractSize: 0.5,
      tickSize: 1.00,
      tickValue: 0.50,
      description: 'Micro E-mini Dow ($0.50/tick)'
    }
  },
  'RTY': {
    'Mini': {
      name: 'E-mini Russell 2000',
      symbol: 'RTY',
      contractSize: 50,
      tickSize: 0.10,
      tickValue: 5.00,
      description: 'E-mini Russell 2000 ($5.00/tick)'
    },
    'Micro': {
      name: 'Micro E-mini Russell 2000',
      symbol: 'M2K',
      contractSize: 5,
      tickSize: 0.10,
      tickValue: 0.50,
      description: 'Micro E-mini Russell 2000 ($0.50/tick)'
    }
  },
  'CL': {
    'Mini': {
      name: 'Crude Oil',
      symbol: 'CL',
      contractSize: 1000,
      tickSize: 0.01,
      tickValue: 10.00,
      description: 'Crude Oil Futures ($10.00/tick)'
    },
    'Micro': {
      name: 'Micro Crude Oil',
      symbol: 'MCL',
      contractSize: 100,
      tickSize: 0.01,
      tickValue: 1.00,
      description: 'Micro Crude Oil ($1.00/tick)'
    }
  },
  'GC': {
    'Full': {
      name: 'Gold',
      symbol: 'GC',
      contractSize: 100,
      tickSize: 0.10,
      tickValue: 10.00,
      description: 'Gold Futures ($10.00/tick)'
    },
    'Micro': {
      name: 'Micro Gold',
      symbol: 'MGC',
      contractSize: 10,
      tickSize: 0.10,
      tickValue: 1.00,
      description: 'Micro Gold ($1.00/tick)'
    }
  },
  'SI': {
    'Full': {
      name: 'Silver',
      symbol: 'SI',
      contractSize: 5000,
      tickSize: 0.005,
      tickValue: 25.00,
      description: 'Silver Futures ($25.00/tick)'
    },
    'Micro': {
      name: 'Micro Silver',
      symbol: 'SIL',
      contractSize: 1000,
      tickSize: 0.005,
      tickValue: 5.00,
      description: 'Micro Silver ($5.00/tick)'
    }
  },
  'HG': {
    'Full': {
      name: 'Copper',
      symbol: 'HG',
      contractSize: 25000,
      tickSize: 0.0005,
      tickValue: 12.50,
      description: 'Copper Futures ($12.50/tick)'
    }
  },
  'NG': {
    'Full': {
      name: 'Natural Gas',
      symbol: 'NG',
      contractSize: 10000,
      tickSize: 0.001,
      tickValue: 10.00,
      description: 'Natural Gas Futures ($10.00/tick)'
    }
  },
  'ZB': {
    'Full': {
      name: '30-Year U.S. Treasury Bond',
      symbol: 'ZB',
      contractSize: 100000,
      tickSize: 0.03125,
      tickValue: 31.25,
      description: '30-Year U.S. Treasury Bond ($31.25/tick)'
    }
  }
};
