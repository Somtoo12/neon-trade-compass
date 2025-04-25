
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-6 border-t border-white/10 backdrop-blur-sm bg-black/30">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-sm text-center md:text-left">
          PipCraft — Smart Tools. No Noise. Made by traders for traders.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Disclaimer
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
