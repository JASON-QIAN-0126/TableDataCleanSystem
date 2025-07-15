## Test File Structure

```
cypress/
├── e2e/
│   ├── topbar-navigation.cy.ts     # Tests navigation bar and theme toggle
│   ├── feedback-support.cy.ts      # Tests feedback and support forms
│   ├── file-upload.cy.ts           # Tests file upload functionality
│   ├── complete-clean-workflow.cy.ts # Tests complete data cleaning workflow
│   └── integration.cy.ts           # Comprehensive integration tests
├── fixtures/                       # Test data files
├── support/                        # Support files and custom commands
└── README.md                       # This file
```

### Test Coverage

1. Topbar and Theme Toggle Tests (topbar-navigation.cy.ts)
   • ✅ Verify navigation bar display and links
   • ✅ Test page navigation functionality
   • ✅ Check active link highlighting
   • ✅ Test light/dark mode toggle
   • ✅ Verify sun/moon theme icon display
   • ✅ Persist theme state across pages
   • ✅ Test hover effects

2. Feedback and Support Form Tests (feedback-support.cy.ts)
   • ✅ Verify form display and elements
   • ✅ Validate form input rules
   • ✅ Validate email format
   • ✅ Test form submission and thank-you message
   • ✅ Check form in light mode
   • ✅ Test like/dislike options in feedback
   • ✅ Test hover effects and animations
   • ✅ Persist state during theme toggle

3. File Upload Functionality Tests (file-upload.cy.ts)
   • ✅ Navigate to upload page via different routes
   • ✅ Display of file upload interface
   • ✅ Upload single and multiple files
   • ✅ Display file info
   • ✅ File deletion functionality
   • ✅ File preview feature
   • ✅ Keyword input handling
   • ✅ Validate all features in light mode
   • ✅ Verify animations and visual effects

4. Complete Clean Workflow Tests (complete-clean-workflow.cy.ts)
   • ✅ Complete data cleaning workflow from upload to report
   • ✅ File upload and processing
   • ✅ Processing status display with animations
   • ✅ Search functionality in results
   • ✅ Download processed data
   • ✅ Navigation to report page
   • ✅ Light mode workflow testing
   • ✅ Multiple file upload workflow
   • ✅ Error handling scenarios

5. Integration Tests (integration.cy.ts)
   • ✅ Complete user flow testing
   • ✅ Error handling scenarios
   • ✅ Persist theme state during flow
   • ✅ Test file operation sequences
   • ✅ Verify animations and UI transitions

### Running Tests

Prerequisites 1. Ensure the frontend dev server is running at http://localhost:5173 2. Ensure Cypress dependencies are installed

# Start the frontend dev server

npm run dev

# In a new terminal, run Cypress

# Run tests (headless mode)

npm test

# Open Cypress test runner (interactive mode)

npm run cypress:open

# Run all tests in headless mode

npm run cypress:run

### Run Specific Test Files

npx cypress run --spec "cypress/e2e/topbar-navigation.cy.ts"
npx cypress run --spec "cypress/e2e/feedback-support.cy.ts"
npx cypress run --spec "cypress/e2e/file-upload.cy.ts"
npx cypress run --spec "cypress/e2e/complete-clean-workflow.cy.ts"
npx cypress run --spec "cypress/e2e/integration.cy.ts"
