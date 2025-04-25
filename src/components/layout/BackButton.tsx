
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't show on homepage
  if (location.pathname === '/') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-4 z-50 md:relative md:top-0 md:left-0"
    >
      <Button
        variant="ghost"
        size={isMobile ? "default" : "sm"}
        onClick={() => navigate(-1)}
        className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/10 backdrop-blur-sm min-h-[44px] min-w-[44px]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </motion.div>
  );
};

export default BackButton;
