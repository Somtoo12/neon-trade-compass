
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BellRing, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

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
      // Generate simple fingerprint for duplicate detection
      const fingerprint = btoa(`${navigator.userAgent}-${window.screen.width}-${window.screen.height}`);
      
      // Try to get client IP (this may not work in all environments)
      let ipAddress = undefined;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        }
      } catch (error) {
        console.log('Could not fetch IP address, continuing without it');
      }
      
      // Insert email into Supabase
      const { data, error } = await supabase
        .from('early_access_emails')
        .insert([
          { 
            email,
            fingerprint,
            ip_address: ipAddress,
            user_agent: navigator.userAgent
          }
        ]);
      
      if (error) {
        console.error("Supabase error:", error);
        
        // Check if it's a duplicate email error (code 23505 is PostgreSQL's unique constraint violation)
        if (error.code === '23505') {
          toast({
            title: "You're already subscribed!",
            description: "This email is already on our notification list.",
          });
          // We still consider this a success
          setSubscribed(true);
          setEmail('');
          return;
        }
        
        throw new Error(error.message);
      }
      
      // Save to local storage for client-side reference
      localStorage.setItem('notificationSubscribed', 'true');
      localStorage.setItem('notificationEmail', email);
      
      // Show success notification
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive notifications when new tools are released.",
      });
      
      // Update UI
      setSubscribed(true);
      setEmail('');
      
    } catch (error: any) {
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
    <section id="email-capture" className="w-full py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-background border border-accent/20 p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
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
                    disabled={loading}
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <BellRing className="mr-2 h-4 w-4" />
                        Notify Me
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-md">
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
