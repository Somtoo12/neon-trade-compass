
import React from 'react';

const KeyTakeaways = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mt-12 mb-6">Key Takeaways</h2>
      <ul className="list-none space-y-4">
        <li className="flex items-start gap-3">
          <span className="text-neon-green">•</span>
          Trading with scattered tools can lower focus and increase errors
        </li>
        <li className="flex items-start gap-3">
          <span className="text-neon-blue">•</span>
          A unified command center combines key trading tools for better control
        </li>
        <li className="flex items-start gap-3">
          <span className="text-neon-purple">•</span>
          PipCraft provides a free, easy-to-use platform that improves trading efficiency
        </li>
      </ul>
    </section>
  );
};

export default KeyTakeaways;
