
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Droplet } from 'lucide-react';

interface BlogPostProps {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, icon }) => {
  return (
    <div className="mt-20 md:mt-28 border-t border-border/50 pt-14 md:pt-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="rounded-full bg-primary/10 p-2.5">
          {icon || <Droplet className="h-6 w-6 text-primary" />}
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{title}</h2>
      </div>
      
      <Separator className="mb-10 opacity-30" />
      
      <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
        <div className="space-y-8">
          {content}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
