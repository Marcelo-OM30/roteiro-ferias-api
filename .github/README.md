# 🚀 GitHub Actions - Roteiro de Férias

Este diretório contém as workflows do GitHub Actions para automatizar testes e deployment.

## 📋 Workflows Disponíveis

### `test-and-deploy.yml`
Pipeline principal que executa testes e faz deploy dos relatórios no GitHub Pages.

**Triggers:**
- Push na branch `main`
- Pull Requests para `main`
- Execução manual (`workflow_dispatch`)

**Jobs:**
1. **Test** - Executa testes em múltiplas versões do Node.js
2. **Deploy Pages** - Publica relatórios no GitHub Pages
3. **Notify** - Cria resumo dos resultados

## 🔧 Configuração

### Permissões Necessárias
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Variáveis de Ambiente
- `CYPRESS_baseUrl`: URL base para os testes (padrão: http://localhost:3000)

### Secrets (Gerenciados Automaticamente)
- `GITHUB_TOKEN`: Token automático para GitHub Pages

## 📊 Relatórios Gerados

### Estrutura no Pages
```
_site/
├── index.html          # Dashboard personalizado
├── mochawesome.html    # Relatório completo do Mochawesome
├── assets/            # CSS e JS do Mochawesome
├── README.md          # Documentação dos relatórios
└── *.json            # Dados brutos dos testes
```

### Acesso aos Relatórios
- **Dashboard**: https://marcelo-om30.github.io/roteiro-ferias-app/
- **Relatório Completo**: https://marcelo-om30.github.io/roteiro-ferias-app/mochawesome.html

## 🧪 Testes Executados

### Cenários Cypress
1. **Login Scenarios** (`login-scenarios.cy.js`)
   - Autenticação válida/inválida
   - Bloqueio após tentativas falhadas
   - Recuperação de senha
   - Redirecionamentos

### Cobertura
- ✅ UI/UX Testing
- ✅ API Integration
- ✅ Error Handling
- ✅ Authentication Flow

## 📈 Monitoramento

### Métricas Coletadas
- Número total de testes
- Taxa de sucesso/falha
- Tempo de execução
- Screenshots de falhas
- Vídeos dos testes

### Artefatos Salvos
- Relatórios Mochawesome (30 dias)
- Screenshots de falhas
- Vídeos dos testes
- Logs de execução

## 🔧 Troubleshooting

### Problemas Comuns

**1. Servidor não inicia**
```bash
# Verificar se a porta 3000 está livre
npm run health-check
```

**2. Testes falham por timeout**
```bash
# Aumentar timeout no cypress.config.js
defaultCommandTimeout: 10000
```

**3. Pages não atualiza**
- Verificar permissões do repositório
- Confirmar que branch `gh-pages` foi criada
- Verificar status na aba Actions

### Debug Local
```bash
# Executar pipeline localmente
npm run test:clean
npm start &
npm run wait-for-server
npm run test:ci
```

## 📝 Manutenção

### Atualizações de Dependências
```bash
# Atualizar Cypress
npm update cypress

# Atualizar Actions
# Verificar https://github.com/actions/checkout/releases
```

### Monitoramento de Performance
- Acompanhar tempo de execução dos testes
- Verificar tamanho dos artefatos
- Monitorar uso de minutos do GitHub Actions

## 🚀 Melhorias Futuras

### Roadmap
- [ ] Testes em múltiplos browsers
- [ ] Integração com Slack/Discord para notificações
- [ ] Cache avançado para dependencies
- [ ] Testes de performance com Lighthouse
- [ ] Deploy automático para staging environment

### Configurações Avançadas
```yaml
# Exemplo de matrix strategy para browsers
strategy:
  matrix:
    browser: [chrome, firefox, edge]
    node-version: [18, 20]
```

---

**Última atualização**: Agosto 2025  
**Responsável**: Marcelo OM30
