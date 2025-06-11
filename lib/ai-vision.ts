// Google Vision API Integration for Plant Disease Detection
// This demonstrates real AI integration capability

import { AI_VISION_ERRORS, throwConfigurationError } from './error-handling';

interface VisionAnalysisResult {
  labels: Array<{
    description: string;
    score: number;
  }>;
  objects: Array<{
    name: string;
    score: number;
  }>;
  plantDiseaseDetected: boolean;
  suggestedDiseases: string[];
  confidence: number;
  isHealthyPlant?: boolean;
  visualCharacteristics?: string[];
  diseaseType?: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'nutritional' | 'environmental';
}

// Comprehensive Australian plant disease database based on visual leaf characteristics
const COMPREHENSIVE_PLANT_DISEASES = {
  // Fungal Diseases
  fungal: [
    {
      name: 'Powdery Mildew',
      visualIndicators: ['white', 'powder', 'coating', 'mildew', 'dusty', 'grey'],
      description: 'White or light grey powdery coating on leaves and stems',
      severity: 'moderate'
    },
    {
      name: 'Rust',
      visualIndicators: ['rust', 'orange', 'yellow', 'pustules', 'spots', 'brown'],
      description: 'Orange, yellow, or white pustules, often on leaf underside',
      severity: 'moderate'
    },
    {
      name: 'Black Spot',
      visualIndicators: ['black', 'spot', 'circular', 'dark', 'round'],
      description: 'Round black spots with fringed margins, leading to yellowing',
      severity: 'moderate'
    },
    {
      name: 'Sooty Mould',
      visualIndicators: ['black', 'sooty', 'dark', 'coating', 'mould', 'grey'],
      description: 'Black or dark grey coating on leaves, caused by honeydew',
      severity: 'mild'
    },
    {
      name: 'Myrtle Rust',
      visualIndicators: ['brown', 'grey', 'yellow', 'spores', 'bright', 'rust'],
      description: 'Brown to grey spots with bright yellow spores on Myrtaceae leaves',
      severity: 'severe'
    },
    {
      name: 'Peach Leaf Curl',
      visualIndicators: ['curl', 'distorted', 'puckered', 'red', 'purple', 'twisted'],
      description: 'Distorted, puckered leaves with red or purple discoloration',
      severity: 'moderate'
    },
    {
      name: 'Downy Mildew',
      visualIndicators: ['yellow', 'spots', 'white', 'mould', 'underside', 'grey'],
      description: 'Yellow spots on upper leaf surface, white or grey mould on underside',
      severity: 'moderate'
    },
    {
      name: 'Anthracnose',
      visualIndicators: ['dark', 'sunken', 'lesions', 'brown', 'black', 'spots'],
      description: 'Dark, sunken lesions on leaves, stems, and fruits',
      severity: 'moderate'
    },
    {
      name: 'Septoria Leaf Spot',
      visualIndicators: ['circular', 'spots', 'yellow', 'halo', 'brown', 'center'],
      description: 'Circular spots with yellow halos and brown centers',
      severity: 'moderate'
    }
  ],
  // Bacterial Diseases  
  bacterial: [
    {
      name: 'Bacterial Leaf Spot',
      visualIndicators: ['water-soaked', 'spots', 'brown', 'black', 'halo', 'yellow'],
      description: 'Small water-soaked spots turning brown or black, sometimes with yellow halo',
      severity: 'moderate'
    },
    {
      name: 'Fire Blight',
      visualIndicators: ['wilted', 'blackened', 'burnt', 'scorched', 'brown', 'dead'],
      description: 'Wilted, blackened leaves and shoots appearing burnt or scorched',
      severity: 'severe'
    },
    {
      name: 'Bacterial Canker',
      visualIndicators: ['canker', 'sunken', 'lesions', 'oozing', 'gum', 'brown'],
      description: 'Sunken lesions with gum or ooze, often on stems and branches',
      severity: 'severe'
    }
  ],
  // Fungal Wilts
  wilts: [
    {
      name: 'Verticillium Wilt',
      visualIndicators: ['wilting', 'yellow', 'one-sided', 'browning', 'vascular'],
      description: 'Yellowing and wilting of leaves, often on one side of plant',
      severity: 'severe'
    },
    {
      name: 'Fusarium Wilt',
      visualIndicators: ['wilting', 'yellow', 'lower', 'leaves', 'brown', 'stem'],
      description: 'Lower leaves turn yellow and wilt, brown streaking in stem',
      severity: 'severe'
    }
  ],
  // Pest-Related Damage
  pests: [
    {
      name: 'Aphid Infestation',
      visualIndicators: ['curled', 'distorted', 'sticky', 'honeydew', 'yellowing'],
      description: 'Curled or distorted leaves with sticky honeydew residue',
      severity: 'mild'
    },
    {
      name: 'Spider Mite Damage',
      visualIndicators: ['stippling', 'speckled', 'bronze', 'webbing', 'tiny', 'dots'],
      description: 'Fine stippling or speckling with possible webbing',
      severity: 'moderate'
    },
    {
      name: 'Scale Insect Damage',
      visualIndicators: ['yellowing', 'stunted', 'waxy', 'bumps', 'honeydew'],
      description: 'Yellowing leaves with waxy or hard bumps on stems and leaves',
      severity: 'moderate'
    },
    {
      name: 'Thrip Damage',
      visualIndicators: ['silvery', 'streaks', 'scarring', 'stippling', 'distorted'],
      description: 'Silvery streaks and scarring on leaf surfaces',
      severity: 'mild'
    }
  ],
  // Nutritional Disorders
  nutritional: [
    {
      name: 'Nitrogen Deficiency',
      visualIndicators: ['yellow', 'older', 'leaves', 'pale', 'green', 'stunted'],
      description: 'Older leaves turn yellow, overall pale green appearance',
      severity: 'mild'
    },
    {
      name: 'Iron Chlorosis',
      visualIndicators: ['yellow', 'green', 'veins', 'interveinal', 'chlorosis'],
      description: 'Yellow leaves with green veins, interveinal chlorosis',
      severity: 'mild'
    },
    {
      name: 'Magnesium Deficiency',
      visualIndicators: ['yellow', 'margins', 'green', 'veins', 'older', 'leaves'],
      description: 'Yellow leaf margins with green veins, starting on older leaves',
      severity: 'mild'
    }
  ]
};

// Enhanced visual characteristic keywords for more accurate detection
const ENHANCED_VISUAL_KEYWORDS = {
  // Color patterns
  colors: {
    disease: ['brown', 'black', 'yellow', 'orange', 'red', 'purple', 'white', 'grey', 'bronze'],
    healthy: ['green', 'vibrant', 'fresh', 'lush', 'bright']
  },
  // Texture and coating patterns
  textures: {
    disease: ['powder', 'coating', 'mould', 'dusty', 'sticky', 'waxy', 'oozing', 'webbing'],
    healthy: ['smooth', 'glossy', 'firm']
  },
  // Shape and structure patterns
  shapes: {
    disease: ['spots', 'lesions', 'pustules', 'canker', 'curl', 'distorted', 'wilted', 'stunted'],
    healthy: ['upright', 'straight', 'normal']
  },
  // Pattern distributions
  patterns: {
    disease: ['circular', 'sunken', 'raised', 'water-soaked', 'stippling', 'streaks', 'halo'],
    healthy: ['uniform', 'even']
  }
};

// Real Google Vision API integration (requires API key)
export async function analyzeImageWithVision(imageFile: File): Promise<VisionAnalysisResult> {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY;
  
  if (!API_KEY) {
    console.error('Google Vision API key not configured');
    throwConfigurationError(AI_VISION_ERRORS.NOT_CONFIGURED);
  }

  try {
    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    // Call Google Vision API with enhanced feature detection
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: {
            content: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 30 }, // Increased for more detailed analysis
            { type: 'OBJECT_LOCALIZATION', maxResults: 15 },
            { type: 'TEXT_DETECTION', maxResults: 5 }, // Can help identify plant tags/labels
            { type: 'IMAGE_PROPERTIES' } // Color analysis for better disease detection
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const annotations = data.responses[0];

    console.log('Google Vision API Response:', annotations); // Debug logging

    // Process Vision API results for comprehensive plant disease detection
    return processEnhancedVisionResults(annotations);
    
  } catch (error) {
    console.error('Google Vision API error:', error);
    
    // Check for specific API errors
    if (error instanceof Error) {
      if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
        throwConfigurationError(AI_VISION_ERRORS.API_QUOTA_EXCEEDED);
      }
      if (error.message.includes('invalid') || error.message.includes('INVALID_IMAGE')) {
        throwConfigurationError(AI_VISION_ERRORS.INVALID_IMAGE);
      }
    }
    
    // Re-throw the original error
    throw error;
  }
}

// Enhanced processing function for comprehensive disease detection
function processEnhancedVisionResults(annotations: any): VisionAnalysisResult {
  const labels = annotations.labelAnnotations || [];
  const objects = annotations.localizedObjectAnnotations || [];
  const imageProperties = annotations.imagePropertiesAnnotation || {};
  
  console.log('Processing Vision Results:', { labels: labels.slice(0, 10), objects }); // Debug logging
  
  // Look for plant-related labels with higher confidence
  const plantLabels = labels.filter((label: any) => 
    label.description.toLowerCase().includes('plant') ||
    label.description.toLowerCase().includes('leaf') ||
    label.description.toLowerCase().includes('flower') ||
    label.description.toLowerCase().includes('tree') ||
    label.description.toLowerCase().includes('vegetation') ||
    label.description.toLowerCase().includes('foliage') ||
    label.description.toLowerCase().includes('crop') ||
    label.description.toLowerCase().includes('herb') ||
    label.description.toLowerCase().includes('garden')
  );

  // Enhanced healthy plant indicators
  const healthyIndicators = labels.filter((label: any) => {
    const desc = label.description.toLowerCase();
    return ENHANCED_VISUAL_KEYWORDS.colors.healthy.some(keyword => desc.includes(keyword)) ||
           ENHANCED_VISUAL_KEYWORDS.textures.healthy.some(keyword => desc.includes(keyword)) ||
           desc.includes('healthy') || desc.includes('fresh') || desc.includes('vibrant');
  });

  // Comprehensive disease indicators based on visual characteristics
  const diseaseIndicators = labels.filter((label: any) => {
    const desc = label.description.toLowerCase();
    return ENHANCED_VISUAL_KEYWORDS.colors.disease.some(keyword => desc.includes(keyword)) ||
           ENHANCED_VISUAL_KEYWORDS.textures.disease.some(keyword => desc.includes(keyword)) ||
           ENHANCED_VISUAL_KEYWORDS.shapes.disease.some(keyword => desc.includes(keyword)) ||
           ENHANCED_VISUAL_KEYWORDS.patterns.disease.some(keyword => desc.includes(keyword)) ||
           desc.includes('disease') || desc.includes('pest') || desc.includes('damage') ||
           desc.includes('blight') || desc.includes('fungus') || desc.includes('rot') ||
           desc.includes('infection') || desc.includes('pathogen');
  });

  // Extract visual characteristics for diagnosis
  const visualCharacteristics = labels
    .filter((label: any) => label.score > 0.6) // Only high-confidence labels
    .map((label: any) => label.description)
    .slice(0, 8); // Top 8 characteristics

  // Determine if this is a healthy plant or has disease issues
  // First check for strong disease indicators (definitive disease signs)
  const hasStrongDiseaseSignals = hasStrongDiseaseIndicators(labels);
  
  // Disease detection logic: prioritize strong disease indicators
  const plantDiseaseDetected = plantLabels.length > 0 && 
                             (hasStrongDiseaseSignals || diseaseIndicators.length >= 2);
  
  // Healthy plant logic: only if NO strong disease signals AND more healthy than disease indicators
  const isHealthyPlant = plantLabels.length > 0 && 
                        !hasStrongDiseaseSignals &&
                        !plantDiseaseDetected &&
                        (healthyIndicators.length > diseaseIndicators.length || 
                         (healthyIndicators.length > 0 && diseaseIndicators.length === 0));

  // Intelligent disease matching based on visual characteristics
  const { suggestedDiseases, diseaseType, confidence } = plantDiseaseDetected 
    ? matchDiseasesToVisualCharacteristics(labels, visualCharacteristics)
    : { suggestedDiseases: [], diseaseType: undefined, confidence: 0 };

  // Calculate overall confidence based on multiple factors
  const avgConfidence = calculateEnhancedConfidence(labels, plantLabels, diseaseIndicators, healthyIndicators);

  console.log('🔍 DISEASE ANALYSIS DEBUG:', { 
    plantLabelsFound: plantLabels.length,
    healthyIndicatorCount: healthyIndicators.length,
    diseaseIndicatorCount: diseaseIndicators.length,
    hasStrongDiseaseSignals,
    isHealthyPlant, 
    plantDiseaseDetected, 
    suggestedDiseases, 
    confidence: avgConfidence,
    topLabels: labels.slice(0, 5).map((l: any) => `${l.description} (${Math.round(l.score * 100)}%)`)
  }); // Enhanced debug logging

  return {
    labels: labels.map((label: any) => ({
      description: label.description,
      score: label.score
    })),
    objects: objects.map((obj: any) => ({
      name: obj.name,
      score: obj.score
    })),
    plantDiseaseDetected,
    suggestedDiseases,
    confidence: avgConfidence,
    isHealthyPlant,
    visualCharacteristics,
    diseaseType
  };
}

// Helper function to detect strong disease indicators
function hasStrongDiseaseIndicators(labels: any[]): boolean {
  const strongIndicators = ['blight', 'canker', 'wilt', 'rust', 'mildew', 'spot', 'rot', 'curl'];
  const diseaseTerms = ['disease', 'infection', 'fungus', 'pathogen', 'pest', 'damage'];
  
  // Check for definitive disease terms with high confidence
  const hasStrongSignal = labels.some((label: any) => 
    strongIndicators.some(indicator => 
      label.description.toLowerCase().includes(indicator) && label.score > 0.6
    )
  );
  
  // Also check for explicit disease terms
  const hasDiseaseTerms = labels.some((label: any) => 
    diseaseTerms.some(term => 
      label.description.toLowerCase().includes(term) && label.score > 0.7
    )
  );
  
  // Check for specific disease combinations (e.g., "black" + "spot")
  const labelText = labels.map(l => l.description.toLowerCase()).join(' ');
  const hasSpecificDiseases = (
    (labelText.includes('black') && labelText.includes('spot')) ||
    (labelText.includes('powdery') && labelText.includes('white')) ||
    (labelText.includes('rust') && labelText.includes('orange')) ||
    (labelText.includes('brown') && labelText.includes('spot'))
  );
  
  return hasStrongSignal || hasDiseaseTerms || hasSpecificDiseases;
}

// Intelligent disease matching based on visual characteristics
function matchDiseasesToVisualCharacteristics(labels: any[], visualCharacteristics: string[]): {
  suggestedDiseases: string[];
  diseaseType: 'fungal' | 'bacterial' | 'viral' | 'pest' | 'nutritional' | 'environmental';
  confidence: number;
} {
  const labelText = labels.map((l: any) => l.description.toLowerCase()).join(' ');
  const visualText = visualCharacteristics.join(' ').toLowerCase();
  const searchText = `${labelText} ${visualText}`;
  
  const matches: Array<{ disease: any; score: number; type: string }> = [];
  
  // Check each disease category
  Object.entries(COMPREHENSIVE_PLANT_DISEASES).forEach(([type, diseases]) => {
    diseases.forEach((disease: any) => {
      let score = 0;
      let matchCount = 0;
      
      // Score based on visual indicator matches
      disease.visualIndicators.forEach((indicator: string) => {
        if (searchText.includes(indicator.toLowerCase())) {
          score += 1;
          matchCount++;
        }
      });
      
      // Bonus for multiple matches
      if (matchCount > 1) {
        score += matchCount * 0.5;
      }
      
      // Penalty for conflicting indicators (e.g., if we see both healthy and disease indicators)
      const hasHealthyIndicators = ENHANCED_VISUAL_KEYWORDS.colors.healthy.some(healthy =>
        searchText.includes(healthy)
      );
      if (hasHealthyIndicators && type !== 'nutritional') {
        score *= 0.7;
      }
      
      if (score > 0) {
        matches.push({ disease, score, type });
      }
    });
  });
  
  // Sort by score and return top matches
  matches.sort((a, b) => b.score - a.score);
  
  const suggestedDiseases = matches.slice(0, 3).map(match => match.disease.name);
  const primaryType = matches.length > 0 ? matches[0].type as any : 'fungal';
  const confidence = matches.length > 0 ? Math.min(matches[0].score * 20, 95) : 0;
  
  return {
    suggestedDiseases,
    diseaseType: primaryType,
    confidence
  };
}

// Enhanced confidence calculation
function calculateEnhancedConfidence(
  labels: any[], 
  plantLabels: any[], 
  diseaseIndicators: any[], 
  healthyIndicators: any[]
): number {
  if (labels.length === 0) return 50;
  
  // Base confidence from Google Vision labels
  const avgLabelConfidence = labels.slice(0, 5).reduce((sum: number, label: any) => sum + label.score, 0) / Math.min(5, labels.length);
  
  // Boost confidence if we have clear plant identification
  let confidence = avgLabelConfidence * 100;
  if (plantLabels.length > 0) {
    confidence += 10;
  }
  
  // Adjust based on disease vs healthy indicators
  if (diseaseIndicators.length > healthyIndicators.length) {
    confidence += diseaseIndicators.length * 5; // More disease indicators = higher confidence in disease detection
  } else if (healthyIndicators.length > diseaseIndicators.length) {
    confidence += healthyIndicators.length * 3; // More healthy indicators = higher confidence in healthy plant
  }
  
  // Cap confidence at 95% (never 100% certain)
  return Math.min(Math.round(confidence), 95);
}

// Check if Google Vision API is configured
export const isVisionAPIConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_VISION_API_KEY;
  console.log('🔧 Vision API Config Check:', {
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey?.substring(0, 8) + '...' || 'none'
  });
  return !!apiKey;
};

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Get configuration status for UI display
export const getAIConfigurationStatus = () => {
  return {
    visionAPI: isVisionAPIConfigured(),
    configured: isVisionAPIConfigured(),
    message: isVisionAPIConfigured() 
      ? 'Using Google Vision API for real plant analysis with comprehensive disease detection'
      : 'Google Vision API not configured - plant analysis unavailable'
  };
};



// Export disease database for use in other components
export { COMPREHENSIVE_PLANT_DISEASES, ENHANCED_VISUAL_KEYWORDS }; 