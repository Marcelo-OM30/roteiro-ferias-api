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
        console.error('Erro ao conectar com API de login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao conectar com API de autenticação'
        });
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
        console.error('Erro ao conectar com API de recuperação:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao conectar com API de recuperação'
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
