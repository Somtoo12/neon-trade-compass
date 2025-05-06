
import React from 'react';
import BlogPost from './BlogPost';
import useBlogContent from '@/hooks/useBlogContent';

interface BlogPostSectionProps {
  toolId: string;
}

const BlogPostSection: React.FC<BlogPostSectionProps> = ({ toolId }) => {
  const { title, content } = useBlogContent(toolId);
  
  return (
    <BlogPost 
      title={title}
      content={content}
    />
  );
};

export default BlogPostSection;
