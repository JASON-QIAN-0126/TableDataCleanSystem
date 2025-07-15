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

describe("Complete Clean Workflow", () => {
  beforeEach(() => cy.visit("/clean"));

  it("completes the full data cleaning workflow", () => {
    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });
    cy.get(".file-item").should("contain", "test-data.csv");
    cy.get(".keywords-input").type("email, name, company");
    cy.contains("button", "Finish").click();

    waitForTableOrFail();

    cy.get(".search-input").type("John");
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("contain", "John Doe");
    cy.get(".search-input").clear();
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("have.length.at.least", 2);

    cy.contains(".download-button", "Download").click();
    cy.get(".clean-page3-title").should("contain", "System Report");
  });

  it("handles the workflow in light mode", () => {
    cy.get(".neon-switch").click();
    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });
    cy.get(".file-item").should("contain", "test-data.csv");
    cy.get(".keywords-input").type("email, name, company");
    cy.contains("button", "Finish").click();

    waitForTableOrFail();

    cy.get(".search-input").should("have.class", "light").type("John");
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("contain", "John Doe");

    cy.contains(".download-button", "Download").click();
    cy.get(".clean-page3-title").should("have.class", "light");
  });

  it("handles workflow with multiple file uploads", () => {
    cy.get('input[type="file"]').selectFile(
      ["cypress/fixtures/test-data.csv", "cypress/fixtures/test-data.csv"],
      { force: true },
    );
    cy.get(".file-item").should("have.length", 2);
    cy.get(".keywords-input").type("email, name, company, role");
    cy.contains("button", "Finish").click();

    waitForTableOrFail(120000);

    cy.get(".search-input").type("John");
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("contain", "John Doe");

    cy.contains(".download-button", "Download").click();
    cy.get(".clean-page3-title").should("be.visible");
  });

  it("handles workflow error scenarios", () => {
    cy.contains("button", "Finish").click();
    cy.get(".error-message").should(
      "contain",
      "Please select at least one file",
    );

    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });
    cy.contains("button", "Finish").click();

    waitForTableOrFail();

    cy.get(".search-input").clear();
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("have.length.at.least", 1);

    cy.contains(".download-button", "Download").click();
    cy.get(".clean-page3-title").should("be.visible");
  });
});
