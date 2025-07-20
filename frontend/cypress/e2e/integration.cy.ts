/// <reference types="cypress" />

describe("Complete Application Integration Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should complete the full user workflow", () => {
    // start from home page
    cy.visit("/home");

    // test navigation and theme switch
    cy.get(".topbar-container").should("be.visible");
    cy.get(".neon-switch").should("be.visible");

    cy.get(".neon-switch").click();
    cy.get(".topbar-container").should("have.class", "topbar-light");

    // into clean page
    cy.get("button").contains("Start Clean").click();
    cy.url().should("include", "/clean");

    // upload function
    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });

    cy.get(".file-item").should("contain", "test-data.csv");

    // preview
    cy.get(".preview-btn").click();
    cy.get(".preview-modal").should("be.visible");
    cy.get(".preview-modal-content table").should("be.visible");
    cy.get(".preview-modal-content th").should("contain", "name");
    cy.get(".close-btn").click();

    cy.get(".keywords-input").type("email, name, company");

    cy.get(".nav-link").contains("Support").click();
    cy.url().should("include", "/support");

    cy.get('input[type="text"]').type("Integration Test User");
    cy.get('input[type="email"]').type("integration@example.com");
    cy.get("textarea").type("This is an integration test message for support.");

    cy.get('button[type="submit"]').click();

    cy.get(".thank-you-message").should("be.visible");
    cy.get(".thank-you-message h2").should(
      "contain",
      "Thank you for your message. Our team will get back to you shortly.",
    );

    cy.get(".nav-link").contains("Feedback").click();
    cy.url().should("include", "/feedback");

    cy.get('label[for="dislike"]').click();
    cy.get('input[type="text"]').type("Integration Test Feedback User");
    cy.get('input[type="email"]').type("feedback-integration@example.com");
    cy.get("textarea").type("This is an integration test feedback message.");

    cy.get('button[type="submit"]').click();

    cy.get(".thank-you-message").should("be.visible");
    cy.get(".thank-you-message h2").should(
      "contain",
      "Thanks! We truly appreciate your feedback and will take it into consideration.",
    );

    cy.get(".nav-link").contains("Home").click();
    cy.url().should("include", "/home");

    cy.get(".topbar-container").should("have.class", "topbar-light");
    cy.get(".neon-switch").should("have.class", "checked");
  });

  it("should handle error scenarios gracefully", () => {
    // no file upload
    cy.visit("/clean");

    cy.get("button").contains("Finish").click();

    cy.get(".error-message").should("be.visible");
    cy.get(".error-message").should(
      "contain",
      "Please select at least one file to upload",
    );

    cy.visit("/support");

    cy.get('button[type="submit"]').click();

    cy.get('input[type="text"]:invalid').should("exist");
    cy.get('input[type="email"]:invalid').should("exist");
    cy.get("textarea:invalid").should("exist");

    cy.get('input[type="text"]').type("Test User");
    cy.get('input[type="email"]').type("invalid-email");
    cy.get("textarea").type("Test message");

    cy.get('button[type="submit"]').click();
    cy.get('input[type="email"]:invalid').should("exist");
  });

  it("should maintain state across theme changes", () => {
    cy.visit("/clean");

    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });

    cy.get(".keywords-input").type("test keywords");

    cy.get(".neon-switch").click();

    cy.get(".file-item").should("contain", "test-data.csv");
    cy.get(".keywords-input").should("have.value", "test keywords");

    cy.get(".clean-card").should("have.class", "light");
    cy.get(".keywords-input").should("have.class", "light");

    cy.get(".neon-switch").click();

    cy.get(".file-item").should("contain", "test-data.csv");
    cy.get(".keywords-input").should("have.value", "test keywords");

    cy.get(".clean-card").should("not.have.class", "light");
  });

  it("should handle file operations in sequence", () => {
    cy.visit("/clean");

    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });

    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });

    cy.get(".file-item").should("have.length", 2);
    cy.get(".file-list").should("contain", "test-data.csv");

    cy.get(".file-item").first().find(".preview-btn").click();
    cy.get(".preview-modal-content th").should("contain", "name");
    cy.get(".close-btn").click();

    cy.get(".file-item").first().find(".delete-btn").click();
    cy.get(".file-item").should("have.length", 1);
    cy.get(".file-list").should("contain", "test-data.csv");

    cy.get(".preview-btn").click();
    cy.get(".preview-modal-content th").should("contain", "name");
    cy.get(".close-btn").click();

    cy.get(".keywords-input").type("name, email, company, role");

    cy.get("button").contains("Finish").should("not.be.disabled");
  });

  it("should display all animations and visual effects", () => {
    cy.visit("/home");

    cy.get(".fade-inh").should("be.visible");

    cy.get(".relative").should("be.visible");

    cy.get("button").contains("Start Clean").click();

    cy.get(".fade-in").should("be.visible");
    cy.get(".clean-card").should("have.css", "position", "relative");

    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });

    cy.get(".progress-bar").should("be.visible");
    cy.get(".progress-percent").should("be.visible");

    cy.get(".nav-link").contains("Support").click();

    cy.get(".fade-in").should("be.visible");
    cy.get(".form-card").should("have.css", "position", "relative");

    cy.get(".nav-link").contains("Feedback").click();

    cy.get(".fade-in").should("be.visible");
    cy.get(".form-card").should("have.css", "position", "relative");
  });
});
