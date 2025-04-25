import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const TermsPage = () => {
  return (
    <>
      <SEO 
        title="PipCraft Terms of Use"
        description="Understand your rights and responsibilities when using PipCraft."
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Terms of Use</h1>
            <p className="text-muted-foreground mb-6">Effective Date: April 25, 2025</p>
            
            <p className="mb-6">Welcome to PipCraft. By accessing or using this website, you agree to be bound by these Terms of Use. If you disagree with any part of the terms, please do not use the website.</p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Purpose</h2>
                <p>PipCraft provides free trading tools for informational and educational purposes only. None of the tools or content on this site constitutes financial advice.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">2. No Liability</h2>
                <p>You use PipCraft at your own risk. We do not guarantee the accuracy or reliability of any calculator, tool, or suggestion. We are not responsible for any losses or damages resulting from your use of the platform.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">3. Intellectual Property</h2>
                <p>All content, branding, and tools on this site are the intellectual property of PipCraft. You may not copy, reproduce, or distribute any content without permission.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">4. Changes</h2>
                <p>We reserve the right to update these Terms of Use at any time. Continued use of the platform means you accept any changes.</p>
              </section>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
