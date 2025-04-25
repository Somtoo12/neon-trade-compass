
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="mt-16">
      <Button className="w-full md:w-auto" size="lg">
        Start Using PipCraft Now
        <ArrowRight className="ml-2" />
      </Button>
    </section>
  );
};

export default CallToAction;
