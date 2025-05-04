
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the most popular tools across categories
const popularTools = [
  {
    title: 'Forex Pip Calculator',
    description: 'Calculate pips in forex trading with our forex pip calculator for beginners',
    icon: '📊',
    path: '/forex-calculator',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    popular: true
  },
  {
    title: 'Password Strength Checker',
    description: 'Test your password security with our password strength checker online free tool',
    icon: '🔒',
    path: '/password-strength-checker',
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    popular: true
  },
  {
    title: 'Countdown Timer',
    description: 'Set precise timers with our online countdown timer with alarm functionality',
    icon: '⏱️',
    path: '/countdown-timer',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    popular: true
  },
  {
    title: 'Word Counter',
    description: 'Count words, characters and more with our online word counter free tool',
    icon: '📝',
    path: '/character-counter',
    color: 'from-orange-500/20 to-yellow-500/20',
    borderColor: 'border-orange-500/30',
    new: true
  },
  {
    title: 'GPA Calculator',
    description: 'Calculate your GPA with our simple and effective calculator',
    icon: '🎓',
    path: '/grade-calculator',
    color: 'from-red-500/20 to-pink-500/20',
    borderColor: 'border-red-500/30',
    new: true
  },
  {
    title: 'Risk Management',
    description: 'Optimize your trading position sizes for maximum effectiveness',
    icon: '📈',
    path: '/risk-management',
    color: 'from-indigo-500/20 to-blue-500/20',
    borderColor: 'border-indigo-500/30',
    popular: true
  },
];

const PopularTools: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 md:px-6 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Popular Tools
              </span>
            </h2>
            <p className="text-foreground/70 max-w-2xl">
              Our most-used tools that users love for everyday tasks
            </p>
          </div>
          
          <Link to="/tools" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-accent/30">
              View All Tools
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Desktop view - Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {popularTools.map((tool, index) => (
            <ToolCard key={index} tool={tool} index={index} />
          ))}
        </div>

        {/* Mobile/Tablet view - Carousel */}
        <div className="lg:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {popularTools.map((tool, index) => (
                <CarouselItem key={index} className="md:basis-1/2 pl-2">
                  <ToolCard tool={tool} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="static mx-2" />
              <CarouselNext className="static mx-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

interface ToolCardProps {
  tool: typeof popularTools[0];
  index: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, index }) => {
  return (
    <motion.div
      className={`relative group rounded-xl p-6 bg-gradient-to-br ${tool.color} border ${tool.borderColor} h-full transition-all hover:shadow-lg`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Badge */}
      {(tool.new || tool.popular) && (
        <span 
          className={`absolute top-3 right-3 px-2 py-0.5 text-xs rounded-full ${
            tool.new 
              ? "bg-neon-green/20 text-neon-green" 
              : "bg-neon-purple/20 text-neon-purple"
          }`}
        >
          {tool.new ? "New" : "Popular"}
        </span>
      )}

      <div className="text-3xl mb-4">{tool.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
      <p className="text-sm text-foreground/70 mb-4">{tool.description}</p>
      
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-accent hover:text-accent/80 hover:bg-background/20 p-0"
          asChild
        >
          <Link to={tool.path}>
            Try Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Full card link overlay */}
      <Link to={tool.path} className="absolute inset-0 z-10" aria-label={`Try ${tool.title}`}>
        <span className="sr-only">Try {tool.title}</span>
      </Link>
    </motion.div>
  );
};

export default PopularTools;
