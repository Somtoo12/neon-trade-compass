
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Copy, Trash, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
}

const CharacterCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });
  const [limit, setLimit] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Analyze text whenever it changes
  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    
    // Average reading speed is about 200-250 words per minute
    const readingTime = words / 200;
    
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    });
  }, [text]);
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };
  
  const handleClearText = () => {
    setText('');
    toast({
      title: "Cleared",
      description: "Text has been cleared",
    });
  };
  
  const formatReadingTime = (minutes: number): string => {
    if (minutes < 1) {
      return "Less than a minute";
    } else if (minutes < 1.5) {
      return "About 1 minute";
    } else {
      return `About ${Math.round(minutes)} minutes`;
    }
  };
  
  const getProgressColor = () => {
    if (!limit) return 'bg-primary';
    
    const percentage = (stats.characters / limit) * 100;
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <AppLayout activeSection="utilities" setActiveSection={() => {}}>
      <Helmet>
        <title>Character Counter | PipCraft Tools</title>
        <meta name="description" content="Count characters, words, sentences, and more with our real-time text analyzer. Perfect for social media posts, essays, and content creation." />
        <link rel="canonical" href="https://pipcrafts.com/character-counter" />
      </Helmet>

      <div className="container mx-auto max-w-4xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pt-4 pb-16"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
              Character Counter
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Count characters, words, sentences and more. Perfect for Twitter, essays, SEO content, and character-limited applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <Card className="border-border/50 backdrop-blur-sm bg-card/30 h-full">
                <CardContent className="p-5 md:p-6 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <Timer className="h-5 w-5 mr-2 text-primary" />
                        <h2 className="text-lg font-medium">Text Analyzer</h2>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleCopyToClipboard}
                          disabled={!text}
                          className="min-h-[36px]"
                        >
                          <Copy className="h-4 w-4 mr-1" /> Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleClearText}
                          disabled={!text}
                          className="min-h-[36px]"
                        >
                          <Trash className="h-4 w-4 mr-1" /> Clear
                        </Button>
                      </div>
                    </div>
                    
                    <div className="relative flex-grow">
                      <textarea 
                        className="w-full min-h-[300px] p-4 rounded-md border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                        placeholder="Type or paste your text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      ></textarea>
                      
                      {limit && (
                        <div className="absolute bottom-4 right-4 text-sm">
                          <span className={stats.characters > limit ? "text-red-500 font-medium" : ""}>
                            {stats.characters}
                          </span>
                          <span className="text-muted-foreground">/{limit}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Character limit progress bar */}
                    {limit && (
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor()} transition-all duration-300`}
                            style={{ width: `${Math.min((stats.characters / limit) * 100, 100)}%` }}
                          ></div>
                        </div>
                        
                        {stats.characters > limit && (
                          <div className="flex items-center mt-2 text-sm text-red-500">
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            <span>{stats.characters - limit} characters over the limit</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="border-border/50 backdrop-blur-sm bg-card/30 h-full">
                <CardContent className="p-5 md:p-6">
                  <h3 className="font-medium mb-4">Text Statistics</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Characters</span>
                      <span className="font-medium">{stats.characters}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Characters (no spaces)</span>
                      <span className="font-medium">{stats.charactersNoSpaces}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Words</span>
                      <span className="font-medium">{stats.words}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Sentences</span>
                      <span className="font-medium">{stats.sentences}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Paragraphs</span>
                      <span className="font-medium">{stats.paragraphs}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Reading Time</span>
                      <span className="font-medium">{formatReadingTime(stats.readingTime)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium mb-2">Character Limits</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => setLimit(280)} className="min-h-[36px]">
                        Twitter (280)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setLimit(2200)} className="min-h-[36px]">
                        Instagram (2,200)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setLimit(5000)} className="min-h-[36px]">
                        Facebook (5,000)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setLimit(1500)} className="min-h-[36px]">
                        LinkedIn (1,500)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setLimit(300)} className="min-h-[36px]">
                        Meta Title (300)
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setLimit(null)} className="min-h-[36px]">
                        No Limit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <article className="prose prose-sm dark:prose-invert max-w-none mt-8 px-4">
            <h2 className="text-xl font-semibold mb-3">Why Count Characters?</h2>
            <p>
              Character counting is essential for various platforms with specific limits, such as social media posts, meta descriptions, and SMS messages. Our real-time character counter helps ensure your content fits within these constraints while providing additional insights about your text.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Content Optimization</h2>
            <p>
              Understanding your text statistics helps optimize content for different purposes. Word counts are useful for essays and articles, while character counts are critical for SEO elements like meta titles and descriptions. For optimal social media engagement, staying within character limits while maintaining your message is key.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Writing Efficiency</h2>
            <p>
              The Character Counter tool helps improve writing efficiency by showing real-time statistics as you type. This allows you to be more concise and impactful with your messaging. For traders documenting their strategies in our <Link to="/trade-journal" className="text-primary hover:underline">Trade Journal</Link>, this tool can help keep trade descriptions clear and focused.
            </p>
          </article>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default CharacterCounter;
