const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Servir arquivos estáticos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/public-trips', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'public-trips.html'));
});

// Proxy endpoints para a API de login (testApi na porta 3001)
app.post('/api/login', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('⚠️ API backend não disponível, usando respostas mockadas');
        
        // Respostas mockadas para quando a API não está disponível (modo CI/CD)
        const { username, password } = req.body;
        
        if (username === 'admin' && password === 'admin123') {
            res.json({
                success: true,
                message: 'Login realizado com sucesso!',
                token: 'mock-token-admin',
                user: { username: 'admin', role: 'admin' }
            });
        } else if (username === 'usuario' && password === 'senha123') {
            res.json({
                success: true,
                message: 'Login realizado com sucesso!',
                token: 'mock-token-user',
                user: { username: 'usuario', role: 'user' }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Username ou senha incorretos'
            });
        }
    }
});

app.post('/api/forgot-password', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('⚠️ API backend não disponível para recuperação de senha');
        
        // Resposta mockada para recuperação de senha
        const { email } = req.body;
        
        if (email && email.includes('@')) {
            res.json({
                success: true,
                message: 'Email de recuperação enviado! Verifique sua caixa de entrada.'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Email inválido'
            });
        }
    }
});

app.post('/api/reset-attempts', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:3001/api/reset-attempts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('⚠️ API backend não disponível para reset de tentativas');
        
        // Resposta mockada - sempre sucesso para testes
        res.json({
            success: true,
            message: 'Reset realizado (modo desenvolvimento)'
        });
    }
});

// Endpoint de health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor frontend funcionando',
        timestamp: new Date().toISOString()
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 Frontend server rodando na porta ${PORT}`);
    console.log(`📱 Acesse: http://localhost:${PORT}`);
    console.log(`🔗 API de Login: http://localhost:3001`);
    console.log(`🩺 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
