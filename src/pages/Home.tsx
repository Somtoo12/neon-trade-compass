
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart, LineChart, PieChart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme/ThemeToggle';

const Home: React.FC = () => {
  useEffect(() => {
    // Animation for the headline when page loads
    const headline = document.querySelector('.headline');
    if (headline) {
      headline.classList.add('animate-fade-in');
    }
  }, []);

  const features = [
    {
      id: 'forex',
      title: 'Forex Pip Calculator',
      description: 'Track pip movements, value, and profits in real-time with over 100 pairs.',
      icon: <BarChart className="w-12 h-12 text-neon-green" />,
      link: '/calculators#forex'
    },
    {
      id: 'crypto',
      title: 'Crypto Profit & Lot Size Calculator',
      description: 'Accurate profit + MT4/MT5 lot size logic using true crypto contract sizes.',
      icon: <LineChart className="w-12 h-12 text-neon-blue" />,
      link: '/calculators#crypto'
    },
    {
      id: 'futures',
      title: 'Futures Tick Calculator',
      description: 'Calculate tick gain/loss using Micro or Mini Futures and correct tick values.',
      icon: <PieChart className="w-12 h-12 text-neon-purple" />,
      link: '/calculators#futures'
    },
    {
      id: 'clock',
      title: 'Trading Session Clock',
      description: 'Live global trading hours with glowing active session indicators.',
      icon: <Clock className="w-12 h-12 text-primary" />,
      link: '/calculators#clock'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="headline text-5xl md:text-7xl font-bold font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
            PipCraft – Tools That Work While You Trade
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Built for precision. Used by traders. Powered by simplicity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/calculators">
              <Button size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground font-medium text-lg px-8 py-6 h-auto neon-border neon-glow">
                Open PipCraft Tools
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="rotate-90 text-muted-foreground" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-poppins">Trading Tools Built For Traders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map(feature => (
              <div 
                key={feature.id}
                className="neo-card p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button className="w-full">
                      Use {feature.title.split(' ')[0]} Tool
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/calculators">
              <Button size="lg" variant="outline" className="neon-border input-glow">
                Open All PipCraft Tools
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 backdrop-blur-sm bg-black/30">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            PipCraft is proudly built by Somtoo — for traders, by a trader.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
