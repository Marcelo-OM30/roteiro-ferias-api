describe('Debug Cenário 3', () => {
    beforeEach(() => {
        cy.clearAuth()
        cy.visit('/')
        cy.resetAPI()
        cy.wait(500)
    })

    it('Debug: Testar 3 tentativas e ver mensagem exata', () => {
        // Fazer 3 tentativas e capturar as mensagens
        for (let i = 1; i <= 3; i++) {
            cy.log(`Tentativa ${i}`)

            cy.get('#username').clear({ force: true }).type('admin', { force: true })
            cy.get('#password').clear({ force: true }).type('senha_errada', { force: true })
            cy.get('#loginForm').submit()

            cy.wait(3000) // Aguardar mensagem aparecer

            // Verificar se mensagem existe e capturar texto
            cy.get('body').then(() => {
                cy.get('#message').should('exist').then(($msg) => {
                    const isVisible = $msg.is(':visible')
                    const text = $msg.text()
                    const classes = $msg.attr('class')

                    cy.log(`Tentativa ${i} - Visível: ${isVisible}`)
                    cy.log(`Tentativa ${i} - Texto: "${text}"`)
                    cy.log(`Tentativa ${i} - Classes: "${classes}"`)

                    // Forçar falha para mostrar informações no log
                    if (i === 3) {
                        expect(text).to.include('__DEBUG_INFO__')
                    }
                })
            })

            cy.wait(2000)
        }
    })
})
