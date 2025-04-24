
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { PropFirm } from "@/data/propFirms";

interface PromoCardProps {
  firm: PropFirm;
}

const PromoCard = ({ firm }: PromoCardProps) => {
  return (
    <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:border-accent/50 group neo-card">
      <CardContent className="flex-1 p-6">
        <div className="flex items-start gap-4 mb-4">
          <img 
            src={firm.logo} 
            alt={`${firm.name} logo`} 
            className="w-12 h-12 rounded-lg"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{firm.name}</h3>
            <div className="flex flex-wrap gap-2">
              {firm.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          {firm.promo ? (
            <p className="text-lg font-semibold text-accent">{firm.promo}</p>
          ) : (
            <p className="text-muted-foreground italic">Stay tuned for upcoming promo!</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Profit Split</p>
            <p className="font-medium">{firm.profitSplit}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Evaluation</p>
            <p className="font-medium">{firm.evaluation}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Payout Time</p>
            <p className="font-medium">{firm.payout}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full group-hover:shadow-[0_0_15px_rgba(123,97,255,0.3)]"
          onClick={() => window.open(firm.website, '_blank')}
        >
          Visit Website <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromoCard;
