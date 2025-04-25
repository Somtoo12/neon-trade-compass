import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const DisclaimerPage = () => {
  return (
    <>
      <SEO 
        title="PipCraft Disclaimer"
        description="Trading is risky. Read our disclaimer before using any tools."
      />
      <div className="min-h-screen bg-background text-foreground pt-safe">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Link to="/" className="inline-block mb-8">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <article className="prose prose-invert max-w-none">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Disclaimer</h1>
            
            <div className="space-y-6">
              <p>PipCraft is a free educational tool for traders. All tools, calculators, and insights are provided "as-is" and "as-available." We make no guarantees about the results of using any strategy, simulator, or planning tool.</p>
              
              <p>Trading involves risk. Always do your own research and consult with a qualified financial advisor before making any trading decisions.</p>
              
              <p>PipCraft and its creators are not responsible for any losses incurred from using the site.</p>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default DisclaimerPage;
