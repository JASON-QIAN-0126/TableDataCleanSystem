/// <reference types="cypress" />

describe("User Authentication and Profile Tests", () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: "testpass123"
  };

  beforeEach(() => {
    cy.visit("/");
    // clear local storage
    cy.clearLocalStorage();
  });

  describe("User Registration", () => {
    it("should allow user to register with valid credentials", () => {
      cy.visit("/home");
      
      cy.get(".signup-button").click();
      cy.get(".signup-modal").should("be.visible");

      cy.get('input[type="text"]').type(testUser.username);
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').first().type(testUser.password);
      cy.get('input[type="password"]').last().type(testUser.password);

      cy.get('button[type="submit"]').click();
      cy.get(".username").should("contain", testUser.username);
      cy.get(".user-avatar").should("be.visible");
    });

    it("should show validation errors for invalid registration", () => {
      cy.visit("/home");
      
      cy.get(".signup-button").click();
      cy.get(".signup-modal").should("be.visible");

      cy.get('input[type="text"]').type("ab");
      cy.get('input[type="email"]').type("invalid-email");
      cy.get('input[type="password"]').first().type("123");
      cy.get('input[type="password"]').last().type("456");

      cy.get('button[type="submit"]').click();

      cy.get(".error-message").should("be.visible");
    });
  });

  describe("User Login", () => {
    it("should allow user to login with valid credentials", () => {
      cy.visit("/home");
      cy.get(".signup-button").click();
      cy.get('input[type="text"]').type(testUser.username);
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').first().type(testUser.password);
      cy.get('input[type="password"]').last().type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.get(".user-avatar").click();
      cy.get(".logout-button").click();

      cy.get(".signin-button").click();
      cy.get(".signin-modal").should("be.visible");

      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.get(".username").should("contain", testUser.username);
      cy.get(".user-avatar").should("be.visible");
    });

    it("should show error for invalid login credentials", () => {
      cy.visit("/home");
      
      cy.get(".signin-button").click();
      cy.get(".signin-modal").should("be.visible");

      cy.get('input[type="email"]').type("nonexistent@example.com");
      cy.get('input[type="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();

      cy.get(".error-message").should("be.visible");
      cy.get(".error-text").should("contain", "Invalid credentials");
    });
  });

  describe("User Logout", () => {
    it("should logout user and redirect from profile page", () => {
      cy.visit("/home");
      cy.get(".signup-button").click();
      cy.get('input[type="text"]').type(testUser.username);
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').first().type(testUser.password);
      cy.get('input[type="password"]').last().type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();
      cy.url().should("include", "/profile");

      cy.get(".user-avatar").click();
      cy.get(".logout-button").click();

      cy.url().should("include", "/home");
      cy.get(".signin-button").should("be.visible");
      cy.get(".signup-button").should("be.visible");
    });
  });

  describe("Profile Page", () => {
    beforeEach(() => {
      cy.visit("/home");
      cy.get(".signup-button").click();
      cy.get('input[type="text"]').type(testUser.username);
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').first().type(testUser.password);
      cy.get('input[type="password"]').last().type(testUser.password);
      cy.get('button[type="submit"]').click();
    });

    it("should display user profile information", () => {
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();
      cy.url().should("include", "/profile");

      cy.get(".profile-title").should("contain", "User Profile");
      cy.get(".section-title").should("contain", "Basic Information");
      cy.get(".info-value").should("contain", testUser.email);
      cy.get(".info-value").should("contain", testUser.username);
    });

    it("should show clean history section", () => {
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();

      cy.get(".section-title").should("contain", "Clean History");
      cy.get(".no-history").should("contain", "No clean history");
    });

    it("should allow username editing", () => {
      const newUsername = `updated_${testUser.username}`;
      
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();

      cy.get(".edit-btn").click();

      cy.get(".username-input").clear().type(newUsername);
      cy.get(".save-btn").click();

      cy.get(".success-message").should("be.visible");
      cy.get(".success-text").should("contain", "Username updated successfully");
      cy.get(".info-value").should("contain", newUsername);

      cy.get(".username").should("contain", newUsername);
    });

    it("should cancel username editing", () => {
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();

      cy.get(".edit-btn").click();

      cy.get(".username-input").clear().type("cancelled_username");
      cy.get(".cancel-btn").click();

      cy.get(".info-value").should("contain", testUser.username);
    });

    it("should show error for invalid username", () => {
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();

      cy.get(".edit-btn").click();

      cy.get(".username-input").clear().type("ab");
      cy.get(".save-btn").click();

      cy.get(".error-message").should("be.visible");
    });
  });

  describe("Theme Switching in Profile", () => {
    it("should work correctly in both light and dark themes", () => {
      cy.visit("/home");
      cy.get(".signup-button").click();
      cy.get('input[type="text"]').type(testUser.username);
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').first().type(testUser.password);
      cy.get('input[type="password"]').last().type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.get(".neon-switch").click();
      cy.get(".topbar-container").should("have.class", "topbar-light");

      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();

      cy.get(".profile-card").should("have.class", "light");
      cy.get(".profile-title").should("have.class", "light");

      cy.get(".neon-switch").click();

      cy.get(".profile-card").should("not.have.class", "light");
    });
  });

  describe("Clean History Functionality", () => {
    it("should save and display clean history after completing a clean task", () => {
      cy.visit("/home");
      cy.get(".signup-button").click();
      cy.get('input[type="text"]').type(testUser.username);
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').first().type(testUser.password);
      cy.get('input[type="password"]').last().type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.get("button").contains("Start Clean").click();
      cy.url().should("include", "/clean");

      cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
        force: true,
      });
      cy.get(".file-item").should("contain", "test-data.csv");
      cy.wait(2000);
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();

      cy.get(".history-list").should("be.visible");
      cy.get(".history-item").should("exist");
      cy.get(".file-name").should("contain", "Demo Data File");
      cy.get(".status-badge").should("contain", "Completed");
    });
  });
}); 