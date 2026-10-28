/// <reference types="cypress" />

/**
 * Giriş ekranındaki 3 soruyu cevaplar ve ilk karara kadar ilerler.
 * level: yeni-basladim | biraz-deneyimim-var | deneyimliyim
 * role:  backend-gelistirici | test-qa-muhendisi | takim-lideri
 * goal:  hata-ayiklama | test-ve-kalite | veri-guvenligi-ve-kvkk
 */
Cypress.Commands.add(
  'startGame',
  (level = 'biraz-deneyimim-var', role = 'backend-gelistirici', goal = 'test-ve-kalite') => {
    cy.visit('/');
    cy.get('[data-testid="start-button"]').should('be.disabled');
    cy.get(`[data-testid="level-${level}"]`).click();
    cy.get(`[data-testid="role-${role}"]`).click();
    cy.get(`[data-testid="goal-${goal}"]`).click();
    cy.get('[data-testid="start-button"]').should('not.be.disabled').click();
    cy.get('[data-testid="kriz-start-button"]').click();
    cy.get('[data-testid="decision-title"]').should('be.visible');
  },
);

/** Bir kararda A veya B'yi seçer, sonuç panelini kontrol eder ve devam eder. */
Cypress.Commands.add('choose', (option) => {
  cy.get(`[data-testid="option-${option.toLowerCase()}"]`).click();
  cy.get('[data-testid="result-panel"]').should('be.visible');
  cy.get('[data-testid="result-what"]').should('not.be.empty');
  cy.get('[data-testid="result-why"]').should('not.be.empty');
  cy.get('[data-testid="continue-button"]').click();
});
