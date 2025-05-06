
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Droplet } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface BlogPostProps {
  title: string;
  content: React.ReactNode;
  className?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, className = '' }) => {
  return (
    <Card className={`mt-16 md:mt-24 border-t border-border/50 pt-12 md:pt-16 px-4 md:px-6 lg:px-8 pb-12 shadow-md bg-card/80 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className="rounded-full bg-primary/10 p-2.5">
          <Droplet className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      
      <Separator className="mb-8 opacity-30" />
      
      <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none space-y-6">
        {/* Apply styling to the blog content */}
        <div className="space-y-6 leading-relaxed">
          {content}
        </div>
      </article>
    </Card>
  );
};

export default BlogPost;
