
import React from 'react';
import { motion } from 'framer-motion';
import { Telegram } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const FloatingTelegramButton: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.a
            href="https://t.me/pipcraftstelegram"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#229ED9] hover:bg-[#1d8ac0] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Telegram className="w-6 h-6 text-white" />
          </motion.a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Red Folder News Alerts</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingTelegramButton;
