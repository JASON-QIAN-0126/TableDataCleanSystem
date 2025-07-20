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
    // cy.get(".keywords-input").type("pet");
    cy.contains("button", "Finish").click();

    waitForTableOrFail();

  // invalid email check
    cy.contains("label", "Hide invalid email").find('input[type="checkbox"]').check({ force: true });
    cy.wait(500);

    cy.get("tbody tr").each(($row) => {
    cy.wrap($row)
      .should("not.contain", "Format Error")
      .and("not.contain", "invalid");
    });

    cy.contains("label", "Hide invalid email")
    .find('input[type="checkbox"]')
    .uncheck({ force: true });

    cy.get("tbody tr").then(($rows) => {
      const found = [...$rows].some((row) => {
        const text = row.innerText;
        return text.includes("Format Error") || text.includes("invalid");
      });
      expect(found).to.be.true;
    });

    cy.get(".search-input").type("John");
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("contain", "John Doe");
    // cy.get(".search-input").type("pet");
    // cy.contains("button", "Search").click();
    // cy.get("tbody tr").should("contain", "pet");
    cy.get(".search-input").clear();
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("have.length.at.least", 2);

    cy.contains(".download-button-1", "Download").click();
    cy.get(".clean-page3-title").should("contain", "Data Cleaning Report");
    cy.get(".summary-section").should("exist");
    cy.get(".download-section").should("exist");
  });

  it("handles the workflow in light mode", () => {
    cy.get(".neon-switch").click();
    cy.get('input[type="file"]').selectFile("cypress/fixtures/test-data.csv", {
      force: true,
    });
    cy.get(".file-item").should("contain", "test-data.csv");
    cy.contains("button", "Finish").click();

    waitForTableOrFail();
    
    cy.contains("label", "Hide invalid email").find('input[type="checkbox"]').check({ force: true });
    cy.wait(500);

    cy.get("tbody tr").each(($row) => {
    cy.wrap($row)
      .should("not.contain", "Format Error")
      .and("not.contain", "invalid");
    });

    cy.contains("label", "Hide invalid email")
    .find('input[type="checkbox"]')
    .uncheck({ force: true });

    cy.wait(500);
    cy.get("tbody tr").then(($rows) => {
      const found = [...$rows].some((row) => {
        const text = row.innerText;
        return text.includes("Format Error") || text.includes("invalid");
      });
      expect(found).to.be.true;
    });

    cy.get(".search-input").should("have.class", "light").type("John");
    cy.contains("button", "Search").click();
    cy.get("tbody tr").should("contain", "John Doe");

    cy.contains(".download-button-1", "Download").click();
    cy.get(".clean-page3-title").should("have.class", "light");
    cy.get(".clean-page3-title").should("contain", "Data Cleaning Report");
    cy.get(".summary-section").should("exist");
    cy.get(".download-section").should("exist");
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

    cy.contains(".download-button-1", "Download").click();
    cy.get(".clean-page3-title").should("be.visible");
    cy.get(".clean-page3-title").should("contain", "Data Cleaning Report");
    cy.get(".summary-section").should("exist");
    cy.get(".download-section").should("exist");
  });
});
