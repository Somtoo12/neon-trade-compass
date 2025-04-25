import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/seo';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pt-safe">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <SEO 
          title="About PipCraft – Trader-Built Smart Tools for the Prop Firm Era"
          description="Learn about PipCraft's mission to deliver free, high-performance forex/crypto tools: risk managers, calculators, journals, and more for prop traders and independent investors."
          canonical="https://pipcrafts.com/about"
        />
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">About Us</h1>
          
          <div className="space-y-6">
            <p>PipCraft was built by traders, for traders. Our mission is to give every trader access to smart, noise-free tools that improve decision-making and confidence—without the fees or fluff.</p>
            
            <p>All our tools are 100% free to use. Whether you're just getting started or scaling up, we aim to be your go-to control center for prop firm success.</p>
            
            <p className="text-xl font-semibold">Smart Tools. No Noise.</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default AboutPage;
