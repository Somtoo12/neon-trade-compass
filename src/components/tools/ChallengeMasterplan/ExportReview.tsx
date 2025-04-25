
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import html2canvas from 'html2canvas';
import { 
  Download, 
  Copy, 
  Share2,
  FileSpreadsheet,
  FileText,
  BadgeCheck,
  Calendar,
  Target,
  TrendingUp,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { ScreenshotButton } from "@/components/ui/screenshot-button";
import type { TraderProfile, StrategyDetails, SimulationState } from './index';
import { STRATEGY_TYPES, RISK_LEVELS, CONFIDENCE_LEVELS } from './constants';

interface ExportReviewProps {
  traderProfile: TraderProfile;
  strategyDetails: StrategyDetails | null;
  simulationState: SimulationState | null;
}

const ExportReview: React.FC<ExportReviewProps> = ({
  traderProfile,
  strategyDetails,
  simulationState
}) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!strategyDetails) {
    return (
      <div className="text-center py-16">
        <p>Please complete the strategy planning first</p>
      </div>
    );
  }
  
  // Calculate required profit and other values
  const requiredProfit = traderProfile.accountBalance * (traderProfile.targetPercentage / 100);
  const targetBalance = traderProfile.accountBalance + requiredProfit;
  const riskAmount = traderProfile.accountBalance * (strategyDetails.riskPerTradePercent / 100);
  const rewardAmount = riskAmount * strategyDetails.rewardRiskRatio;
  
  // Function to download as PNG
  const downloadAsPNG = () => {
    const element = document.getElementById('strategy-summary');
    if (!element) return;
    
    html2canvas(element, {
      backgroundColor: '#1A1F2C', // Dark mode background
      scale: 2, // Higher resolution
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `challenge-masterplan-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Strategy downloaded",
        description: `Your challenge plan has been saved as PNG.`,
        duration: 3000,
      });
    });
  };
  
  // Function to copy strategy text
  const copyStrategyText = () => {
    const strategyText = `
CHALLENGE MASTERPLAN SUMMARY

Account Size: ${formatCurrency(traderProfile.accountBalance)}
Target Profit: ${traderProfile.targetPercentage}% (${formatCurrency(requiredProfit)})
Days to Complete: ${traderProfile.daysRemaining}
Risk Level: ${RISK_LEVELS[traderProfile.riskLevel].label}

STRATEGY DETAILS
- Recommended Approach: ${STRATEGY_TYPES[strategyDetails.strategyType].label}
- Risk per Trade: ${strategyDetails.riskPerTradePercent}% (${formatCurrency(riskAmount)})
- Reward:Risk Ratio: ${strategyDetails.rewardRiskRatio}:1
- Estimated Win Rate Needed: ${Math.round(strategyDetails.breakEvenWinRate)}%
- Minimum Wins Required: ${strategyDetails.minWinsRequired}
- Estimated Trades Needed: ${Math.ceil(strategyDetails.totalTradesEstimate)}
- Daily Trade Plan: ${Math.ceil(strategyDetails.totalTradesEstimate / traderProfile.daysRemaining)} trades per day

RISK WARNING: Trading involves significant risk of loss. This plan is for educational purposes only.
    `;
    
    navigator.clipboard.writeText(strategyText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Strategy summary has been copied to your clipboard.",
        duration: 3000,
      });
    });
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Review & Export</h2>
        <p className="text-muted-foreground mb-6">
          Your challenge strategy is ready. Review the details and export your plan.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                <div id="strategy-summary" className="space-y-6 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-accent via-purple-500 to-blue-500 bg-clip-text text-transparent">
                      Challenge Masterplan
                    </h3>
                    <div className="text-sm px-3 py-1 bg-accent/10 border border-accent/30 rounded-full">
                      Strategy Summary
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <BadgeCheck className="h-5 w-5 text-accent mr-2" />
                        Challenge Details
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Account Size</div>
                          <div className="text-lg font-medium">{formatCurrency(traderProfile.accountBalance)}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Target Profit</div>
                          <div className="text-lg font-medium">
                            {traderProfile.targetPercentage}% ({formatCurrency(requiredProfit)})
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Days to Complete</div>
                          <div className="text-lg font-medium flex items-center">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                            {traderProfile.daysRemaining} days
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Risk Level</div>
                          <div className="text-lg font-medium flex items-center">
                            {traderProfile.riskLevel === 'low' && <Shield className="h-4 w-4 text-green-500 mr-2" />}
                            {traderProfile.riskLevel === 'balanced' && <Target className="h-4 w-4 text-amber-500 mr-2" />}
                            {traderProfile.riskLevel === 'high' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
                            {RISK_LEVELS[traderProfile.riskLevel].label}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 text-accent mr-2" />
                        Strategy Details
                      </h4>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-muted-foreground">Recommended Approach</div>
                          <div className="text-lg font-medium">
                            {STRATEGY_TYPES[strategyDetails.strategyType].label}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">Risk per Trade</div>
                          <div className="text-lg font-medium">
                            {strategyDetails.riskPerTradePercent}% ({formatCurrency(riskAmount)})
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Reward:Risk</div>
                            <div className="text-lg font-medium">
                              {strategyDetails.rewardRiskRatio}:1
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Win Rate Target</div>
                            <div className="text-lg font-medium">
                              {Math.round(strategyDetails.breakEvenWinRate)}%+
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Minimum Wins</div>
                            <div className="text-lg font-medium">
                              {strategyDetails.minWinsRequired}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Trades Needed</div>
                            <div className="text-lg font-medium">
                              ~{Math.ceil(strategyDetails.totalTradesEstimate)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-start">
                      <Target className="h-5 w-5 text-accent mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Key Strategy</h4>
                        <p className="text-sm mt-1">
                          Take approximately {Math.ceil(strategyDetails.totalTradesEstimate / traderProfile.daysRemaining)} trades per day. 
                          Aim for at least a {strategyDetails.breakEvenWinRate.toFixed(0)}% win rate with {strategyDetails.rewardRiskRatio}:1 reward-to-risk to reach your goal.
                          Maintain discipline with {strategyDetails.riskPerTradePercent}% risk per trade.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`
                    p-3 rounded-lg border mt-4
                    ${strategyDetails.confidenceScore === 'high' ? 'bg-green-500/10 border-green-500/30' : 
                      strategyDetails.confidenceScore === 'moderate' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-red-500/10 border-red-500/30'}
                  `}>
                    <div className="text-sm flex items-center">
                      <span className="font-medium mr-2">Confidence Score:</span>
                      <span className={CONFIDENCE_LEVELS[strategyDetails.confidenceScore].color}>
                        {CONFIDENCE_LEVELS[strategyDetails.confidenceScore].label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {CONFIDENCE_LEVELS[strategyDetails.confidenceScore].description}
                    </div>
                  </div>
                  
                  <div className="text-xs text-center text-muted-foreground mt-6 pt-2 border-t border-border/50">
                    <p>This plan is for educational purposes only. Trading outcomes are inherently probabilistic.</p>
                    <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Export Options */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Export Options</h3>
                
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      className="w-full flex items-center justify-start"
                      onClick={downloadAsPNG}
                    >
                      <Download className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Download as Image</div>
                        <div className="text-xs text-muted-foreground">Save as PNG file</div>
                      </div>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      className="w-full flex items-center justify-start"
                      variant="outline"
                      onClick={copyStrategyText}
                    >
                      <Copy className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Copy as Text</div>
                        <div className="text-xs text-muted-foreground">Copy to clipboard</div>
                      </div>
                    </Button>
                  </motion.div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Screenshot Options</div>
                    <ScreenshotButton 
                      targetId="strategy-summary" 
                      filename="challenge-masterplan" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional Plans */}
            <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Additional Resources</h3>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full flex items-center justify-start"
                    variant="outline"
                  >
                    <FileSpreadsheet className="h-5 w-5 mr-3 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Challenge Tracker</div>
                      <div className="text-xs text-muted-foreground">Track your daily progress</div>
                    </div>
                  </Button>
                  
                  <Button 
                    className="w-full flex items-center justify-start"
                    variant="outline"
                  >
                    <FileText className="h-5 w-5 mr-3 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Strategy Templates</div>
                      <div className="text-xs text-muted-foreground">Download trading plans</div>
                    </div>
                  </Button>
                </div>
                
                <div className="mt-6 p-3 bg-secondary/30 rounded-lg">
                  <div className="text-sm font-medium">Need More Help?</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check out our trading tools for additional support with your prop challenge.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportReview;
