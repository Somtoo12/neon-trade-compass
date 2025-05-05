import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplet } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';
import BlogPost from '@/components/shared/BlogPost';
import { Link } from 'react-router-dom';

const DailyWaterIntakeCalculator: React.FC = () => {
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [result, setResult] = useState<{liters: number; oz: number} | null>(null);
  const [error, setError] = useState<string>('');

  const calculateWaterIntake = () => {
    setError('');

    // Validation
    if (!age || !weight) {
      setError('Please fill in all fields');
      return;
    }

    const ageNum = parseInt(age);
    let weightNum = parseFloat(weight);

    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setError('Please enter a valid age between 1 and 120');
      return;
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      setError('Please enter a valid weight');
      return;
    }

    // Convert pounds to kg if needed
    if (weightUnit === 'lb') {
      weightNum = weightNum * 0.453592;
    }

    // Base calculation: 30-35ml per kg of body weight
    let baseIntake = weightNum * 30;

    // Adjust for age
    if (ageNum > 65) {
      baseIntake *= 0.9; // Less water for elderly
    } else if (ageNum < 18) {
      baseIntake *= 1.1; // More water for younger people
    }

    // Adjust for activity level
    switch (activityLevel) {
      case 'sedentary':
        baseIntake *= 0.85;
        break;
      case 'moderate':
        // No adjustment for moderate (default)
        break;
      case 'active':
        baseIntake *= 1.15;
        break;
      case 'very-active':
        baseIntake *= 1.3;
        break;
      default:
        break;
    }

    // Convert to liters (ml / 1000)
    const liters = parseFloat((baseIntake / 1000).toFixed(2));
    // Convert to fluid oz (liters * 33.814)
    const oz = parseFloat((liters * 33.814).toFixed(2));

    setResult({ liters, oz });
  };

  const waterIntakeBlogContent = (
    <div className="space-y-8">
      <h2 id="daily-hydration-guide" className="text-2xl font-semibold mt-8">Daily Hydration Guide: Understanding Your Water Needs</h2>
      
      <p className="text-muted-foreground text-lg leading-relaxed">
        Proper hydration is one of the most fundamental yet overlooked aspects of health and wellness. 
        The human body is approximately 60% water, and maintaining optimal hydration levels is essential 
        for virtually every bodily function. Our Daily Water Intake Calculator helps you determine exactly 
        how much water your unique body needs each day for peak performance and health.
      </p>
      
      <h3 id="importance-of-proper-hydration" className="text-xl font-semibold mt-8">The Importance of Proper Hydration</h3>
      
      <p>
        Water isn't just a thirst quencher—it's a critical component of your body's operating system. 
        Adequate <strong>daily water consumption</strong> supports:
      </p>
      
      <ul className="list-disc pl-6 space-y-3 my-6">
        <li>
          <strong>Cognitive Function</strong>: Even mild dehydration can impair concentration, memory, and mood. 
          Proper hydration helps maintain mental clarity and focus throughout the day.
        </li>
        <li>
          <strong>Physical Performance</strong>: Whether you're an athlete or simply going about your daily activities, 
          proper hydration is essential for muscle function, joint lubrication, and temperature regulation.
        </li>
        <li>
          <strong>Digestive Health</strong>: Water helps break down food, absorb nutrients, and transport waste out 
          of the body. It's essential for preventing constipation and maintaining digestive efficiency.
        </li>
        <li>
          <strong>Kidney Function</strong>: Your kidneys require adequate water to filter waste products efficiently. 
          Proper hydration helps prevent kidney stones and urinary tract infections.
        </li>
        <li>
          <strong>Skin Health</strong>: Well-hydrated skin appears more plump, elastic, and radiant. While water isn't 
          a miracle cure for skin issues, chronic dehydration can contribute to dryness and premature aging.
        </li>
      </ul>
      
      <h3 id="signs-of-dehydration" className="text-xl font-semibold mt-8">Signs You're Not Drinking Enough Water</h3>
      
      <p>
        Many people walk around mildly dehydrated without even realizing it. Some common signs of <strong>inadequate water intake</strong> include:
      </p>
      
      <ul className="list-disc pl-6 space-y-3 my-6">
        <li>Dark yellow urine (light straw-colored urine indicates good hydration)</li>
        <li>Feeling thirsty (note that by the time you feel thirst, you're already mildly dehydrated)</li>
        <li>Dry mouth, lips, and skin</li>
        <li>Headaches</li>
        <li>Fatigue or low energy</li>
        <li>Dizziness or lightheadedness</li>
        <li>Infrequent urination or decreased urine output</li>
        <li>Constipation</li>
      </ul>
      
      <h3 id="factors-affecting-water-needs" className="text-xl font-semibold mt-8">Factors That Affect Your Daily Water Needs</h3>
      
      <p>
        The old advice to "drink eight 8-ounce glasses of water daily" (known as the 8×8 rule) is a 
        decent starting point, but it doesn't account for individual differences. Our <strong>personalized 
        hydration calculator</strong> considers several key factors that influence your specific water requirements:
      </p>
      
      <ol className="list-decimal pl-6 space-y-3 my-6">
        <li>
          <strong>Body Weight</strong>: Larger bodies contain more water and generally require more fluid 
          intake. Our calculator uses your weight as a primary factor in determining your base hydration needs.
        </li>
        <li>
          <strong>Age</strong>: Hydration needs change throughout the lifespan. Children often need proportionally 
          more water than adults, while older adults may have a diminished thirst response and need to be more 
          conscious about their fluid intake.
        </li>
        <li>
          <strong>Activity Level</strong>: Physical activity increases water loss through sweat and respiration. 
          The more active you are, the more water you need to replace these losses and maintain optimal hydration.
        </li>
        <li>
          <strong>Climate</strong>: Hot, humid environments increase water loss through sweat, while dry environments 
          can increase water loss through respiration. High altitudes can also increase hydration needs.
        </li>
        <li>
          <strong>Health Status</strong>: Certain medical conditions and medications can affect hydration needs. 
          Fever, vomiting, diarrhea, and some medications can increase fluid loss and necessitate greater intake.
        </li>
        <li>
          <strong>Pregnancy and Breastfeeding</strong>: Women who are pregnant or breastfeeding have increased 
          fluid needs to support the developing baby or milk production.
        </li>
      </ol>
      
      <h3 id="how-to-use-calculator" className="text-xl font-semibold mt-8">How to Use the Daily Water Intake Calculator</h3>
      
      <p>
        Our <strong>water consumption calculator</strong> makes it easy to determine your personal hydration needs:
      </p>
      
      <ol className="list-decimal pl-6 space-y-3 my-6">
        <li>
          <strong>Enter your age</strong>: Input your age in years. The calculator adjusts recommendations slightly 
          for different age groups.
        </li>
        <li>
          <strong>Enter your weight</strong>: Input your current weight and select the unit (kg or lb). Weight is 
          a key factor in determining your base hydration needs.
        </li>
        <li>
          <strong>Select your activity level</strong>: Choose from sedentary (little to no exercise), moderate 
          (exercise 1-3 times/week), active (exercise 4-5 times/week), or very active (daily exercise or physical job).
        </li>
        <li>
          <strong>Click "Calculate Water Intake"</strong>: The calculator will process your information and provide 
          your recommended daily water intake in both liters and fluid ounces.
        </li>
      </ol>
      
      <p>
        In seconds, you'll have a personalized <strong>hydration recommendation</strong> based on your unique 
        characteristics and lifestyle.
      </p>
      
      <h3 id="understanding-results" className="text-xl font-semibold mt-8">Understanding Your Results</h3>
      
      <p>
        The calculator provides your recommended daily water intake in two common measurements:
      </p>
      
      <ul className="list-disc pl-6 space-y-3 my-6">
        <li>
          <strong>Liters</strong>: The metric measurement commonly used for water bottles and scientific measurements.
        </li>
        <li>
          <strong>Fluid Ounces</strong>: The imperial measurement common in the US and some other countries.
        </li>
      </ul>
      
      <p>
        This result represents your total daily fluid needs from drinking water and other beverages. Remember that about 
        20% of your daily water intake typically comes from food, particularly fruits and vegetables with high water content.
      </p>
      
      <h3 id="practical-tips" className="text-xl font-semibold mt-8">Practical Tips for Staying Properly Hydrated</h3>
      
      <p>
        Knowing your daily water target is one thing—actually consuming that amount consistently is another. Here are some 
        practical strategies to help you meet your <strong>optimal daily water intake</strong>:
      </p>
      
      <ul className="list-disc pl-6 space-y-3 my-6">
        <li>
          <strong>Start your day with water</strong>: Drink a glass of water first thing in the morning to rehydrate after sleep.
        </li>
        <li>
          <strong>Carry a reusable water bottle</strong>: Having water readily available makes it easier to sip throughout the day.
        </li>
        <li>
          <strong>Set regular reminders</strong>: Use smartphone alerts or apps designed to remind you to drink water at regular intervals.
        </li>
        <li>
          <strong>Flavor your water</strong>: If plain water is unappealing, try adding slices of fruit, cucumber, or herbs like mint 
          for natural flavor without calories.
        </li>
        <li>
          <strong>Eat water-rich foods</strong>: Fruits and vegetables like watermelon, cucumber, oranges, and strawberries have high 
          water content and contribute to your daily intake.
        </li>
        <li>
          <strong>Track your intake</strong>: Use a water tracking app or simply mark a tally on your water bottle to ensure you're 
          meeting your goals.
        </li>
        <li>
          <strong>Drink before, during, and after exercise</strong>: Physical activity increases your hydration needs, so be sure to 
          drink extra water around workouts.
        </li>
      </ul>
      
      <h3 id="hydration-myths" className="text-xl font-semibold mt-8">Common Hydration Myths Debunked</h3>
      
      <p>
        There's a lot of misinformation about hydration. Let's address some common myths:
      </p>
      
      <h4>Myth 1: Coffee and tea are dehydrating</h4>
      <p>
        While caffeine has a mild diuretic effect, caffeinated beverages like coffee and tea still contribute positively to your 
        daily fluid balance. However, water remains the ideal hydration source.
      </p>
      
      <h4>Myth 2: You need to drink 8 glasses of water every day</h4>
      <p>
        The 8×8 rule (eight 8-ounce glasses) is easy to remember but not scientifically based. Individual hydration needs vary 
        widely based on the factors we've discussed. Our <strong>daily water intake calculator online</strong> provides a more 
        personalized recommendation.
      </p>
      
      <h4>Myth 3: If you're not thirsty, you're hydrated enough</h4>
      <p>
        Thirst is not always a reliable indicator of hydration status, especially in older adults. By the time you feel thirsty, 
        you may already be slightly dehydrated.
      </p>
      
      <h4>Myth 4: You can't drink too much water</h4>
      <p>
        While uncommon, it is possible to drink too much water, leading to a condition called hyponatremia (low sodium levels). 
        This is most common in endurance athletes who drink excessive amounts without replacing electrolytes.
      </p>
      
      <h3 id="special-circumstances" className="text-xl font-semibold mt-8">Special Hydration Circumstances</h3>
      
      <p>
        Certain situations require adjustments to your normal hydration routine:
      </p>
      
      <ul className="list-disc pl-6 space-y-3 my-6">
        <li>
          <strong>Exercise</strong>: For workouts lasting less than an hour, water is usually sufficient. For longer or more 
          intense sessions, consider sports drinks with electrolytes.
        </li>
        <li>
          <strong>Illness</strong>: Fever, vomiting, or diarrhea can quickly lead to dehydration. Increase fluid intake and 
          consider oral rehydration solutions that replace lost electrolytes.
        </li>
        <li>
          <strong>Pregnancy and breastfeeding</strong>: Women who are pregnant need about 10 cups (2.4 liters) of fluid daily, 
          while breastfeeding mothers need about 13 cups (3.1 liters).
        </li>
        <li>
          <strong>Air travel</strong>: The low humidity environment in airplane cabins can accelerate dehydration. Drink extra 
          water before and during flights.
        </li>
        <li>
          <strong>Altitude</strong>: Higher elevations increase respiration rate and urine output, accelerating fluid loss. 
          Increase water intake when at high altitudes.
        </li>
      </ul>
      
      <h3 id="related-tools" className="text-xl font-semibold mt-8">Related Health Tools at PipCraft</h3>
      
      <p>
        For a comprehensive approach to health and wellness, consider using these related tools:
      </p>
      
      <ul className="list-disc pl-6 space-y-3 my-6">
        <li>
          <Link to="/grade-calculator" className="text-primary hover:underline">GPA Calculator</Link> - 
          Track your academic progress while staying hydrated for optimal cognitive performance
        </li>
        <li>
          <Link to="/countdown-timer" className="text-primary hover:underline">Countdown Timer</Link> - 
          Set reminders to drink water throughout the day
        </li>
        <li>
          <Link to="/unit-converter" className="text-primary hover:underline">Unit Converter</Link> - 
          Convert between different measurement systems
        </li>
        <li>
          <Link to="/character-counter" className="text-primary hover:underline">Character Counter</Link> - 
          Useful for tracking and journaling your hydration habits
        </li>
      </ul>
      
      <h3 id="conclusion" className="text-xl font-semibold mt-8">Conclusion: Hydration for Optimal Health</h3>
      
      <p>
        Proper hydration is a cornerstone of good health that affects virtually every system in your body. Our 
        <strong> water intake calculator</strong> takes the guesswork out of determining your personal hydration needs, 
        accounting for your unique characteristics and lifestyle factors.
      </p>
      
      <p>
        Remember that water needs can change based on circumstances like weather, illness, and activity level. Use our 
        calculator as a baseline guideline and adjust as needed. Pay attention to your body's signals and the color of your 
        urine—pale yellow generally indicates good hydration.
      </p>
      
      <p>
        By maintaining proper hydration, you're supporting your body's essential functions, from cognitive performance to 
        physical endurance, digestive health, and beyond. It's one of the simplest yet most impactful steps you can take 
        toward overall wellness.
      </p>
      
      <h3 id="faqs" className="text-xl font-semibold mt-8">Frequently Asked Questions About Water Intake</h3>
      
      <h4>How do I know if I'm drinking enough water?</h4>
      <p>
        The most reliable indicator is the color of your urine. Pale straw to light yellow suggests adequate hydration, while 
        dark yellow or amber indicates you need more water. Other signs of good hydration include regular urination, moist 
        lips and tongue, and good skin elasticity.
      </p>
      
      <h4>Do other beverages count toward my daily water intake?</h4>
      <p>
        Yes, most beverages contribute to your hydration status, including tea, coffee, milk, and juice. However, water is 
        still the ideal choice as it contains no calories, sugar, or additives. Alcoholic beverages have a diuretic effect 
        and may contribute to dehydration if consumed in large quantities.
      </p>
      
      <h4>How should I adjust my water intake during exercise?</h4>
      <p>
        A good rule of thumb is to drink about 16-20 oz (0.5-0.6 liters) of water 1-2 hours before exercise, 8 oz (0.2 liters) 
        every 15-20 minutes during exercise, and at least 16-24 oz (0.5-0.7 liters) after exercise for every pound of weight 
        lost during the activity.
      </p>
      
      <h4>Can drinking more water help with weight management?</h4>
      <p>
        Water can support weight management in several ways. It has zero calories, can help you feel fuller before meals, 
        and may slightly boost metabolism. Drinking water instead of caloric beverages like soda or juice can significantly 
        reduce your overall calorie intake.
      </p>
      
      <h4>Is bottled water better than tap water?</h4>
      <p>
        Not necessarily. In many developed countries, tap water meets strict safety standards and is thoroughly tested. 
        Bottled water is convenient but has environmental drawbacks due to plastic waste. If you're concerned about tap water 
        quality, consider using a water filter rather than relying on bottled water.
      </p>
    </div>
  );

  return (
    <AppLayout activeSection="daily-water-intake-calculator" setActiveSection={() => {}}>
      <SEO 
        title="Daily Water Intake Calculator | Hydration Needs Calculator | PipCraft Tools" 
        description="Calculate your personalized daily water intake based on age, weight, and activity level with our free water intake calculator. Stay optimally hydrated for better health and wellness."
      />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Daily Water Intake Calculator</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Calculate your recommended daily water intake based on your age, weight, and activity level.
            </p>
          </div>

          <Card className="border border-border/50 shadow-lg">
            <CardContent className="pt-8 pb-8 space-y-6">
              <div>
                <label htmlFor="age" className="block text-md font-medium mb-2">
                  Age:
                </label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="text-lg"
                />
              </div>

              <div>
                <label htmlFor="weight" className="block text-md font-medium mb-2">
                  Weight:
                </label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    min="1"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter your weight"
                    className="flex-1 text-lg"
                  />
                  <Select 
                    value={weightUnit} 
                    onValueChange={(val) => setWeightUnit(val as 'kg' | 'lb')}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label htmlFor="activity" className="block text-md font-medium mb-2">
                  Activity Level:
                </label>
                <Select 
                  value={activityLevel} 
                  onValueChange={setActivityLevel}
                >
                  <SelectTrigger id="activity" className="w-full text-lg">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                    <SelectItem value="moderate">Moderate (Exercise 1-3 times/week)</SelectItem>
                    <SelectItem value="active">Active (Exercise 4-5 times/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (Daily exercise or physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full text-lg py-6" 
                size="lg" 
                onClick={calculateWaterIntake}
              >
                Calculate Water Intake
              </Button>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {result && (
                <div className="mt-8 p-6 bg-secondary/20 rounded-lg border border-border/40">
                  <h3 className="text-lg font-medium mb-5 text-center">Your Recommended Daily Water Intake:</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col items-center p-4 bg-background/50 rounded-md">
                      <div className="text-5xl font-semibold text-primary mb-3">{result.liters}</div>
                      <p className="text-muted-foreground">Liters</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-background/50 rounded-md">
                      <div className="text-5xl font-semibold text-primary mb-3">{result.oz}</div>
                      <p className="text-muted-foreground">Fluid Ounces</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="prose prose-lg dark:prose-invert max-w-none bg-secondary/10 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">About Daily Water Intake Calculator</h2>
            <p>
              The Daily Water Intake Calculator is a useful tool for determining how much water your body needs 
              to stay properly hydrated. While the general recommendation of eight 8-ounce glasses (about 2 liters) 
              per day is widely known, individual hydration needs can vary significantly based on several factors.
            </p>
            
            <p>
              This calculator takes into account your age, weight, and activity level to provide a personalized 
              hydration recommendation. Weight is a primary factor because larger bodies contain more water and 
              require more fluid to maintain optimal hydration. Age is considered because hydration needs change 
              throughout the lifespan, with older adults often requiring more conscious attention to fluid intake.
            </p>
            
            <p>
              Activity level significantly impacts water requirements as well. More active individuals lose more 
              water through sweat and respiration and therefore need increased fluid intake. Our calculator adjusts 
              the base recommendation accordingly, with modifications for sedentary, moderately active, active, and 
              very active lifestyles.
            </p>
            
            <p>
              Maintaining proper hydration is essential for numerous bodily functions, including temperature regulation, 
              joint lubrication, infection prevention, organ function, and delivering nutrients to cells. By using this 
              calculator regularly and adjusting for changing circumstances like weather or illness, you can ensure 
              you're getting the right amount of water for your unique needs. For more health-related tools, try our 
              <Link to="/bmi-calculator" className="text-primary hover:underline"> BMI Calculator</Link> or explore our complete 
              <Link to="/tools" className="text-primary hover:underline"> suite of utility tools</Link>.
            </p>
          </div>
          
          <BlogPost 
            title="The Complete Guide to Daily Hydration"
            content={waterIntakeBlogContent}
          />
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DailyWaterIntakeCalculator;
