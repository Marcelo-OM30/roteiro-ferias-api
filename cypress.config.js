const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.js',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: true,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 20000,
        requestTimeout: 20000,
        responseTimeout: 20000,

        // Configuração do reporter mochawesome
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: 'cypress/reports/mochawesome',
            overwrite: false,
            html: false,
            json: true,
            timestamp: 'mmddyyyy_HHMMss'
        }
    },
    component: {
        devServer: {
            framework: 'create-react-app',
            bundler: 'webpack',
        },
    },
})
