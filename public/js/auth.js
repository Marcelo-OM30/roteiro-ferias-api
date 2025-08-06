/**
 * Serviço de Autenticação
 * Gerencia comunicação com a API de login (testApi)
 * Implementa funcionalidades de login, recuperação de senha e gerenciamento de sessão
 */

class AuthService {
    constructor() {
        this.baseURL = '/api';
        this.tokenKey = 'authToken';
        this.userKey = 'userInfo';
        this.usernameKey = 'username';
    }

    /**
     * Realiza login do usuário
     * @param {string} username - Nome de usuário
     * @param {string} password - Senha do usuário
     * @returns {Promise<Object>} Resultado do login
     */
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password
                })
            });

            const data = await response.json();

            if (data.success && data.token) {
                this.setAuthData(data.token, username, data.user);

                console.log('Login bem-sucedido:', {
                    username,
                    hasToken: !!data.token,
                    user: data.user
                });
            }

            return {
                success: data.success,
                message: data.message,
                user: data.user,
                attemptsLeft: data.attemptsLeft,
                token: data.token
            };

        } catch (error) {
            console.error('Erro no login:', error);
            return {
                success: false,
                message: 'Erro de conexão com o servidor. Verifique se a API está rodando na porta 3001.'
            };
        }
    }

    async forgotPassword(email) {
        try {
            const response = await fetch(`${this.baseURL}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase()
                })
            });

            const data = await response.json();

            console.log('Recuperação de senha solicitada:', {
                email,
                success: data.success
            });

            return {
                success: data.success,
                message: data.message
            };

        } catch (error) {
            console.error('Erro na recuperação de senha:', error);
            return {
                success: false,
                message: 'Erro de conexão com o servidor. Verifique se a API está rodando na porta 3001.'
            };
        }
    }

    async validateToken() {
        const token = this.getToken();
        if (!token) {
            return { valid: false, message: 'Token não encontrado' };
        }

        try {
            const tokenData = this.parseJWT(token);

            if (tokenData && tokenData.exp) {
                const now = Math.floor(Date.now() / 1000);
                if (now >= tokenData.exp) {
                    this.logout();
                    return { valid: false, message: 'Token expirado' };
                }
            }

            return {
                valid: true,
                user: this.getCurrentUser()
            };

        } catch (error) {
            console.error('Erro na validação do token:', error);
            return { valid: false, message: 'Token inválido' };
        }
    }

    setAuthData(token, username, user) {
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.usernameKey, username);
        localStorage.setItem(this.userKey, JSON.stringify(user || { username }));
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.usernameKey);
        localStorage.removeItem(this.userKey);

        console.log('Logout realizado');

        setTimeout(() => {
            window.location.href = '/';
        }, 500);
    }

    isAuthenticated() {
        const token = this.getToken();
        const username = this.getUsername();
        return !!(token && username);
    }

    /**
     * Obtém dados do usuário atual
     * @returns {Object|null} Dados do usuário ou null
     */
    getCurrentUser() {
        const userInfo = localStorage.getItem(this.userKey);
        const username = this.getUsername();

        if (!username) return null;

        try {
            const userData = userInfo ? JSON.parse(userInfo) : { username };
            return {
                ...userData,
                username,
                isAdmin: this.isAdmin(username)
            };
        } catch (error) {
            console.error('Erro ao obter dados do usuário:', error);
            return {
                username,
                isAdmin: this.isAdmin(username)
            };
        }
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Obtém nome de usuário
     * @returns {string|null} Username ou null
     */
    getUsername() {
        return localStorage.getItem(this.usernameKey);
    }

    /**
     * Verifica se usuário é administrador
     * @param {string} username - Nome de usuário
     * @returns {boolean} Se é admin
     */
    isAdmin(username) {
        return username === 'admin';
    }

    /**
     * Parse simples de JWT (sem validação de assinatura)
     * @param {string} token - Token JWT
     * @returns {Object|null} Payload do token
     */
    parseJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Erro ao fazer parse do JWT:', error);
            return null;
        }
    }

    /**
     * Verifica status da API
     * @returns {Promise<boolean>} Se a API está online
     */
    async checkAPIStatus() {
        try {
            const response = await fetch('/health');
            return response.ok;
        } catch (error) {
            console.error('API não está acessível:', error);
            return false;
        }
    }
}

// Instância global do serviço de autenticação
const authService = new AuthService();

// Verificar status da API na inicialização
authService.checkAPIStatus().then(isOnline => {
    if (!isOnline) {
        console.warn('⚠️ API pode não estar acessível. Verifique se o servidor backend está rodando.');
    } else {
        console.log('✅ API está online e acessível.');
    }
});

// Exportar para uso global
window.authService = authService;
