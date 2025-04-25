
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Image, FileText, Instagram } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import { StrategyMetrics, TraderData, RiskStyle } from './index';

interface ExportToolsProps {
  traderData: TraderData;
  metrics: StrategyMetrics;
  riskStyle: RiskStyle;
}

const ExportTools: React.FC<ExportToolsProps> = ({ traderData, metrics, riskStyle }) => {
  const { toast } = useToast();
  const chartRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleCopyToClipboard = () => {
    const summaryText = generateSummaryText();
    navigator.clipboard.writeText(summaryText).then(() => {
      toast({
        title: "Summary Copied",
        description: "The blueprint summary has been copied to your clipboard."
      });
    });
  };
  
  const generateSummaryText = () => {
    return `
🏆 PIPCROFT CHALLENGE BLUEPRINT 🏆

Account: ${formatCurrency(traderData.accountSize)}
Profit Target: ${traderData.profitTarget}% (${formatCurrency(traderData.accountSize * traderData.profitTarget / 100)})
Timeline: ${traderData.passDays} days
Risk Style: ${riskStyle === 'conservative' ? 'Conservative' : 'Aggressive'}

STRATEGY BREAKDOWN:
• Est. Trades Needed: ${Math.ceil(metrics.tradesNeeded)}
• Daily Target: ${formatCurrency(metrics.dailyTargetAmount)} (${metrics.dailyTargetPercent.toFixed(2)}%)
• Max Drawdown Risk: ${metrics.drawdownRisk.toFixed(1)}%
• Pass Probability: ${metrics.passProbability.toFixed(0)}%

TRADER PERFORMANCE:
• Win Rate: ${traderData.winRate}%
• Risk:Reward: ${traderData.riskRewardRatio}
• Risk Per Trade: ${traderData.riskPerTrade}%
• Avg Trades Per Day: ${traderData.tradesPerDay}

Created with PipCraft.app
    `;
  };
  
  const handleSaveAsPDF = () => {
    toast({
      title: "Feature Coming Soon",
      description: "PDF export will be available in the next update."
    });
  };
  
  const handleSaveChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = 'pipcroft-equity-curve.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        toast({
          title: "Chart Saved",
          description: "The equity curve chart has been downloaded."
        });
      });
    }
  };
  
  const handleSaveSummary = () => {
    if (summaryRef.current) {
      html2canvas(summaryRef.current, {
        backgroundColor: '#1a1f2c',
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'pipcroft-blueprint-summary.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        toast({
          title: "Summary Image Saved",
          description: "The blueprint summary has been downloaded as an image."
        });
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="border border-border/50 shadow-md bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">Export Challenge Blueprint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Export Options</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start"
                  onClick={handleCopyToClipboard}
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Copy Blueprint Summary
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start"
                  onClick={handleSaveAsPDF}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Save as PDF
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start"
                  onClick={handleSaveChart}
                >
                  <Image className="h-5 w-5 mr-2" />
                  Save Equity Curve
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-start bg-accent/10 hover:bg-accent/20 border-accent/30"
                  onClick={handleSaveSummary}
                >
                  <Instagram className="h-5 w-5 mr-2" />
                  Save as Social Image
                </Button>
                
                <div className="text-xs text-muted-foreground mt-1">
                  Perfect for sharing on social media! 
                </div>
              </div>
            </div>
            
            {/* Social Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Social Preview</h3>
              
              <div 
                ref={summaryRef} 
                className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
                style={{width: '100%', maxWidth: '500px'}}
              >
                <div className="text-xl font-bold bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent mb-3">
                  Challenge Blueprint
                </div>
                
                <div className="text-sm">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="text-muted-foreground">Account Size</div>
                      <div className="font-semibold">{formatCurrency(traderData.accountSize)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Profit Target</div>
                      <div className="font-semibold">{traderData.profitTarget}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Timeline</div>
                      <div className="font-semibold">{traderData.passDays} days</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Risk Style</div>
                      <div className="font-semibold capitalize">{riskStyle}</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-3 mb-3">
                    <div className="text-muted-foreground mb-1">Strategy Breakdown</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between">
                        <span>Est. Trades:</span>
                        <span className="font-semibold">{Math.ceil(metrics.tradesNeeded)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Win Rate:</span>
                        <span className="font-semibold">{traderData.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Target:</span>
                        <span className="font-semibold">{metrics.dailyTargetPercent.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk:Reward:</span>
                        <span className="font-semibold">{traderData.riskRewardRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Drawdown Risk:</span>
                        <span className="font-semibold">{metrics.drawdownRisk.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Per Trade:</span>
                        <span className="font-semibold">{traderData.riskPerTrade}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="w-full py-1 rounded text-center text-xs bg-accent/10 border border-accent/30"
                  >
                    Created with PipCraft.app
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Reference (hidden) */}
          <div ref={chartRef} className="hidden">
            {/* This is just for capturing the chart; can be populated on render */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportTools;
