
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldAlert, ShieldX } from 'lucide-react';

const BreachRiskBar: React.FC = () => {
  const [startingBalance, setStartingBalance] = useState<number>(10000);
  const [dailyLossPercent, setDailyLossPercent] = useState<number>(5);
  const [currentPL, setCurrentPL] = useState<number>(0);
  const [useTrailingBalance, setUseTrailingBalance] = useState<boolean>(false);
  const [previousBalance, setPreviousBalance] = useState<number>(0);
  const [progressValue, setProgressValue] = useState<number>(0);
  
  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedStartingBalance = localStorage.getItem('breachStartingBalance');
    const savedDailyLossPercent = localStorage.getItem('breachDailyLossPercent');
    const savedCurrentPL = localStorage.getItem('breachCurrentPL');
    const savedUseTrailingBalance = localStorage.getItem('breachUseTrailingBalance');
    const savedPreviousBalance = localStorage.getItem('breachPreviousBalance');
    
    if (savedStartingBalance) setStartingBalance(parseFloat(savedStartingBalance));
    if (savedDailyLossPercent) setDailyLossPercent(parseFloat(savedDailyLossPercent));
    if (savedCurrentPL) setCurrentPL(parseFloat(savedCurrentPL));
    if (savedUseTrailingBalance) setUseTrailingBalance(savedUseTrailingBalance === 'true');
    if (savedPreviousBalance) setPreviousBalance(parseFloat(savedPreviousBalance));
    
    // Set previous day balance if not already set
    if (!savedPreviousBalance && savedStartingBalance) {
      setPreviousBalance(parseFloat(savedStartingBalance));
      localStorage.setItem('breachPreviousBalance', savedStartingBalance);
    }
  }, []);
  
  // Save to localStorage whenever these values change
  useEffect(() => {
    localStorage.setItem('breachStartingBalance', startingBalance.toString());
  }, [startingBalance]);
  
  useEffect(() => {
    localStorage.setItem('breachDailyLossPercent', dailyLossPercent.toString());
  }, [dailyLossPercent]);
  
  useEffect(() => {
    localStorage.setItem('breachCurrentPL', currentPL.toString());
  }, [currentPL]);
  
  useEffect(() => {
    localStorage.setItem('breachUseTrailingBalance', useTrailingBalance.toString());
  }, [useTrailingBalance]);
  
  useEffect(() => {
    localStorage.setItem('breachPreviousBalance', previousBalance.toString());
  }, [previousBalance]);
  
  // Calculate values for the breach risk bar
  const calculateRisk = () => {
    const referenceBalance = useTrailingBalance ? previousBalance : startingBalance;
    const dailyLossLimit = referenceBalance * (dailyLossPercent / 100);
    const currentLoss = currentPL < 0 ? Math.abs(currentPL) : 0;
    const remainingLoss = dailyLossLimit - currentLoss;
    const riskPercentage = (currentLoss / dailyLossLimit) * 100;
    
    return {
      dailyLossLimit,
      currentLoss,
      remainingLoss,
      riskPercentage: Math.min(Math.max(riskPercentage, 0), 100)
    };
  };
  
  const { dailyLossLimit, currentLoss, remainingLoss, riskPercentage } = calculateRisk();
  
  // Update progress bar value
  useEffect(() => {
    setProgressValue(riskPercentage);
  }, [riskPercentage]);
  
  // Determine color based on risk level
  const getColorClass = () => {
    if (riskPercentage < 50) return 'bg-green-500';
    if (riskPercentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get warning message based on risk level
  const getWarningMessage = () => {
    if (riskPercentage >= 100) {
      return "⚠️ You have EXCEEDED your daily loss limit!";
    }
    
    if (riskPercentage >= 80) {
      return `⚠️ WARNING: You are only $${remainingLoss.toFixed(2)} away from your daily loss limit!`;
    }
    
    if (riskPercentage >= 50) {
      return `Caution: You are $${remainingLoss.toFixed(2)} away from your daily loss limit.`;
    }
    
    return `Safe zone: $${remainingLoss.toFixed(2)} remaining until daily loss limit.`;
  };
  
  // Calculate the next dangerous position size
  const calculateDangerousPositionSize = () => {
    // A position that would cause 80% of remaining loss limit if it went -1R
    if (remainingLoss <= 0) return 0;
    return remainingLoss * 0.8;
  };
  
  // Get risk status icon
  const getRiskIcon = () => {
    if (riskPercentage >= 80) return <ShieldX className="h-5 w-5 text-red-500" />;
    if (riskPercentage >= 50) return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
    return <Shield className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="starting-balance">Starting Balance</Label>
          <Input
            id="starting-balance"
            type="number"
            value={startingBalance}
            onChange={(e) => setStartingBalance(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <Label htmlFor="daily-loss">Daily Loss % Limit</Label>
          <Input
            id="daily-loss"
            type="number"
            value={dailyLossPercent}
            onChange={(e) => setDailyLossPercent(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div>
          <Label htmlFor="current-pl">Current Floating P/L</Label>
          <Input
            id="current-pl"
            type="number"
            value={currentPL}
            onChange={(e) => setCurrentPL(parseFloat(e.target.value) || 0)}
            className={currentPL < 0 ? 'text-red-500' : 'text-green-500'}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="use-trailing"
          checked={useTrailingBalance}
          onCheckedChange={setUseTrailingBalance}
        />
        <Label htmlFor="use-trailing">Use previous day's balance for calculation</Label>
      </div>
      
      {useTrailingBalance && (
        <div>
          <Label htmlFor="previous-balance">Previous Day Balance</Label>
          <Input
            id="previous-balance"
            type="number"
            value={previousBalance}
            onChange={(e) => setPreviousBalance(parseFloat(e.target.value) || 0)}
          />
        </div>
      )}
      
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <Label>
            Daily Loss Limit: ${dailyLossLimit.toFixed(2)}
          </Label>
          <div className="flex items-center gap-1">
            {getRiskIcon()}
            <span className="text-sm font-medium">
              {riskPercentage.toFixed(0)}% Used
            </span>
          </div>
        </div>
        
        <Progress 
          value={progressValue} 
          className="h-4" 
          indicatorClassName={getColorClass()}
          aria-label="Risk progress"
        />
        
        <div className="mt-2 text-sm">
          <p className={riskPercentage >= 80 ? 'text-red-500 font-medium' : ''}>
            {getWarningMessage()}
          </p>
          
          {remainingLoss > 0 && (
            <p className="mt-2">
              One loss of <span className="font-medium">${calculateDangerousPositionSize().toFixed(2)}</span> would put you in the danger zone.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreachRiskBar;
