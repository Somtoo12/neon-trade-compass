
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScreenshotButtonProps {
  targetId: string;
  filename: string;
}

export function ScreenshotButton({ targetId, filename }: ScreenshotButtonProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { toast } = useToast();

  const captureScreenshot = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    // Add temporary theme class for screenshot
    const originalClass = element.className;
    element.className = `${originalClass} screenshot-${theme}`;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: theme === 'light' ? '#FFFFFF' : '#1A1F2C',
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Reset the class
      element.className = originalClass;

      // Create download link
      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Screenshot saved!",
        description: `Exported as ${link.download}`,
      });
    } catch (error) {
      toast({
        title: "Screenshot failed",
        description: "There was an error capturing the screenshot.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={theme}
        onValueChange={(value: 'dark' | 'light') => setTheme(value)}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dark">Dark Theme</SelectItem>
          <SelectItem value="light">Light Theme</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={captureScreenshot}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Camera className="h-4 w-4" />
        Export Screenshot
      </Button>
    </div>
  );
}
