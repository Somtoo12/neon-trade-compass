
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/10 backdrop-blur-sm bg-black/30">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link to="/" className="font-bold text-xl bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              PipCraft
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Smart Tools. No Noise. Made by traders for traders.
            </p>
          </div>
          
          <div className="flex gap-6 flex-wrap justify-center">
            <Link to="/about" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="text-sm text-foreground/80 hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block py-1 px-4 rounded-full bg-accent/10 border border-accent/20"
          >
            <span className="text-sm font-medium">All tools are 100% free — forever</span>
          </motion.div>
          
          <p className="text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} PipCraft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
