
import React from 'react';
import { motion } from 'framer-motion';

const ArticleHeader = () => {
  return (
    <header className="text-center mb-12">
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Why Every Trader Needs a Smart Command Center in 2025
      </motion.h1>
      <p className="text-xl text-muted-foreground">
        Boost Performance with All Essential Tools in One Place
      </p>
    </header>
  );
};

export default ArticleHeader;
