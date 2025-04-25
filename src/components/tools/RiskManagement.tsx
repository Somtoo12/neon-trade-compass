
import React from 'react';
import BasicRiskCalculator from '@/components/calculators/BasicRiskCalculator';
import MaxLotSizeCalculator from '@/components/calculators/MaxLotSizeCalculator';

const RiskManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <BasicRiskCalculator />
      <MaxLotSizeCalculator />
    </div>
  );
};

export default RiskManagement;
