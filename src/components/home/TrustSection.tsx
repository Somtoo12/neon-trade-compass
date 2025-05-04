
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Clock, Shield, Sparkles, Users } from 'lucide-react';

const trustItems = [
  {
    icon: Sparkles,
    title: 'Free to Use',
    description: 'All our tools are completely free with no hidden fees'
  },
  {
    icon: Lock,
    title: 'No Signups',
    description: 'No account creation or registration required'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays on your device, not our servers'
  },
  {
    icon: Clock,
    title: 'New Tools Weekly',
    description: 'We regularly add new tools to our collection'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Built based on user feedback and requests'
  }
];

const TrustSection: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 md:px-6 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              Why Choose PipCraft
            </span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            We build high-quality tools with you in mind
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-accent/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="p-3 rounded-full bg-accent/10 mb-4">
                  <Icon className="w-6 h-6 text-accent" aria-label={item.title} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-xs text-foreground/70">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
