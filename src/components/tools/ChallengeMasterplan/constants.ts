
export const RISK_LEVELS = {
  low: {
    label: 'Conservative',
    description: 'Lower risk per trade (0.25-0.5%). Slower but safer path to pass.',
    riskPerTradeRange: [0.25, 0.5],
    recommendedRR: 1.5
  },
  balanced: {
    label: 'Balanced',
    description: 'Moderate risk per trade (0.75-1.25%). Balanced approach between safety and speed.',
    riskPerTradeRange: [0.75, 1.25],
    recommendedRR: 2
  },
  high: {
    label: 'Aggressive',
    description: 'Higher risk per trade (1.5-2.5%). Faster pass potential, but higher drawdown risk.',
    riskPerTradeRange: [1.5, 2.5],
    recommendedRR: 2.5
  }
};

export const TRADING_STYLES = {
  intraday: {
    label: 'Intraday Scalper',
    description: 'Multiple short-term trades completed within market hours',
    avgTradesPerDay: [3, 10],
    avgTimeInTrade: '5min - 2hrs'
  },
  swing: {
    label: 'Swing Trader',
    description: 'Trades held for several days to capture larger market moves',
    avgTradesPerDay: [0.5, 2],
    avgTimeInTrade: '1-5 days'
  },
  position: {
    label: 'Position Trader',
    description: 'Longer-term trades following major market trends',
    avgTradesPerDay: [0.2, 1],
    avgTimeInTrade: '1-3 weeks'
  },
  hybrid: {
    label: 'Hybrid Approach',
    description: 'Combination of trading styles based on market conditions',
    avgTradesPerDay: [1, 5],
    avgTimeInTrade: 'Variable'
  }
};

export const TIME_COMMITMENTS = {
  'part-time': {
    label: 'Part-time',
    description: '1-2 hours per day',
    recommendedTrades: [1, 3]
  },
  'full-time': {
    label: 'Full-time',
    description: '4+ hours per day',
    recommendedTrades: [2, 10]
  }
};

export const STRATEGY_TYPES = {
  'sniper': {
    label: 'Sniper',
    description: 'Highly selective approach with fewer, high-quality trades',
    suitableFor: ['swing', 'position'],
    idealRiskTolerance: 'low',
    winRateExpectation: 'Higher (60%+)',
    tradeFrequency: 'Low'
  },
  'scalp-sprint': {
    label: 'Scalp Sprint',
    description: 'Rapid-fire trades capturing small market movements',
    suitableFor: ['intraday'],
    idealRiskTolerance: 'high',
    winRateExpectation: 'Moderate (50-60%)',
    tradeFrequency: 'High'
  },
  'balanced-day-trader': {
    label: 'Balanced Day Trader',
    description: 'Moderate approach with selective intraday opportunities',
    suitableFor: ['intraday', 'hybrid'],
    idealRiskTolerance: 'balanced',
    winRateExpectation: 'Moderate (55-65%)',
    tradeFrequency: 'Moderate'
  },
  'hybrid': {
    label: 'Hybrid Strategy',
    description: 'Flexible approach combining multiple timeframes',
    suitableFor: ['hybrid'],
    idealRiskTolerance: 'balanced',
    winRateExpectation: 'Variable',
    tradeFrequency: 'Variable'
  }
};

export const CONFIDENCE_LEVELS = {
  high: {
    label: 'High',
    description: 'Your plan has a strong statistical likelihood of success.',
    color: 'text-green-500',
    percentage: '70-95%'
  },
  moderate: {
    label: 'Moderate',
    description: 'Your plan is achievable but requires consistent execution.',
    color: 'text-amber-500',
    percentage: '40-70%'
  },
  low: {
    label: 'Low',
    description: 'Your plan is ambitious and may need adjustment.',
    color: 'text-red-500',
    percentage: '10-40%'
  }
};
