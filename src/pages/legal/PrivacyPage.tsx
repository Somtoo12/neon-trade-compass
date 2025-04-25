import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const PrivacyPage = () => {
  return (
    <>
      <SEO 
        title="PipCraft Privacy Policy"
        description="Learn how we handle your data and protect your privacy."
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-6">Effective Date: April 25, 2025</p>
            
            <p className="mb-6">PipCraft respects your privacy. This policy outlines how we collect, use, and protect your information.</p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Information Collected</h2>
                <p>We may collect anonymous usage data for analytics purposes (e.g., tool usage, page visits). We do not collect personal identifying information unless you contact us directly.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">2. Cookies</h2>
                <p>We use minimal cookies to improve website performance. You can disable cookies in your browser settings.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">3. Third-Party Tools</h2>
                <p>Some tools may embed third-party widgets (e.g., TradingView, Spotify). These third parties may collect data in accordance with their own privacy policies.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">4. Security</h2>
                <p>We use best practices to protect data but cannot guarantee absolute security.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
                <p>If you have privacy concerns, please reach out via our Contact page.</p>
              </section>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;
