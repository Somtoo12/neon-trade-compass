
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Forex Pip Calculator",
    description: "Supports 100+ pairs with live pip calculations.",
  },
  {
    title: "Crypto Profit & Lot Size Calculator",
    description: "Includes MT4/MT5 logic with accurate crypto contracts.",
  },
  {
    title: "Futures Tick Calculator",
    description: "Micro/Mini toggle with correct tick values.",
  },
  {
    title: "Trading Session Clock",
    description: "Live session tracker with glowing active indicators.",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold font-poppins">
            PipCraft
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
      <section className="min-h-screen flex items-center justify-center pt-16">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Welcome to PipCraft
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Trade smarter with precise tools for Forex, Crypto, and Futures.
          </p>
          <Link to="/calculators">
            <Button className="px-8 py-6 text-lg neon-glow">
              Open Tools
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="p-6 neo-card hover:scale-[1.02] transition-transform duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <Link to="/calculators">
                  <Button variant="outline" className="w-full">
                    Use Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-muted-foreground border-t border-border/40">
        <p>PipCraft is proudly built by Somtoo — for traders, by a trader.</p>
      </footer>
    </div>
  );
};

export default Home;
