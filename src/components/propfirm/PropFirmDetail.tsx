
import React from 'react';
import { PropFirm } from '@/data/propFirms';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PropFirmDetailProps {
  firm: PropFirm;
  onClose: () => void;
}

export function PropFirmDetail({ firm, onClose }: PropFirmDetailProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 bg-card rounded-md overflow-hidden flex items-center justify-center border">
            <img 
              src={firm.logo} 
              alt={`${firm.name} logo`} 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{firm.name}</h2>
            {firm.ranking <= 5 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 mr-1 text-orange-500" /> Ranked #{firm.ranking}
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Challenge Model</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Evaluation Type</div>
                <div className="text-lg">{firm.evaluation}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Maximum Drawdown</div>
                <div className="text-lg">{firm.drawdown}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Daily Loss Limit</div>
                <div className="text-lg">{firm.dailyLoss}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Trial Available</div>
                <div className="text-lg">{firm.trial}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Payout & Scaling</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Profit Split</div>
                <div className="text-lg">{firm.profitSplit}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Payout Time</div>
                <div className="text-lg">{firm.payout}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Refundable Fee</div>
                <div className="text-lg">{firm.refund}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium mb-1">Scaling Program</div>
                <div className="text-lg">{firm.scaling}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-semibold mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {firm.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button 
          onClick={() => window.open(firm.website, '_blank')}
          className="w-full max-w-xs"
        >
          <ExternalLink className="mr-2 h-4 w-4" /> Visit Official Website
        </Button>
      </div>
    </div>
  );
}
