/// <reference types="cypress" />

describe("Topbar Navigation and Theme Toggle", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the topbar with navigation links", () => {
    // check if topbar is visible
    cy.get(".topbar-container").should("be.visible");

    cy.get(".topbar-nav").should("be.visible");
    cy.get(".nav-link").should("have.length", 4);

    cy.get(".nav-link").eq(0).should("contain", "Home");
    cy.get(".nav-link").eq(1).should("contain", "Clean");
    cy.get(".nav-link").eq(2).should("contain", "Support");
    cy.get(".nav-link").eq(3).should("contain", "Feedback");
  });

  it("should navigate to different pages when clicking navigation links", () => {
    // test navigation to Home page
    cy.get(".nav-link").contains("Home").click();
    cy.wait(500);
    cy.url().should("include", "/home");

    // test navigation to Clean page
    cy.get(".nav-link").contains("Clean").click();
    cy.wait(500);
    cy.url().should("include", "/clean");

    // test navigation to Support page
    cy.get(".nav-link").contains("Support").click();
    cy.wait(500);
    cy.url().should("include", "/support");

    // test navigation to Feedback page
    cy.get(".nav-link").contains("Feedback").click();
    cy.wait(500);
    cy.url().should("include", "/feedback");
  });

  it("should highlight the active navigation link", () => {
    // visit four pages
    cy.visit("/home");
    cy.get(".nav-link").contains("Home").should("have.class", "active-dark");

    cy.visit("/clean");
    cy.get(".nav-link").contains("Clean").should("have.class", "active-dark");

    cy.visit("/support");
    cy.get(".nav-link").contains("Support").should("have.class", "active-dark");

    cy.visit("/feedback");
    cy.get(".nav-link")
      .contains("Feedback")
      .should("have.class", "active-dark");
  });

  it("should toggle between light and dark mode", () => {
    // test toggle between light and dark mode
    cy.visit("/home");

    cy.get(".topbar-container").should("have.class", "topbar-dark");

    cy.get(".neon-switch").should("be.visible").click();

    cy.get(".topbar-container").should("have.class", "topbar-light");

    cy.get(".neon-switch").should("have.class", "checked");

    cy.get(".neon-switch").click();

    cy.get(".topbar-container").should("have.class", "topbar-dark");
    cy.get(".neon-switch").should("not.have.class", "checked");
  });

  it("should display correct theme switch icons", () => {
    cy.visit("/home");

    cy.get(".neon-switch .switch-icon").should("be.visible");
    cy.get(".neon-switch .moon-icon").should("be.visible");

    cy.get(".neon-switch").click();

    cy.get(".neon-switch .switch-icon").should("be.visible");
    cy.get(".neon-switch .sun-icon").should("be.visible");
  });

  it("should persist theme across page navigation", () => {
    cy.visit("/home");

    cy.get(".neon-switch").click();
    cy.get(".topbar-container").should("have.class", "topbar-light");

    cy.get(".nav-link").contains("Support").click();
    cy.wait(500);

    cy.get(".topbar-container").should("have.class", "topbar-light");
    cy.get(".neon-switch").should("have.class", "checked");
    cy.get(".nav-link").contains("Clean").click();
    cy.wait(500);

    cy.get(".topbar-container").should("have.class", "topbar-light");
    cy.get(".neon-switch").should("have.class", "checked");
  });

  it("should show hover effects on navigation links", () => {
    cy.visit("/home");

    cy.get(".nav-link").contains("Clean").trigger("mouseover");

    cy.get(".nav-link").contains("Clean").should("be.visible");

    cy.get(".neon-switch").trigger("mouseover");
    cy.get(".neon-switch").should("be.visible");
  });
});
