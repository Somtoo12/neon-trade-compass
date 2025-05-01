
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Key, CopyIcon, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [strengthText, setStrengthText] = useState<string>('');
  const { toast } = useToast();

  // Character sets
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    // Generate initial password
    generatePassword();
  }, []);

  useEffect(() => {
    // Evaluate password strength whenever password changes
    evaluatePasswordStrength();
  }, [password]);

  const generatePassword = () => {
    // Ensure at least one character set is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Error",
        description: "Please select at least one character type.",
        variant: "destructive"
      });
      return;
    }

    // Build character set based on options
    let chars = '';
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;

    let newPassword = '';
    let hasUppercase = !includeUppercase;
    let hasLowercase = !includeLowercase;
    let hasNumber = !includeNumbers;
    let hasSymbol = !includeSymbols;

    // First, ensure we have at least one character from each required set
    if (includeUppercase && !hasUppercase) {
      newPassword += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
      hasUppercase = true;
    }
    if (includeLowercase && !hasLowercase) {
      newPassword += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
      hasLowercase = true;
    }
    if (includeNumbers && !hasNumber) {
      newPassword += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
      hasNumber = true;
    }
    if (includeSymbols && !hasSymbol) {
      newPassword += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
      hasSymbol = true;
    }

    // Fill the rest of the password with random characters
    const remainingLength = passwordLength - newPassword.length;
    
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      newPassword += chars.charAt(randomIndex);
    }
    
    // Shuffle the password characters
    newPassword = newPassword
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
    
    setPassword(newPassword);
  };

  const evaluatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength(0);
      setStrengthText('');
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Character variety check
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Normalize to percentage
    const normalizedStrength = Math.min(100, Math.round((strength / 7) * 100));
    setPasswordStrength(normalizedStrength);
    
    // Set descriptive text
    if (normalizedStrength < 30) setStrengthText('Very Weak');
    else if (normalizedStrength < 50) setStrengthText('Weak');
    else if (normalizedStrength < 70) setStrengthText('Moderate');
    else if (normalizedStrength < 90) setStrengthText('Strong');
    else setStrengthText('Very Strong');
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    if (passwordStrength < 90) return 'bg-green-500';
    return 'bg-green-600';
  };

  const copyToClipboard = () => {
    if (!password) return;
    
    navigator.clipboard.writeText(password);
    toast({
      title: "Password copied to clipboard",
      description: "You can now paste it where needed."
    });
  };

  return (
    <AppLayout activeSection="password-generator" setActiveSection={() => {}}>
      <SEO 
        title="Password Generator | Create Secure Passwords | PipCraft Tools" 
        description="Generate strong, secure passwords with our free password generator tool. Customize length and complexity to create unique passwords that protect your accounts from hackers."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Password Generator</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create strong, secure passwords with customizable options for maximum security.
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password-output" className="block text-sm font-medium">
                    Your Generated Password:
                  </label>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                    disabled={!password}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="password-output"
                    type="text"
                    value={password}
                    readOnly
                    className="font-mono"
                  />
                  <Button 
                    onClick={generatePassword}
                    variant="outline"
                    className="flex items-center gap-1"
                    title="Generate new password"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                {password && (
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span>Strength: {strengthText}</span>
                      <span>{passwordStrength}%</span>
                    </div>
                    <Progress value={passwordStrength} className={`h-1.5 ${getStrengthColor()}`} />
                  </div>
                )}
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="length-slider" className="block text-sm font-medium">
                      Password Length: {passwordLength} characters
                    </label>
                  </div>
                  <Slider 
                    id="length-slider"
                    value={[passwordLength]} 
                    min={4}
                    max={32}
                    step={1}
                    onValueChange={(value) => setPasswordLength(value[0])}
                    className="py-4"
                  />
                </div>
                
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-medium">Include Characters:</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="uppercase" 
                        checked={includeUppercase} 
                        onCheckedChange={setIncludeUppercase} 
                      />
                      <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
                    </div>
                    <span className="text-xs text-muted-foreground">ABC</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="lowercase" 
                        checked={includeLowercase} 
                        onCheckedChange={setIncludeLowercase} 
                      />
                      <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
                    </div>
                    <span className="text-xs text-muted-foreground">abc</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="numbers" 
                        checked={includeNumbers} 
                        onCheckedChange={setIncludeNumbers} 
                      />
                      <Label htmlFor="numbers">Numbers (0-9)</Label>
                    </div>
                    <span className="text-xs text-muted-foreground">123</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="symbols" 
                        checked={includeSymbols} 
                        onCheckedChange={setIncludeSymbols} 
                      />
                      <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
                    </div>
                    <span className="text-xs text-muted-foreground">!?&</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-4" 
                  onClick={generatePassword}
                >
                  Generate New Password
                </Button>
                
                {(!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) && (
                  <div className="flex items-center gap-2 p-3 text-sm text-yellow-500 bg-yellow-500/10 rounded-md">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Select at least one character type</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Password Generator</h2>
            <p>
              The Password Generator is an essential security tool designed to create strong, unique passwords 
              that help protect your online accounts from unauthorized access. In an era where data breaches 
              and hacking attempts are increasingly common, using robust passwords is one of the simplest yet 
              most effective ways to enhance your digital security.
            </p>
            
            <p>
              This tool allows you to customize your password creation process by adjusting the length and 
              character types included. For maximum security, experts recommend using passwords that are at 
              least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, 
              and special symbols. Such diversity makes passwords exponentially more difficult to crack through 
              brute force methods or dictionary attacks.
            </p>
            
            <p>
              Each generated password comes with a strength indicator that evaluates its security level based 
              on length and complexity factors. Striving for "Strong" or "Very Strong" ratings is advisable 
              for accounts containing sensitive information like financial or personal data. Remember that 
              even the strongest password becomes vulnerable if reused across multiple accounts - each important 
              account should have its unique password.
            </p>
            
            <p>
              For optimal security practices, consider using this generator in conjunction with a reputable 
              password manager to store your complex passwords securely. This allows you to use strong, unique 
              passwords for all your accounts without having to memorize them. For additional security tools, 
              check out our <a href="/password-strength-checker" className="text-primary hover:underline">Password Strength Checker</a> 
              to evaluate your existing passwords, or explore our <a href="/tools" className="text-primary hover:underline">full suite of utility tools</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default PasswordGenerator;
