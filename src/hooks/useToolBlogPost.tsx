
import React from 'react';
import BlogPostSection from '@/components/shared/BlogPostSection';

// This hook adds a blog post section to tool pages
export function useToolBlogPost(activeSection: string) {
  // Map the active section to its corresponding blog content
  const getBlogPostSection = () => {
    if (!activeSection) return null;
    
    return <BlogPostSection toolId={activeSection} />;
  };
  
  return {
    blogPostSection: getBlogPostSection()
  };
}

export default useToolBlogPost;
