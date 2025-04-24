
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Star, Smartphone, Info } from 'lucide-react';

const BookmarkButtons = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const showAddToHomeInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const message = isIOS
      ? "Tap the Share icon (📤) in your browser and choose 'Add to Home Screen'"
      : "Tap the menu (⋮) in your browser, then select 'Add to Home screen'";

    toast({
      title: "Add to Home Screen",
      description: message,
      duration: 5000,
    });
  };

  const showBookmarkInstructions = () => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const key = isMac ? '⌘' : 'Ctrl';
    window.prompt(`Press ${key} + D to bookmark PipCraft in your browser`, document.title);
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent opacity-30" />
      
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Pin PipCraft for{" "}
            <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              Instant Access
            </span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isMobile ? (
              <Button
                variant="outline"
                size="lg"
                onClick={showAddToHomeInstructions}
                className="group relative w-full sm:w-auto border-accent/50 hover:border-accent bg-background/50 backdrop-blur"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Add to Home Screen
                <Info className="ml-2 h-4 w-4 text-accent/70" />
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-accent/10 rounded-md blur-sm" />
                </div>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={showBookmarkInstructions}
                className="group relative w-full sm:w-auto border-accent/50 hover:border-accent bg-background/50 backdrop-blur"
              >
                <Star className="mr-2 h-5 w-5" />
                Bookmark PipCraft
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-accent/10 rounded-md blur-sm" />
                </div>
              </Button>
            )}
            
            {/* Firefox Fallback - Only shown on desktop */}
            {!isMobile && (
              <a
                href={window.location.href}
                rel="sidebar"
                className="hidden firefox:block text-sm text-accent/70 hover:text-accent transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  showBookmarkInstructions();
                }}
              >
                Add to Bookmarks (Firefox)
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookmarkButtons;
