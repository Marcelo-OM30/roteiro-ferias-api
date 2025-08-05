const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({
        message: 'Servidor frontend funcionando!',
        port: PORT,
        path: __dirname
    });
});

app.listen(PORT, () => {
    console.log(`✅ Servidor FRONTEND rodando na porta ${PORT}`);
    console.log(`📂 Diretório: ${__dirname}`);
});
