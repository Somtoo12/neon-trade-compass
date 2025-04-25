
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pt-safe">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <SEO
          title="Contact PipCraft – Get Fast Support for Forex & Crypto Tools"
          description="Need assistance with PipCraft calculators, prop firm tools, or risk management? Contact our team and get a quick response. Support for traders is our top priority."
          canonical="https://pipcrafts.com/contact"
        />
        <Link to="/" className="inline-block mb-8">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <article className="prose prose-invert max-w-none">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Us</h1>
          
          <div className="space-y-6">
            <p>Need help or want to get in touch?</p>
            
            <p>Email us at: <a href="mailto:support@pipcrafts.com" className="text-accent hover:text-accent/80 transition-colors">support@pipcrafts.com</a></p>
            
            <p>We typically respond within 48 hours. Please include a brief summary of your request so we can assist you faster.</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ContactPage;

