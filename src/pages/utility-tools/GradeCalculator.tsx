
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Award, Plus, Trash } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import SEO from '@/components/shared/SEO';

interface GradeEntry {
  id: string;
  score: string;
  weight: string;
}

const GradeCalculator: React.FC = () => {
  const [grades, setGrades] = useState<GradeEntry[]>([
    { id: Date.now().toString(), score: '', weight: '' }
  ]);
  const [weightedAverage, setWeightedAverage] = useState<number | null>(null);
  const [letterGrade, setLetterGrade] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const addGradeEntry = () => {
    setGrades([...grades, { id: Date.now().toString(), score: '', weight: '' }]);
  };
  
  const removeGradeEntry = (id: string) => {
    if (grades.length > 1) {
      setGrades(grades.filter(grade => grade.id !== id));
    }
  };
  
  const updateGradeEntry = (id: string, field: 'score' | 'weight', value: string) => {
    setGrades(grades.map(grade => 
      grade.id === id ? { ...grade, [field]: value } : grade
    ));
  };
  
  const calculateGrade = () => {
    setError('');
    
    // Validate all inputs
    for (const grade of grades) {
      const score = parseFloat(grade.score);
      const weight = parseFloat(grade.weight);
      
      if (isNaN(score) || score < 0 || score > 100) {
        setError('All scores must be valid numbers between 0 and 100');
        return;
      }
      
      if (isNaN(weight) || weight <= 0) {
        setError('All weights must be positive numbers');
        return;
      }
    }
    
    // Calculate weighted average
    let totalWeight = 0;
    let weightedSum = 0;
    
    grades.forEach(grade => {
      const score = parseFloat(grade.score);
      const weight = parseFloat(grade.weight);
      
      weightedSum += score * weight;
      totalWeight += weight;
    });
    
    if (totalWeight === 0) {
      setError('Total weight cannot be zero');
      return;
    }
    
    const average = weightedSum / totalWeight;
    setWeightedAverage(Math.round(average * 100) / 100);
    
    // Determine letter grade
    let letter = '';
    if (average >= 90) letter = 'A';
    else if (average >= 80) letter = 'B';
    else if (average >= 70) letter = 'C';
    else if (average >= 60) letter = 'D';
    else letter = 'F';
    
    setLetterGrade(letter);
  };

  return (
    <AppLayout activeSection="grade-calculator" setActiveSection={() => {}}>
      <SEO 
        title="Grade Calculator | Calculate Weighted Grade Averages | PipCraft Tools" 
        description="Calculate weighted grade averages and determine your letter grade with our easy-to-use Grade Calculator. Perfect for students, teachers, and parents to track academic performance."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Grade Calculator</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Calculate your weighted grade average and letter grade based on multiple test scores and their respective weights.
            </p>
          </div>

          <Card className="border border-border/50">
            <CardContent className="pt-6 space-y-4">
              {grades.map((grade, index) => (
                <div key={grade.id} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label htmlFor={`score-${index}`} className="block text-sm font-medium mb-1">
                      Score {index + 1}:
                    </label>
                    <Input
                      id={`score-${index}`}
                      type="number"
                      min="0"
                      max="100"
                      value={grade.score}
                      onChange={(e) => updateGradeEntry(grade.id, 'score', e.target.value)}
                      placeholder="0-100"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor={`weight-${index}`} className="block text-sm font-medium mb-1">
                      Weight:
                    </label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={grade.weight}
                      onChange={(e) => updateGradeEntry(grade.id, 'weight', e.target.value)}
                      placeholder="e.g. 0.5"
                    />
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-5"
                    onClick={() => removeGradeEntry(grade.id)}
                    disabled={grades.length === 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addGradeEntry}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Grade
                </Button>
                
                <Button onClick={calculateGrade}>Calculate Grade</Button>
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              {weightedAverage !== null && (
                <div className="p-4 bg-secondary/30 rounded-md mt-4">
                  <h3 className="text-sm font-medium mb-2">Results:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Weighted Average</p>
                      <p className="text-xl font-semibold">{weightedAverage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Letter Grade</p>
                      <p className="text-xl font-semibold">{letterGrade}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">About Grade Calculator</h2>
            <p>
              The Grade Calculator is a versatile tool designed to help students, teachers, and parents calculate 
              weighted grade averages and determine the corresponding letter grade. Unlike simple averages, 
              weighted averages account for the varying importance of different assignments, tests, or categories 
              in your overall grade calculation.
            </p>
            
            <p>
              In most academic settings, different assessments carry different weights. For example, a final exam 
              might be worth 40% of your grade, while homework assignments collectively account for 20%. This calculator 
              allows you to enter each score along with its respective weight to compute an accurate representation of 
              your overall performance.
            </p>
            
            <p>
              The weighted average is calculated by multiplying each score by its weight, adding these products together, 
              and then dividing by the sum of all weights. The letter grade is then determined based on standard grading 
              scales: A (90-100%), B (80-89%), C (70-79%), D (60-69%), and F (below 60%).
            </p>
            
            <p>
              This tool is especially useful during exam periods when planning study strategies, or at the end of a term 
              when calculating final grades. Use it to determine what scores you need on upcoming assessments to achieve 
              your target grade. For other educational tools, check out our <a href="/character-counter" className="text-primary hover:underline">Character Counter</a> for essay writing or our <a href="/tools" className="text-primary hover:underline">full suite of utility tools</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default GradeCalculator;
