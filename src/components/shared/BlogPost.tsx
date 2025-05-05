
import React from 'react';

interface BlogPostProps {
  title: string;
  content: React.ReactNode;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content }) => {
  return (
    <div className="mt-12 md:mt-16 border-t border-border/50 pt-8 md:pt-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
      <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
        {content}
      </article>
    </div>
  );
};

export default BlogPost;
