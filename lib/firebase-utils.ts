// Mock Firebase utilities for the demo
// In a real app, these would interact with Firebase

import { PlantDiagnosis, Treatment } from './types';

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
export const analyzePlantImage = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate AI processing delay
    setTimeout(() => {
      // Return a mock diagnosis ID
      resolve('new-diagnosis-123');
    }, 2000);
  });
};

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
      const diagnosis = mockDiagnoses.find((d) => d.id === id);
      
      if (diagnosis) {
        resolve(diagnosis);
      } else if (id === 'new-diagnosis-123') {
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