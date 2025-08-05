#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Caminho para o relatório
const reportPath = path.join(__dirname, 'cypress', 'reports', 'mochawesome', 'merged-report.html');

// Verificar se o arquivo existe
if (!fs.existsSync(reportPath)) {
    console.log('❌ Relatório não encontrado:', reportPath);
    process.exit(1);
}

console.log('📊 Abrindo relatório de testes...');
console.log('📁 Localização:', reportPath);

// Comando para abrir baseado no sistema operacional
let command;
if (process.platform === 'darwin') {
    command = `open "${reportPath}"`;
} else if (process.platform === 'win32') {
    command = `start "" "${reportPath}"`;
} else {
    // Linux e outros
    command = `xdg-open "${reportPath}"`;
}

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.log('⚠️  Não foi possível abrir automaticamente. Abra manualmente:');
        console.log(`file://${reportPath}`);
    } else {
        console.log('✅ Relatório aberto com sucesso!');
    }
});
