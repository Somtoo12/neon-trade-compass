
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfitEstimator from './ProfitEstimator';
import CryptoLotSizeCalculator from './CryptoLotSizeCalculator';
import { cryptoPairs } from '@/constants/currencyPairs';

const CryptoCalculator: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Crypto Calculator</h2>
      
      <Tabs defaultValue="profit" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-background/95 p-1 rounded-lg">
          <TabsTrigger value="profit" className="data-[state=active]:bg-primary/20">
            Profit Estimator
          </TabsTrigger>
          <TabsTrigger value="lot" className="data-[state=active]:bg-primary/20">
            Lot Size Calculator
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profit" className="mt-4">
          <ProfitEstimator />
        </TabsContent>
        
        <TabsContent value="lot" className="mt-4">
          <CryptoLotSizeCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoCalculator;
