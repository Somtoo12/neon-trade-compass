
import React from 'react';
import BasicRiskCalculator from '@/components/calculators/BasicRiskCalculator';
import { Card } from '@/components/ui/card';

const RiskManagement: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Risk Management Tools</h2>
      <BasicRiskCalculator />
    </Card>
  );
};

export default RiskManagement;
