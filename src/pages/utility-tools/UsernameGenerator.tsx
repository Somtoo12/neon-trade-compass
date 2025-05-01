
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, CopyIcon, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const UsernameGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [usernames, setUsernames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  const adjectives = [
    'Amazing', 'Brave', 'Clever', 'Dynamic', 'Epic', 'Fierce', 'Glorious', 
    'Happy', 'Incredible', 'Jolly', 'Kind', 'Lucky', 'Mighty', 'Noble', 
    'Optimal', 'Powerful', 'Quick', 'Radical', 'Super', 'Talented', 'Ultimate', 
    'Vibrant', 'Wise', 'Xenial', 'Youthful', 'Zealous', 'Brilliant', 'Creative', 
    'Dazzling', 'Energetic'
  ];
  
  const nouns = [
    'Ace', 'Boss', 'Champion', 'Dragon', 'Eagle', 'Fox', 'Genius', 'Hero', 
    'Icon', 'Joker', 'Knight', 'Legend', 'Master', 'Ninja', 'Owl', 'Phoenix', 
    'Queen', 'Ranger', 'Samurai', 'Titan', 'Unicorn', 'Vampire', 'Warrior', 
    'Xenon', 'Yeti', 'Zeus', 'Paladin', 'Rogue', 'Sage', 'Templar'
  ];

  const generateUsernames = () => {
    if (!keyword || keyword.trim() === '') {
      toast({
        title: "Keyword required",
        description: "Please enter a name or keyword to generate usernames.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    const cleanKeyword = keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const results: string[] = [];
    
    // Add some random generated usernames
    for (let i = 0; i < 15 && results.length < 15; i++) {
      const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
      const randomNum = Math.floor(Math.random() * 1000);
      
      const usernameOptions = [
        `${randomAdjective}${cleanKeyword}${Math.floor(Math.random() * 99)}`,
        `${cleanKeyword}${randomNoun}`,
        `${randomAdjective}${randomNoun}${cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1)}`,
        `${cleanKeyword}_${randomNoun}`,
        `The${randomAdjective}${cleanKeyword}`,
        `${cleanKeyword}${randomNum}`,
        `${randomAdjective}${cleanKeyword}`,
        `${cleanKeyword}${randomNoun}${Math.floor(Math.random() * 99)}`,
        `${cleanKeyword.charAt(0).toUpperCase()}${randomAdjective}${randomNum}`,
        `${randomNoun}${cleanKeyword.charAt(0).toUpperCase() + cleanKeyword.slice(1)}`,
        `${cleanKeyword}_${randomAdjective}${Math.floor(Math.random() * 10)}`,
        `${randomNoun}_${cleanKeyword}`,
        `${cleanKeyword}The${randomAdjective}`,
        `${randomAdjective}_${cleanKeyword}_${randomNum % 100}`,
        `${cleanKeyword}Is${randomAdjective}`
      ];
      
      // Get a random username from the options and ensure no duplicates
      const newUsername = usernameOptions[Math.floor(Math.random() * usernameOptions.length)];
      if (!results.includes(newUsername)) {
        results.push(newUsername);
      }
    }
    
    setUsernames(results);
    setIsGenerating(false);
  };
  
  const copyUsername = (username: string) => {
    navigator.clipboard.writeText(username);
    toast({
      title: "Username copied",
      description: `"${username}" copied to clipboard.`
    });
  };
  
  const handleGenerateMore = () => {
    generateUsernames();
  };

  return (
    <AppLayout activeSection="username-generator" setActiveSection={() => {}}>
      <SEO 
        title="Username Generator | Create Unique Usernames | PipCraft Tools" 
        description="Generate creative and unique username ideas for social media, gaming, or any online platform. Just enter a keyword and get instant username suggestions."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Username Generator</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate creative username ideas for social media, gaming, or any online platform.
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="keyword" className="block text-sm font-medium mb-1">
                    Enter name or keyword:
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="keyword"
                      type="text"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="e.g. dragon, alex, gamer"
                      className="flex-1"
                    />
                    <Button 
                      onClick={generateUsernames} 
                      disabled={isGenerating}
                      className="flex items-center gap-2"
                    >
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </div>
                
                {usernames.length > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-medium">Username Ideas:</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleGenerateMore}
                        className="flex items-center gap-1"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Generate More
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {usernames.map((username, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2.5 rounded-md border border-border/50 bg-secondary/10 hover:bg-secondary/30 transition-colors"
                        >
                          <span className="font-medium">{username}</span>
                          <Button variant="ghost" size="icon" onClick={() => copyUsername(username)}>
                            <CopyIcon className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Username Generator</h2>
            <p>
              The Username Generator is a creative tool designed to help you find unique and appealing 
              usernames for your social media accounts, gaming profiles, forums, or any online platform 
              where you need to establish your digital identity. Coming up with a username that is both 
              available and reflects your personality can be challenging, which is why this tool combines 
              your input with creative elements to generate multiple options.
            </p>
            
            <p>
              A good username is memorable, distinctive, and often says something about who you are or what 
              you enjoy. By entering a keyword that's meaningful to you—perhaps your name, a hobby, or an 
              interest—our generator creates variations by combining it with adjectives, nouns, and numbers 
              in different patterns. This approach ensures that the suggestions remain personally relevant 
              while being unique enough to stand out.
            </p>
            
            <p>
              The generator creates a diverse range of username styles, from professional to playful, 
              allowing you to choose one that best fits the platform and purpose. For gaming, you might 
              prefer something bold and action-oriented, while for professional networks, something more 
              subdued might be appropriate.
            </p>
            
            <p>
              Finding the perfect username is important because it often becomes your primary identifier in online 
              communities. With our generator, you can quickly explore multiple options and find one that 
              represents you well. Once you've found a username you like, you can easily copy it to your clipboard 
              with a single click. For additional online identity tools, try our <a href="/password-generator" className="text-primary hover:underline">Password Generator</a> 
              to create secure passwords, or explore our <a href="/tools" className="text-primary hover:underline">complete collection of utility tools</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default UsernameGenerator;
