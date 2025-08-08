# Roteiro de Férias - Aplicação Web Integrada

[![Test and Deploy](https://github.com/Marcelo-OM30/testApi/actions/workflows/test-and-deploy.yml/badge.svg)](https://github.com/Marcelo-OM30/testApi/actions/workflows/test-and-deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/Reports-GitHub%20Pages-blue?style=flat&logo=github)](https://marcelo-om30.github.io/roteiro-ferias-app/)
[![Cypress Tests](https://img.shields.io/badge/Tests-Cypress-brightgreen?style=flat&logo=cypress)](https://marcelo-om30.github.io/roteiro-ferias-app/mochawesome.html)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MaterializeCSS](https://img.shields.io/badge/MaterializeCSS-ee6e73?style=for-the-badge&logo=material-design&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎯 Sobre o Projeto

Esta é uma aplicação web desenvolvida para o **Desafio Mentoria 2.0** que demonstra a integração completa entre um frontend moderno e uma API REST de autenticação. O projeto consome a API de login desenvolvida no desafio anterior, implementando uma interface elegante e testes automatizados.

### 🏗️ Arquitetura

```
┌─────────────────┐    HTTP Requests    ┌──────────────────┐
│   Frontend      │ ─────────────────→ │   Backend API    │
│   Express.js    │                     │   (testApi)      │
│   Port 3000     │ ←───────────────── │   Port 3001      │
│                 │    JSON Responses   │                  │
└─────────────────┘                     └──────────────────┘
        │
        ├─ HTML/CSS/JS (MaterializeCSS)
        ├─ Consumo da API /api/login
        ├─ Consumo da API /api/forgot-password
        └─ Testes automatizados (Cypress)
```

## 🛠️ Tecnologias Utilizadas

- **Express.js**: Servidor web para servir arquivos estáticos e proxy da API
- **MaterializeCSS**: Framework CSS para interface moderna e responsiva
- **HTML5/CSS3/JavaScript**: Frontend moderno e interativo
- **Cypress**: Testes end-to-end automatizados
- **Node.js**: Runtime do servidor
- **Fetch API**: Comunicação com API REST

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com validação de credenciais
- Sistema de recuperação de senha por email
- Bloqueio automático após múltiplas tentativas falhadas
- Gerenciamento de sessão com localStorage
- Redirecionamento baseado em perfil de usuário

### 🎨 Interface
- Design responsivo com MaterializeCSS
- Animações e transições suaves
- Feedback visual para todas as ações
- Validação em tempo real de formulários
- Mensagens de toast para melhor UX

### 🧪 Testes Automatizados
Implementa os **4 cenários principais** do desafio:

1. **Login com credenciais válidas**
2. **Login com credenciais inválidas**
3. **Múltiplas tentativas falhadas (bloqueio)**
4. **Recuperação de senha por email**

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 16 ou superior)
- NPM ou Yarn
- API testApi rodando na porta 3001

### Passo 1: Iniciar a API Backend
```bash
# Em um terminal, vá para o projeto testApi
cd ../testApi
npm start
# API rodará na porta 3001
```

### Passo 2: Instalar Dependências
```bash
# No diretório do projeto roteiro-ferias-app
npm install
```

### Passo 3: Iniciar Servidor Frontend
```bash
npm start
# Aplicação rodará na porta 3000
```

### Passo 4: Acessar Aplicação
Abra seu navegador e acesse: `http://localhost:3000`

## 🧪 Executar Testes

### Testes Interativos (Interface Gráfica)
```bash
npm run test:open
```

### Testes em Modo Headless
```bash
npm test
```

### Verificar Status da API
```bash
curl http://localhost:3000/health
```

## 📋 Cenários de Teste

### Cenário 1: Login Válido
- **Usuário**: `admin` | **Senha**: `123456`
- **Resultado**: Redirecionamento para área administrativa
- **Usuário**: `user` | **Senha**: `password`
- **Resultado**: Redirecionamento para roteiros públicos

### Cenário 2: Login Inválido
- **Usuário**: `usuario_invalido` | **Senha**: `senha_errada`
- **Resultado**: Mensagem de erro, permanece na tela de login

### Cenário 3: Bloqueio de Conta
- **Ação**: 5 tentativas de login com senha incorreta
- **Resultado**: Conta bloqueada temporariamente

### Cenário 4: Recuperação de Senha
- **Email**: `admin@example.com`
- **Resultado**: Email de recuperação enviado

## 📁 Estrutura do Projeto

```
roteiro-ferias-app/
├── server.js                 # Servidor Express.js
├── package.json              # Dependências e scripts
├── cypress.config.js         # Configuração do Cypress
├── public/                   # Arquivos estáticos
│   ├── index.html           # Página principal de login
│   ├── 404.html             # Página de erro 404
│   ├── css/
│   │   └── style.css        # CSS customizado
│   └── js/
│       ├── auth.js          # Serviço de autenticação
│       └── app.js           # Lógica principal da aplicação
├── cypress/                 # Testes automatizados
│   ├── e2e/
│   │   └── login-scenarios.cy.js # Testes dos 4 cenários
│   └── support/
│       ├── e2e.js           # Configurações globais
│       └── commands.js      # Comandos customizados
└── README.md                # Documentação
```

## 🔧 Scripts Disponíveis

### 🚀 Execução Local
- `npm start`: Inicia o servidor de produção
- `npm run dev`: Inicia o servidor com nodemon (desenvolvimento)
- `npm run health-check`: Verifica status do servidor
- `npm run wait-for-server`: Aguarda servidor estar disponível

### 🧪 Testes Automatizados
- `npm test`: Executa testes Cypress em modo headless com relatório
- `npm run test:open`: Abre interface gráfica do Cypress para desenvolvimento
- `npm run test:run`: Executa apenas os testes (sem relatório)
- `npm run test:ci`: Executa testes em modo CI/CD (sem abrir relatório)
- `npm run test:clean`: Limpa relatórios anteriores
- `npm run test:full`: Limpa + testa + gera relatório completo

### 🔄 Pipeline e Deploy
- `npm run test:trigger-pipeline`: **Dispara execução da pipeline GitHub Actions**
  ```bash
  # Executa automaticamente:
  # 1. git add .
  # 2. git commit --allow-empty
  # 3. git push origin main
  # 4. Triggers GitHub Actions workflow
  ```

## 🚀 CI/CD com GitHub Actions

### 🎯 Pipeline Automatizada
Este projeto possui uma pipeline completa no GitHub Actions que:

- ✅ **Executa 10 cenários de teste** automaticamente em push/PR
- ✅ **Gera relatórios Mochawesome** com resultados detalhados e estatísticas
- ✅ **Publica no GitHub Pages** com dashboard personalizado em horário brasileiro
- ✅ **Testa em múltiplas versões** do Node.js (18, 20) para compatibilidade
- ✅ **Salva artefatos** (screenshots, vídeos, relatórios) por 30 dias
- ✅ **Deploy automático** do relatório em Pages após sucesso dos testes

### 📊 Acesso aos Relatórios
- **🏠 Dashboard Principal**: [Test Reports Dashboard](https://marcelo-om30.github.io/roteiro-ferias-api/)
- **📈 Relatório Completo**: [Mochawesome Report](https://marcelo-om30.github.io/roteiro-ferias-api/merged-report.html)
- **🔧 GitHub Actions**: [Pipeline Status](https://github.com/Marcelo-OM30/roteiro-ferias-api/actions)

### 🔄 Como Disparar a Pipeline

#### 1. **Método Automatizado** (Recomendado)
```bash
# Comando único que faz tudo
npm run test:trigger-pipeline
```

#### 2. **Método Manual**
```bash
# Push na branch main
git add .
git commit -m "trigger: Executa testes na pipeline" --allow-empty
git push origin main
```

#### 3. **Via Interface GitHub**
- Acesse: `Actions` → `🧪 Test and Deploy` → `Run workflow`

#### 4. **Pull Request**
```bash
# Automaticamente executa em PRs
gh pr create --title "Feature: Nova funcionalidade" --body "Descrição"
```

### 📈 Métricas e Relatórios
- ✅ **10 cenários de teste** executados automaticamente
- 📊 **Taxa de sucesso**: 100% (10/10 testes passando)
- ⏱️ **Tempo de execução**: ~2-3 minutos
- 🗓️ **Horário brasileiro**: Timestamps em BRT (UTC-3)
- 📱 **Layout responsivo**: Dashboard funciona em mobile
- 🔄 **Execução contínua**: A cada push na branch main
- Screenshots de falhas (se houver)
- Vídeos completos dos testes
- Logs detalhados de cada step

### ⚙️ Configuração Local para CI
```bash
# Simular pipeline localmente
npm run test:clean
npm start &
npm run wait-for-server  
npm run test:ci
```

## 🌐 Endpoints

### Frontend (Port 3000)
- `GET /`: Página principal de login
- `GET /admin`: Área administrativa (requer autenticação)
- `GET /public-trips`: Roteiros públicos
- `GET /health`: Status do servidor

### Proxy API (Para testApi Port 3001)
- `POST /api/login`: Autenticação de usuário
- `POST /api/forgot-password`: Recuperação de senha

## 🎨 Recursos de Interface

### MaterializeCSS Components
- **Cards**: Layout principal dos formulários
- **Forms**: Inputs com validação e feedback visual
- **Buttons**: Botões com animações e estados de loading
- **Toast**: Notificações não intrusivas
- **Progress**: Indicadores de carregamento
- **Icons**: Ícones Material Design
- **Grid**: Layout responsivo

### Animações e Efeitos
- Transições suaves entre telas
- Efeito shake em erros de login
- Loading states em botões
- Fade in/out em mensagens
- Hover effects em elementos interativos

## 🛡️ Segurança

- Validação de entrada no frontend e backend
- Sanitização de dados
- Gerenciamento seguro de tokens
- Rate limiting via API
- Validação de CORS

## 🐛 Tratamento de Erros

- Mensagens de erro amigáveis ao usuário
- Fallbacks para falhas de conexão
- Validação de campos em tempo real
- Logs detalhados para debug
- Página 404 customizada

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🔄 Integração com API Original

Este projeto consome a API desenvolvida no desafio anterior (`testApi`), mantendo:
- ✅ Mesmos endpoints de autenticação
- ✅ Mesma lógica de bloqueio de conta
- ✅ Mesma funcionalidade de recuperação de senha
- ✅ Compatibilidade com todos os cenários de teste

## 📝 Logs e Debug

O sistema inclui logs detalhados para facilitar o desenvolvimento:
- 🟢 Logs de sucesso em operações
- 🔴 Logs de erro com stack trace
- 🔵 Logs de debug para autenticação
- ⚪ Logs de navegação e eventos

## 🎓 Objetivo Acadêmico

Este projeto foi desenvolvido para demonstrar:
- Integração entre frontend e backend
- Consumo de APIs REST
- Implementação de testes automatizados
- Uso de frameworks CSS modernos
- Boas práticas de desenvolvimento web
- Arquitetura de aplicações web

## 👨‍💻 Autor

**Marcelo OM30**
- GitHub: [@Marcelo-OM30](https://github.com/Marcelo-OM30)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido para o Desafio Universitário** 🎓

> "A integração perfeita entre design, funcionalidade e testes automatizados."
