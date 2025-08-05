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
  // Reset API state para admin
  cy.request({
    url: 'http://localhost:3001/api/reset-attempts',
    method: 'POST',
    body: { email: 'admin@teste.com' },
    failOnStatusCode: false
  }).then((response) => {
    cy.log('Reset admin:', response.status)
  })

  // Reset API state para usuário comum
  cy.request({
    url: 'http://localhost:3001/api/reset-attempts',
    method: 'POST',
    body: { email: 'usuario@teste.com' },
    failOnStatusCode: false
  }).then((response) => {
    cy.log('Reset usuario:', response.status)
  })

  // Reset API state para marcelo.salmeron
  cy.request({
    url: 'http://localhost:3001/api/reset-attempts',
    method: 'POST',
    body: { email: 'marcelo.salmeron@teste.com' },
    failOnStatusCode: false
  }).then((response) => {
    cy.log('Reset marcelo.salmeron:', response.status)
  })
})

Cypress.Commands.add('waitForMessage', (message) => {
  cy.get('#message', { timeout: 10000 }).should('be.visible')
  cy.get('#message').should('contain', message)
})

Cypress.Commands.add('checkRedirect', (url) => {
  cy.url({ timeout: 10000 }).should('include', url)
})
