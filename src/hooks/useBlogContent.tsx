
import React from 'react';
import { 
  generateDefaultContent, 
  generateForexCalculatorContent,
  generateMaxLotSizeContent,
  generateRiskManagementContent,
  generateTradeJournalContent,
  generateChallengeBlueprintContent
} from '@/utils/blogContentGenerators';
import { toolsData, utilityToolsData } from '@/data/toolsData';
import { Droplet } from 'lucide-react';

// Hook to get the appropriate blog content for a tool
export function useBlogContent(toolId: string) {
  // Generate the title based on the tool name
  const getToolName = () => {
    const tool = [...utilityToolsData, ...toolsData].find(t => t.id === toolId);
    
    if (!tool) return "Tool Guide";
    
    return `${tool.name} Guide`;
  };
  
  // Get the appropriate content based on the tool ID
  const getContent = () => {
    switch (toolId) {
      case 'forex-calculator':
        return generateForexCalculatorContent();
      case 'max-lot-size':
        return generateMaxLotSizeContent();
      case 'risk-management':
        return generateRiskManagementContent();
      case 'trade-journal':
        return generateTradeJournalContent();
      case 'challenge-blueprint':
        return generateChallengeBlueprintContent();
      default:
        const tool = [...toolsData, ...utilityToolsData].find(t => t.id === toolId);
        return generateDefaultContent(tool);
    }
  };
  
  return {
    title: getToolName(),
    content: getContent()
  };
}

export default useBlogContent;
