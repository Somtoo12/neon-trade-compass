
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { toolCategories } from '@/data/toolCategories';

const FeaturedCategories: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent">
              Discover Our Tools
            </span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Explore our wide range of tools designed to make your life easier, from advanced calculators to productivity boosters
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((category, index) => {
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.id}
                className={`relative rounded-xl p-6 bg-gradient-to-br ${category.color} border ${category.borderColor} backdrop-blur-sm transition-all hover:shadow-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-background/30 ${category.iconColor}`}>
                    <Icon className="w-6 h-6" aria-label={`${category.name} category`} />
                  </div>
                  <Link 
                    to={`/tools#${category.id}`}
                    className="text-xs font-medium flex items-center gap-1 hover:text-accent"
                  >
                    View All
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-foreground/70 mb-4">{category.description}</p>
                
                <div className="space-y-2">
                  {category.examples.map((example, i) => (
                    <Link
                      key={i}
                      to={example.path}
                      className="flex items-center text-sm hover:text-accent transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/70 mr-2"></span>
                      {example.name}
                    </Link>
                  ))}
                </div>

                <Link
                  to={`/tools#${category.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Explore all ${category.name}`}
                >
                  <span className="sr-only">Explore {category.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
