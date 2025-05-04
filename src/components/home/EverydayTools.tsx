
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { utilityToolsData } from '@/data/utilityToolsData';

const EverydayTools: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-background relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Everyday Tools
            </span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Simple, powerful utilities for your daily tasks
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {utilityToolsData.map((tool, index) => (
            <motion.div
              key={tool.id}
              className="relative group overflow-hidden rounded-xl backdrop-blur-sm bg-card/40 border border-border/50 hover:border-primary/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link 
                to={tool.path} 
                className="block p-4 md:p-5 h-full"
                title={tool.shortDescription || tool.description}
              >
                <div className="flex flex-col h-full">
                  <div className="bg-secondary/50 p-3 rounded-lg w-fit mb-3">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-sm md:text-base font-medium mb-1">{tool.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground flex-grow">
                    {tool.shortDescription || tool.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EverydayTools;
