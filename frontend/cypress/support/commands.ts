/// <reference types="cypress" />

// Custom commands for the application
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Custom command to wait for navigation to complete
       * @example cy.waitForNavigation()
       */
      waitForNavigation(): Chainable<null>;

      /**
       * Custom command to check if element is visible on screen
       * @example cy.get('button').shouldBeVisible()
       */
      shouldBeVisible(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Custom command implementations
Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("waitForNavigation", () => {
  cy.wait(500); // Wait for navigation transitions
});

Cypress.Commands.add(
  "shouldBeVisible",
  { prevSubject: "element" },
  (subject) => {
    return cy.wrap(subject).should("be.visible");
  },
);

export {};
