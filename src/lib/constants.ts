export const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
  'Equity Research': { 
    bg: '#354a61', // Dark Slate Blue (Core/Foundational)
    text: '#ffffff' 
  },
  'M&A': { 
    bg: '#ac9741', // Dark Gold (High-impact/Premium)
    text: '#ffffff' 
  },
  'Quantitative Research': { 
    bg: '#44576e', // Slate Blue (Technical/Analytical)
    text: '#ffffff' 
  },
  'Economic Research': { 
    bg: '#7b8797', // Medium Grey (Macro/Academic)
    text: '#ffffff' 
  },
  'All': { 
    bg: '#354a61', // Fallback to primary brand color
    text: '#ffffff' 
  }
};