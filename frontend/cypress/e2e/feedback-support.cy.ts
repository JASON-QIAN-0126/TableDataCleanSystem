/// <reference types="cypress" />

describe("Feedback and Support Forms", () => {
  describe("Support Form", () => {
    beforeEach(() => {
      cy.visit("/support");
    });

    it("should display the support form", () => {
      cy.get("h2").should("contain", "Need Help With Cleaning?");
      cy.get("form").should("be.visible");
      cy.get('input[type="text"]').should("be.visible");
      cy.get('input[type="email"]').should("be.visible");
      cy.get("textarea").should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
      cy.get('label[for="name"]').should("contain", "Name:");
      cy.get('label[for="email"]').should("contain", "Email:");
      cy.get('label[for="content"]').should("contain", "Content:");
    });

    it("should show form validation for required fields", () => {
      cy.get('button[type="submit"]').click();
      cy.get('input[type="text"]:invalid').should("exist");
      cy.get('input[type="email"]:invalid').should("exist");
      cy.get("textarea:invalid").should("exist");
    });

    it("should validate email format", () => {
      cy.get('input[type="text"]').type("Test User");
      cy.get('input[type="email"]').type("invalid-email");
      cy.get("textarea").type("This is a test message");
      cy.get('button[type="submit"]').click();
      cy.get('input[type="email"]:invalid').should("exist");
    });

    it("should successfully submit support form and show thank you message", () => {
      cy.get('input[type="text"]').type("John Doe");
      cy.get('input[type="email"]').type("john.doe@example.com");
      cy.get("textarea").type(
        "I need help with cleaning my data files. The upload feature seems to be having issues.",
      );
      cy.get('button[type="submit"]').click();
      cy.get(".thank-you-message").should("be.visible");
      cy.get(".thank-you-message h2").should(
        "contain",
        "Thank you for your message. Our team will get back to you shortly.",
      );
      cy.get("form").should("not.exist");
    });

    it("should display form correctly in light mode", () => {
      cy.get(".neon-switch").click();
      cy.get(".form-card").should("have.class", "light");
      cy.get(".form-group").should("have.class", "light");
      cy.get(".submit-btn-fly").should("have.class", "light");
      cy.get('input[type="text"]').type("Test User");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get("textarea").type("Test message in light mode");
      cy.get('button[type="submit"]').click();
      cy.get(".thank-you-message").should("have.class", "light");
    });

    it("should show submit button hover effect", () => {
      cy.get('button[type="submit"]').trigger("mouseover");
      cy.get('button[type="submit"]').should("contain", "Submit");
    });

    it("should display ShineBorder animation", () => {
      cy.get(".form-card").should("be.visible");
      cy.get(".form-card").should("have.css", "position", "relative");
    });
  });

  describe("Feedback Form", () => {
    beforeEach(() => {
      cy.visit("/feedback");
    });

    it("should display the feedback form", () => {
      cy.get("h2").should("contain", "Got Thoughts? We're Listening!");
      cy.get("form").should("be.visible");
      cy.get('input[type="text"]').should("be.visible");
      cy.get('input[type="email"]').should("be.visible");
      cy.get("textarea").should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
      cy.get('label[for="like"]').should("contain", "👍");
      cy.get('label[for="dislike"]').should("contain", "👎");
    });

    it("should have like option selected by default", () => {
      cy.get('input[type="radio"][value="like"]').should("be.checked");
      cy.get('input[type="radio"][value="dislike"]').should("not.be.checked");
    });

    it("should allow switching between like and dislike options", () => {
      cy.get('label[for="dislike"]').click();
      cy.get('input[type="radio"][value="dislike"]').should("be.checked");
      cy.get('input[type="radio"][value="like"]').should("not.be.checked");
      cy.get('label[for="like"]').click();
      cy.get('input[type="radio"][value="like"]').should("be.checked");
      cy.get('input[type="radio"][value="dislike"]').should("not.be.checked");
    });

    it("should successfully submit feedback form and show thank you message", () => {
      cy.get('label[for="dislike"]').click();
      cy.get('input[type="text"]').type("Jane Smith");
      cy.get('input[type="email"]').type("jane.smith@example.com");
      cy.get("textarea").type(
        "The interface could be more intuitive. Some buttons are not clearly labeled.",
      );
      cy.get('button[type="submit"]').click();
      cy.get(".thank-you-message").should("be.visible");
      cy.get(".thank-you-message h2").should(
        "contain",
        "Thanks! We truly appreciate your feedback and will take it into consideration.",
      );
      cy.get("form").should("not.exist");
    });

    it("should display form correctly in light mode", () => {
      cy.get(".neon-switch").click();
      cy.get(".form-card").should("have.class", "light");
      cy.get(".form-group").should("have.class", "light");
      cy.get(".feel-group").should("have.class", "light");
      cy.get(".submit-btn-fly").should("have.class", "light");
      cy.get(".feel-label").should("have.class", "light");
      cy.get('label[for="dislike"]').click();
      cy.get('input[type="text"]').type("Test User");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get("textarea").type("Test feedback in light mode");
      cy.get('button[type="submit"]').click();
      cy.get(".thank-you-message").should("have.class", "light");
    });

    it("should show validation errors for empty required fields", () => {
      cy.get('button[type="submit"]').click();
      cy.get('input[type="text"]:invalid').should("exist");
      cy.get('input[type="email"]:invalid').should("exist");
      cy.get("textarea:invalid").should("exist");
    });

    it("should handle form submission with positive feedback", () => {
      cy.get('input[type="radio"][value="like"]').should("be.checked");
      cy.get('input[type="text"]').type("Alice Johnson");
      cy.get('input[type="email"]').type("alice.johnson@example.com");
      cy.get("textarea").type(
        "Great application! The data cleaning feature works perfectly and saves me a lot of time.",
      );
      cy.get('button[type="submit"]').click();
      cy.get(".thank-you-message").should("be.visible");
      cy.get(".thank-you-message h2").should(
        "contain",
        "Thanks! We truly appreciate your feedback and will take it into consideration.",
      );
    });

    it("should display feel options correctly", () => {
      cy.get(".feel-group").should("be.visible");
      cy.get(".feel-options").should("be.visible");
      cy.get('label[for="like"]').should("be.visible");
      cy.get('label[for="dislike"]').should("be.visible");
      cy.get('label[for="like"]').click();
      cy.get('input[type="radio"][value="like"]').should("be.checked");
      cy.get('label[for="dislike"]').click();
      cy.get('input[type="radio"][value="dislike"]').should("be.checked");
    });
  });

  describe("Form Animations and Interactions", () => {
    it("should display fade-in animation on page load", () => {
      cy.visit("/support");
      cy.get(".fade-in").should("be.visible");
    });

    it("should display ShineBorder components on both forms", () => {
      cy.visit("/support");
      cy.get(".form-card").should("be.visible");
      cy.visit("/feedback");
      cy.get(".form-card").should("be.visible");
    });

    it("should maintain form state when switching themes", () => {
      cy.visit("/feedback");
      cy.get('input[type="text"]').type("Test User");
      cy.get('input[type="email"]').type("test@example.com");
      cy.get("textarea").type("Test message");
      cy.get('label[for="dislike"]').click();
      cy.get(".neon-switch").click();
      cy.get('input[type="text"]').should("have.value", "Test User");
      cy.get('input[type="email"]').should("have.value", "test@example.com");
      cy.get("textarea").should("have.value", "Test message");
      cy.get('input[type="radio"][value="dislike"]').should("be.checked");
    });
  });
});
