
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Keyboard, RefreshCw } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const TypingSpeedTester: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [activeTextIndex, setActiveTextIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sampleTexts = [
    `The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet, making it a perfect test for typing practice. How fast can you type these words with accuracy?`,
    `In the world of software development, typing speed and accuracy are essential skills. Programmers spend hours writing code, documentation, and communicating with team members through text. Improving your typing abilities can significantly enhance productivity.`,
    `The art of effective communication begins with clear writing. Whether you're crafting emails, reports, or social media posts, the ability to type quickly and accurately helps translate your thoughts into words efficiently. Practice makes perfect!`,
    `Typing is a fundamental skill in today's digital world. From students taking notes to professionals preparing presentations, keyboard proficiency is invaluable. Regular practice with varied texts can help improve both speed and accuracy over time.`,
    `The history of typewriters dates back to the 1860s, revolutionizing written communication. Today's keyboards evolved from these early machines, though the standard QWERTY layout remains largely unchanged. Mastering this layout is essential for efficient typing.`
  ];

  useEffect(() => {
    // Start with a random sample text
    setActiveTextIndex(Math.floor(Math.random() * sampleTexts.length));
    setText(sampleTexts[activeTextIndex]);
  }, []);

  useEffect(() => {
    setText(sampleTexts[activeTextIndex]);
  }, [activeTextIndex]);

  useEffect(() => {
    // Start the timer when typing begins
    if (isStarted && !isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    // Clear the timer when finished
    if (isFinished && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Clean up interval on component unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isFinished]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateWpm = (text: string, timeInSeconds: number) => {
    // Standard calculation: (characters typed / 5) / minutes elapsed
    const words = text.trim().split(/\s+/).length;
    const minutes = timeInSeconds / 60;
    return Math.round(words / minutes);
  };

  const calculateAccuracy = (original: string, typed: string) => {
    // Count the number of correct characters
    let correctChars = 0;
    const minLength = Math.min(original.length, typed.length);
    
    for (let i = 0; i < minLength; i++) {
      if (original[i] === typed[i]) {
        correctChars++;
      }
    }
    
    return Math.round((correctChars / original.length) * 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Start timer on first keystroke
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
      setIsStarted(true);
    }
    
    setUserInput(value);
    
    // Check if typing is complete
    if (value === text) {
      const endTimeMs = Date.now();
      setEndTime(endTimeMs);
      const timeElapsed = (endTimeMs - (startTime || 0)) / 1000; // in seconds
      setElapsedTime(timeElapsed);
      setWpm(calculateWpm(text, timeElapsed));
      setAccuracy(calculateAccuracy(text, value));
      setIsFinished(true);
    }
  };

  const restartTest = (newTextIndex: number = -1) => {
    // Choose next sample text or specific one if provided
    let nextIndex;
    if (newTextIndex >= 0) {
      nextIndex = newTextIndex;
    } else {
      // Choose a different text than current
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * sampleTexts.length);
      } while (randomIndex === activeTextIndex && sampleTexts.length > 1);
      nextIndex = randomIndex;
    }
    
    setActiveTextIndex(nextIndex);
    setText(sampleTexts[nextIndex]);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(null);
    setAccuracy(null);
    setElapsedTime(null);
    setIsStarted(false);
    setIsFinished(false);
    setTimer(0);
    
    // Focus on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  return (
    <AppLayout activeSection="typing-speed-tester" setActiveSection={() => {}}>
      <SEO 
        title="Typing Speed Tester | WPM and Accuracy Measurement | PipCraft Tools" 
        description="Test and improve your typing speed and accuracy with our free Typing Speed Tester. Measure your WPM (Words Per Minute) and track your progress over time."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Typing Speed Tester</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Test your typing speed and accuracy with our simple and effective typing test.
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Text to Type:</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {isStarted && !isFinished ? formatTime(timer) : '00:00'}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => restartTest()} 
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> New Text
                  </Button>
                </div>
              </div>
              
              <div className="p-4 bg-secondary/20 rounded-md mb-4">
                <p className="whitespace-pre-wrap break-words">{text}</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="typing-input" className="block text-sm font-medium">
                  Type the text above:
                </label>
                <Textarea
                  ref={textareaRef}
                  id="typing-input"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Start typing here..."
                  className="min-h-32 resize-none"
                  disabled={isFinished}
                  autoFocus
                />
              </div>
              
              {isStarted && !isFinished && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Progress:</p>
                  <Progress 
                    value={(userInput.length / text.length) * 100} 
                    className="h-2" 
                  />
                </div>
              )}
              
              {isFinished && wpm !== null && accuracy !== null && elapsedTime !== null && (
                <div className="p-4 bg-secondary/30 rounded-md mt-4 space-y-4">
                  <h3 className="text-lg font-medium text-center mb-2">Results</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Speed</p>
                      <p className="text-2xl font-semibold">{wpm} WPM</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-semibold">{accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="text-2xl font-semibold">{Math.round(elapsedTime)}s</p>
                    </div>
                  </div>
                  <div className="flex justify-center pt-2">
                    <Button onClick={() => restartTest()}>Try Again</Button>
                  </div>
                </div>
              )}
              
              {!isStarted && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground italic p-2">
                  <AlertCircle className="h-4 w-4" />
                  Begin typing to start the test...
                </div>
              )}
            </CardContent>
          </Card>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Typing Speed Tester</h2>
            <p>
              The Typing Speed Tester is a practical tool designed to measure and help improve your typing 
              proficiency. In today's digital world, typing is an essential skill across nearly all 
              professions and academic pursuits. This tool provides a straightforward way to assess your 
              current typing abilities and track improvements over time.
            </p>
            
            <p>
              The test measures two key metrics: Words Per Minute (WPM) and accuracy percentage. WPM indicates 
              how many words you can type in one minute, calculated using the standard formula of characters 
              typed divided by 5 (the average word length), divided by the time in minutes. Accuracy is equally 
              important, as it reflects how precise your typing is - even fast typing loses its value if riddled 
              with errors.
            </p>
            
            <p>
              Regular practice with varied texts can significantly improve both your typing speed and accuracy. 
              Professional typists typically achieve 65-75 WPM with high accuracy, while competitive speed typists 
              can exceed 100 WPM. Most casual computer users type between 35-45 WPM. Where do you stand?
            </p>
            
            <p>
              Improving your typing skills offers numerous benefits, including increased productivity, reduced 
              fatigue during long typing sessions, and less time spent correcting mistakes. Whether you're a 
              student typing essays, a professional preparing reports, or someone who communicates extensively 
              through text, better typing skills translate to more efficient workflows. For more productivity tools, 
              check out our <a href="/character-counter" className="text-primary hover:underline">Character Counter</a> or 
              explore our <a href="/tools" className="text-primary hover:underline">comprehensive collection of utility tools</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default TypingSpeedTester;
