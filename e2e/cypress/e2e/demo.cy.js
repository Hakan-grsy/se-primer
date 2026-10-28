/// <reference types="cypress" />

// 60 saniyelik demo videosu için yavaşlatılmış tek oynanış:
// giriş → kriz → 3 karar (tutor sorusu dahil) → iyi son.
// Video: cypress/videos/demo.cy.js.mp4
const bekle = (ms) => cy.wait(ms);

describe('Demo (60 sn video)', () => {
  it('Yeni başlayan bir oyuncu iyi sona ulaşır', () => {
    cy.intercept('POST', '/api/tutor', {
      statusCode: 200,
      delay: 800,
      body: { reply: 'Sorun tam olarak ne zaman başladı? O saatte sistemde ne değişmişti?', model: 'stub' },
    });

    cy.visit('/');
    bekle(3000);
    cy.get('[data-testid="level-yeni-basladim"]').scrollIntoView().click();
    bekle(1500);
    cy.get('[data-testid="role-backend-gelistirici"]').scrollIntoView().click();
    bekle(1500);
    cy.get('[data-testid="goal-veri-guvenligi-ve-kvkk"]').scrollIntoView().click();
    bekle(1500);
    cy.get('[data-testid="start-button"]').scrollIntoView().click();
    bekle(4000);
    cy.get('[data-testid="kriz-start-button"]').scrollIntoView().click();
    bekle(3000);

    // Karar 1 + tutor
    cy.get('[data-testid="hint-card"]').scrollIntoView();
    bekle(2500);
    cy.contains("Tutor'a sor").scrollIntoView().click();
    cy.get('[data-testid="tutor-input"]').type('Cevap hangisi, A mı?', { delay: 60 });
    cy.get('[data-testid="tutor-send"]').click();
    cy.get('[data-testid="tutor-message"]').last().should('contain.text', 'ne zaman başladı');
    bekle(3500);
    cy.get('[data-testid="option-a"]').scrollIntoView().click();
    bekle(4000);
    cy.get('[data-testid="continue-button"]').scrollIntoView().click();
    bekle(2000);

    // Karar 2
    cy.get('[data-testid="decision-title"]').scrollIntoView();
    bekle(2500);
    cy.get('[data-testid="option-a"]').scrollIntoView().click();
    bekle(4000);
    cy.get('[data-testid="continue-button"]').scrollIntoView().click();
    bekle(2000);

    // Karar 3
    cy.get('[data-testid="decision-title"]').scrollIntoView();
    bekle(2500);
    cy.get('[data-testid="option-a"]').scrollIntoView().click();
    bekle(4000);
    cy.get('[data-testid="continue-button"]').scrollIntoView().click();

    // İyi son
    cy.get('[data-testid="ending-good"]').should('be.visible');
    bekle(3000);
    cy.scrollTo('bottom', { duration: 3000 });
    bekle(2000);
  });
});
