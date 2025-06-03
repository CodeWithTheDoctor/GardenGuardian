import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Declare global types
declare global {
  var mockFirebaseUser: {
    uid: string
    email: string
    displayName: string
  }
  var mockDiagnosis: {
    id: string
    userId: string
    disease: string
    confidence: number
    treatments: any[]
    timestamp: Date
    imageUrl: string
  }
}

// Mock Firebase to avoid real API calls in tests
vi.mock('../lib/firebase-utils', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  },
  db: {},
  storage: {},
  analytics: null,
}))

// Mock Google Vision API
vi.mock('../lib/vision-service', () => ({
  analyzeImage: vi.fn(() => Promise.resolve({
    labels: [
      { description: 'Plant', score: 0.95 },
      { description: 'Leaf', score: 0.90 },
      { description: 'Disease symptoms', score: 0.75 }
    ],
    diagnosis: {
      disease: 'Powdery Mildew',
      confidence: 0.85,
      severity: 'moderate',
      treatments: []
    }
  }))
}))

// Mock APVMA Service
vi.mock('../lib/apvma-service', () => ({
  searchChemicals: vi.fn(() => Promise.resolve({
    result: {
      records: [
        {
          _id: 1,
          'Active Constituent': 'Copper Hydroxide',
          'Product Name': 'Test Copper Fungicide',
          'Registration Number': '12345',
          'Current Holder': 'Test Company',
          'Product Type': 'Fungicide'
        }
      ]
    }
  })),
  getWeatherConditions: vi.fn(() => Promise.resolve({
    temperature: 22,
    humidity: 65,
    windSpeed: 8,
    conditions: 'good',
    warnings: []
  }))
}))

// Global test utilities
globalThis.mockFirebaseUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User'
}

globalThis.mockDiagnosis = {
  id: 'test-diagnosis-123',
  userId: 'test-user-123',
  disease: 'Powdery Mildew',
  confidence: 0.85,
  treatments: [],
  timestamp: new Date(),
  imageUrl: 'test-image.jpg'
} 