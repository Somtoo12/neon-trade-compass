
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, CandlestickChart, Database, GridIcon } from 'lucide-react';

const TradingVisual = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden my-8">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-accent/5 to-background opacity-50" />
      
      {/* Main container for the trading visualization */}
      <div className="relative h-full max-w-4xl mx-auto">
        {/* Grid background */}
        <motion.div 
          className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-px opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border border-accent/20" />
          ))}
        </motion.div>

        {/* Floating icons */}
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <TrendingUp className="h-12 w-12 text-neon-green" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <CandlestickChart className="h-16 w-16 text-neon-purple" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/4 left-1/3"
          animate={{ 
            y: [-10, 10, -10],
            scale: [0.9, 1, 0.9],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Database className="h-10 w-10 text-neon-blue" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/3"
          animate={{ 
            y: [10, -10, 10],
            scale: [1, 0.9, 1],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <GridIcon className="h-14 w-14 text-accent" />
        </motion.div>

        {/* Central glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-neon-blue"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
              y: [0, -20, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TradingVisual;
