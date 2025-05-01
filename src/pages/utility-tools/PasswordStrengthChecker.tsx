
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, ShieldX, ShieldAlert, Check, X, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface StrengthCriteria {
  hasMinimumLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState('');
  const [score, setScore] = useState(0);
  const [strength, setStrength] = useState('');
  const [color, setColor] = useState('');
  const [criteria, setCriteria] = useState<StrengthCriteria>({
    hasMinimumLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);

  const checkPasswordStrength = (password: string) => {
    // Check criteria
    const newCriteria: StrengthCriteria = {
      hasMinimumLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    };
    
    setCriteria(newCriteria);
    
    // Calculate score (0-100)
    let newScore = 0;
    
    // Weight each criteria
    if (newCriteria.hasMinimumLength) newScore += 20;
    if (newCriteria.hasUpperCase) newScore += 20;
    if (newCriteria.hasLowerCase) newScore += 20;
    if (newCriteria.hasNumber) newScore += 20;
    if (newCriteria.hasSpecialChar) newScore += 20;
    
    // Bonus for length beyond minimum
    if (password.length > 12) newScore = Math.min(newScore + 10, 100);
    
    // Penalty for short passwords
    if (password.length < 8 && password.length > 0) {
      newScore = Math.floor(newScore * (password.length / 8));
    }
    
    // If password is empty, score is 0
    if (password.length === 0) newScore = 0;
    
    setScore(newScore);
    
    // Determine strength category and color
    if (newScore >= 80) {
      setStrength('Strong');
      setColor('bg-green-500');
    } else if (newScore >= 50) {
      setStrength('Moderate');
      setColor('bg-yellow-500');
    } else if (newScore > 0) {
      setStrength('Weak');
      setColor('bg-red-500');
    } else {
      setStrength('');
      setColor('bg-gray-300 dark:bg-gray-700');
    }
  };

  const handleClearPassword = () => {
    setPassword('');
  };

  const getStrengthIcon = () => {
    if (score >= 80) {
      return <ShieldCheck className="h-8 w-8 text-green-500" />;
    } else if (score >= 50) {
      return <ShieldAlert className="h-8 w-8 text-yellow-500" />;
    } else if (score > 0) {
      return <ShieldX className="h-8 w-8 text-red-500" />;
    } else {
      return <ShieldX className="h-8 w-8 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout activeSection="password-strength-checker" setActiveSection={() => {}}>
      <Helmet>
        <title>Password Strength Checker | PipCraft Tools</title>
        <meta name="description" content="Check the strength of your password with our free password strength checker. Ensure your online accounts are protected with strong, secure passwords." />
        <link rel="canonical" href="https://pipcrafts.com/password-strength-checker" />
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
              Password Strength Checker
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Verify the security of your passwords by checking their strength. Protect your online accounts with stronger passwords.
            </p>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/30">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter your password to check its strength"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-4 pr-4 py-2 w-full border border-border input-glow min-h-[44px]"
                    />
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleClearPassword}
                    className="min-h-[44px] flex-grow md:flex-grow-0"
                  >
                    <X className="mr-2 h-4 w-4" /> Clear
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Strength: {strength}</span>
                  <span className="text-sm font-medium">{score}%</span>
                </div>
                <Progress value={score} className={`h-2 ${color}`} />

                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-8">
                  {getStrengthIcon()}
                  <div className="space-y-2 flex-grow max-w-md">
                    <div className="flex items-center">
                      {criteria.hasMinimumLength ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">At least 8 characters</span>
                    </div>
                    <div className="flex items-center">
                      {criteria.hasUpperCase ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">Contains uppercase letters (A-Z)</span>
                    </div>
                    <div className="flex items-center">
                      {criteria.hasLowerCase ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">Contains lowercase letters (a-z)</span>
                    </div>
                    <div className="flex items-center">
                      {criteria.hasNumber ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">Contains numbers (0-9)</span>
                    </div>
                    <div className="flex items-center">
                      {criteria.hasSpecialChar ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      <span className="text-sm">Contains special characters (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <article className="prose prose-sm dark:prose-invert max-w-none mt-8 px-4">
            <h2 className="text-xl font-semibold mb-3">Why Password Strength Matters</h2>
            <p>
              Strong passwords are your first line of defense against unauthorized access to your accounts. A robust password makes it significantly harder for hackers to gain access to your personal information, financial data, or sensitive business details. Using our Password Strength Checker helps you evaluate the security level of your passwords before using them.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Creating Strong Passwords</h2>
            <p>
              To create a strong password, use a combination of uppercase and lowercase letters, numbers, and special characters. Avoid using common words, personal information, or sequential numbers. The longer your password, the more secure it typically is. Consider using a phrase or sentence as the basis for your password, with character substitutions for added security. If you need help creating a strong password, try our <Link to="/password-generator" className="text-primary hover:underline">Password Generator</Link> tool.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Password Security Best Practices</h2>
            <p>
              Even with strong passwords, it's essential to follow security best practices. Never reuse passwords across multiple accounts, as a breach on one site could compromise all your accounts. Consider using a password manager to generate and store unique, complex passwords for each service you use. Enable two-factor authentication where available for an additional layer of security. And regularly check if your accounts have been involved in data breaches using reputable security services. For traders managing multiple accounts, good password security is as important as using proper <Link to="/risk-management" className="text-primary hover:underline">Risk Management</Link> strategies.
            </p>
          </article>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default PasswordStrengthChecker;
