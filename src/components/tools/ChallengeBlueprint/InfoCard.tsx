
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const InfoCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-24 right-6 z-50 max-w-sm"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-2 p-3 text-sm font-medium bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg hover:bg-accent/10 transition-colors">
            <Info className="h-4 w-4 text-accent shrink-0" />
            <span>How It Works — Click to Expand</span>
          </button>
        </CollapsibleTrigger>

        <AnimatePresence>
          {isOpen && (
            <CollapsibleContent forceMount>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-2"
              >
                <Card className="border border-border/50 shadow-lg bg-card/95 backdrop-blur-sm">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-accent" />
                        <h3 className="text-lg font-semibold">💡 How It Works</h3>
                      </div>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-accent/10 rounded-md transition-colors"
                      >
                        <Minimize className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Design a realistic plan to pass your prop firm challenge based on your personal trading stats.
                    </p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <span>📌</span>
                        <div>
                          <span className="font-medium text-foreground">1. Trader Profile</span>
                          <p className="text-muted-foreground">Set your account size, profit target, and how many days you want to pass the challenge in.</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span>🧠</span>
                        <div>
                          <span className="font-medium text-foreground">2. Strategy Blueprint</span>
                          <p className="text-muted-foreground">We calculate your optimal trade count, risk size, and probability of success. Adjust risk-reward, win rate, and trading frequency live.</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span>🧪</span>
                        <div>
                          <span className="font-medium text-foreground">3. Adaptive Simulator</span>
                          <p className="text-muted-foreground">Test your setup using a simulated strategy model to track how changes affect your odds.</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span>🗂️</span>
                        <div>
                          <span className="font-medium text-foreground">4. Export & Review</span>
                          <p className="text-muted-foreground">Save your plan to local storage and export your blueprint with just one click.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm border-t border-border/50 pt-3">
                      <p className="flex gap-2">
                        <span>💬</span>
                        <span className="text-muted-foreground">
                          <strong>Tip:</strong> Use the "Preferred Strategy" selector to align your plan with your real trading habits like SMC, Scalping, or Swing Trading.
                        </span>
                      </p>
                      
                      <p className="flex gap-2">
                        <span>📈</span>
                        <span className="text-muted-foreground">Everything here updates live to help you make better trading decisions.</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </motion.div>
  );
};

export default InfoCard;
