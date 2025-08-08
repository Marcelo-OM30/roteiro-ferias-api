// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for authentication testing

Cypress.Commands.add('clearAuth', () => {
  // Clear localStorage authentication data
  cy.window().then((win) => {
    win.localStorage.removeItem('authToken')
    win.localStorage.removeItem('username')
    win.localStorage.removeItem('userRole')
  })
})

Cypress.Commands.add('resetAPI', () => {
  cy.log('🔄 Tentativa de reset da API (não crítico)')

  // Comando que tenta mas não falha se API não estiver disponível
  return cy.window().then(() => {
    return new Cypress.Promise((resolve) => {
      fetch('http://localhost:3000/api/reset-attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(() => {
          cy.log('✅ API reset realizado')
          resolve()
        })
        .catch(() => {
          cy.log('⚠️ API não disponível (esperado em CI/CD)')
          resolve() // Resolve mesmo com erro
        })
    })
  })
})

Cypress.Commands.add('waitForMessage', (message, timeout = 15000) => {
  cy.get('#message', { timeout }).should('be.visible')
  cy.get('#message').should('contain', message)
})

Cypress.Commands.add('waitForToast', (message, timeout = 15000) => {
  cy.get('.toast', { timeout }).should('be.visible')
  cy.get('.toast').should('contain', message)
})

Cypress.Commands.add('checkRedirect', (url) => {
  cy.url({ timeout: 15000 }).should('include', url)
})
