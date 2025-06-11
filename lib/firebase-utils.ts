// Mock Firebase utilities for the demo
// In a real app, these would interact with Firebase

import { PlantDiagnosis, Treatment } from './types';
import { analyzeImageWithGemini } from './gemini-vision';
import { isFirebaseConfigured, auth } from './firebase-config';
import { FIREBASE_ERRORS, throwConfigurationError } from './error-handling';

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

// REAL DATA PERSISTENCE: Upload image via API route or provide base64 fallback
export const uploadPlantImage = async (image: File): Promise<string> => {
  if (!isFirebaseConfigured()) {
    // Fallback: Convert to base64 data URL for demo mode (works in production)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        console.log('📦 Image converted to base64 for demo mode');
        resolve(base64Url);
      };
      reader.onerror = () => {
        console.error('🚨 Error converting image to base64');
        reject(new Error('Failed to process image'));
      };
      reader.readAsDataURL(image);
    });
  }

  try {
    // Compress image before upload for better performance
    const compressedImage = await compressImage(image);
    
    // Use Next.js API route for server-side upload
    const diagnosisId = `img-${Date.now()}`;
    const formData = new FormData();
    formData.append('file', compressedImage);
    formData.append('diagnosisId', diagnosisId);
    formData.append('userId', 'demo-user-001'); // Use consistent demo user ID
    
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }
    
    const result = await response.json();
    console.log('✅ Image uploaded via API route:', result.imageUrl);
    return result.imageUrl;
    
  } catch (error) {
    console.error('🚨 Error uploading image via API route:', error);
    
    // Fallback to base64 if API upload fails
    console.log('💾 Falling back to base64 conversion');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Url = reader.result as string;
        console.log('📦 Image converted to base64 as fallback');
        resolve(base64Url);
      };
      reader.onerror = () => {
        console.error('🚨 Error converting image to base64');
        reject(new Error('Failed to process image'));
      };
      reader.readAsDataURL(image);
    });
  }
};

/**
 * Compress image for better performance and storage efficiency
 */
const compressImage = async (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            console.log(`📦 Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB`);
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => resolve(file); // Fallback to original
    img.src = URL.createObjectURL(file);
  });
};

// INTELLIGENT PLANT ANALYSIS: Analyze image with Gemini 2.0 Flash and save diagnosis
export const analyzePlantImage = async (imageFile: File): Promise<string> => {
  try {
    // Use retry mechanism for AI analysis
    return await retryOperation(
      async () => {
        // Create proper diagnosis object with unique ID
        const diagnosisId = `diagnosis-${Date.now()}`;
        
        // Handle image upload properly for both Firebase and demo modes
        const imageUrl = await uploadPlantImage(imageFile);
        
        const result = await analyzeImageWithGemini(imageFile, imageUrl);
        
        console.log('🤖 Raw Gemini analysis result:', result);
        
        // Get current user ID - check authentication first
        let userId = 'demo-user-001'; // fallback default
        
        if (isFirebaseConfigured() && auth.currentUser) {
          // Use authenticated user's ID
          userId = auth.currentUser.uid;
          console.log('🔍 Using authenticated user ID:', userId);
        } else if (!isFirebaseConfigured()) {
          // Check for demo user in localStorage
          const demoUser = localStorage.getItem('demo-user');
          if (demoUser) {
            try {
              const userData = JSON.parse(demoUser);
              userId = userData.id || 'demo-user-001';
              console.log('🔍 Using demo user ID:', userId);
            } catch (err) {
              console.warn('🔍 Failed to parse demo user data, using default');
            }
          }
        } else {
          console.log('🔍 No authenticated user, using default demo user ID');
        }
        
        // Convert Gemini treatments to our Treatment interface
        const convertedTreatments: Treatment[] = result.treatmentRecommendations.map((treatment, index) => ({
          id: `gemini-${index}`,
          name: treatment.name,
          type: treatment.type,
          instructions: [
            treatment.application, 
            treatment.timing,
            '⚠️ VERIFY: Check product registration at portal.apvma.gov.au',
            '⚠️ CONSULT: Seek professional agricultural advice before use'
          ],
          cost: parseFloat(treatment.cost.replace(/[^0-9.]/g, '')) || 0,
          suppliers: [treatment.availability],
          safetyWarnings: [
            treatment.safetyNotes,
            'This is an AI-generated suggestion requiring professional verification',
            'Always read and follow product labels exactly'
          ],
          webPurchaseLinks: treatment.bunningsAvailable ? ['https://www.bunnings.com.au'] : []
        }));
        
        const diagnosisObject: PlantDiagnosis = {
          id: diagnosisId,
          userId: userId,
          imageUrl: imageUrl,
          diagnosis: {
            disease: result.diagnosis,
            confidence: result.confidence,
            severity: result.severity,
            description: result.description,
            plantHealth: result.plantHealth,
            additionalNotes: result.additionalNotes,
            metadata: {
              analysisTimestamp: result.analysisTimestamp,
              geminiAnalysis: true
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          treated: result.plantHealth === 'healthy',
          treatments: convertedTreatments
        };
        
        // Save the diagnosis
        await saveDiagnosis(diagnosisObject);
        console.log('✅ Gemini diagnosis saved with ID:', diagnosisId);
        
        // Return the proper diagnosis ID
        return diagnosisId;
      },
      3, // max retries
      2000 // delay between retries
    );
  } catch (error) {
    console.error('🚨 Gemini analysis failed after retries:', error);
    
    // Provide user-friendly error message
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        throw new Error('Daily analysis limit reached. Please try again tomorrow or upgrade your plan.');
      } else if (error.message.includes('network')) {
        throw new Error('Network connection issue. Please check your internet and try again.');
      } else if (error.message.includes('format')) {
        throw new Error('Image format not supported. Please try a different image.');
      } else if (error.message.includes('GEMINI_VISION_NOT_CONFIGURED')) {
        throw new Error('Gemini AI is not configured. Please set up your API key.');
      }
    }
    
    throw new Error('Unable to analyze image. Please try again or contact support if the issue persists.');
  }
};

// REAL DATA PERSISTENCE: Save diagnosis function with enhanced error handling
export const saveDiagnosis = async (diagnosis: PlantDiagnosis): Promise<void> => {
  try {
    await retryOperation(async () => {
      if (!isFirebaseConfigured()) {
        // Enhanced demo mode with better error simulation
        if (Math.random() < 0.05) { // 5% chance of simulated error
          throw new Error('demo_network_error');
        }
        
        console.log('💾 Saving diagnosis to sessionStorage (demo mode)');
        sessionStorage.setItem(diagnosis.id, JSON.stringify(diagnosis));
        
        const existingDiagnoses = JSON.parse(sessionStorage.getItem('all-diagnoses') || '[]');
        existingDiagnoses.unshift(diagnosis);
        sessionStorage.setItem('all-diagnoses', JSON.stringify(existingDiagnoses.slice(0, 50)));
        return;
      }

      const persistenceService = await getFirebasePersistence();
      await persistenceService.saveDiagnosis(diagnosis);
      console.log('✅ Diagnosis saved to Firebase:', diagnosis.id);
    }, 3, 1000);
  } catch (error) {
    console.error('🚨 Error saving diagnosis:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message === 'demo_network_error') {
        throw new Error('Simulated network error in demo mode. This would retry automatically in production.');
      } else if (error.message.includes('permission-denied')) {
        throw new Error('Permission denied. Please log in again.');
      } else if (error.message.includes('quota-exceeded')) {
        throw new Error('Storage quota exceeded. Please contact support.');
      }
    }
    
    // Fallback to sessionStorage as last resort
    try {
      sessionStorage.setItem(diagnosis.id, JSON.stringify(diagnosis));
      console.log('📝 Diagnosis saved to local storage as fallback');
    } catch (fallbackError) {
      throw new Error('Unable to save diagnosis. Please check your internet connection and try again.');
    }
  }
};

/**
 * Retry mechanism for operations that might fail temporarily
 */
const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(`⚠️ Attempt ${attempt} failed:`, error);

      // Don't retry certain types of errors
      if (error instanceof Error) {
        if (error.message.includes('permission-denied') || 
            error.message.includes('invalid-argument') ||
            error.message.includes('not-found')) {
          throw error; // These won't resolve with retries
        }
      }

      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${delay * attempt}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError!;
};

/**
 * Generate diagnosis from AI analysis results
 */
const generateDiagnosisFromAnalysis = (result: any): string => {
  console.log('🔍 DIAGNOSIS GENERATION DEBUG:', {
    isHealthyPlant: result.isHealthyPlant,
    plantDiseaseDetected: result.plantDiseaseDetected,
    suggestedDiseases: result.suggestedDiseases,
    confidence: result.confidence,
    totalLabels: result.labels?.length || 0
  });

  // PRIORITY 1: Check for actual disease detection FIRST
  if (result.plantDiseaseDetected && result.suggestedDiseases?.length > 0) {
    console.log('✅ Disease detected:', result.suggestedDiseases[0]);
    return result.suggestedDiseases[0];
  }
  
  // PRIORITY 2: Check disease-related labels even if AI didn't flag as disease
  const labels = result.labels || [];
  const diseaseLabels = labels.filter((label: any) => {
    const desc = label.description.toLowerCase();
    return desc.includes('disease') || desc.includes('damage') || desc.includes('pest') ||
           desc.includes('spot') || desc.includes('blight') || desc.includes('rust') ||
           desc.includes('mildew') || desc.includes('black') || desc.includes('brown') ||
           desc.includes('yellow') || desc.includes('wilt') || desc.includes('rot');
  });
  
  if (diseaseLabels.length > 0) {
    console.log('⚠️ Disease labels found:', diseaseLabels.map((l: any) => l.description));
    return `Potential ${diseaseLabels[0].description} detected`;
  }
  
  // PRIORITY 3: Only mark as healthy if explicitly detected as healthy
  if (result.isHealthyPlant === true) {
    console.log('✅ Confirmed healthy plant');
    return 'Healthy Plant Detected';
  }
  
  // PRIORITY 4: Check for plant labels
  const plantLabels = labels.filter((label: any) => 
    label.description.toLowerCase().includes('plant') ||
    label.description.toLowerCase().includes('leaf') ||
    label.description.toLowerCase().includes('vegetation')
  );
  
  // Only assume healthy if we have plant labels AND no disease concerns
  if (plantLabels.length > 0 && diseaseLabels.length === 0) {
    console.log('🌱 Plant detected with no disease indicators');
    return 'Plant Health Assessment - No Issues Detected';
  }
  
  console.log('❓ Uncertain analysis result');
  return 'Plant analysis completed - check results for details';
};

// REAL DATA PERSISTENCE: Get user diagnoses from Firebase  
export const getUserDiagnoses = async (userId?: string): Promise<PlantDiagnosis[]> => {
  if (!isFirebaseConfigured()) {
    console.error('Firebase not configured - cannot load user diagnoses');
    throwConfigurationError(FIREBASE_ERRORS.NOT_CONFIGURED);
  }

  try {
    const persistenceService = await getFirebasePersistence();
    
    // Determine the target user ID - must be provided or throw error
    let targetUserId: string;
    
    if (userId) {
      targetUserId = userId;
      console.log('✅ Loading diagnoses for provided user ID:', targetUserId);
    } else {
      throw new Error('User ID is required to load diagnoses. Please authenticate first.');
    }
    
    const diagnoses = await persistenceService.getUserDiagnoses(targetUserId);
    console.log('✅ Loaded diagnoses from Firebase for user:', targetUserId, 'Count:', diagnoses.length);
    return diagnoses;
  } catch (error) {
    console.error('🚨 Error loading diagnoses from Firebase:', error);
    throw error; // Re-throw the original error
  }
};

// REAL DATA PERSISTENCE: Get specific diagnosis by ID
export const getDiagnosisById = async (id: string): Promise<PlantDiagnosis> => {
  if (!isFirebaseConfigured()) {
    console.error('Firebase not configured - cannot load diagnosis by ID');
    throwConfigurationError(FIREBASE_ERRORS.NOT_CONFIGURED);
  }

  try {
    // Decode URL-encoded ID (in case it comes from router params)
    const decodedId = decodeURIComponent(id);
    console.log('🔍 Looking for diagnosis with ID:', decodedId, '(original:', id, ')');
    
    const persistenceService = await getFirebasePersistence();
    
    // Try with decoded ID first
    let diagnosis = await persistenceService.getDiagnosis(decodedId);
    
    // If not found and IDs are different, try with original ID
    if (!diagnosis && decodedId !== id) {
      diagnosis = await persistenceService.getDiagnosis(id);
    }
    
    if (diagnosis) {
      console.log('✅ Loaded diagnosis from Firebase:', diagnosis.id);
      return diagnosis;
    }
    
    throw new Error(`Diagnosis with ID ${id} not found`);
    
  } catch (error) {
    console.error('🚨 Error loading diagnosis from Firebase:', error);
    throw error; // Re-throw the original error
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
    console.error('Firebase not configured - cannot load dashboard analytics');
    throwConfigurationError(FIREBASE_ERRORS.NOT_CONFIGURED);
  }

  try {
    const persistenceService = await getFirebasePersistence();
    
    // Determine the target user ID - must be provided or throw error
    let targetUserId: string;
    
    if (userId) {
      targetUserId = userId;
      console.log('✅ Loading analytics for provided user ID:', targetUserId);
    } else {
      throw new Error('User ID is required to load analytics. Please authenticate first.');
    }
    
    const analytics = await persistenceService.getDashboardAnalytics(targetUserId); 
    console.log('✅ Loaded analytics from Firebase for user:', targetUserId);
    return analytics;
  } catch (error) {
    console.error('🚨 Error loading analytics from Firebase:', error);
    throw error; // Re-throw the original error
  }
};

/**
 * Fallback treatments - now only used for demo mode since Gemini generates dynamic treatments
 * Keeping minimal set for when Gemini API is not available
 */
function getRelevantTreatments(disease?: string): Treatment[] {
  // With Gemini AI, this function is only used as a fallback
  // Return basic Australian treatments for demo purposes
  return australianTreatments.slice(0, 2);
}

/**
 * Simplified matching function for fallback treatments
 */
function findMatchingTreatments(disease: string, treatmentMap: { [key: string]: Treatment[] }): Treatment[] {
  // Since Gemini AI handles treatment matching, this is now just a simple fallback
  return australianTreatments.slice(0, 2);
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