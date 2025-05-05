
import { useMemo } from 'react';
import { generateToolBlogContent } from '@/utils/blogContentGenerators';
import { utilityToolsData } from '@/data/utilityToolsData';
import { toolsData } from '@/data/toolsData';
import { Droplet, Binary, Calculator as CalcIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

export const useBlogContent = (toolId: string) => {
  // Convert kebab-case to camelCase for icon lookup
  const getIconName = (iconId: string): string => {
    return iconId
      .split('-')
      .map((part, index) => 
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join('');
  };

  const blogContent = useMemo(() => {
    return generateToolBlogContent(toolId);
  }, [toolId]);

  const blogIcon = useMemo(() => {
    // Find the tool to get its icon
    const tool = [...utilityToolsData, ...toolsData].find(t => t.id === toolId);
    
    if (!tool) return <Droplet />;
    
    // Convert the tool's icon component to a React element
    const IconComponent = tool.icon;
    return <IconComponent className="h-6 w-6 text-primary" />;
  }, [toolId]);

  const blogTitle = useMemo(() => {
    let title = 'Complete Guide';
    
    // Find the tool to get a proper title
    const tool = [...utilityToolsData, ...toolsData].find(t => t.id === toolId);
    
    if (tool) {
      title = `Complete Guide to ${tool.name}`;
    }
    
    return title;
  }, [toolId]);

  return {
    blogContent,
    blogIcon,
    blogTitle
  };
};

export default useBlogContent;
