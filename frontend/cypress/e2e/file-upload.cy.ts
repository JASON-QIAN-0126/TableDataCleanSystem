/// <reference types="cypress" />

describe("File Upload and Data Cleaning", () => {
  const csvPath = "cypress/fixtures/test-data.csv";

  beforeEach(() => cy.visit("/home"));

  describe("Navigation to Clean Page", () => {
    it("via Start Clean button", () => {
      cy.contains("button", "Start Clean").click();
      cy.url().should("include", "/clean");
      cy.get(".clean-card").should("be.visible");
    });

    it("via navigation bar", () => {
      cy.contains(".nav-link", "Clean").click();
      cy.url().should("include", "/clean");
      cy.get(".clean-card").should("be.visible");
    });
  });

  describe("File Upload Interface", () => {
    beforeEach(() => cy.visit("/clean"));

    it("renders upload elements", () => {
      cy.get(".clean-card").should("be.visible");
      cy.get(".select-file-btn").should("be.visible");
      cy.get(".supported-files").should(
        "contain",
        "xlsv,csv,tsv file supported",
      );
      cy.get(
        ".progress-bar-container, .file-list-container, .keywords-input",
      ).should("be.visible");
      cy.contains("button", "Finish").should("be.visible");
    });
  });

  describe("File Upload Functionality", () => {
    beforeEach(() => cy.visit("/clean"));

    it("single upload", () => {
      cy.get('input[type="file"]').selectFile(csvPath, { force: true });
      cy.get(".file-item").should("contain", "test-data.csv");
    });

    it("multiple upload", () => {
      cy.get('input[type="file"]').selectFile([csvPath, csvPath], {
        force: true,
      });
      cy.get(".file-item").should("have.length", 2);
    });
  });

  describe("File Management Operations", () => {
    beforeEach(() => {
      cy.visit("/clean");
      cy.get('input[type="file"]').selectFile(csvPath, { force: true });
    });

    it("delete file", () => {
      cy.get(".file-item").first().trigger("mouseover");
      cy.get(".delete-btn").click();
      cy.get(".file-item").should("not.exist");
    });

    it("preview file", () => {
      cy.get(".file-item").first().trigger("mouseover");
      cy.get(".preview-btn").click();
      cy.get(".preview-modal").should("be.visible");
      cy.get(".close-btn").click();
    });
  });

  describe("Keywords Input and Form Submission", () => {
    beforeEach(() => {
      cy.visit("/clean");
      cy.get('input[type="file"]').selectFile(csvPath, { force: true });
    });

    it("enter keyword and description, then add", () => {
      cy.get(".keyword-input").type("industry");
      cy.get(".description-input").type("users industry");
  
      cy.get(".add-keyword-btn").click();
  
      cy.get(".keyword-cell").should("contain.text", "industry");
      cy.get(".description-cell").should("contain.text", "users industry");
    });
  });

  describe("Light Mode Functionality", () => {
    beforeEach(() => {
      cy.visit("/clean");
      cy.get(".neon-switch").click();
    });

    it("upload & manage in light mode", () => {
      cy.get('input[type="file"]').selectFile(csvPath, { force: true });
      cy.get(".file-item").first().trigger("mouseover");
      cy.get(".preview-btn").click();
      cy.get(".preview-modal").should("have.class", "light");
      cy.get(".close-btn").click();
    });
  });

  describe("Animation and Visual Effects", () => {
    beforeEach(() => cy.visit("/clean"));

    it("progress bar animates", () => {
      cy.get('input[type="file"]').selectFile(csvPath, { force: true });
      cy.get(".progress-bar").should("be.visible");
      cy.wait(2000);
      cy.get(".progress-percent").should("contain", "100%");
    });
  });
});
