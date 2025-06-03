// Mock Firebase utilities for the demo
// In a real app, these would interact with Firebase

import { PlantDiagnosis, Treatment } from './types';
import { analyzeImageWithVision } from './ai-vision';

// Enhanced mock diagnoses data with more Australian-specific diseases
const mockDiagnoses: PlantDiagnosis[] = [
  {
    id: '1',
    userId: 'user123',
    imageUrl: 'https://images.pexels.com/photos/7728056/pexels-photo-7728056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    diagnosis: {
      disease: 'Tomato Leaf Spot (Septoria)',
      confidence: 94,
      severity: 'moderate',
      description: 'Fungal infection causing circular spots on leaves with yellow halos. Common in humid Australian conditions. Can spread to stems and fruit if untreated.',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    treated: false,
    treatments: [
      {
        id: 't1',
        name: 'Copper Oxychloride Fungicide',
        type: 'chemical',
        instructions: [
          'Mix 20g per 10L of water',
          'Apply in early morning or late evening',
          'Spray all foliage including undersides of leaves',
          'Repeat every 14 days or after rain'
        ],
        cost: 18,
        apvmaNumber: 'APVMA 52851',
        suppliers: ['Bunnings', 'Garden City', 'Mitre 10'],
        safetyWarnings: [
          'Wear protective clothing and gloves',
          'Do not spray in windy conditions',
          'Keep away from waterways and fish ponds'
        ],
        webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=copper+oxychloride']
      },
      {
        id: 't2',
        name: 'Organic Neem Oil',
        type: 'organic',
        instructions: [
          'Mix 10ml neem oil with 5ml eco-friendly detergent per 1L water',
          'Test on small area first',
          'Apply weekly in cool conditions',
          'Avoid application during flowering'
        ],
        cost: 15,
        suppliers: ['Bunnings', 'Organic Garden Centre'],
        safetyWarnings: [
          'May cause skin irritation',
          'Keep away from beneficial insects during application'
        ],
        webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=neem+oil']
      }
    ]
  },
  {
    id: '2',
    userId: 'user123',
    imageUrl: 'https://images.pexels.com/photos/7728081/pexels-photo-7728081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    diagnosis: {
      disease: 'Rose Aphid Infestation',
      confidence: 98,
      severity: 'mild',
      description: 'Small green aphids clustered on new growth, causing leaf curl and stunted growth. Secretes honeydew that can lead to sooty mold. Common in Australian spring.',
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    treated: true,
    treatments: [
      {
        id: 't3',
        name: 'Pyrethrum Insect Spray',
        type: 'chemical',
        instructions: [
          'Shake well before use',
          'Spray directly onto affected areas',
          'Apply in early morning or evening',
          'Repeat after 7 days if necessary'
        ],
        cost: 24,
        apvmaNumber: 'APVMA 61234',
        suppliers: ['Bunnings', 'Mitre 10', 'Masters'],
        safetyWarnings: [
          'Toxic to bees - do not spray flowering plants',
          'Wear gloves and avoid inhaling spray',
          'Keep pets away from treated areas for 24 hours'
        ],
        webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=pyrethrum+spray']
      }
    ]
  },
  {
    id: '3',
    userId: 'user123',
    imageUrl: 'https://images.pexels.com/photos/7728039/pexels-photo-7728039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    diagnosis: {
      disease: 'Citrus Canker',
      confidence: 89,
      severity: 'severe',
      description: 'Bacterial disease causing raised corky lesions on leaves, stems, and fruit. Highly contagious and reportable in some Australian states. Can lead to defoliation and fruit drop.',
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    treated: false,
    treatments: [
      {
        id: 't4',
        name: 'Copper Hydroxide Bactericide',
        type: 'chemical',
        instructions: [
          'IMPORTANT: Contact local agriculture department first',
          'Mix according to label directions',
          'Apply preventatively to healthy tissue',
          'Remove and destroy infected plant material'
        ],
        cost: 32,
        apvmaNumber: 'APVMA 45123',
        suppliers: ['Agricultural Supply Stores', 'Rural Traders'],
        safetyWarnings: [
          'This is a notifiable disease in some states',
          'Contact Department of Agriculture before treatment',
          'Wear full protective equipment',
          'Dispose of infected material safely'
        ],
        webPurchaseLinks: ['https://www.google.com/search?q=copper+hydroxide+bactericide+australia']
      }
    ]
  }
];

// Australian-specific treatment database
const australianTreatments: Treatment[] = [
  {
    id: 'aus1',
    name: 'Eco-Oil Horticultural Spray',
    type: 'organic',
    instructions: [
      'Mix 10ml per 1L of water',
      'Add 1ml of eco-friendly wetting agent',
      'Spray thoroughly covering all plant surfaces',
      'Apply in cool conditions (below 25°C)'
    ],
    cost: 12,
    suppliers: ['Bunnings', 'Garden City', 'Independent Garden Centres'],
    safetyWarnings: [
      'Do not apply in hot weather or full sun',
      'Test on small area first to check plant tolerance'
    ],
    webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=eco+oil']
  },
  {
    id: 'aus2',
    name: 'Yates Fruit Fly Trap',
    type: 'cultural',
    instructions: [
      'Hang traps 1.5-2m high in fruit trees',
      'Place 2-4 traps per mature tree',
      'Replace lure every 6-8 weeks',
      'Check and empty trap weekly'
    ],
    cost: 25,
    suppliers: ['Bunnings', 'Mitre 10', 'Rural Stores'],
    safetyWarnings: [
      'Keep away from children and pets',
      'Dispose of used lures responsibly'
    ],
    webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=fruit+fly+trap']
  }
];

// Simulate uploading an image to Firebase Storage
export const uploadPlantImage = async (image: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Return a mock image URL
      resolve('https://images.pexels.com/photos/7728039/pexels-photo-7728039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
    }, 1500);
  });
};

// Simulate analyzing the image with AI
export const analyzePlantImage = async (imageFile: File): Promise<string> => {
  try {
    // Use the new AI vision analysis
    const visionResult = await analyzeImageWithVision(imageFile);
    
    // Create a more sophisticated diagnosis based on AI analysis
    const diagnosisId = `diagnosis-${Date.now()}`;
    
    // Store the enhanced diagnosis (in production, this would go to Firebase)
    const enhancedDiagnosis: PlantDiagnosis = {
      id: diagnosisId,
      userId: 'user123',
      imageUrl: URL.createObjectURL(imageFile), // In demo mode, use object URL
      diagnosis: {
        disease: visionResult.suggestedDiseases[0] || 'Unknown Plant Issue',
        confidence: visionResult.confidence,
        severity: visionResult.confidence > 95 ? 'severe' : 
                  visionResult.confidence > 85 ? 'moderate' : 'mild',
        description: `AI analysis detected plant health concerns with ${visionResult.confidence}% confidence. ${visionResult.plantDiseaseDetected ? 'Disease indicators found in image.' : 'No clear disease indicators detected.'}`,
        metadata: {
          aiLabels: visionResult.labels.slice(0, 5),
          detectedObjects: visionResult.objects,
          analysisTimestamp: new Date().toISOString()
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      treated: false,
      treatments: getRelevantTreatments(visionResult.suggestedDiseases[0])
    };
    
    console.log('🔍 Storing diagnosis with key:', diagnosisId);
    console.log('🔍 Diagnosis data:', enhancedDiagnosis);
    
    // In demo mode, store in sessionStorage for immediate retrieval
    // Don't double-prefix the key since diagnosisId already includes 'diagnosis-'
    sessionStorage.setItem(diagnosisId, JSON.stringify(enhancedDiagnosis));
    
    return diagnosisId;
  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Fallback to original mock behavior
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('new-diagnosis-123');
      }, 2000);
    });
  }
};

// Get relevant treatments based on diagnosed disease
function getRelevantTreatments(disease?: string): Treatment[] {
  if (!disease) return australianTreatments.slice(0, 2);
  
  // Map diseases to appropriate treatments
  const treatmentMap: { [key: string]: Treatment[] } = {
    'Tomato Leaf Spot (Septoria)': [
      {
        id: 'tls1',
        name: 'Copper Hydroxide Fungicide',
        type: 'chemical',
        instructions: [
          'Mix 2g per 1L water',
          'Spray every 10-14 days',
          'Cover all leaf surfaces thoroughly',
          'Apply preventatively to healthy plants'
        ],
        cost: 18,
        apvmaNumber: 'APVMA 67890',
        suppliers: ['Bunnings', 'Garden City', 'Rural Stores'],
        safetyWarnings: [
          'Wear gloves and eye protection',
          'Do not apply in windy conditions',
          'Toxic to fish - avoid water contamination'
        ],
        webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=copper+hydroxide']
      }
    ],
    'Rose Aphid Infestation': [
      {
        id: 'ra1',
        name: 'Pyrethrum Insecticide',
        type: 'organic',
        instructions: [
          'Spray directly on aphids',
          'Apply in early morning or evening',
          'Repeat every 3-5 days if needed',
          'Target undersides of leaves'
        ],
        cost: 14,
        suppliers: ['Bunnings', 'Independent Garden Centres'],
        safetyWarnings: [
          'Toxic to bees - do not spray flowering plants',
          'Keep away from waterways'
        ],
        webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=pyrethrum+spray']
      }
    ],
    'Citrus Canker': [
      {
        id: 'cc1',
        name: 'Copper-based Bactericide',
        type: 'chemical',
        instructions: [
          'IMPORTANT: Citrus canker is a notifiable disease',
          'Contact Department of Agriculture immediately',
          'Do not move infected plant material',
          'Professional treatment may be required'
        ],
        cost: 0,
        apvmaNumber: 'Restricted Use',
        suppliers: ['Agricultural Consultants Only'],
        safetyWarnings: [
          'This is a serious exotic disease',
          'Legal requirements apply',
          'Professional assessment required'
        ],
        webPurchaseLinks: []
      }
    ]
  };
  
  return treatmentMap[disease] || australianTreatments.slice(0, 2);
}

// Simulate getting all diagnoses for a user
export const getUserDiagnoses = async (userId?: string): Promise<PlantDiagnosis[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Return mock diagnoses
      resolve(mockDiagnoses);
    }, 1000);
  });
};

// Simulate getting a specific diagnosis by ID
export const getDiagnosisById = async (id: string): Promise<PlantDiagnosis> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      console.log('🔍 Looking for diagnosis with ID:', id);
      
      // First check sessionStorage for AI-generated diagnoses
      const sessionKey = id.startsWith('diagnosis-') ? id : `diagnosis-${id}`;
      const sessionDiagnosis = sessionStorage.getItem(sessionKey);
      console.log('🔍 Checking sessionStorage with key:', sessionKey);
      
      if (sessionDiagnosis) {
        console.log('🔍 Found diagnosis in sessionStorage');
        try {
          const parsed = JSON.parse(sessionDiagnosis);
          resolve(parsed);
          return;
        } catch (parseError) {
          console.error('🚨 Error parsing sessionStorage diagnosis:', parseError);
        }
      }
      
      // Check mock diagnoses
      const diagnosis = mockDiagnoses.find((d) => d.id === id);
      
      if (diagnosis) {
        console.log('🔍 Found diagnosis in mock data');
        resolve(diagnosis);
      } else if (id === 'new-diagnosis-123') {
        console.log('🔍 Returning fallback diagnosis');
        // Return a new diagnosis for the demo
        resolve({
          id: 'new-diagnosis-123',
          userId: 'user123',
          imageUrl: 'https://images.pexels.com/photos/7728039/pexels-photo-7728039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          diagnosis: {
            disease: 'Powdery Mildew',
            confidence: 96,
            severity: 'moderate',
            description: 'Fungal disease causing white powdery spots on leaves and stems. Thrives in humid Australian conditions with poor air circulation. Common in roses, cucumbers, and grapes.',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          treated: false,
          treatments: [
            {
              id: 'pm1',
              name: 'Potassium Bicarbonate Spray',
              type: 'organic',
              instructions: [
                'Mix 5g potassium bicarbonate per 1L water',
                'Add 2ml horticultural oil for better coverage',
                'Spray weekly until symptoms disappear',
                'Apply in early morning or late evening'
              ],
              cost: 8,
              suppliers: ['Health Food Stores', 'Online Suppliers'],
              safetyWarnings: [
                'Food-grade potassium bicarbonate only',
                'Test on small area first'
              ],
              webPurchaseLinks: ['https://www.google.com/search?q=potassium+bicarbonate+australia']
            },
            {
              id: 'pm2',
              name: 'Systemic Fungicide (Myclobutanil)',
              type: 'chemical',
              instructions: [
                'Follow label directions exactly',
                'Apply at first sign of disease',
                'Do not exceed recommended application rate',
                'Withholding period applies for edible crops'
              ],
              cost: 28,
              apvmaNumber: 'APVMA 54321',
              suppliers: ['Garden Centres', 'Agricultural Suppliers'],
              safetyWarnings: [
                'Wear protective clothing and respirator',
                'Do not apply to food crops within withholding period',
                'Toxic to aquatic life'
              ],
              webPurchaseLinks: ['https://www.bunnings.com.au/search/products?q=systemic+fungicide']
            }
          ]
        });
      } else {
        console.error('🚨 Diagnosis not found for ID:', id);
        reject(new Error('Diagnosis not found'));
      }
    }, 1000);
  });
};

// Get Australian-compliant treatments
export const getAustralianTreatments = async (): Promise<Treatment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(australianTreatments);
    }, 500);
  });
};

// Simulate weather-based alerts
export const getWeatherAlerts = async (postcode: string): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'w1',
          type: 'pest_warning',
          title: 'Fruit Fly Activity High',
          description: 'Warm, humid conditions are ideal for fruit fly breeding. Check traps and harvest fruit early.',
          severity: 'moderate',
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'w2',
          type: 'disease_warning',
          title: 'Fungal Disease Risk',
          description: 'High humidity and warm temperatures increase risk of powdery mildew and black spot.',
          severity: 'mild',
          validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    }, 800);
  });
};