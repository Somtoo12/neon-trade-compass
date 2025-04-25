
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const FocusMode = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 z-50"
      >
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🎧 Focus Mode – Curated Sound for Clear Trades
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
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
          <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS"
            width="100%"
            height="400"
            frameBorder="0"
            allow="encrypted-media"
            className="w-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default FocusMode;
