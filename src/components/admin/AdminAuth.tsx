
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AdminAuthProps {
  setIsAdmin: (value: boolean) => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ setIsAdmin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // In a real application, you would validate against a backend
  // This is just for demonstration purposes
  const adminPassword = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === adminPassword) {
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin control panel",
        });
        setIsAdmin(true);
      } else {
        toast({
          title: "Access denied",
          description: "Invalid admin password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="text-primary" />
            Admin Access
          </CardTitle>
          <CardDescription>
            Enter your admin password to access the control panel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Control Panel"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
