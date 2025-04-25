
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MaxLotSizeCalculator from '@/components/calculators/MaxLotSizeCalculator';

const MaxLotSize = () => {
  return (
    <AppLayout activeSection="max-lot-size" setActiveSection={() => {}}>
      <div className="container mx-auto max-w-6xl px-2 sm:px-4">
        <MaxLotSizeCalculator />
      </div>
    </AppLayout>
  );
};

export default MaxLotSize;
