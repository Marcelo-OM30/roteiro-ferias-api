/**
 * Aplicação Principal
 * Gerencia interface, eventos e interações do usuário
 * Integra com o serviço de autenticação
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Roteiro de Férias - Aplicação iniciada');

    // Inicializar MaterializeCSS
    M.AutoInit();

    // Cache de elementos DOM
    const elements = {
        // Forms
        loginForm: document.getElementById('loginForm'),
        forgotForm: document.getElementById('forgotForm'),

        // Cards
        loginCard: document.getElementById('loginCard'),
        forgotCard: document.getElementById('forgotCard'),
        aboutCard: document.getElementById('aboutCard'),

        // Inputs
        username: document.getElementById('username'),
        password: document.getElementById('password'),
        email: document.getElementById('email'),

        // Buttons
        loginBtn: document.getElementById('loginBtn'),
        forgotBtn: document.getElementById('forgotBtn'),
        forgotPasswordLink: document.getElementById('forgotPasswordLink'),
        backToLogin: document.getElementById('backToLogin'),
        backToLoginFromAbout: document.getElementById('backToLoginFromAbout'),
        aboutBtn: document.getElementById('aboutBtn'),
        footerAbout: document.getElementById('footerAbout'),

        // Messages
        message: document.getElementById('message'),
        messageText: document.getElementById('messageText')
    };

    // Verificar se já está autenticado
    checkInitialAuth();

    // Event Listeners
    setupEventListeners();

    /**
     * Verifica autenticação inicial
     */
    async function checkInitialAuth() {
        if (authService.isAuthenticated()) {
            const validation = await authService.validateToken();

            if (validation.valid) {
                const user = authService.getCurrentUser();
                console.log('👤 Usuário já autenticado:', user);

                showMessage('Redirecionando...', 'blue', false);

                setTimeout(() => {
                    if (user && user.isAdmin) {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/public-trips';
                    }
                }, 1000);

                return;
            } else {
                console.log('🔒 Token inválido, fazendo logout');
                authService.logout();
            }
        }

        console.log('🏠 Exibindo página de login');
    }

    /**
     * Configura todos os event listeners
     */
    function setupEventListeners() {
        // Forms
        elements.loginForm?.addEventListener('submit', handleLogin);
        elements.forgotForm?.addEventListener('submit', handleForgotPassword);

        // Navigation
        elements.forgotPasswordLink?.addEventListener('click', showForgotForm);
        elements.backToLogin?.addEventListener('click', showLoginForm);
        elements.backToLoginFromAbout?.addEventListener('click', showLoginForm);
        elements.aboutBtn?.addEventListener('click', showAboutForm);
        elements.footerAbout?.addEventListener('click', showAboutForm);

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);

        // Input validation em tempo real
        elements.email?.addEventListener('input', validateEmail);
        elements.username?.addEventListener('input', validateUsername);
        elements.password?.addEventListener('input', validatePassword);
    }

    /**
     * Manipula submit do formulário de login
     */
    async function handleLogin(e) {
        e.preventDefault();

        const username = elements.username.value.trim();
        const password = elements.password.value;

        // Validação básica
        if (!username || !password) {
            showMessage('Por favor, preencha todos os campos', 'red');
            return;
        }

        // Mostrar loading
        setButtonLoading(elements.loginBtn, true);
        showMessage('Fazendo login...', 'blue', true);

        try {
            const result = await authService.login(username, password);

            if (result.success) {
                showMessage('Login realizado com sucesso! 🎉', 'green');

                // Log para debug
                console.log('✅ Login bem-sucedido:', result);

                setTimeout(() => {
                    const user = authService.getCurrentUser();
                    if (user && user.isAdmin) {
                        console.log('👑 Redirecionando para área admin');
                        window.location.href = '/admin';
                    } else {
                        console.log('👤 Redirecionando para roteiros públicos');
                        window.location.href = '/public-trips';
                    }
                }, 1500);

            } else {
                // Tratar diferentes tipos de erro
                let errorMessage = result.message || 'Erro no login';

                if (result.attemptsLeft !== undefined) {
                    if (result.attemptsLeft > 0) {
                        errorMessage += ` (${result.attemptsLeft} tentativas restantes)`;
                    } else {
                        errorMessage = 'Conta bloqueada! Muitas tentativas de login falharam.';
                    }
                }

                showMessage(errorMessage, 'red');

                // Shake effect nos campos
                shakeElement(elements.loginCard);
            }

        } catch (error) {
            console.error('❌ Erro no login:', error);
            showMessage('Erro inesperado. Tente novamente.', 'red');
        } finally {
            setButtonLoading(elements.loginBtn, false);
        }
    }

    /**
     * Manipula submit do formulário de recuperação
     */
    async function handleForgotPassword(e) {
        e.preventDefault();

        const email = elements.email.value.trim().toLowerCase();

        // Validação básica
        if (!email || !isValidEmail(email)) {
            showMessage('Por favor, insira um email válido', 'red');
            return;
        }

        // Mostrar loading
        setButtonLoading(elements.forgotBtn, true);
        showMessage('Enviando email de recuperação...', 'blue', true);

        try {
            const result = await authService.forgotPassword(email);

            if (result.success) {
                showMessage('Email de recuperação enviado! 📧 Verifique sua caixa de entrada.', 'green');

                setTimeout(() => {
                    showLoginForm();
                }, 3000);

            } else {
                showMessage(result.message || 'Erro ao enviar email de recuperação', 'red');
            }

        } catch (error) {
            console.error('❌ Erro na recuperação:', error);
            showMessage('Erro inesperado. Tente novamente.', 'red');
        } finally {
            setButtonLoading(elements.forgotBtn, false);
        }
    }

    /**
     * Mostra formulário de recuperação de senha
     */
    function showForgotForm(e) {
        e?.preventDefault();
        hideAllCards();
        elements.forgotCard.style.display = 'block';
        elements.email.focus();
        console.log('📧 Exibindo formulário de recuperação');
    }

    /**
     * Mostra formulário de login
     */
    function showLoginForm() {
        hideAllCards();
        elements.loginCard.style.display = 'block';
        elements.forgotForm.reset();
        elements.username.focus();
        console.log('🔑 Exibindo formulário de login');
    }

    /**
     * Mostra card de informações
     */
    function showAboutForm(e) {
        e?.preventDefault();
        hideAllCards();
        elements.aboutCard.style.display = 'block';
        console.log('ℹ️ Exibindo informações sobre o sistema');
    }

    /**
     * Esconde todos os cards
     */
    function hideAllCards() {
        elements.loginCard.style.display = 'none';
        elements.forgotCard.style.display = 'none';
        elements.aboutCard.style.display = 'none';
        elements.message.style.display = 'none';
    }

    /**
     * Exibe mensagem para o usuário
     */
    function showMessage(text, color, showProgress = false) {
        elements.messageText.textContent = text;

        // Remover classes antigas
        elements.message.className = 'card-panel';

        // Adicionar nova cor
        elements.message.classList.add(`${color}`, 'lighten-2');

        if (showProgress) {
            elements.message.innerHTML = `
                <span>${text}</span>
                <div class="progress ${color} lighten-4" style="margin-top: 10px;">
                    <div class="indeterminate ${color}"></div>
                </div>
            `;
        } else {
            elements.message.innerHTML = `<span>${text}</span>`;
        }

        elements.message.style.display = 'block';

        // Toast para mensagens importantes
        if (color === 'green' || color === 'red') {
            M.toast({
                html: text,
                classes: `${color} lighten-1`,
                displayLength: 4000
            });
        }
    }

    /**
     * Controla estado de loading dos botões
     */
    function setButtonLoading(button, isLoading) {
        if (!button) return;

        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    /**
     * Adiciona efeito shake ao elemento
     */
    function shakeElement(element) {
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    /**
     * Valida email em tempo real
     */
    function validateEmail() {
        const email = elements.email.value.trim();
        const isValid = isValidEmail(email);

        if (email.length > 0) {
            elements.email.classList.toggle('valid', isValid);
            elements.email.classList.toggle('invalid', !isValid);
        }
    }

    /**
     * Valida username em tempo real
     */
    function validateUsername() {
        const username = elements.username.value.trim();
        const isValid = username.length >= 2;

        if (username.length > 0) {
            elements.username.classList.toggle('valid', isValid);
            elements.username.classList.toggle('invalid', !isValid);
        }
    }

    /**
     * Valida password em tempo real
     */
    function validatePassword() {
        const password = elements.password.value;
        const isValid = password.length >= 3;

        if (password.length > 0) {
            elements.password.classList.toggle('valid', isValid);
            elements.password.classList.toggle('invalid', !isValid);
        }
    }

    /**
     * Manipula atalhos de teclado
     */
    function handleKeyboard(e) {
        // ESC para voltar ao login
        if (e.key === 'Escape') {
            showLoginForm();
        }

        // F1 para mostrar informações
        if (e.key === 'F1') {
            e.preventDefault();
            showAboutForm();
        }
    }

    /**
     * Valida formato de email
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // CSS para animação shake
    const shakeCSS = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;

    // Adicionar CSS dinâmico
    const style = document.createElement('style');
    style.textContent = shakeCSS;
    document.head.appendChild(style);

    console.log('✅ Aplicação configurada com sucesso');
});
