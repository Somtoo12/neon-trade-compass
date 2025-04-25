import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EnhancedMaxLotSizeCalculator from '@/components/calculators/EnhancedMaxLotSizeCalculator';
import SEO from '@/components/shared/SEO';

const MaxLotSize = () => {
  return (
    <>
      <SEO 
        title="Max Lot Size Calculator – Find Your Limit Fast | PipCraft"
        description="Know your max lot size per trade using leverage, account size, and live price. Fast, accurate, and built for prop traders."
      />
      <AppLayout activeSection="max-lot-size" setActiveSection={() => {}}>
        <div className="container mx-auto max-w-6xl px-2 sm:px-4">
          <EnhancedMaxLotSizeCalculator />
        </div>
      </AppLayout>
    </>
  );
};

export default MaxLotSize;
