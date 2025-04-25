
import React from 'react';
import { motion } from 'framer-motion';
import ArticleHeader from './article/ArticleHeader';
import KeyTakeaways from './article/KeyTakeaways';
import VideoSection from './article/VideoSection';
import CallToAction from './article/CallToAction';

const TradingArticle = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-accent/5 to-background">
      <div className="container mx-auto max-w-4xl">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <ArticleHeader />

          <div className="space-y-8">
            <section>
              <p className="lead text-lg text-foreground/90">
                Trading in 2025 comes with many challenges. Traders often juggle several separate tools, from pip calculators to economic calendars. This scattered setup can cause confusion, slow decisions, and reduce focus. <strong>Having all essential tools in one place helps traders manage risks better and stay disciplined.</strong>
              </p>
            </section>

            <img 
              src="https://koala.sh/api/image/v2-tqvht-iutjc.jpg?width=1216&height=832&dream" 
              alt="A busy trading floor with traders analyzing data on multiple screens"
              className="w-full rounded-xl shadow-2xl mb-8"
            />

            <section>
              <p>
                A "Trading Command Center" means a single platform where traders find everything they need. This includes pip calculators, risk managers, trade journals, and even game-based discipline trainers. It also uses automation and user-friendly design to keep traders focused and efficient.
              </p>
              <p>
                PipCraft offers a clean and free hub that brings these tools together. It helps traders avoid distractions and work smarter by having everything ready in one spot. <strong>This all-in-one approach supports better trading decisions and improves performance in today's fast-paced market.</strong>
              </p>
            </section>

            <KeyTakeaways />
            <VideoSection />

            <section>
              <h3 className="text-xl font-semibold mb-4">Information Overload and Distraction</h3>
              <p className="mb-6">
                Traders often deal with excessive information from multiple sources like news feeds, charts, alerts, and social media. This flood of data can lead to confusion and missed important signals. Switching between many platforms wastes time and breaks focus.
              </p>

              <p className="mb-6">
                Too many tabs, apps, or notifications can cause mental fatigue. This makes it harder to analyze trades clearly. Without a streamlined setup, traders risk making poor decisions due to scattered attention and unreliable information.
              </p>

              <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-accent/10 mb-8">
                <p className="font-semibold text-accent">
                  A clear and organized workspace helps reduce distractions. Keeping essential tools together improves efficiency and allows traders to focus on key data without feeling overwhelmed.
                </p>
              </div>
            </section>

            <CallToAction />
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default TradingArticle;
