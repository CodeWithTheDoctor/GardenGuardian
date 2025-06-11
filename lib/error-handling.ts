// Error handling utilities for GardenGuardian AI
// Provides consistent error messages instead of mock fallbacks

export interface ServiceError {
  code: string;
  title: string;
  message: string;
  action?: string;
  configRequired?: readonly string[];
}

export class ConfigurationError extends Error {
  public readonly serviceError: ServiceError;

  constructor(serviceError: ServiceError) {
    super(serviceError.message);
    this.name = 'ConfigurationError';
    this.serviceError = serviceError;
  }
}

// Firebase Configuration Errors
export const FIREBASE_ERRORS = {
  NOT_CONFIGURED: {
    code: 'FIREBASE_NOT_CONFIGURED',
    title: 'Firebase Not Configured',
    message: 'Firebase services are not configured. Data persistence features are unavailable.',
    action: 'Please configure Firebase environment variables to enable cloud storage and user authentication.',
    configRequired: [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]
  },
  AUTH_REQUIRED: {
    code: 'FIREBASE_AUTH_REQUIRED',
    title: 'Authentication Required',
    message: 'You must be logged in to access this feature.',
    action: 'Please log in or create an account to continue.'
  },
  PERMISSION_DENIED: {
    code: 'FIREBASE_PERMISSION_DENIED',
    title: 'Permission Denied',
    message: 'You don\'t have permission to access this resource.',
    action: 'Please check your account permissions or contact support.'
  }
} as const;

// AI Vision Configuration Errors (Legacy Google Vision)
export const AI_VISION_ERRORS = {
  NOT_CONFIGURED: {
    code: 'AI_VISION_NOT_CONFIGURED',
    title: 'AI Vision Not Configured',
    message: 'Google Vision API is not configured. Plant disease analysis is unavailable.',
    action: 'Please configure Google Vision API key to enable AI-powered plant diagnosis.',
    configRequired: ['NEXT_PUBLIC_GOOGLE_VISION_API_KEY']
  },
  API_QUOTA_EXCEEDED: {
    code: 'AI_VISION_QUOTA_EXCEEDED',
    title: 'API Quota Exceeded',
    message: 'Google Vision API quota has been exceeded for today.',
    action: 'Please try again tomorrow or upgrade your API plan.'
  },
  INVALID_IMAGE: {
    code: 'AI_VISION_INVALID_IMAGE',
    title: 'Invalid Image',
    message: 'The uploaded image could not be processed for plant analysis.',
    action: 'Please upload a clear, well-lit photo of the plant showing the problem area.'
  }
} as const;

// Gemini Vision Configuration Errors (New Gemini 2.0 Flash)
export const GEMINI_VISION_ERRORS = {
  NOT_CONFIGURED: {
    code: 'GEMINI_VISION_NOT_CONFIGURED',
    title: 'Gemini AI Not Configured',
    message: 'Gemini 2.0 Flash API is not configured. Intelligent plant health analysis is unavailable.',
    action: 'Please configure Gemini API key to enable AI-powered plant diagnosis with Australian treatment recommendations.',
    configRequired: ['NEXT_PUBLIC_GEMINI_API_KEY']
  },
  API_QUOTA_EXCEEDED: {
    code: 'GEMINI_API_QUOTA_EXCEEDED',
    title: 'API Quota Exceeded',
    message: 'Gemini API quota has been exceeded for today.',
    action: 'Please try again tomorrow or upgrade your API plan.'
  },
  INVALID_IMAGE: {
    code: 'GEMINI_INVALID_IMAGE',
    title: 'Invalid Image',
    message: 'The uploaded image could not be processed for plant health analysis.',
    action: 'Please upload a clear, well-lit photo of the plant showing the problem area.'
  },
  CONTENT_FILTERED: {
    code: 'GEMINI_CONTENT_FILTERED',
    title: 'Content Filtered',
    message: 'The image content was filtered by safety policies.',
    action: 'Please upload a different image of your plant.'
  },
  PARSE_ERROR: {
    code: 'GEMINI_PARSE_ERROR',
    title: 'Analysis Parsing Error',
    message: 'Unable to parse the AI analysis response.',
    action: 'Please try uploading the image again.'
  }
} as const;

// Weather Service Configuration Errors
export const WEATHER_ERRORS = {
  NOT_CONFIGURED: {
    code: 'WEATHER_NOT_CONFIGURED',
    title: 'Weather Service Not Configured',
    message: 'Weather API is not configured. Current weather conditions and spray recommendations are unavailable.',
    action: 'Please configure OpenWeatherMap API key to enable weather-based spray recommendations.',
    configRequired: ['NEXT_PUBLIC_OPENWEATHER_API_KEY']
  },
  API_ERROR: {
    code: 'WEATHER_API_ERROR',
    title: 'Weather Data Unavailable',
    message: 'Unable to fetch current weather conditions.',
    action: 'Please check your internet connection and try again.'
  }
} as const;

// Community Service Configuration Errors
export const COMMUNITY_ERRORS = {
  NOT_CONFIGURED: {
    code: 'COMMUNITY_NOT_CONFIGURED',
    title: 'Community Features Not Available',
    message: 'Firebase is not configured. Community features like posting, commenting, and user profiles are unavailable.',
    action: 'Please configure Firebase to enable community features.',
    configRequired: [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ]
  },
  AUTH_REQUIRED: {
    code: 'COMMUNITY_AUTH_REQUIRED',
    title: 'Login Required',
    message: 'You must be logged in to participate in the community.',
    action: 'Please log in or create an account to post, comment, or interact with other gardeners.'
  }
} as const;

// APVMA Service Errors (note: APVMA API is public, so these are mainly network errors)
export const APVMA_ERRORS = {
  API_UNAVAILABLE: {
    code: 'APVMA_API_UNAVAILABLE',
    title: 'APVMA Database Unavailable',
    message: 'The Australian Pesticides and Veterinary Medicines Authority database is temporarily unavailable.',
    action: 'Please check your internet connection and try again later.'
  },
  NO_RESULTS: {
    code: 'APVMA_NO_RESULTS',
    title: 'No Products Found',
    message: 'No registered products found for your search criteria.',
    action: 'Try adjusting your search terms or consult with a local garden center.'
  }
} as const;

// Utility functions
export function throwConfigurationError(error: ServiceError): never {
  throw new ConfigurationError(error);
}

export function isConfigurationError(error: any): error is ConfigurationError {
  return error instanceof ConfigurationError;
}

export function getErrorDisplayInfo(error: any): ServiceError {
  if (isConfigurationError(error)) {
    return error.serviceError;
  }
  
  // Default error for unexpected errors
  return {
    code: 'UNKNOWN_ERROR',
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again.',
    action: 'If the problem persists, please contact support.'
  };
} 