
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const ForexCalculator = () => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only run this if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Create script for remote widgets
      const remoteWidgetScript = document.createElement('script');
      remoteWidgetScript.src = 'https://www.cashbackforex.com/Content/remote/remote-widgets.js';
      remoteWidgetScript.async = true;
      
      // Create script for calculator configuration
      const calculatorScript = document.createElement('script');
      calculatorScript.textContent = `
        if (typeof RemoteCalc === 'function') {
          RemoteCalc({
            "Url":"https://www.cashbackforex.com",
            "TopPaneStyle":"YmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KCMzNDM1NDAgMCUsICMyNDI4MzEgMTAwJSk7IApjb2xvcjogd2hpdGU7IApib3JkZXItYm90dG9tOiBub25lOw==",
            "BottomPaneStyle":"YmFja2dyb3VuZDogIzE1MTgxZDsgCmJvcmRlcjogc29saWQgMHB4ICMyYTJlMzk7IApjb2xvcjogIzkxOTRhMTs=",
            "ButtonStyle":"YmFja2dyb3VuZDogIzAwRkY1QTsgCmNvbG9yOiBibGFjazsgCmJvcmRlci1yYWRpdXM6IDhweDsgCmZvbnQtd2VpZ2h0OiBib2xkOwo=",
            "TitleStyle":"dGV4dC1hbGlnbjogbGVmdDsgCmZvbnQtc2l6ZTogMzBweDsgCmZvbnQtd2VpZ2h0OiA2MDA7IApjb2xvcjogd2hpdGU7Cg==",
            "TextboxStyle":"YmFja2dyb3VuZDogIzE1MTgxZDsgCmNvbG9yOiAjOTE5NGExOyAKYm9yZGVyOiBzb2xpZCAxcHggIzJhMmUzOTsgCmJvcmRlci1yYWRpdXM6IDZweDsKCg==",
            "ContainerWidth": "${isMobile ? window.innerWidth - 40 : Math.min(window.innerWidth - 100, 700)}",
            "HighlightColor":"rgba(0,0,0,1.0)",
            "IsDisplayTitle":false,
            "IsShowChartLinks":true,
            "IsShowEmbedButton":true,
            "CompactType":"${isMobile ? 'small' : 'large'}",
            "Calculator":"pip-value-calculator",
            "ContainerId":"pip-value-calculator-160495"
          });
        } else {
          console.error('RemoteCalc is not defined. Make sure the script is loaded properly.');
        }
      `;
      
      // Clear previous content and append scripts
      if (calculatorRef.current) {
        // Append scripts to the container
        calculatorRef.current.innerHTML = '<div id="pip-value-calculator-160495" class="mx-auto"></div>';
        calculatorRef.current.appendChild(remoteWidgetScript);
        
        // Add calculator script after remote widget script is loaded
        remoteWidgetScript.onload = () => {
          calculatorRef.current?.appendChild(calculatorScript);
        };
      }

      // Clean up on unmount
      return () => {
        if (calculatorRef.current) {
          calculatorRef.current.innerHTML = '';
        }
      };
    }
  }, [isMobile]);

  return (
    <div className="space-y-8">
      <div className="sticky top-0 py-2 md:py-3 bg-background/90 backdrop-blur-lg z-10 border-b border-border/30 -mx-3 md:-mx-4 px-3 md:px-4">
        <h2 className="text-lg md:text-xl font-bold font-poppins">
          Forex Pip Value Calculator
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Calculate exact pip values for precise position sizing and learn how to calculate pips in forex trading
        </p>
      </div>

      <Card className="p-4 md:p-6">
        {/* Calculator Container with responsive width */}
        <div 
          ref={calculatorRef} 
          className="calculator-container min-h-[400px] flex items-center justify-center overflow-x-auto w-full"
          title="Forex pip calculator for beginners - Calculate pip value with lot size"
        >
          <div className="text-muted-foreground flex flex-col items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
            Loading calculator...
          </div>
        </div>

        {/* SEO Article */}
        <div className="mt-12 prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6">How to Use Our Forex Pip Value Calculator to Improve Your Trading Precision</h2>
          
          <p className="mb-4">
            When it comes to successful forex trading, understanding your pip value is one of the most important factors. Every pip movement can mean the difference between making a profit or experiencing a loss. That's why we've made it easy for you with our free, intuitive Forex Pip Calculator for beginners.
          </p>

          <p className="mb-6">
            This tool is designed to help both beginners and advanced traders quickly determine the exact monetary value of each pip based on their lot size, currency pair, and market prices. With just a few simple inputs, you'll get immediate results that can help you plan your trades with precision, minimize unnecessary risks, and optimize your trading strategy.
          </p>

          <h3 className="text-xl font-bold mb-4">Why Pip Value Matters in Forex Trading</h3>
          <p className="mb-4">
            Pip value plays a critical role in every trade you place. A pip, which stands for "percentage in point," measures the smallest price movement in the forex market. Knowing the value of each pip in your base currency helps you to:
          </p>

          <ul className="list-disc pl-6 mb-6">
            <li>Size your trades appropriately</li>
            <li>Manage your risk with better stop-loss and take-profit levels</li>
            <li>Understand potential gains or losses before entering a position</li>
            <li>Maintain consistent risk management across all trades</li>
          </ul>

          <p className="mb-6">
            For instance, if you're trading EUR/USD and your pip value is $10 per pip at a standard lot size, every 10-pip movement could equal a $100 profit or loss. Without knowing your pip value in advance, you risk exposing your account to unintended volatility.
          </p>

          <h3 className="text-xl font-bold mb-4">How to Calculate Pips in Forex Trading</h3>
          <p className="mb-4">Our calculator was built with simplicity and speed in mind. Here's how to use it:</p>

          <ol className="list-decimal pl-6 mb-6">
            <li className="mb-2">Select Your Currency Pair: Choose the forex pair you are planning to trade, such as EUR/USD, GBP/JPY, or USD/CHF.</li>
            <li className="mb-2">Enter Your Lot Size: Specify the size of your trade (standard, mini, or micro lots). Our pip calculator for micro lots ensures precision even with smaller positions.</li>
            <li className="mb-2">Input Entry and Exit Prices: Although pip value is primarily based on lot size and currency pair, providing entry and exit prices ensures the tool is tailored to your specific trade idea.</li>
            <li>Click Calculate: Instantly receive the pip value result in your account's base currency, allowing you to adjust your risk accordingly before executing the trade.</li>
          </ol>

          <p className="mb-6">This simple, fast process ensures that every trade you make is backed by solid numbers, not guesswork.</p>

          <h3 className="text-xl font-bold mb-4">Why Choose PipCraft's Forex Pip Calculator</h3>
          <p className="mb-4">While there are many pip calculators available online, PipCraft's calculator is uniquely optimized for speed, clarity, and user-friendliness. Here's why traders trust it:</p>

          <ul className="list-disc pl-6 mb-6">
            <li>Instant Results: No waiting, no complicated forms—just input and calculate.</li>
            <li>Supports All Major and Minor Pairs: Whether you're trading USD/JPY or NZD/CAD, the tool adjusts to any pair.</li>
            <li>Responsive Design: Use it seamlessly on your desktop, tablet, or mobile device.</li>
            <li>Zero Guesswork: Always know your pip value before placing a trade, improving your discipline and consistency.</li>
          </ul>

          <p className="mb-6">
            Many successful traders know that precision in trading starts long before entering a trade. With PipCraft's pip calculator, you gain that precision every time you plan a new position.
          </p>

          <h3 className="text-xl font-bold mb-4">Pip Calculator for Different Currency Pairs</h3>
          <p className="mb-6">
            Different currency pairs have different pip values. For example, the pip value for EUR/USD will be different from USD/JPY or GBP/USD. Our calculator automatically adjusts for these differences, making it easy to compare potential profits or losses across different currency pairs.
          </p>

          <h3 className="text-xl font-bold mb-4">Trading Examples Using Pip Value</h3>
          <p className="mb-6">
            Let's say you are trading GBP/USD with a 0.10 lot size (a mini lot). If your calculated pip value is $1 per pip, a 50-pip gain would result in a $50 profit. Similarly, a 20-pip loss would mean a $20 loss.
          </p>

          <p className="mb-6">
            Without a pip calculator, you might underestimate or overestimate your exposure, leading to poor risk management. Smart traders always know their numbers first—and that's exactly what our tool helps you achieve.
          </p>

          <h3 className="text-xl font-bold mb-4">Forex Pip Calculator for Day Trading</h3>
          <p className="mb-4">
            Day traders in particular need to quickly calculate pip values as they enter and exit multiple positions throughout the trading session. Our calculator is perfect for day trading scenarios where speed and accuracy are crucial.
          </p>

          <p className="mb-4">
            For day traders who use scalping strategies, even small pip movements can add up to significant profits or losses. Our pip calculator for scalping strategy helps you determine exactly how much each pip is worth, allowing you to set precise take-profit and stop-loss levels.
          </p>

          <h3 className="text-xl font-bold mb-4">Final Thoughts: Master Your Trading with Precision</h3>
          <p className="mb-4">
            Risk management is the foundation of successful trading. Using our Forex Pip Value Calculator ensures that you have complete clarity over your potential trade outcomes before you even click "Buy" or "Sell."
          </p>

          <p className="mb-4">
            By using the PipCraft calculator before every trade, you can size your positions properly, avoid emotional decision-making, and trade with the confidence that you're controlling your risk at all times. Whether you're scalping, day trading, or swing trading, this tool is an essential part of your trading arsenal.
          </p>

          <p>
            Bookmark this page now, and make our Pip Value Calculator your go-to resource for every trade you take!
          </p>

          <div className="mt-8 bg-accent/10 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Frequently Asked Questions</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium">How do I calculate pip value manually?</h5>
                <p className="text-sm text-muted-foreground">
                  To calculate pip value manually, you need to know your lot size, account currency, and the currency pair you're trading. For standard USD pairs, a standard lot (100,000 units) has a pip value of $10, a mini lot (10,000 units) equals $1 per pip, and a micro lot (1,000 units) is worth $0.10 per pip.
                </p>
              </div>
              <div>
                <h5 className="font-medium">Is the pip calculator suitable for forex trading beginners?</h5>
                <p className="text-sm text-muted-foreground">
                  Yes, our forex pip calculator for beginners is designed to be intuitive and easy to use, making it perfect for those who are just starting their trading journey. Simply enter your lot size and currency pair to get instant results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ForexCalculator;
