
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Search, Loader, AlertTriangle, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { forexPairs } from '@/constants/currencyPairs';
import { 
  fetchLivePrice, 
  calculatePipsDifference, 
  calculatePipValue, 
  calculateTotalPnL,
  getPipSize,
  getPipDescription,
  formatPipDisplay,
  getInstrumentType,
  InstrumentType
} from '@/services/twelveDataApi';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form schema for validation
const calculatorSchema = z.object({
  pair: z.string(),
  lotSize: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Lot size must be a positive number"
  }),
  entryPrice: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Entry price is required and must be a positive number"
  }),
  exitPrice: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Exit price is required and must be a positive number"
  })
});

type CalculatorFormValues = z.infer<typeof calculatorSchema>;

const ForexCalculator: React.FC = () => {
  const [pipsResult, setPipsResult] = useState<number | null>(null);
  const [pipValue, setPipValue] = useState<number | null>(null);
  const [totalPnL, setTotalPnL] = useState<number | null>(null);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [pipDescription, setPipDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInstrument, setCurrentInstrument] = useState<InstrumentType>(InstrumentType.FOREX_STANDARD);
  
  const { toast } = useToast();
  
  const form = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      pair: 'EUR/USD',
      lotSize: '0.01',
      entryPrice: '',
      exitPrice: ''
    }
  });
  
  // Combine all pairs for the dropdown
  const allPairs = [
    ...(forexPairs.metals || []),
    ...(forexPairs.indices || []),
    ...(forexPairs.crypto || []),
    ...(forexPairs.majors || []),
    ...(forexPairs.minors || []),
    ...(forexPairs.exotics || [])
  ];
  
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPairs = {
    metals: forexPairs.metals ? forexPairs.metals.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    indices: forexPairs.indices ? forexPairs.indices.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    crypto: forexPairs.crypto ? forexPairs.crypto.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    majors: forexPairs.majors ? forexPairs.majors.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    minors: forexPairs.minors ? forexPairs.minors.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [],
    exotics: forexPairs.exotics ? forexPairs.exotics.filter(pair => 
      pair.toLowerCase().includes(searchTerm.toLowerCase())
    ) : []
  };

  const handleSymbolChange = (symbol: string) => {
    // Update instrument type when symbol changes
    const instrumentType = getInstrumentType(symbol);
    setCurrentInstrument(instrumentType);
    setPipDescription(getPipDescription(symbol));
    
    form.setValue('pair', symbol);
  };
  
  const onSubmit = async (data: CalculatorFormValues) => {
    setIsLoading(true);
    setError(null);
    setPipsResult(null);
    setPipValue(null);
    setTotalPnL(null);
    setLivePrice(null);
    setPipDescription("");
    
    try {
      const { pair, lotSize, entryPrice, exitPrice } = data;
      const lotSizeNum = parseFloat(lotSize);
      const entryPriceNum = parseFloat(entryPrice);
      const exitPriceNum = parseFloat(exitPrice);
      
      if (!entryPrice || !exitPrice) {
        throw new Error("Please enter both Entry and Exit prices to calculate your pip result.");
      }
      
      // Fetch live price to calculate accurate pip value
      const currentPrice = await fetchLivePrice(pair);
      setLivePrice(currentPrice);
      
      // Get pip description for this instrument
      const pipDescriptionText = getPipDescription(pair);
      setPipDescription(pipDescriptionText);
      
      // Calculate pip value using live price
      const calculatedPipValue = calculatePipValue(currentPrice, lotSizeNum, pair);
      setPipValue(calculatedPipValue);
      
      // Calculate pips difference
      const pipDifference = calculatePipsDifference(entryPriceNum, exitPriceNum, pair);
      setPipsResult(pipDifference);
      
      // Calculate total P&L using the accurate live price for pip value
      const pnl = calculateTotalPnL(entryPriceNum, exitPriceNum, currentPrice, lotSizeNum, pair);
      setTotalPnL(pnl);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Unable to fetch live market price right now. Please try again later.";
        
      setError(errorMessage);
      toast({
        title: "Calculation Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="neo-card p-6">
      <h2 className="text-xl font-semibold mb-4 font-poppins">Forex Pip Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pair"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Currency Pair / Instrument</FormLabel>
                      {pipDescription && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Info className="h-3 w-3 mr-1" />
                                {pipDescription}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This is how pips are calculated for this instrument</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => {
                        handleSymbolChange(value);
                      }}
                    >
                      <SelectTrigger className="bg-secondary/50 border-input/40 input-glow">
                        <SelectValue placeholder="Select pair" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-input/40 max-h-[300px]">
                        <div className="flex items-center px-3 pb-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <Input
                            placeholder="Search pairs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-8"
                          />
                        </div>
                        <ScrollArea className="h-[200px]">
                          {filteredPairs.metals && filteredPairs.metals.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Metals</SelectLabel>
                              {filteredPairs.metals.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          
                          {filteredPairs.indices && filteredPairs.indices.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Indices</SelectLabel>
                              {filteredPairs.indices.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          
                          {filteredPairs.crypto && filteredPairs.crypto.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Crypto</SelectLabel>
                              {filteredPairs.crypto.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          
                          {filteredPairs.majors && filteredPairs.majors.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Major Pairs</SelectLabel>
                              {filteredPairs.majors.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          
                          {filteredPairs.minors && filteredPairs.minors.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Minor Pairs</SelectLabel>
                              {filteredPairs.minors.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          
                          {filteredPairs.exotics && filteredPairs.exotics.length > 0 && (
                            <SelectGroup>
                              <SelectLabel>Exotic Pairs</SelectLabel>
                              {filteredPairs.exotics.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lotSize"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Lot Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0.01" 
                        placeholder="0.01"
                        className="bg-secondary/50 border-input/40 input-glow"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="entryPrice"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Entry Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.00001" 
                          placeholder="Enter price"
                          className="bg-secondary/50 border-input/40 input-glow"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exitPrice"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Exit Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.00001" 
                          placeholder="Enter price"
                          className="bg-secondary/50 border-input/40 input-glow"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate'
                )}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md dark:border-white/5 light:bg-[#FFFFFF] rounded-xl p-6 border light:border-gray-200/80 flex flex-col justify-center dark:shadow-[0_4px_15px_rgba(0,0,0,0.5)] light:shadow-[0_2px_15px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm dark:text-gray-400 light:text-gray-600">Result</span>
            <ArrowRight className="h-4 w-4 dark:text-gray-400 light:text-gray-500" />
          </div>
          
          {isLoading ? (
            <div className="py-8 text-center">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Fetching data...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-destructive">{error}</p>
            </div>
          ) : pipsResult !== null ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm dark:text-gray-400 light:text-gray-700 mb-1">Pips Gained/Lost</h3>
                <p className={`text-2xl font-bold ${pipsResult >= 0 ? 'text-[#00ff94]' : 'text-red-500'}`}>
                  {pipsResult >= 0 ? '+' : ''}{formatPipDisplay(pipsResult, form.getValues().pair)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm dark:text-gray-400 light:text-gray-700 mb-1">Current Market Price</h3>
                <p className="text-xl font-medium dark:text-gray-300 light:text-gray-800">
                  {livePrice?.toFixed(5)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm dark:text-gray-400 light:text-gray-700 mb-1">Pip Value</h3>
                <p className="text-xl font-medium dark:text-gray-300 light:text-gray-800">
                  {pipValue?.toFixed(2)} USD
                </p>
              </div>
              
              <div>
                <h3 className="text-sm dark:text-gray-400 light:text-gray-700 mb-1">Total Profit/Loss</h3>
                <p className={`text-3xl font-bold ${totalPnL !== null && totalPnL >= 0 ? 'text-[#00ff94]' : 'text-red-500'}`}>
                  {totalPnL !== null ? (totalPnL >= 0 ? '+' : '') + totalPnL.toFixed(2) + ' USD' : '-'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Enter values and click Calculate to see results</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ForexCalculator;
