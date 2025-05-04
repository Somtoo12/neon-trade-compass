
import React from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

// Sample testimonials
const testimonials = [
  {
    name: 'Michael T.',
    role: 'Forex Trader',
    content: 'The forex pip calculator for beginners is exactly what I needed when I was starting out. It made position sizing so much easier and helped me manage risk properly.',
    avatar: '👨‍💼',
  },
  {
    name: 'Sarah J.',
    role: 'University Student',
    content: 'I\'ve been using the GPA calculator for UNILAG students and it\'s incredibly helpful. Makes tracking my academic progress so much easier!',
    avatar: '👩‍🎓',
  },
  {
    name: 'David K.',
    role: 'Security Professional',
    content: 'As someone who deals with cybersecurity, I recommend the password strength checker online free tool to all my clients. It\'s simple but effective.',
    avatar: '🧑‍💻',
  },
  {
    name: 'Emily R.',
    role: 'Content Creator',
    content: 'The online word counter free tool has become an essential part of my workflow. I use it daily to make sure my content fits platform requirements.',
    avatar: '👩‍💼',
  },
  {
    name: 'Alex P.',
    role: 'Fitness Coach',
    content: 'I use the online countdown timer with alarm for all my training sessions. Simple, reliable, and helps me keep my clients on track.',
    avatar: '🏋️‍♂️',
  },
];

const UserTestimonials: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
              Loved by Thousands of Smart Users
            </span>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            See what our community has to say about our tools
          </p>
        </div>

        {/* Desktop testimonial grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Mobile/Tablet testimonial carousel */}
        <div className="lg:hidden mb-8">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-2">
                  <TestimonialCard testimonial={testimonial} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="static mx-2" />
              <CarouselNext className="static mx-2" />
            </div>
          </Carousel>
        </div>

        {/* Submit feedback CTA */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-accent/30 group">
            <MessageSquare className="mr-2 h-4 w-4 group-hover:text-accent" />
            Submit Your Feedback
          </Button>
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  return (
    <motion.div
      className="bg-background/30 backdrop-blur-sm border border-accent/10 rounded-xl p-6 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="mb-4 text-3xl">{testimonial.avatar}</div>
      
      <blockquote className="flex-1">
        <p className="text-foreground/80 italic mb-4">"{testimonial.content}"</p>
      </blockquote>
      
      <div>
        <p className="font-semibold">{testimonial.name}</p>
        <p className="text-sm text-foreground/60">{testimonial.role}</p>
      </div>
    </motion.div>
  );
};

export default UserTestimonials;
