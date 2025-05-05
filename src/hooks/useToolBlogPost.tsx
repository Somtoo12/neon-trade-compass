
import React from 'react';
import BlogPostSection from '@/components/shared/BlogPostSection';

export const useToolBlogPost = (activeSection: string) => {
  // Only return the blog post section if we're on a valid tool page
  if (!activeSection) {
    return null;
  }

  return <BlogPostSection toolId={activeSection} />;
};

export default useToolBlogPost;
