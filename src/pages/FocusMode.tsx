
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const FocusMode = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background pt-safe">
      {/* Back Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 z-50"
      >
        <Link to="/">
          <Button variant="ghost" className="gap-2 min-h-[44px] min-w-[44px]">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎧 Focus Mode
          </motion.h1>
          <motion.h2
            className="text-xl md:text-2xl font-medium mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
          >
            Curated Sound for Clear Trades
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.2 } }}
          >
            Play a Spotify-powered setlist while you plan, journal, or track the markets.
          </motion.p>
        </div>

        {/* Spotify Embed */}
        <motion.div 
          className="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
          <div className="aspect-ratio-container relative w-full overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS"
              width="100%"
              height={isMobile ? "380" : "400"}
              frameBorder="0"
              allow="encrypted-media"
              className="w-full rounded-lg"
            />
          </div>
        </motion.div>
        
        {/* Mobile Back Button at Bottom */}
        {isMobile && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4 } }}
          >
            <Link to="/">
              <Button size="lg" className="w-full min-h-[44px]">
                <ArrowLeft className="mr-2" />
                Return to Homepage
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FocusMode;
