
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BellRing, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmailCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Note: Assume this is connected to Supabase already as per requirements
      // This would normally make an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
      
      // Show success notification
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive notifications when new tools are released.",
      });
      
      // Update UI
      setSubscribed(true);
      setEmail('');
      
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-background border border-accent/20 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Background grid effect */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(to right, var(--accent) 1px, transparent 1px),
              linear-gradient(to bottom, var(--accent) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }} />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Join the Drop List
                </h2>
                <p className="text-foreground/80 mb-4 md:mb-0">
                  Be the first to know when new tools launch. We're constantly creating new utilities to help you work smarter.
                </p>
              </div>
              
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="min-w-[240px] bg-background/50"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {loading ? (
                      <>Loading...</>
                    ) : (
                      <>
                        <BellRing className="mr-2 h-4 w-4" />
                        Notify Me
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2 bg-neon-green/10 text-neon-green px-4 py-2 rounded-md">
                  <CheckCircle className="h-5 w-5" />
                  <span>You're on the list!</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EmailCapture;
