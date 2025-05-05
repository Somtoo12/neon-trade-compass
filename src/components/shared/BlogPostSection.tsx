
import React from 'react';
import BlogPost from './BlogPost';
import useBlogContent from '@/hooks/useBlogContent';

interface BlogPostSectionProps {
  toolId: string;
}

const BlogPostSection: React.FC<BlogPostSectionProps> = ({ toolId }) => {
  const { blogContent, blogIcon, blogTitle } = useBlogContent(toolId);
  
  return (
    <BlogPost 
      title={blogTitle}
      content={blogContent}
      icon={blogIcon}
    />
  );
};

export default BlogPostSection;
