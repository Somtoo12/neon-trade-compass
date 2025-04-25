
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import EnhancedMaxLotSizeCalculator from '@/components/calculators/EnhancedMaxLotSizeCalculator';

const MaxLotSize = () => {
  return (
    <AppLayout activeSection="max-lot-size" setActiveSection={() => {}}>
      <div className="container mx-auto max-w-6xl px-2 sm:px-4">
        <EnhancedMaxLotSizeCalculator />
      </div>
    </AppLayout>
  );
};

export default MaxLotSize;
