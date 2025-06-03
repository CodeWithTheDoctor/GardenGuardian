export interface PlantDiagnosis {
  id: string;
  userId: string;
  imageUrl?: string;
  diagnosis: {
    disease: string;
    confidence: number;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    metadata?: {
      aiLabels?: Array<{
        description: string;
        score: number;
      }>;
      detectedObjects?: Array<{
        name: string;
        score: number;
      }>;
      analysisTimestamp?: string;
    };
  };
  createdAt: string | Date;
  updatedAt: string | Date;
  treated?: boolean;
  treatments?: Treatment[];
}

export interface Treatment {
  id: string;
  name: string;
  type: 'organic' | 'chemical' | 'cultural';
  instructions: string[];
  cost: number;
  apvmaNumber?: string; // Australian compliance
  suppliers: string[];
  safetyWarnings: string[];
  webPurchaseLinks?: string[]; // Direct web links to purchase
}

export interface UserPreferences {
  organicOnly: boolean;
  budgetLimit: number;
}

export interface User {
  id: string;
  email: string;
  location?: {
    postcode: string;
    state: string;
    climateZone: string;
  };
  preferences?: UserPreferences;
}