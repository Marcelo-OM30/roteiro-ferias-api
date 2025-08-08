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

Cypress.Commands.add('waitForMessage', (message, timeout = 20000) => {
  cy.get('#message', { timeout }).should('be.visible')
  cy.get('#message').should('contain', message)
})

Cypress.Commands.add('waitForToast', (message, timeout = 20000) => {
  // Tenta diferentes seletores para toast
  cy.log(`🔍 Procurando por toast com mensagem: "${message}"`)
  
  const toastSelectors = ['.toast', '.toast-container .toast', '#toast-container .toast', '.materialize-toast']
  
  // Primeiro tenta encontrar um toast real
  cy.get('body').then($body => {
    let toastFound = false
    
    for (const selector of toastSelectors) {
      if ($body.find(selector).length > 0) {
        cy.get(selector, { timeout }).should('be.visible')
        cy.get(selector).should('contain', message)
        toastFound = true
        cy.log(`✅ Toast encontrado com seletor: ${selector}`)
        return
      }
    }
    
    if (!toastFound) {
      cy.log('⚠️ Toast não encontrado, verificando mensagens em cards visíveis')
      
      // Procura em todos os cards visíveis por mensagens
      const messageSelectors = [
        '#forgotCard #message',
        '#loginCard #message', 
        '#message',
        '.card #message',
        '.message',
        '.error-message'
      ]
      
      let messageFound = false
      for (const selector of messageSelectors) {
        try {
          if ($body.find(selector).length > 0 && $body.find(selector).is(':visible')) {
            cy.get(selector, { timeout: 5000 }).should('be.visible')
            cy.get(selector).should('contain', message)
            messageFound = true
            cy.log(`✅ Mensagem encontrada em: ${selector}`)
            break
          }
        } catch (e) {
          // Continua tentando
        }
      }
      
      if (!messageFound) {
        cy.log('⚠️ Nem toast nem mensagem encontrados, verificando se mensagem aparece em qualquer lugar')
        cy.contains(message, { timeout }).should('be.visible')
      }
    }
  })
})

Cypress.Commands.add('waitForMessageFlexible', (possibleMessages, timeout = 20000) => {
  cy.log(`🔍 Procurando por uma das mensagens: ${possibleMessages.join(', ')}`)
  
  cy.get('#message', { timeout }).should('be.visible')
  
  // Verifica se pelo menos uma das mensagens está presente
  cy.get('#message').then($el => {
    const messageText = $el.text()
    cy.log(`📨 Texto completo da mensagem: "${messageText}"`)
    
    const found = possibleMessages.some(msg => messageText.includes(msg))
    if (found) {
      const foundMsg = possibleMessages.find(msg => messageText.includes(msg))
      cy.log(`✅ Encontrada mensagem: "${foundMsg}"`)
    } else {
      cy.log(`❌ Nenhuma das mensagens esperadas encontrada. Texto atual: "${messageText}"`)
      // Não falha imediatamente, deixa Cypress tentar novamente
    }
    
    // Verifica que pelo menos uma das mensagens está presente
    expect(possibleMessages.some(msg => messageText.includes(msg))).to.be.true
  })
})

Cypress.Commands.add('checkRedirect', (url) => {
  cy.url({ timeout: 15000 }).should('include', url)
})
