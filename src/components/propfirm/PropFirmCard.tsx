
import React from 'react';
import { ExternalLink, Check, Info } from 'lucide-react';
import { PropFirm } from '@/data/propFirms';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PropFirmCardProps {
  firm: PropFirm;
  isSelected: boolean;
  onSelect: (firm: PropFirm) => void;
  onViewDetails: (firm: PropFirm) => void;
}

export function PropFirmCard({ firm, isSelected, onSelect, onViewDetails }: PropFirmCardProps) {
  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-card rounded-md overflow-hidden flex items-center justify-center">
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
              <div className="font-bold">{firm.name}</div>
              {firm.ranking <= 3 && (
                <Badge variant="secondary" className="mt-1">
                  <Trophy className="h-3 w-3 mr-1 text-orange-500" /> 
                  Rank #{firm.ranking}
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => onSelect(firm)}
          >
            {isSelected ? <Check className="h-4 w-4 text-primary" /> : <Check className="h-4 w-4" />}
          </Button>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max DD:</span>
            <span className="font-medium">{firm.drawdown}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Daily Loss:</span>
            <span className="font-medium">{firm.dailyLoss}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Evaluation:</span>
            <span className="font-medium">{firm.evaluation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Profit Split:</span>
            <span className="font-medium">{firm.profitSplit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Refundable:</span>
            <span className="font-medium">{firm.refund}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {firm.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {firm.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{firm.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => onViewDetails(firm)}
        >
          <Info className="mr-1 h-3 w-3" /> Details
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={() => window.open(firm.website, '_blank')}
        >
          <ExternalLink className="mr-1 h-3 w-3" /> Website
        </Button>
      </CardFooter>
    </Card>
  );
}

function Trophy({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m8 0h1.5a2.5 2.5 0 0 1 0 5H14"></path>
      <path d="M6 4h12v6a6 6 0 0 1-12 0V4Z"></path>
      <path d="M9 14h6"></path>
      <path d="M12 17v3"></path>
      <path d="M10 20h4"></path>
    </svg>
  );
}
