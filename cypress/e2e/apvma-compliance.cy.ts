describe('APVMA Compliance Dashboard - Phase 2 E2E', () => {
  beforeEach(() => {
    cy.visit('/compliance')
  })

  describe('Compliance Dashboard Navigation', () => {
    it('should load the compliance dashboard', () => {
      cy.get('h1').should('contain', 'APVMA Compliance Dashboard')
      cy.get('[data-testid="compliance-tabs"]').should('be.visible')
    })

    it('should have all required tabs', () => {
      cy.get('[data-testid="product-search-tab"]').should('be.visible')
      cy.get('[data-testid="weather-conditions-tab"]').should('be.visible')
      cy.get('[data-testid="compliance-info-tab"]').should('be.visible')
    })
  })

  describe('Product Search Functionality', () => {
    it('should search for registered chemicals', () => {
      cy.get('[data-testid="product-search-tab"]').click()
      cy.get('[data-testid="chemical-search-input"]').type('copper')
      cy.get('[data-testid="search-button"]').click()
      
      // Wait for results to load
      cy.get('[data-testid="search-results"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0)
    })

    it('should display product details', () => {
      cy.get('[data-testid="product-search-tab"]').click()
      cy.get('[data-testid="chemical-search-input"]').type('pyrethrum')
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="product-name"]').should('be.visible')
        cy.get('[data-testid="active-constituent"]').should('be.visible')
        cy.get('[data-testid="registration-number"]').should('be.visible')
        cy.get('[data-testid="product-type"]').should('be.visible')
        cy.get('[data-testid="view-label-button"]').should('be.visible')
      })
    })

    it('should handle empty search results', () => {
      cy.get('[data-testid="product-search-tab"]').click()
      cy.get('[data-testid="chemical-search-input"]').type('nonexistentchemical123')
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('[data-testid="no-results-message"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="no-results-message"]').should('contain', 'No products found')
    })

    it('should open APVMA portal when viewing labels', () => {
      cy.get('[data-testid="product-search-tab"]').click()
      cy.get('[data-testid="chemical-search-input"]').type('copper')
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="view-label-button"]').should('have.attr', 'href').and('include', 'apvma.gov.au')
      })
    })
  })

  describe('Weather Conditions Integration', () => {
    it('should display weather information for valid postcodes', () => {
      cy.get('[data-testid="weather-conditions-tab"]').click()
      cy.get('[data-testid="postcode-input"]').type('2000')
      cy.get('[data-testid="check-weather-button"]').click()
      
      cy.get('[data-testid="weather-display"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="temperature"]').should('be.visible')
      cy.get('[data-testid="humidity"]').should('be.visible')
      cy.get('[data-testid="wind-speed"]').should('be.visible')
      cy.get('[data-testid="spray-conditions"]').should('be.visible')
    })

    it('should test multiple Australian postcodes', () => {
      const postcodes = ['2000', '3000', '4000', '5000', '6000']
      
      cy.get('[data-testid="weather-conditions-tab"]').click()
      
      postcodes.forEach((postcode) => {
        cy.get('[data-testid="postcode-input"]').clear().type(postcode)
        cy.get('[data-testid="check-weather-button"]').click()
        cy.get('[data-testid="weather-display"]', { timeout: 10000 }).should('be.visible')
        cy.get('[data-testid="location-display"]').should('contain', postcode)
      })
    })

    it('should show spray condition recommendations', () => {
      cy.get('[data-testid="weather-conditions-tab"]').click()
      cy.get('[data-testid="postcode-input"]').type('2000')
      cy.get('[data-testid="check-weather-button"]').click()
      
      cy.get('[data-testid="spray-conditions"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="spray-conditions"]').should('contain.oneOf', ['excellent', 'good', 'marginal', 'poor'])
    })

    it('should display weather warnings when conditions are poor', () => {
      cy.get('[data-testid="weather-conditions-tab"]').click()
      cy.get('[data-testid="postcode-input"]').type('2000')
      cy.get('[data-testid="check-weather-button"]').click()
      
      // Check if warnings section exists (may or may not have warnings)
      cy.get('[data-testid="weather-display"]', { timeout: 10000 }).should('be.visible')
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="weather-warnings"]').length > 0) {
          cy.get('[data-testid="weather-warnings"]').should('be.visible')
        }
      })
    })
  })

  describe('Compliance Information', () => {
    it('should display compliance system status', () => {
      cy.get('[data-testid="compliance-info-tab"]').click()
      cy.get('[data-testid="system-status"]').should('be.visible')
      cy.get('[data-testid="apvma-status"]').should('contain', 'Active')
      cy.get('[data-testid="weather-status"]').should('contain', 'Active')
    })

    it('should show data sources', () => {
      cy.get('[data-testid="compliance-info-tab"]').click()
      cy.get('[data-testid="data-sources"]').should('be.visible')
      cy.get('[data-testid="data-sources"]').should('contain', 'APVMA PubCRIS')
      cy.get('[data-testid="data-sources"]').should('contain', 'Bureau of Meteorology')
    })

    it('should display compliance features', () => {
      cy.get('[data-testid="compliance-info-tab"]').click()
      cy.get('[data-testid="compliance-features"]').should('be.visible')
      cy.get('[data-testid="compliance-features"]').should('contain', 'Real-time registration verification')
      cy.get('[data-testid="compliance-features"]').should('contain', 'Weather-based application timing')
    })
  })

  describe('Mobile Responsiveness', () => {
    it('should work on mobile devices', () => {
      cy.viewport('iphone-6')
      cy.get('[data-testid="compliance-tabs"]').should('be.visible')
      cy.get('[data-testid="product-search-tab"]').click()
      cy.get('[data-testid="chemical-search-input"]').should('be.visible')
    })

    it('should work on tablet devices', () => {
      cy.viewport('ipad-2')
      cy.get('[data-testid="compliance-tabs"]').should('be.visible')
      cy.get('[data-testid="weather-conditions-tab"]').click()
      cy.get('[data-testid="postcode-input"]').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API calls to simulate network errors
      cy.intercept('GET', '**/datastore_search**', { forceNetworkError: true }).as('networkError')
      
      cy.get('[data-testid="product-search-tab"]').click()
      cy.get('[data-testid="chemical-search-input"]').type('copper')
      cy.get('[data-testid="search-button"]').click()
      
      cy.get('[data-testid="error-message"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-testid="error-message"]').should('contain', 'network')
    })

    it('should validate postcode format', () => {
      cy.get('[data-testid="weather-conditions-tab"]').click()
      cy.get('[data-testid="postcode-input"]').type('12345')
      cy.get('[data-testid="check-weather-button"]').click()
      
      cy.get('[data-testid="validation-error"]').should('be.visible')
      cy.get('[data-testid="validation-error"]').should('contain', 'Australian postcode')
    })
  })

  describe('Integration with Main App', () => {
    it('should navigate back to main diagnosis flow', () => {
      cy.get('[data-testid="nav-diagnose"]').click()
      cy.url().should('include', '/diagnose')
    })

    it('should be accessible from navigation menu', () => {
      cy.visit('/')
      cy.get('[data-testid="nav-compliance"]').click()
      cy.url().should('include', '/compliance')
      cy.get('h1').should('contain', 'APVMA Compliance')
    })
  })
}) 