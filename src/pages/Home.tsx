
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Activity, CircleDot } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Forex Pip Calculator",
    description: "Supports 100+ pairs with live pip calculations.",
    icon: <Sparkles className="h-6 w-6 text-primary" />,
  },
  {
    title: "Crypto Profit & Lot Size Calculator",
    description: "Includes MT4/MT5 logic with accurate crypto contracts.",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    title: "Futures Tick Calculator",
    description: "Micro/Mini toggle with correct tick values.",
    icon: <Activity className="h-6 w-6 text-primary" />,
  },
  {
    title: "Trading Session Clock",
    description: "Live session tracker with glowing active indicators.",
    icon: <CircleDot className="h-6 w-6 text-primary" />,
  },
];

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-accent/20 via-background to-transparent animate-pulse-glow opacity-50" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold font-poppins relative group">
            PipCraft
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            to="/calculators"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Calculators
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 py-16 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in relative inline-block">
            Welcome to PipCraft
            <Sparkles className="absolute -top-6 -right-6 text-primary animate-pulse" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            Trade smarter with precise tools for Forex, Crypto, and Futures.
          </p>
          <Link to="/calculators">
            <Button className="px-8 py-6 text-lg relative group overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Open Tools
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="p-6 neo-card hover:scale-[1.02] transition-all duration-300 opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6">{feature.description}</p>
                  </div>
                </div>
                <Link to="/calculators">
                  <Button variant="outline" className="w-full group">
                    Use Tool
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground border-t border-border/40 relative z-10 backdrop-blur-sm">
        <p className="flex items-center justify-center gap-2">
          PipCraft is proudly built by Somtoo — for traders, by a trader
          <Sparkles className="h-4 w-4 animate-pulse text-primary" />
        </p>
      </footer>
    </div>
  );
};

export default Home;
