/**
 * Testes dos 4 Cenários de Login da API
 * Implementação dos testes automatizados com Cypress
 * Testa integração completa entre frontend e API
 */

describe('Cenários de Login da API - Desafio Universitário', () => {

    beforeEach(() => {
        // Limpar dados de autenticação
        cy.clearAuth()

        // Visitar página inicial
        cy.visit('/')

        // Verificar se página carregou corretamente
        cy.get('#loginCard').should('be.visible')
        cy.get('h1').should('not.exist') // Verificar que não há erro 404

        // Reset API state para testes limpos
        cy.resetAPI()

        // Aguardar um pouco para a API processar o reset
        cy.wait(500)
    })

    /**
     * CENÁRIO 1: Login com credenciais válidas
     * Objetivo: Verificar login bem-sucedido com credenciais corretas
     * Resultado esperado: Usuário logado e redirecionado para área apropriada
     */
    it('Cenário 1: Login com credenciais válidas - Admin', () => {
        cy.log('🧪 Testando login com credenciais válidas (admin)')

        // Preencher formulário de login
        cy.get('#username').should('be.visible').type('admin', { force: true })
        cy.get('#password').should('be.visible').type('admin123', { force: true })

        // Verificar se campos foram preenchidos
        cy.get('#username').should('have.value', 'admin')
        cy.get('#password').should('have.value', 'admin123')

        // Submeter formulário
        cy.get('#loginForm').submit()

        // Verificar mensagem de sucesso
        cy.waitForMessage('Login realizado com sucesso!')
        cy.get('#message').should('have.class', 'green')

        // Verificar redirecionamento para área admin
        cy.checkRedirect('/admin')

        // Verificar se token foi armazenado
        cy.window().then((win) => {
            expect(win.localStorage.getItem('authToken')).to.not.be.null
            expect(win.localStorage.getItem('username')).to.equal('admin')
        })
    })

    it('Cenário 1b: Login com credenciais válidas - Usuário comum', () => {
        cy.log('🧪 Testando login com credenciais válidas (usuário comum)')

        // Preencher formulário de login
        cy.get('#username').type('usuario', { force: true })
        cy.get('#password').type('senha123', { force: true })

        // Submeter formulário
        cy.get('#loginForm').submit()

        // Verificar mensagem de sucesso
        cy.waitForMessage('Login realizado com sucesso!')

        // Verificar redirecionamento para roteiros públicos
        cy.checkRedirect('/public-trips')
    })

    /**
     * CENÁRIO 2: Login com credenciais inválidas
     * Objetivo: Verificar comportamento com credenciais incorretas
     * Resultado esperado: Mensagem de erro e permanência na tela de login
     */
    it('Cenário 2: Login com credenciais inválidas', () => {
        cy.log('🧪 Testando login com credenciais inválidas')

        // Preencher formulário com credenciais inválidas (usuário válido, senha errada)
        cy.get('#username').type('usuario', { force: true })
        cy.get('#password').type('senha_errada', { force: true })

        // Submeter formulário
        cy.get('#loginForm').submit()

        // Verificar mensagem de erro (pode ser "Username ou senha incorretos")
        cy.get('#message').should('be.visible')
        cy.get('#message').should('contain.text', 'incorretos')
        cy.get('#message').should('have.class', 'red')

        // Verificar que permanece na página de login
        cy.url().should('eq', Cypress.config().baseUrl + '/')
        cy.get('#loginCard').should('be.visible')

        // Verificar que não há token armazenado
        cy.window().then((win) => {
            expect(win.localStorage.getItem('authToken')).to.be.null
        })
    })

    it('Cenário 2b: Login com campos vazios', () => {
        cy.log('🧪 Testando login com campos vazios')

        // Tentar submeter formulário vazio
        cy.get('#loginForm').submit()

        // Verificar validação HTML5 ou mensagem de erro customizada
        cy.get('#username:invalid').should('exist')
        cy.get('#password:invalid').should('exist')
    })

    /**
     * CENÁRIO 3: Múltiplas tentativas de login falharam (Bloqueio de conta)
     * Objetivo: Verificar sistema de bloqueio após múltiplas tentativas
     * Resultado esperado: Conta bloqueada após 3 tentativas falhadas
     */
    it('Cenário 3: Múltiplas tentativas de login falharam - Bloqueio de conta', () => {
        cy.log('🧪 Testando bloqueio após múltiplas tentativas falhadas')

        // Simular 3 tentativas de login falhadas
        for (let i = 1; i <= 3; i++) {
            cy.log(`Tentativa ${i} de 3`)

            // Limpar e preencher campos
            cy.get('#username').clear({ force: true }).type('admin', { force: true })
            cy.get('#password').clear({ force: true }).type('senha_errada', { force: true })

            // Submeter formulário
            cy.get('#loginForm').submit()

            // Verificar resposta baseada na tentativa
            if (i < 3) {
                // Primeiras 2 tentativas: erro de credenciais com tentativas restantes
                cy.get('#message').should('be.visible')
                cy.get('#message').should('contain', 'Username ou senha incorretos')
                cy.get('#message').should('have.class', 'red')

                // Verificar que menciona tentativas restantes
                const tentativasRestantes = 3 - i
                cy.get('#message').should('contain', `${tentativasRestantes} tentativas restantes`)

                // Aguardar antes da próxima tentativa
                cy.wait(2000)
            } else {
                // 3ª tentativa: conta deve ser bloqueada (mensagem original da API)
                cy.get('#message').should('be.visible')
                cy.get('#message').should('have.class', 'red')
                cy.get('#message').should('contain', 'Conta bloqueada devido a múltiplas tentativas falhadas')
            }
        }

        // Verificar que tentativa adicional também falha (conta bloqueada)
        cy.log('🔒 Verificando que conta permanece bloqueada')
        cy.get('#username').clear({ force: true }).type('admin', { force: true })
        cy.get('#password').clear({ force: true }).type('admin123', { force: true }) // Senha correta, mas conta bloqueada
        cy.get('#loginForm').submit()

        // Deve mostrar que conta está bloqueada, mesmo com senha correta
        cy.get('#message').should('be.visible')
        cy.get('#message').should('contain', 'Conta bloqueada devido a múltiplas tentativas falhadas')
        cy.get('#message').should('have.class', 'red')
    })

    /**
     * CENÁRIO 4: Recuperação de senha
     * Objetivo: Verificar funcionalidade de recuperação de senha por email
     * Resultado esperado: Email de recuperação enviado com sucesso
     */
    it('Cenário 4: Recuperação de senha por email', () => {
        cy.log('🧪 Testando recuperação de senha')

        // Clicar no link "Esqueci minha senha"
        cy.get('#forgotPasswordLink').should('be.visible').click()

        // Verificar se formulário de recuperação apareceu
        cy.get('#forgotCard').should('be.visible')
        cy.get('#loginCard').should('not.be.visible')

        // Preencher email válido
        cy.get('#email').should('be.visible').type('admin@teste.com', { force: true })

        // Verificar se email foi preenchido corretamente
        cy.get('#email').should('have.value', 'admin@teste.com')

        // Submeter formulário
        cy.get('#forgotForm').submit()

        // Verificar mensagem de sucesso (deve aparecer como toast)
        cy.get('.toast', { timeout: 10000 }).should('be.visible')
        cy.get('.toast').should('contain', 'Email de recuperação enviado!')
        cy.get('.toast').should('contain', 'Verifique sua caixa de entrada')

        // Verificar que retorna ao login automaticamente após alguns segundos
        cy.get('#loginCard', { timeout: 15000 }).should('be.visible')
        cy.get('#forgotCard').should('not.be.visible')
    })

    it('Cenário 4b: Recuperação com email inválido', () => {
        cy.log('🧪 Testando recuperação com email inválido')

        // Ir para formulário de recuperação
        cy.get('#forgotPasswordLink').click()
        cy.get('#forgotCard').should('be.visible')

        // Tentar com email inválido
        cy.get('#email').type('email_inexistente@test.com', { force: true })
        cy.get('#forgotForm').submit()

        // Deve mostrar mensagem apropriada (email não encontrado) - via toast
        cy.get('.toast', { timeout: 10000 }).should('be.visible')
        cy.get('.toast').should('contain', 'Usuário não encontrado')
    })

    it('Cenário 4c: Validação de formato de email', () => {
        cy.log('🧪 Testando validação de formato de email')

        // Ir para formulário de recuperação
        cy.get('#forgotPasswordLink').click()

        // Tentar com formato de email inválido
        cy.get('#email').type('email-invalido', { force: true })
        cy.get('#forgotForm').submit()

        // Verificar validação HTML5 ou customizada
        cy.get('#email:invalid').should('exist')
    })

    /**
     * TESTE ADICIONAL: Navegação e Interface
     */
    it('Interface e Navegação: Verificar elementos da página', () => {
        cy.log('🧪 Testando interface e navegação')

        // Verificar elementos principais da página
        cy.get('nav').should('be.visible')
        cy.get('.brand-logo').should('contain', 'Roteiro de Férias')
        cy.get('#loginCard').should('be.visible')
        cy.get('footer').should('be.visible')

        // Testar botão "Sobre"
        cy.get('#aboutBtn').click()
        cy.get('#aboutCard').should('be.visible')
        cy.get('#loginCard').should('not.be.visible')

        // Voltar ao login
        cy.get('#backToLoginFromAbout').click()
        cy.get('#loginCard').should('be.visible')
        cy.get('#aboutCard').should('not.be.visible')

        // Testar navegação entre formulários
        cy.get('#forgotPasswordLink').click()
        cy.get('#forgotCard').should('be.visible')

        cy.get('#backToLogin').click()
        cy.get('#loginCard').should('be.visible')
        cy.get('#forgotCard').should('not.be.visible')
    })

    /**
     * TESTE DE INTEGRAÇÃO: Verificar comunicação com API
     */
    it('Integração: Verificar comunicação com API backend', () => {
        cy.log('🧪 Testando comunicação com API backend')

        // Verificar se API está respondendo
        cy.request({
            url: '/health',
            method: 'GET'
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('status', 'ok')
        })

        // Verificar proxy da API de login
        cy.request({
            url: '/api/login',
            method: 'POST',
            body: { username: 'test', password: 'test' },
            failOnStatusCode: false
        }).then((response) => {
            // API deve responder (mesmo que com erro de credenciais)
            expect(response.status).to.be.oneOf([200, 401, 423])
            expect(response.body).to.have.property('success')
        })
    })
})
