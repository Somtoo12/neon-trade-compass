
import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Download, Link as LinkIcon, FileText, Trash, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';

const QRCodeGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const generateQR = () => {
    if (!text) {
      toast({
        title: "Input Required",
        description: "Please enter some text or a URL to generate a QR code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    // A small timeout to show the loading state (even though QR generation is fast)
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  const downloadQR = () => {
    if (!text) {
      toast({
        title: "No QR Code",
        description: "Generate a QR code first before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
      if (!canvas) {
        throw new Error("QR code canvas not found");
      }
      
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success!",
        description: "QR code downloaded successfully.",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearInput = () => {
    setText('');
  };

  // Detect if input is a URL
  const isURL = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppLayout activeSection="qr-code-generator" setActiveSection={() => {}}>
      <Helmet>
        <title>QR Code Generator | PipCraft Tools</title>
        <meta name="description" content="Generate QR codes for URLs, text, and contact information with our free QR code generator tool. Download as PNG for easy sharing." />
        <link rel="canonical" href="https://pipcrafts.com/qr-code-generator" />
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
              QR Code Generator
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create custom QR codes for websites, text, or contact information. Simply enter your content and generate a scannable QR code.
            </p>
          </div>

          <Card className="border-border/50 backdrop-blur-sm bg-card/30">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      placeholder="Enter URL or text to generate QR code"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-border input-glow min-h-[44px]"
                    />
                    {isURL(text) ? (
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
                    ) : (
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                  <div className="flex gap-2 sm:flex-nowrap">
                    <Button 
                      onClick={generateQR} 
                      className="min-h-[44px] bg-primary hover:bg-primary/90 flex-grow md:flex-grow-0"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                      ) : (
                        <><QrCode className="mr-2 h-4 w-4" /> Generate</>
                      )}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={clearInput}
                      className="min-h-[44px] flex-grow md:flex-grow-0"
                      disabled={!text}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Clear
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center" ref={qrRef}>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                  </div>
                ) : text ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-4 rounded-lg shadow-lg"
                  >
                    <QRCode
                      id="qr-code-canvas"
                      value={text}
                      size={250}
                      level="H"
                      includeMargin={true}
                      renderAs="canvas"
                    />
                  </motion.div>
                ) : (
                  <div className="text-center p-8 border border-dashed border-border rounded-lg bg-card/30">
                    <QrCode className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Enter text or a URL above and click Generate</p>
                  </div>
                )}

                {text && !isGenerating && (
                  <Button 
                    onClick={downloadQR}
                    className="mt-4 min-h-[44px]"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download QR Code
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <article className="prose prose-sm dark:prose-invert max-w-none mt-8 px-4">
            <h2 className="text-xl font-semibold mb-3">What are QR Codes?</h2>
            <p>
              QR codes (Quick Response codes) are two-dimensional barcodes that can be scanned using smartphone cameras to quickly access information or websites. They serve as a bridge between the physical and digital worlds, allowing users to navigate to URLs, view contact information, or read text with a simple scan.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">When to Use QR Codes</h2>
            <p>
              QR codes are versatile tools used in marketing materials, business cards, product packaging, and event promotions. They're particularly useful when you want to provide quick access to digital content without requiring users to type long URLs or text. For time-sensitive events, consider pairing your QR codes with our <Link to="/countdown-timer" className="text-primary hover:underline">Countdown Timer</Link> to create urgency and anticipation.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Privacy & Security</h2>
            <p>
              Our QR Code Generator creates codes directly in your browser without storing your data on servers. The generated QR codes are private and can be downloaded immediately for your use. For business applications, consider using these QR codes alongside other PipCraft tools like our <Link to="/character-counter" className="text-primary hover:underline">Character Counter</Link> to ensure your marketing messages stay concise and effective.
            </p>
          </article>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default QRCodeGenerator;
