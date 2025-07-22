/// <reference types="cypress" />

// max waiting for 2 min
function waitForTableOrFail(timeout = 120000) {
  const start = Date.now();

  function check() {
    const elapsed = Date.now() - start;
    if (elapsed > timeout) {
      throw new Error(
        "❌ Timeout: .table-container not found within 2 minutes",
      );
    }
    return cy.document().then((doc) => {
      if (doc.querySelector(".table-container")) {
        return cy.get(".table-container").should("be.visible");
      }

      cy.wait(doc.querySelector(".loader__balls") ? 1000 : 500);
      return check();
    });
  }
  return check();
}

describe("User Authentication and Profile Tests", () => {
  const randomUserId = () => {
    const letters = Math.random().toString(36).substring(2, 6);
    const numbers = Math.floor(Math.random() * 10000);
    return `${letters}${numbers}`;
  };
  
  const id = randomUserId();
  
  const testUser = {
    username: id,
    email: `${id}@example.com`,
    password: "abc123"
  };

  beforeEach(() => {
    cy.visit("/");
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
    const randomUserId = () => {
      const letters = Math.random().toString(36).substring(2, 6);
      const numbers = Math.floor(Math.random() * 10000);
      return `${letters}${numbers}`;
    };
    
    const id = randomUserId();
    
    const testUser = {
      username: id,
      email: `${id}@example.com`,
      password: "abc123"
    };

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
    it("should display user profile information", () => {
      cy.get(".signin-button").click();
      cy.get(".signin-modal").should("be.visible");

      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();
      cy.url().should("include", "/profile");

      cy.get(".profile-title").should("contain", "User Profile");
      cy.get(".section-title").should("contain", "Basic Information");
      cy.get(".info-value").should("contain", testUser.email);
      cy.get(".info-value").should("contain", testUser.username);
    });
  });

  describe("Theme Switching in Profile", () => {
    const randomUserId = () => {
      const letters = Math.random().toString(36).substring(2, 6);
      const numbers = Math.floor(Math.random() * 10000);
      return `${letters}${numbers}`;
    };
    
    const id = randomUserId();
    
    const testUser = {
      username: id,
      email: `${id}@example.com`,
      password: "abc123"
    };

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
      cy.get(".signin-button").click();
      cy.get(".signin-modal").should("be.visible");
      cy.get('input[type="email"]').type(testUser.email);
      cy.get('input[type="password"]').type(testUser.password);
      cy.get('button[type="submit"]').click();

      cy.get("button").contains("Start Clean").click();
      cy.url().should("include", "/clean");

      cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
        force: true,
      });
      cy.get(".file-item").should("contain", "test-data.csv");
      cy.contains("button", "Finish").click();

      waitForTableOrFail();
      cy.get(".search-input").clear();
      cy.get(".user-avatar").click();
      cy.get(".profile-button").click();

      cy.get(".history-list").should("be.visible");
      cy.get(".history-item").should("exist");
      cy.get(".file-name").should("contain", "Demo Data File");
      cy.get(".status-badge").should("contain", "Completed");
    });
  });
}); 