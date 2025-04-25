
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Gauge, 
  Flame, 
  Calendar, 
  HelpCircle, 
  ClipboardCheck, 
  Clock 
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { TraderProfile, RiskLevel, TradingStyle, TimeCommitment } from './index';
import { RISK_LEVELS, TRADING_STYLES, TIME_COMMITMENTS } from './constants';

interface TraderProfileSetupProps {
  traderProfile: TraderProfile;
  onProfileChange: (profile: TraderProfile) => void;
  onCalculate: (profile: TraderProfile) => void;
  isCalculating: boolean;
}

const TraderProfileSetup: React.FC<TraderProfileSetupProps> = ({
  traderProfile,
  onProfileChange,
  onCalculate,
  isCalculating
}) => {
  const [isAccelerated, setIsAccelerated] = useState<boolean>(false);
  
  const handleValueChange = (field: keyof TraderProfile, value: any) => {
    onProfileChange({
      ...traderProfile,
      [field]: value
    });
  };
  
  const handleRiskLevelChange = (level: RiskLevel) => {
    handleValueChange('riskLevel', level);
  };
  
  const handleTradingStyleChange = (style: TradingStyle) => {
    handleValueChange('tradingStyle', style);
    
    // Update trades per day based on trading style
    const avgRange = TRADING_STYLES[style].avgTradesPerDay;
    const newTradesPerDay = Math.round((avgRange[0] + avgRange[1]) / 2);
    handleValueChange('tradesPerDay', newTradesPerDay);
  };
  
  const handleTimeCommitmentChange = (commitment: TimeCommitment) => {
    handleValueChange('timeCommitment', commitment);
  };
  
  const handleAcceleratedToggle = (checked: boolean) => {
    setIsAccelerated(checked);
    
    // Update days remaining based on accelerated toggle
    if (checked) {
      handleValueChange('daysRemaining', 5); // Typical accelerated challenge timeframe
    } else {
      handleValueChange('daysRemaining', 14); // Typical standard challenge timeframe
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(traderProfile);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Trader Profile Setup</h2>
        <p className="text-muted-foreground mb-6">
          Enter your challenge details to create a personalized trading strategy.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Account Details</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accountBalance">Account Size ($)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Your prop firm challenge account size.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="accountBalance"
                      type="number"
                      value={traderProfile.accountBalance}
                      onChange={(e) => handleValueChange('accountBalance', parseInt(e.target.value))}
                      min={1000}
                      step={1000}
                      className="bg-background"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <Label htmlFor="targetPercentage">Target % to Pass</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="ml-1">
                                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The profit target required to pass your challenge.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-sm text-muted-foreground">{traderProfile.targetPercentage}%</span>
                    </div>
                    <Slider
                      id="targetPercentage"
                      value={[traderProfile.targetPercentage]}
                      min={5}
                      max={30}
                      step={1}
                      onValueChange={(values) => handleValueChange('targetPercentage', values[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5%</span>
                      <span>30%</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="daysRemaining">Days to Complete</Label>
                      </div>
                      <span className="text-sm font-medium">{traderProfile.daysRemaining} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="accelerated-toggle" className="text-sm">Accelerated Challenge</Label>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="accelerated-toggle"
                          checked={isAccelerated} 
                          onCheckedChange={handleAcceleratedToggle}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isAccelerated ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    
                    <Slider
                      id="daysRemaining"
                      value={[traderProfile.daysRemaining]}
                      min={isAccelerated ? 3 : 5}
                      max={isAccelerated ? 7 : 30}
                      step={1}
                      onValueChange={(values) => handleValueChange('daysRemaining', values[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{isAccelerated ? '3' : '5'} days</span>
                      <span>{isAccelerated ? '7' : '30'} days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              {/* Risk Tolerance */}
              <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Risk Tolerance</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>This defines your risk per trade, not the prop firm limit. Determines how much capital you're willing to risk on a single position.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <motion.button
                      type="button"
                      onClick={() => handleRiskLevelChange('low')}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        traderProfile.riskLevel === 'low'
                          ? 'border-accent shadow-[0_0_15px_rgba(123,97,255,0.5)] bg-accent/10'
                          : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Shield className={`h-5 w-5 ${
                        traderProfile.riskLevel === 'low' ? 'text-accent' : 'text-foreground/70'
                      }`} />
                      <span className="mt-1 text-sm font-medium">Conservative</span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => handleRiskLevelChange('balanced')}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        traderProfile.riskLevel === 'balanced'
                          ? 'border-accent shadow-[0_0_15px_rgba(123,97,255,0.5)] bg-accent/10'
                          : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Gauge className={`h-5 w-5 ${
                        traderProfile.riskLevel === 'balanced' ? 'text-accent' : 'text-foreground/70'
                      }`} />
                      <span className="mt-1 text-sm font-medium">Balanced</span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      onClick={() => handleRiskLevelChange('high')}
                      className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                        traderProfile.riskLevel === 'high'
                          ? 'border-accent shadow-[0_0_15px_rgba(123,97,255,0.5)] bg-accent/10'
                          : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                      }`}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Flame className={`h-5 w-5 ${
                        traderProfile.riskLevel === 'high' ? 'text-accent' : 'text-foreground/70'
                      }`} />
                      <span className="mt-1 text-sm font-medium">Aggressive</span>
                    </motion.button>
                  </div>
                  
                  <motion.div 
                    key={traderProfile.riskLevel}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="text-sm">{RISK_LEVELS[traderProfile.riskLevel].description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {`Typically ${RISK_LEVELS[traderProfile.riskLevel].riskPerTradeRange[0]}-${RISK_LEVELS[traderProfile.riskLevel].riskPerTradeRange[1]}% risk per trade`}
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
              
              {/* Trading Preferences */}
              <Card className="bg-card/30 backdrop-blur-sm border border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Trading Preferences</h3>
                  
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <Label className="text-sm">Trading Style</Label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(TRADING_STYLES) as Array<TradingStyle>).map((style) => (
                          <motion.button
                            key={style}
                            type="button"
                            onClick={() => handleTradingStyleChange(style)}
                            className={`flex items-center p-2.5 rounded-lg border transition-all ${
                              traderProfile.tradingStyle === style
                                ? 'border-accent shadow-[0_0_10px_rgba(123,97,255,0.3)] bg-accent/10'
                                : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-sm font-medium">{TRADING_STYLES[style].label}</span>
                          </motion.button>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        {TRADING_STYLES[traderProfile.tradingStyle].description}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm">Time Commitment</Label>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(TIME_COMMITMENTS) as Array<TimeCommitment>).map((time) => (
                          <motion.button
                            key={time}
                            type="button"
                            onClick={() => handleTimeCommitmentChange(time)}
                            className={`flex items-center p-2.5 rounded-lg border transition-all ${
                              traderProfile.timeCommitment === time
                                ? 'border-accent shadow-[0_0_10px_rgba(123,97,255,0.3)] bg-accent/10'
                                : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Clock className={`h-4 w-4 mr-2 ${
                              traderProfile.timeCommitment === time ? 'text-accent' : 'text-foreground/70'
                            }`} />
                            <span className="text-sm font-medium">{TIME_COMMITMENTS[time].label}</span>
                          </motion.button>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {TIME_COMMITMENTS[traderProfile.timeCommitment].description}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Label htmlFor="tradesPerDay">Trades Per Day</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="ml-1">
                                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Maximum number of trades you plan to take each day.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <span className="text-sm text-muted-foreground">{traderProfile.tradesPerDay}</span>
                      </div>
                      <Slider
                        id="tradesPerDay"
                        value={[traderProfile.tradesPerDay]}
                        min={1}
                        max={15}
                        step={1}
                        onValueChange={(values) => handleValueChange('tradesPerDay', values[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1</span>
                        <span>15</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              type="submit" 
              className="w-full max-w-md bg-accent hover:bg-accent/90"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-2 border-background mr-2"></div>
                  Generating Strategy...
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Generate Strategy Blueprint
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default TraderProfileSetup;
