## Running Tests

### Prerequisites:

1. Ensure the frontend dev server is running at http://localhost:5173 

2. Ensure Cypress dependencies are installed

3. Ensure Backend server is running

### Start tests:

```bash
cd frontend

## Run tests (headless mode)
npm test

## Open Cypress test runner (interactive mode)
npm run cypress:open

## Run Specific Test Files
npx cypress run --spec "cypress/e2e/topbar-navigation.cy.ts"
npx cypress run --spec "cypress/e2e/feedback-support.cy.ts"
npx cypress run --spec "cypress/e2e/file-upload.cy.ts"
npx cypress run --spec "cypress/e2e/complete-clean-workflow.cy.ts"
npx cypress run --spec "cypress/e2e/integration.cy.ts"
```
