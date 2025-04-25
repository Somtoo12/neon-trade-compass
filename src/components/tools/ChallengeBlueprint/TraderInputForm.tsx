
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { TraderData } from './index';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with validation
const formSchema = z.object({
  accountSize: z.number().min(1000, 'Account size must be at least $1,000').max(1000000, 'Account size must be less than $1,000,000'),
  profitTarget: z.number().min(1, 'Profit target must be at least 1%').max(100, 'Profit target must be less than 100%'),
  passDays: z.number().min(1, 'Days must be at least 1').max(365, 'Days must be less than 365'),
  winRate: z.number().min(1, 'Win rate must be at least 1%').max(100, 'Win rate must be less than 100%'),
  riskRewardRatio: z.number().min(0.1, 'R:R must be at least 0.1').max(10, 'R:R must be less than 10'),
  riskPerTrade: z.number().min(0.1, 'Risk must be at least 0.1%').max(10, 'Risk must be less than 10%'),
  tradesPerDay: z.number().min(0.1, 'Trades per day must be at least 0.1').max(100, 'Trades per day must be less than 100'),
});

interface TraderInputFormProps {
  onSubmit: (data: TraderData) => void;
}

const TraderInputForm: React.FC<TraderInputFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  
  // Set up the form with default values
  const form = useForm<TraderData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountSize: 100000,
      profitTarget: 10,
      passDays: 30,
      winRate: 60,
      riskRewardRatio: 1.5,
      riskPerTrade: 1,
      tradesPerDay: 3,
    },
  });

  const handleFormSubmit = (data: TraderData) => {
    toast({
      title: "Building your blueprint...",
      description: "Analyzing your trading performance data",
    });
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Size */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <FormField
              control={form.control}
              name="accountSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Account Size ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="input-glow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Profit Target */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <FormField
              control={form.control}
              name="profitTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profit Target (%)</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl className="flex-1">
                      <Slider
                        min={1}
                        max={30}
                        step={0.5}
                        value={[field.value]}
                        onValueChange={([val]) => field.onChange(val)}
                        className="py-2"
                      />
                    </FormControl>
                    <span className="w-12 text-right">{field.value}%</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Pass Days */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="passDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pass Timeline (Days)</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl className="flex-1">
                      <Slider
                        min={5}
                        max={90}
                        step={1}
                        value={[field.value]}
                        onValueChange={([val]) => field.onChange(val)}
                        className="py-2"
                      />
                    </FormControl>
                    <span className="w-12 text-right">{field.value}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Win Rate */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <FormField
              control={form.control}
              name="winRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Win Rate (%)</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl className="flex-1">
                      <Slider
                        min={20}
                        max={90}
                        step={1}
                        value={[field.value]}
                        onValueChange={([val]) => field.onChange(val)}
                        className="py-2"
                      />
                    </FormControl>
                    <span className="w-12 text-right">{field.value}%</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Risk Reward Ratio */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <FormField
              control={form.control}
              name="riskRewardRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk:Reward Ratio</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl className="flex-1">
                      <Slider
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={([val]) => field.onChange(val)}
                        className="py-2"
                      />
                    </FormControl>
                    <span className="w-12 text-right">{field.value}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Risk Per Trade */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <FormField
              control={form.control}
              name="riskPerTrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Per Trade (%)</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl className="flex-1">
                      <Slider
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={([val]) => field.onChange(val)}
                        className="py-2"
                      />
                    </FormControl>
                    <span className="w-12 text-right">{field.value}%</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Trades Per Day */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <FormField
              control={form.control}
              name="tradesPerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avg Trades Per Day</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl className="flex-1">
                      <Slider
                        min={0.5}
                        max={15}
                        step={0.5}
                        value={[field.value]}
                        onValueChange={([val]) => field.onChange(val)}
                        className="py-2"
                      />
                    </FormControl>
                    <span className="w-12 text-right">{field.value}</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Button 
            type="submit" 
            size="lg"
            className="relative group overflow-hidden bg-accent/80 hover:bg-accent text-white w-full md:w-auto"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-green to-neon-blue opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            Build My Challenge Blueprint
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};

export default TraderInputForm;
