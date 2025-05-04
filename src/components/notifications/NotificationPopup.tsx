
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNotificationPrompt } from '@/hooks/use-notification-prompt';
import { useTheme } from '@/hooks/use-theme';

const NotificationPopup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const { 
    showPrompt, 
    dismissPrompt, 
    submitEmail, 
    isSubscribed,
    isSubmitting
  } = useNotificationPrompt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await submitEmail(email);
      setIsSuccess(true);
      toast({
        title: "🔔 You're subscribed!",
        description: "Thank you! You'll be notified about new tools and updates.",
      });
      // Reset after 2 seconds
      setTimeout(() => {
        dismissPrompt();
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      // Error will be handled by the hook with toast
      console.error("Error submitting email:", error);
    }
  };

  if (isSubscribed) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <Dialog open={showPrompt} onOpenChange={(open) => !open && dismissPrompt()}>
          <DialogContent className="sm:max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full p-1"
            >
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  👋 Stay in the Loop!
                </DialogTitle>
                <DialogDescription className="text-base">
                  Don't miss our next tool drop, update, or opportunity. Get notified when we release something new — only the good stuff, no spam.
                </DialogDescription>
              </DialogHeader>
              
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      className="flex-1 input-glow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Bell size={16} />
                          Notify Me
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-center pt-2">
                    <Button 
                      type="button"
                      variant="ghost" 
                      onClick={dismissPrompt}
                      className="text-muted-foreground hover:text-foreground"
                      disabled={isSubmitting}
                    >
                      <X size={16} className="mr-2" /> Not Now
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <p className="text-center font-medium">Thank you for subscribing!</p>
                </div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
