/// <reference types="cypress" />

describe('Complete Diagnosis Workflow - Phase 1 & 2 Integration', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('End-to-End Plant Diagnosis Flow', () => {
    it('should complete full diagnosis workflow with APVMA integration', () => {
      // Start from homepage
      cy.get('[data-testid="start-diagnosis-button"]').click()
      cy.url().should('include', '/diagnose')

      // Upload an image (simulate file upload)
      cy.get('[data-testid="file-upload-input"]').should('exist')
      
      // For demo, we can skip actual file upload and proceed
      // In a real test, you would use cy.fixture() to upload a test image
      cy.get('[data-testid="skip-upload-demo"]').click()

      // Wait for AI analysis to complete
      cy.get('[data-testid="analysis-loading"]').should('be.visible')
      cy.get('[data-testid="analysis-results"]', { timeout: 15000 }).should('be.visible')

      // Verify diagnosis results contain APVMA-verified treatments
      cy.get('[data-testid="diagnosis-disease"]').should('be.visible')
      cy.get('[data-testid="confidence-score"]').should('be.visible')
      cy.get('[data-testid="treatment-recommendations"]').should('be.visible')
      
      // Check for APVMA compliance indicators
      cy.get('[data-testid="apvma-verified-badge"]').should('be.visible')
      cy.get('[data-testid="registration-number"]').should('be.visible')

      // Test weather-based recommendations
      cy.get('[data-testid="weather-conditions"]').should('be.visible')
      cy.get('[data-testid="application-timing"]').should('be.visible')

      // Save diagnosis (tests Phase 1 persistence)
      cy.get('[data-testid="save-diagnosis-button"]').click()
      cy.get('[data-testid="success-message"]').should('contain', 'Diagnosis saved')
    })

    it('should persist diagnosis history across sessions', () => {
      // Complete a diagnosis first
      cy.visit('/diagnose')
      cy.get('[data-testid="skip-upload-demo"]').click()
      cy.get('[data-testid="analysis-results"]', { timeout: 15000 }).should('be.visible')
      cy.get('[data-testid="save-diagnosis-button"]').click()

      // Navigate to dashboard
      cy.get('[data-testid="nav-dashboard"]').click()
      cy.url().should('include', '/dashboard')

      // Verify diagnosis appears in history
      cy.get('[data-testid="diagnosis-history"]').should('be.visible')
      cy.get('[data-testid="diagnosis-item"]').should('have.length.greaterThan', 0)

      // Test persistence by refreshing page
      cy.reload()
      cy.get('[data-testid="diagnosis-history"]').should('be.visible')
      cy.get('[data-testid="diagnosis-item"]').should('have.length.greaterThan', 0)
    })

    it('should show enhanced analytics with real data', () => {
      cy.visit('/dashboard')
      
      // Check analytics components
      cy.get('[data-testid="total-diagnoses"]').should('be.visible')
      cy.get('[data-testid="success-rate"]').should('be.visible')
      cy.get('[data-testid="common-diseases-chart"]').should('be.visible')
      cy.get('[data-testid="monthly-activity-chart"]').should('be.visible')

      // Verify data is not just placeholder
      cy.get('[data-testid="total-diagnoses"]').should('not.contain', 'Loading')
      cy.get('[data-testid="success-rate"]').should('contain', '%')
    })
  })

  describe('APVMA Compliance Integration', () => {
    it('should integrate compliance checking in diagnosis flow', () => {
      cy.visit('/diagnose')
      cy.get('[data-testid="skip-upload-demo"]').click()
      cy.get('[data-testid="analysis-results"]', { timeout: 15000 }).should('be.visible')

      // Verify APVMA integration in treatment recommendations
      cy.get('[data-testid="treatment-recommendations"]').within(() => {
        cy.get('[data-testid="chemical-name"]').should('be.visible')
        cy.get('[data-testid="registration-number"]').should('be.visible')
        cy.get('[data-testid="supplier-info"]').should('be.visible')
        cy.get('[data-testid="application-method"]').should('be.visible')
      })

      // Test "Check Weather" functionality
      cy.get('[data-testid="check-weather-button"]').click()
      cy.get('[data-testid="weather-modal"]').should('be.visible')
      cy.get('[data-testid="postcode-input"]').type('2000')
      cy.get('[data-testid="get-weather-button"]').click()
      cy.get('[data-testid="weather-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="spray-conditions"]').should('be.visible')
    })

    it('should link to compliance dashboard', () => {
      cy.visit('/diagnose')
      cy.get('[data-testid="skip-upload-demo"]').click()
      cy.get('[data-testid="analysis-results"]', { timeout: 15000 }).should('be.visible')

      // Find and click compliance dashboard link
      cy.get('[data-testid="view-compliance-dashboard"]').click()
      cy.url().should('include', '/compliance')
      cy.get('h1').should('contain', 'APVMA Compliance')
    })
  })

  describe('User Authentication Flow', () => {
    it('should work in demo mode without authentication', () => {
      // Most features should work without login
      cy.visit('/diagnose')
      cy.get('[data-testid="skip-upload-demo"]').click()
      cy.get('[data-testid="analysis-results"]', { timeout: 15000 }).should('be.visible')
      
      // Should show demo mode indicator
      cy.get('[data-testid="demo-mode-badge"]').should('be.visible')
    })

    it('should offer enhanced features with authentication', () => {
      cy.visit('/login')
      
      // Should have login form
      cy.get('[data-testid="email-input"]').should('be.visible')
      cy.get('[data-testid="password-input"]').should('be.visible')
      cy.get('[data-testid="login-button"]').should('be.visible')
      
      // Should show benefits of signing up
      cy.get('[data-testid="auth-benefits"]').should('contain', 'diagnosis history')
      cy.get('[data-testid="auth-benefits"]').should('contain', 'analytics')
    })
  })

  describe('Error Handling & Resilience', () => {
    it('should handle API failures gracefully', () => {
      // Intercept and fail API calls
      cy.intercept('POST', '**/vision-api/**', { forceNetworkError: true }).as('visionError')
      cy.intercept('GET', '**/datastore_search**', { forceNetworkError: true }).as('apvmaError')

      cy.visit('/diagnose')
      cy.get('[data-testid="skip-upload-demo"]').click()
      
      // Should show fallback content
      cy.get('[data-testid="error-fallback"]', { timeout: 15000 }).should('be.visible')
      cy.get('[data-testid="error-message"]').should('contain', 'offline')
    })

    it('should provide offline capabilities', () => {
      // Test that cached/sessionStorage data works
      cy.visit('/dashboard')
      
      // Should work even if Firebase is unavailable
      cy.get('[data-testid="offline-mode-indicator"]').should('exist')
      cy.get('[data-testid="dashboard-content"]').should('be.visible')
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-6')
      
      cy.visit('/')
      cy.get('[data-testid="mobile-nav-toggle"]').click()
      cy.get('[data-testid="mobile-nav-menu"]').should('be.visible')
      
      cy.get('[data-testid="mobile-diagnose-button"]').click()
      cy.url().should('include', '/diagnose')
      
      cy.get('[data-testid="mobile-camera-button"]').should('be.visible')
    })

    it('should adapt compliance dashboard for mobile', () => {
      cy.viewport('iphone-6')
      
      cy.visit('/compliance')
      cy.get('[data-testid="mobile-tabs"]').should('be.visible')
      cy.get('[data-testid="mobile-search-interface"]').should('be.visible')
    })
  })

  describe('Performance & Loading States', () => {
    it('should show appropriate loading states', () => {
      cy.visit('/diagnose')
      cy.get('[data-testid="skip-upload-demo"]').click()
      
      // Should show loading skeleton
      cy.get('[data-testid="analysis-loading"]').should('be.visible')
      cy.get('[data-testid="loading-skeleton"]').should('be.visible')
      
      // Should disappear when loaded
      cy.get('[data-testid="analysis-results"]', { timeout: 15000 }).should('be.visible')
      cy.get('[data-testid="analysis-loading"]').should('not.exist')
    })

    it('should load compliance dashboard quickly', () => {
      const start = Date.now()
      cy.visit('/compliance')
      cy.get('[data-testid="compliance-tabs"]').should('be.visible')
      
      cy.then(() => {
        const loadTime = Date.now() - start
        expect(loadTime).to.be.lessThan(3000) // Should load in under 3 seconds
      })
    })
  })
}) 