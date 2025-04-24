
import React, { useState, useMemo } from 'react';
import { Search, Filter, Trophy, Info, ExternalLink } from 'lucide-react';
import { propFirms, PropFirm } from '@/data/propFirms';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PropFirmCard } from '@/components/propfirm/PropFirmCard';
import { PropFirmFilter } from '@/components/propfirm/PropFirmFilter';
import { PropFirmComparison } from '@/components/propfirm/PropFirmComparisonTable';
import { PropFirmDetail } from '@/components/propfirm/PropFirmDetail';

export default function PropFirmComparisonSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFirms, setSelectedFirms] = useState<PropFirm[]>([]);
  const [selectedFirm, setSelectedFirm] = useState<PropFirm | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [filters, setFilters] = useState({
    evaluationType: [] as string[],
    drawdownModel: [] as string[],
    profitShare: [] as string[],
    refundPolicy: [] as string[],
    fastPayout: false,
  });

  // Filter firms based on search term and filters
  const filteredFirms = useMemo(() => {
    return propFirms.filter(firm => {
      // Search filter
      const searchMatch = 
        searchTerm === '' ||
        firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        firm.evaluation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firm.drawdown.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Evaluation type filter
      const evalMatch = 
        filters.evaluationType.length === 0 ||
        filters.evaluationType.some(type => firm.evaluation.toLowerCase().includes(type.toLowerCase()));
      
      // Drawdown model filter
      const drawdownMatch = 
        filters.drawdownModel.length === 0 ||
        filters.drawdownModel.some(model => firm.drawdown.toLowerCase().includes(model.toLowerCase()));
      
      // Profit share filter
      const profitMatch = 
        filters.profitShare.length === 0 ||
        filters.profitShare.some(share => {
          const firmShare = parseInt(firm.profitSplit);
          const minShare = parseInt(share);
          return !isNaN(firmShare) && firmShare >= minShare;
        });
      
      // Refund policy filter
      const refundMatch = 
        filters.refundPolicy.length === 0 ||
        (filters.refundPolicy.includes('Yes') && firm.refund === '✅') ||
        (filters.refundPolicy.includes('No') && firm.refund === '❌');
      
      // Fast payout filter
      const payoutMatch = 
        !filters.fastPayout ||
        (firm.payout.includes('7') || firm.payout.includes('8') || firm.payout.includes('10'));
      
      return searchMatch && evalMatch && drawdownMatch && profitMatch && refundMatch && payoutMatch;
    });
  }, [searchTerm, filters]);

  const toggleFirmSelection = (firm: PropFirm) => {
    if (selectedFirms.find(f => f.name === firm.name)) {
      setSelectedFirms(selectedFirms.filter(f => f.name !== firm.name));
    } else if (selectedFirms.length < 3) {
      setSelectedFirms([...selectedFirms, firm]);
    }
  };

  const viewFirmDetails = (firm: PropFirm) => {
    setSelectedFirm(firm);
  };

  const closeDetails = () => {
    setSelectedFirm(null);
  };

  // Determine view mode
  const renderContent = () => {
    if (selectedFirm) {
      return <PropFirmDetail firm={selectedFirm} onClose={closeDetails} />;
    }
    
    if (showCompare && selectedFirms.length >= 2) {
      return (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Side-by-Side Comparison</h2>
            <Button variant="outline" size="sm" onClick={() => setShowCompare(false)}>
              Back to All Firms
            </Button>
          </div>
          <PropFirmComparison firms={selectedFirms} />
        </div>
      );
    }
    
    return (
      <>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, feature or tag..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <PropFirmFilter filters={filters} setFilters={setFilters} />
        </div>
        
        {selectedFirms.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Selected:</span>
              {selectedFirms.map(firm => (
                <Badge 
                  key={firm.name} 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => toggleFirmSelection(firm)}
                >
                  {firm.name} ✕
                </Badge>
              ))}
            </div>
            {selectedFirms.length >= 2 && (
              <Button 
                onClick={() => setShowCompare(true)}
                className="whitespace-nowrap"
                size="sm"
              >
                <Info className="mr-1 h-4 w-4" /> Compare Selected
              </Button>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFirms.map((firm) => (
            <PropFirmCard 
              key={firm.name} 
              firm={firm} 
              isSelected={!!selectedFirms.find(f => f.name === firm.name)}
              onSelect={toggleFirmSelection}
              onViewDetails={viewFirmDetails}
            />
          ))}
        </div>
        
        {filteredFirms.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No prop firms match your filters.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  evaluationType: [],
                  drawdownModel: [],
                  profitShare: [],
                  refundPolicy: [],
                  fastPayout: false,
                });
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-neon-blue" />
          <h1 className="text-2xl md:text-3xl font-bold">Prop Firm Comparison</h1>
        </div>
        <p className="text-muted-foreground mt-1">
          Compare features and requirements from top proprietary trading firms.
        </p>
      </div>
      
      {renderContent()}
    </div>
  );
}
