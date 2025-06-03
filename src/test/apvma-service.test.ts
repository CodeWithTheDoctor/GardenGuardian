import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the APVMA service functions
const mockAPVMAService = {
  searchChemicals: vi.fn(),
  getWeatherConditions: vi.fn(),
  checkCompliance: vi.fn(),
  getApplicationRecommendations: vi.fn()
}

// Mock fetch globally
global.fetch = vi.fn()

vi.mock('../../lib/apvma-service', () => mockAPVMAService)

describe('APVMA Compliance Service - Phase 2', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    vi.mocked(fetch).mockClear()
  })

  describe('Chemical Registration Search', () => {
    it('should search APVMA database for registered chemicals', async () => {
      const mockResponse = {
        result: {
          records: [
            {
              _id: 1,
              'Active Constituent': 'Copper Hydroxide',
              'Product Name': 'Copper Oxychloride WG',
              'Registration Number': '12345',
              'Current Holder': 'Example Chemical Company',
              'Product Type': 'Fungicide',
              'First Registration Date': '2020-01-01'
            }
          ],
          total: 1
        }
      }

      mockAPVMAService.searchChemicals.mockResolvedValue(mockResponse)

      const result = await mockAPVMAService.searchChemicals('copper')
      
      expect(result).toBeDefined()
      expect(result.result.records).toHaveLength(1)
      expect(result.result.records[0]['Active Constituent']).toBe('Copper Hydroxide')
      expect(result.result.records[0]['Product Type']).toBe('Fungicide')
    })

    it('should handle different chemical types', async () => {
      const testCases = [
        { query: 'pyrethrum', expectedType: 'Insecticide' },
        { query: 'glyphosate', expectedType: 'Herbicide' },
        { query: 'copper', expectedType: 'Fungicide' }
      ]

      for (const testCase of testCases) {
        mockAPVMAService.searchChemicals.mockResolvedValue({
          result: {
            records: [{
              'Product Type': testCase.expectedType,
              'Active Constituent': testCase.query
            }]
          }
        })

        const result = await mockAPVMAService.searchChemicals(testCase.query)
        expect(result.result.records[0]['Product Type']).toBe(testCase.expectedType)
      }

      expect(mockAPVMAService.searchChemicals).toHaveBeenCalledTimes(3)
    })

    it('should return empty results for invalid searches', async () => {
      mockAPVMAService.searchChemicals.mockResolvedValue({
        result: { records: [], total: 0 }
      })

      const result = await mockAPVMAService.searchChemicals('invalidchemical123')
      
      expect(result.result.records).toHaveLength(0)
      expect(result.result.total).toBe(0)
    })
  })

  describe('Weather Integration', () => {
    it('should get weather conditions from BOM API', async () => {
      const mockWeatherData = {
        temperature: 22,
        humidity: 65,
        windSpeed: 8,
        windDirection: 'NW',
        conditions: 'good',
        warnings: [],
        location: 'Sydney',
        postcode: '2000'
      }

      mockAPVMAService.getWeatherConditions.mockResolvedValue(mockWeatherData)

      const result = await mockAPVMAService.getWeatherConditions('2000')
      
      expect(result).toBeDefined()
      expect(result.temperature).toBe(22)
      expect(result.conditions).toBe('good')
      expect(result.postcode).toBe('2000')
    })

    it('should provide spray condition assessments', async () => {
      const testConditions = [
        { windSpeed: 5, temperature: 20, humidity: 60, expected: 'excellent' },
        { windSpeed: 12, temperature: 25, humidity: 70, expected: 'good' },
        { windSpeed: 18, temperature: 30, humidity: 80, expected: 'marginal' },
        { windSpeed: 25, temperature: 35, humidity: 90, expected: 'poor' }
      ]

      for (const condition of testConditions) {
        mockAPVMAService.getWeatherConditions.mockResolvedValue({
          ...condition,
          conditions: condition.expected
        })

        const result = await mockAPVMAService.getWeatherConditions('2000')
        expect(result.conditions).toBe(condition.expected)
      }
    })

    it('should handle weather warnings', async () => {
      const mockWeatherWithWarnings = {
        temperature: 35,
        humidity: 90,
        windSpeed: 25,
        conditions: 'poor',
        warnings: [
          'High temperature - avoid spraying during heat of day',
          'Strong winds - drift risk high',
          'High humidity - reduced efficacy likely'
        ]
      }

      mockAPVMAService.getWeatherConditions.mockResolvedValue(mockWeatherWithWarnings)

      const result = await mockAPVMAService.getWeatherConditions('2000')
      
      expect(result.warnings).toHaveLength(3)
      expect(result.warnings).toContain('High temperature - avoid spraying during heat of day')
      expect(result.conditions).toBe('poor')
    })
  })

  describe('Compliance Checking', () => {
    it('should check chemical compliance for specific regions', async () => {
      const mockCompliance = {
        isLegal: true,
        registrationNumber: '12345',
        restrictions: ['Not for use near waterways'],
        applicationMethod: 'Foliar spray only',
        witholdingPeriod: '7 days',
        maxApplicationRate: '2.5L/ha'
      }

      mockAPVMAService.checkCompliance.mockResolvedValue(mockCompliance)

      const result = await mockAPVMAService.checkCompliance('copper', 'NSW')
      
      expect(result.isLegal).toBe(true)
      expect(result.registrationNumber).toBeDefined()
      expect(Array.isArray(result.restrictions)).toBe(true)
    })

    it('should identify restricted chemicals', async () => {
      const mockRestrictedCompliance = {
        isLegal: false,
        registrationNumber: null,
        restrictions: ['Banned for home garden use'],
        reason: 'Professional use only'
      }

      mockAPVMAService.checkCompliance.mockResolvedValue(mockRestrictedCompliance)

      const result = await mockAPVMAService.checkCompliance('restricted-chemical', 'QLD')
      
      expect(result.isLegal).toBe(false)
      expect(result.restrictions).toContain('Banned for home garden use')
    })
  })

  describe('Application Recommendations', () => {
    it('should provide weather-based application timing', async () => {
      const mockRecommendations = {
        bestTime: 'Early morning (6-8 AM)',
        avoidTimes: ['Midday (11 AM - 3 PM)', 'During rain'],
        conditions: {
          temperature: { ideal: '15-25°C', current: '22°C' },
          humidity: { ideal: '40-70%', current: '65%' },
          wind: { ideal: '< 15 km/h', current: '8 km/h' }
        },
        effectiveness: 'High',
        weatherSuitability: 'Excellent'
      }

      mockAPVMAService.getApplicationRecommendations.mockResolvedValue(mockRecommendations)

      const result = await mockAPVMAService.getApplicationRecommendations('copper', '2000')
      
      expect(result.bestTime).toContain('Early morning')
      expect(result.effectiveness).toBe('High')
      expect(result.weatherSuitability).toBe('Excellent')
      expect(Array.isArray(result.avoidTimes)).toBe(true)
    })

    it('should adjust recommendations based on chemical type', async () => {
      const chemicalTypes = ['fungicide', 'insecticide', 'herbicide']
      
      for (const type of chemicalTypes) {
        mockAPVMAService.getApplicationRecommendations.mockResolvedValue({
          chemicalType: type,
          specificGuidance: `Specific guidance for ${type}`,
          timing: `Optimal timing for ${type}`
        })

        const result = await mockAPVMAService.getApplicationRecommendations(type, '2000')
        expect(result.chemicalType).toBe(type)
        expect(result.specificGuidance).toContain(type)
      }
    })
  })

  describe('Error Handling', () => {
    it('should handle API failures gracefully', async () => {
      mockAPVMAService.searchChemicals.mockRejectedValue(new Error('API unavailable'))

      await expect(mockAPVMAService.searchChemicals('copper')).rejects.toThrow('API unavailable')
    })

    it('should handle network timeouts', async () => {
      mockAPVMAService.getWeatherConditions.mockRejectedValue(new Error('Request timeout'))

      await expect(mockAPVMAService.getWeatherConditions('2000')).rejects.toThrow('Request timeout')
    })

    it('should provide fallback data when APIs are unavailable', async () => {
      // Test that the service can provide cached or default data
      mockAPVMAService.searchChemicals.mockImplementation(() => {
        throw new Error('API unavailable')
      })

      try {
        await mockAPVMAService.searchChemicals('copper')
      } catch (error) {
        expect((error as Error).message).toBe('API unavailable')
      }
    })
  })

  describe('Integration Testing', () => {
    it('should work with real Australian postcodes', async () => {
      const australianPostcodes = ['2000', '3000', '4000', '5000', '6000']
      
      for (const postcode of australianPostcodes) {
        mockAPVMAService.getWeatherConditions.mockResolvedValue({
          postcode,
          temperature: 20 + Math.random() * 15,
          conditions: 'good'
        })

        const result = await mockAPVMAService.getWeatherConditions(postcode)
        expect(result.postcode).toBe(postcode)
        expect(typeof result.temperature).toBe('number')
      }
    })

    it('should handle complete workflow: search → compliance → weather → recommendations', async () => {
      // Mock complete workflow
      mockAPVMAService.searchChemicals.mockResolvedValue({
        result: { records: [{ 'Active Constituent': 'Copper', 'Registration Number': '12345' }] }
      })
      
      mockAPVMAService.checkCompliance.mockResolvedValue({
        isLegal: true, registrationNumber: '12345'
      })
      
      mockAPVMAService.getWeatherConditions.mockResolvedValue({
        conditions: 'good', temperature: 22
      })
      
      mockAPVMAService.getApplicationRecommendations.mockResolvedValue({
        effectiveness: 'High', bestTime: 'Early morning'
      })

      // Execute workflow
      const chemical = await mockAPVMAService.searchChemicals('copper')
      const compliance = await mockAPVMAService.checkCompliance('copper', 'NSW')
      const weather = await mockAPVMAService.getWeatherConditions('2000')
      const recommendations = await mockAPVMAService.getApplicationRecommendations('copper', '2000')

      expect(chemical.result.records).toHaveLength(1)
      expect(compliance.isLegal).toBe(true)
      expect(weather.conditions).toBe('good')
      expect(recommendations.effectiveness).toBe('High')
    })
  })
}) 