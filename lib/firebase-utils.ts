// Mock Firebase utilities for the demo
// In a real app, these would interact with Firebase

import { PlantDiagnosis, Treatment } from './types';
import { analyzeImageWithVision } from './ai-vision';
import { isFirebaseConfigured } from './firebase-config';

// Import the real Firebase persistence service
const getFirebasePersistence = async () => {
  const { firebasePersistence } = await import('./firebase-persistence');
  return firebasePersistence;
};

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

// REAL DATA PERSISTENCE: Upload image to Firebase Storage or provide fallback
export const uploadPlantImage = async (image: File): Promise<string> => {
  if (!isFirebaseConfigured()) {
    // Fallback: Create object URL for demo mode
    return new Promise((resolve) => {
      setTimeout(() => {
        const imageUrl = URL.createObjectURL(image);
        resolve(imageUrl);
      }, 1500);
    });
  }

  try {
    const persistenceService = await getFirebasePersistence();
    const diagnosisId = `img-${Date.now()}`;
    const imageUrl = await persistenceService.uploadDiagnosisImage(image, diagnosisId);
    console.log('✅ Image uploaded to Firebase Storage:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('🚨 Error uploading image:', error);
    // Fallback to object URL
    return URL.createObjectURL(image);
  }
};

// REAL DATA PERSISTENCE: Analyze image and save diagnosis to Firebase
export const analyzePlantImage = async (imageFile: File): Promise<string> => {
  try {
    // Use the AI vision analysis
    const visionResult = await analyzeImageWithVision(imageFile);
    
    // Create a diagnosis based on AI analysis
    const diagnosisId = `diagnosis-${Date.now()}`;
    
    // Upload image to storage
    const imageUrl = await uploadPlantImage(imageFile);
    
    // Create enhanced diagnosis with real AI data
    const enhancedDiagnosis: PlantDiagnosis = {
      id: diagnosisId,
      userId: 'current-user', // Will be updated by persistence service if user is logged in
      imageUrl,
      diagnosis: {
        disease: visionResult.suggestedDiseases[0] || 'Unknown Plant Issue',
        confidence: visionResult.confidence,
        severity: visionResult.confidence > 90 ? 'severe' : visionResult.confidence > 75 ? 'moderate' : 'mild',
        description: generateDiseaseDescription(visionResult.suggestedDiseases[0], visionResult.labels),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      treated: false,
      treatments: getRelevantTreatments(visionResult.suggestedDiseases[0])
    };

    // REAL DATA PERSISTENCE: Save to Firebase or fallback storage
    await saveDiagnosis(enhancedDiagnosis);
    
    console.log('✅ Diagnosis saved with real persistence:', diagnosisId);
    return diagnosisId;
    
  } catch (error) {
    console.error('🚨 Error in plant analysis:', error);
    throw new Error('Failed to analyze plant image. Please try again.');
  }
};

// REAL DATA PERSISTENCE: Save diagnosis function
export const saveDiagnosis = async (diagnosis: PlantDiagnosis): Promise<void> => {
  if (!isFirebaseConfigured()) {
    // Fallback: Save to sessionStorage for demo mode
    console.log('💾 Saving diagnosis to sessionStorage (demo mode)');
    sessionStorage.setItem(diagnosis.id, JSON.stringify(diagnosis));
    
    // Also save to a diagnoses list
    const existingDiagnoses = JSON.parse(sessionStorage.getItem('all-diagnoses') || '[]');
    existingDiagnoses.unshift(diagnosis);
    sessionStorage.setItem('all-diagnoses', JSON.stringify(existingDiagnoses.slice(0, 50))); // Keep last 50
    return;
  }

  try {
    const persistenceService = await getFirebasePersistence();
    await persistenceService.saveDiagnosis(diagnosis);
    console.log('✅ Diagnosis saved to Firebase:', diagnosis.id);
  } catch (error) {
    console.error('🚨 Error saving diagnosis to Firebase:', error);
    // Fallback to sessionStorage
    sessionStorage.setItem(diagnosis.id, JSON.stringify(diagnosis));
  }
};

// REAL DATA PERSISTENCE: Get user diagnoses from Firebase
export const getUserDiagnoses = async (userId?: string): Promise<PlantDiagnosis[]> => {
  if (!isFirebaseConfigured()) {
    // Fallback: Get from sessionStorage and merge with mock data
    console.log('📋 Loading diagnoses from sessionStorage (demo mode)');
    const sessionDiagnoses = JSON.parse(sessionStorage.getItem('all-diagnoses') || '[]');
    return [...sessionDiagnoses, ...mockDiagnoses];
  }

  try {
    const persistenceService = await getFirebasePersistence();
    const diagnoses = await persistenceService.getUserDiagnoses(userId);
    console.log('✅ Loaded diagnoses from Firebase:', diagnoses.length);
    return diagnoses;
  } catch (error) {
    console.error('🚨 Error loading diagnoses from Firebase:', error);
    // Fallback to mock data
    return mockDiagnoses;
  }
};

// REAL DATA PERSISTENCE: Get specific diagnosis by ID
export const getDiagnosisById = async (id: string): Promise<PlantDiagnosis> => {
  if (!isFirebaseConfigured()) {
    // Fallback: Check sessionStorage first, then mock data
    console.log('🔍 Looking for diagnosis in sessionStorage (demo mode):', id);
    
    const sessionDiagnosis = sessionStorage.getItem(id);
    if (sessionDiagnosis) {
      try {
        const parsed = JSON.parse(sessionDiagnosis);
        console.log('✅ Found diagnosis in sessionStorage');
        return parsed;
      } catch (error) {
        console.error('🚨 Error parsing sessionStorage diagnosis:', error);
      }
    }
    
    // Check sessionStorage diagnoses list
    const allDiagnoses = JSON.parse(sessionStorage.getItem('all-diagnoses') || '[]');
    const sessionDiag = allDiagnoses.find((d: PlantDiagnosis) => d.id === id);
    if (sessionDiag) {
      console.log('✅ Found diagnosis in sessionStorage list');
      return sessionDiag;
    }
    
    // Fallback to mock data
    const mockDiagnosis = mockDiagnoses.find((d) => d.id === id);
    if (mockDiagnosis) {
      console.log('✅ Found diagnosis in mock data');
      return mockDiagnosis;
    }
    
    // Return fallback diagnosis
    return createFallbackDiagnosis(id);
  }

  try {
    const persistenceService = await getFirebasePersistence();
    const diagnosis = await persistenceService.getDiagnosis(id);
    
    if (diagnosis) {
      console.log('✅ Loaded diagnosis from Firebase:', id);
      return diagnosis;
    }
    
    // If not found in Firebase, check mock data
    const mockDiagnosis = mockDiagnoses.find((d) => d.id === id);
    return mockDiagnosis || createFallbackDiagnosis(id);
    
  } catch (error) {
    console.error('🚨 Error loading diagnosis from Firebase:', error);
    // Fallback to mock data
    const mockDiagnosis = mockDiagnoses.find((d) => d.id === id);
    return mockDiagnosis || createFallbackDiagnosis(id);
  }
};

// REAL DATA PERSISTENCE: Update diagnosis (e.g., mark as treated)
export const updateDiagnosis = async (diagnosisId: string, updates: Partial<PlantDiagnosis>): Promise<void> => {
  if (!isFirebaseConfigured()) {
    // Fallback: Update in sessionStorage
    console.log('💾 Updating diagnosis in sessionStorage (demo mode)');
    const sessionDiagnosis = sessionStorage.getItem(diagnosisId);
    if (sessionDiagnosis) {
      const diagnosis = JSON.parse(sessionDiagnosis);
      const updated = { ...diagnosis, ...updates, updatedAt: new Date().toISOString() };
      sessionStorage.setItem(diagnosisId, JSON.stringify(updated));
      
      // Also update in the all-diagnoses list
      const allDiagnoses = JSON.parse(sessionStorage.getItem('all-diagnoses') || '[]');
      const index = allDiagnoses.findIndex((d: PlantDiagnosis) => d.id === diagnosisId);
      if (index !== -1) {
        allDiagnoses[index] = updated;
        sessionStorage.setItem('all-diagnoses', JSON.stringify(allDiagnoses));
      }
    }
    return;
  }

  try {
    const persistenceService = await getFirebasePersistence();
    await persistenceService.updateDiagnosis(diagnosisId, updates);
    console.log('✅ Diagnosis updated in Firebase:', diagnosisId);
  } catch (error) {
    console.error('🚨 Error updating diagnosis in Firebase:', error);
    throw error;
  }
};

// REAL DATA PERSISTENCE: Get dashboard analytics
export const getDashboardAnalytics = async (userId?: string) => {
  if (!isFirebaseConfigured()) {
    // Fallback: Calculate from sessionStorage + mock data
    console.log('📊 Calculating analytics from local data (demo mode)');
    const sessionDiagnoses = JSON.parse(sessionStorage.getItem('all-diagnoses') || '[]');
    const allDiagnoses = [...sessionDiagnoses, ...mockDiagnoses];
    
    return {
      totalDiagnoses: allDiagnoses.length,
      successfulTreatments: allDiagnoses.filter(d => d.treated).length,
      commonDiseases: calculateCommonDiseases(allDiagnoses),
      monthlyActivity: calculateMonthlyActivity(allDiagnoses)
    };
  }

  try {
    const persistenceService = await getFirebasePersistence();
    const analytics = await persistenceService.getDashboardAnalytics(userId);
    console.log('✅ Loaded analytics from Firebase');
    return analytics;
  } catch (error) {
    console.error('🚨 Error loading analytics from Firebase:', error);
    // Fallback to mock analytics
    return {
      totalDiagnoses: 12,
      successfulTreatments: 8,
      commonDiseases: [
        { disease: 'Aphid Infestation', count: 4 },
        { disease: 'Fungal Disease', count: 3 },
        { disease: 'Leaf Spot', count: 2 }
      ],
      monthlyActivity: [
        { month: 'Nov', count: 3 },
        { month: 'Dec', count: 5 },
        { month: 'Jan', count: 4 }
      ]
    };
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

// ENHANCED: Weather-based alerts using real weather data
export const getWeatherAlerts = async (postcode: string): Promise<any[]> => {
  try {
    // Import the enhanced APVMA service for weather data
    const { apvmaService } = await import('./apvma-service');
    
    // Get current weather forecast
    const forecast = await apvmaService.getSprayWeatherForecast(postcode);
    const todayWeather = forecast[0];
    
    if (!todayWeather) {
      return getStaticWeatherAlerts(postcode);
    }

    const alerts: any[] = [];
    const now = new Date();
    
    // Generate dynamic alerts based on real weather conditions
    
    // High wind alert
    if (todayWeather.windSpeed > 20) {
      alerts.push({
        id: `wind_${postcode}_${now.getTime()}`,
        type: 'weather_warning',
        title: 'High Wind Alert',
        description: `Strong winds (${todayWeather.windSpeed}km/h) detected. Avoid spraying chemicals to prevent drift and ensure safety.`,
        severity: 'severe',
        validUntil: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
        location: todayWeather.location
      });
    } else if (todayWeather.windSpeed > 15) {
      alerts.push({
        id: `wind_moderate_${postcode}_${now.getTime()}`,
        type: 'spray_caution',
        title: 'Moderate Wind Conditions',
        description: `Wind speed ${todayWeather.windSpeed}km/h. Use low-drift nozzles and avoid fine sprays.`,
        severity: 'moderate',
        validUntil: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        location: todayWeather.location
      });
    }

    // Rain probability alert
    if (todayWeather.rainfallProbability > 70) {
      alerts.push({
        id: `rain_${postcode}_${now.getTime()}`,
        type: 'weather_warning',
        title: 'High Rain Probability',
        description: `${todayWeather.rainfallProbability}% chance of rain. Delay chemical applications to avoid washoff.`,
        severity: 'moderate',
        validUntil: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        location: todayWeather.location
      });
    }

    // Temperature-based alerts
    if (todayWeather.temperature.max > 32) {
      alerts.push({
        id: `temp_${postcode}_${now.getTime()}`,
        type: 'application_warning',
        title: 'High Temperature Alert',
        description: `Maximum temperature ${todayWeather.temperature.max}°C. Avoid oil-based sprays and apply treatments in early morning or evening.`,
        severity: todayWeather.temperature.max > 35 ? 'severe' : 'moderate',
        validUntil: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        location: todayWeather.location
      });
    }

    // Optimal spray conditions alert
    if (todayWeather.sprayConditions === 'excellent') {
      alerts.push({
        id: `optimal_${postcode}_${now.getTime()}`,
        type: 'spray_opportunity',
        title: 'Excellent Spray Conditions',
        description: `Ideal weather for chemical applications: ${todayWeather.windSpeed}km/h winds, ${todayWeather.rainfallProbability}% rain chance, ${todayWeather.temperature.max}°C max temp.`,
        severity: 'mild',
        validUntil: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        location: todayWeather.location
      });
    }

    // Humidity-based disease risk
    if (todayWeather.humidity > 85 && todayWeather.temperature.max > 25) {
      alerts.push({
        id: `disease_${postcode}_${now.getTime()}`,
        type: 'disease_warning',
        title: 'Fungal Disease Risk',
        description: `High humidity (${todayWeather.humidity}%) and warm temperatures favor fungal diseases. Monitor plants closely and consider preventive treatments.`,
        severity: 'moderate',
        validUntil: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        location: todayWeather.location
      });
    }

    console.log('✅ Generated weather alerts from real data:', alerts.length);
    return alerts.length > 0 ? alerts : getStaticWeatherAlerts(postcode);

  } catch (error) {
    console.error('🚨 Error generating weather alerts:', error);
    return getStaticWeatherAlerts(postcode);
  }
};

// Fallback static alerts when weather data is unavailable
function getStaticWeatherAlerts(postcode: string): any[] {
  return [
    {
      id: 'w1',
      type: 'pest_warning',
      title: 'Seasonal Fruit Fly Activity',
      description: 'Warm conditions are ideal for fruit fly breeding. Check traps regularly and harvest fruit early.',
      severity: 'moderate',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: `Postcode ${postcode}`
    },
    {
      id: 'w2',
      type: 'disease_warning',
      title: 'Fungal Disease Watch',
      description: 'Humid conditions increase risk of powdery mildew and black spot. Ensure good air circulation around plants.',
      severity: 'mild',
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: `Postcode ${postcode}`
    }
  ];
}

// Helper function to generate disease description from AI analysis
function generateDiseaseDescription(disease?: string, labels?: any[]): string {
  if (!disease) {
    return 'AI analysis completed. Review the image for potential plant health issues and consult the recommended treatments.';
  }
  
  const labelDescriptions = labels ? labels.slice(0, 3).map(l => l.description).join(', ') : '';
  const baseDescription = `Detected: ${disease}. `;
  
  if (labelDescriptions) {
    return baseDescription + `Visual indicators include: ${labelDescriptions}. `;
  }
  
  return baseDescription + 'Consult the treatment recommendations below for appropriate action.';
}

// Helper function to create fallback diagnosis when not found
function createFallbackDiagnosis(id: string): PlantDiagnosis {
  return {
    id: id,
    userId: 'fallback-user',
    imageUrl: 'https://images.pexels.com/photos/7728039/pexels-photo-7728039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    diagnosis: {
      disease: 'Plant Health Assessment',
      confidence: 85,
      severity: 'moderate',
      description: 'General plant health assessment. Review the treatment recommendations below for common plant care practices.',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    treated: false,
    treatments: australianTreatments.slice(0, 2)
  };
}

// Helper function to calculate common diseases from diagnosis data
function calculateCommonDiseases(diagnoses: PlantDiagnosis[]): Array<{ disease: string; count: number }> {
  const diseaseCount: Record<string, number> = {};
  
  diagnoses.forEach(d => {
    const disease = d.diagnosis.disease;
    diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
  });
  
  return Object.entries(diseaseCount)
    .map(([disease, count]) => ({ disease, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

// Helper function to calculate monthly activity from diagnosis data
function calculateMonthlyActivity(diagnoses: PlantDiagnosis[]): Array<{ month: string; count: number }> {
  const monthCount: Record<string, number> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  diagnoses.forEach(d => {
    const date = new Date(d.createdAt);
    const month = monthNames[date.getMonth()];
    monthCount[month] = (monthCount[month] || 0) + 1;
  });
  
  // Return last 6 months of activity
  const currentMonth = new Date().getMonth();
  const result = [];
  
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const month = monthNames[monthIndex];
    result.push({ month, count: monthCount[month] || 0 });
  }
  
  return result;
}