
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Droplet } from 'lucide-react';

interface BlogPostProps {
  title: string;
  content: React.ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content }) => {
  return (
    <div className="mt-16 md:mt-24 border-t border-border/50 pt-12 md:pt-16">
      <div className="flex items-center space-x-2 mb-8">
        <div className="rounded-full bg-primary/10 p-2">
          <Droplet className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
      </div>
      
      <Separator className="mb-8 opacity-30" />
      
      <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none space-y-6">
        {content}
      </article>
    </div>
  );
};

export default BlogPost;
