// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Custom commands for the project
Cypress.Commands.add('login', (username, password) => {
    cy.visit('/')
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#loginForm').submit()
})

Cypress.Commands.add('clearAuth', () => {
    cy.window().then((win) => {
        win.localStorage.removeItem('authToken')
        win.localStorage.removeItem('username')
        win.localStorage.removeItem('userInfo')
    })
})

Cypress.Commands.add('checkAPIConnection', () => {
    cy.request({
        url: 'http://localhost:3001/api/login',
        method: 'POST',
        body: { username: 'test', password: 'test' },
        failOnStatusCode: false
    })
})
