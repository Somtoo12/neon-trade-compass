
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Forex Pip Calculator",
    description: "Supports 100+ currency pairs with live pip calculations and dynamic position sizing. Perfect for both spot and forward trades.",
    icon: Star,
  },
  {
    title: "Crypto Profit & Lot Size Calculator",
    description: "Advanced calculations for major cryptocurrencies including Bitcoin, Ethereum, and altcoins. Features MT4/MT5 integration for seamless trading.",
    icon: TrendingUp,
  },
  {
    title: "Futures Tick Calculator",
    description: "Complete support for ES, NQ, YM, RTY, GC, CL and more. Includes Micro/Mini contracts with precise tick values and margin calculations.",
    icon: Sparkles,
  },
  {
    title: "Trading Session Clock",
    description: "Real-time market hours tracker for all major exchanges. Features visual indicators for Asian, London, and New York sessions.",
    icon: Clock,
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-60 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold font-poppins hover:text-primary transition-colors">
            PipCraft
          </Link>
          <Link 
            to="/calculators"
            className="text-sm text-muted-foreground hover:text-primary transition-colors relative group"
          >
            Calculators
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 relative">
        <div className="container mx-auto px-4 py-16 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-background/50 backdrop-blur-sm mb-8 animate-fade-in hover:border-primary transition-colors duration-300">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm">Precision Trading Tools</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Welcome to PipCraft
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Trade smarter with precise tools for Forex, Crypto, and Futures.
          </p>
          <Link to="/calculators">
            <Button className="px-8 py-6 text-lg group hover:scale-105 transition-transform duration-300 neo-card">
              Open Tools
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="p-6 neo-card hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                    <Link to="/calculators">
                      <Button variant="outline" className="w-full group">
                        Use Tool
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground border-t border-border/40 backdrop-blur-sm">
        <p className="hover:text-primary transition-colors">PipCraft is proudly built by Somtoo — for traders, by a trader.</p>
      </footer>
    </div>
  );
};

export default Home;
