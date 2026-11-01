/// <reference types="cypress" />

// v2 modeli devreye girdiğinde yeni davranış (K6, K7) ve eski davranışın korunması.
// Geçen haftanın testleri (tum-yollar, kabul-ornekleri) ayrıca aynen koşar.

// Selin de tutor gibi cevabı söylememeli (spec.md §5, §9.4 K6)
// Seçenek harfleri büyük harfe duyarlı aranır; "ça" gibi hecelerdeki tek "a" yakalanmasın.
const YASAK_HARF = /(^|[\s"'(])[AB]([\s"').,:;!?]|$)/;
const YASAK_IFADE = /doğru cevap|seçmelisin|en iyisi/i;

describe('v2 risk modeli: Selin kartı (K6, K7)', () => {
  ['yeni-basladim', 'biraz-deneyimim-var', 'deneyimliyim'].forEach((seviye) => {
    it(`${seviye}: kart yalnızca Karar 2'de çıkar ve cevabı söylemez`, () => {
      cy.startGame(seviye);

      // Karar 1: risk düşük → kart yok (K7)
      cy.get('[data-cy="p"]').should('exist');
      cy.get('[data-testid="selin-card"]').should('not.exist');
      cy.choose('A');

      // Karar 2: risk yüksek → kart var (K6)
      cy.contains('Karar 2').should('exist');
      cy.get('[data-cy="p"]').invoke('text').then(parseFloat).should('be.gte', 0.5);
      cy.get('[data-testid="selin-card"]').should('be.visible');
      cy.get('[data-testid="selin-text"]')
        .invoke('text')
        .should('not.match', YASAK_HARF)
        .and('not.match', YASAK_IFADE);
      cy.choose('A');

      // Karar 3: risk düşük → kart yok (K7)
      cy.contains('Karar 3').should('exist');
      cy.get('[data-cy="p"]').invoke('text').then(parseFloat).should('be.lt', 0.5);
      cy.get('[data-testid="selin-card"]').should('not.exist');
      cy.choose('A');

      cy.get('[data-testid="ending-good"]').should('be.visible');
    });
  });
});

describe('v2 risk modeli: hata durumları', () => {
  it('model yüklenemezse oyun çökmez, v1 gibi sonuna kadar oynanır', () => {
    cy.intercept('GET', '/model/config.json', { statusCode: 404, body: 'yok' }).as('config');
    cy.startGame('yeni-basladim');
    cy.wait('@config');
    ['A', 'A', 'A'].forEach((secim, i) => {
      cy.contains(`Karar ${i + 1}`).should('exist');
      cy.get('[data-cy="p"]').should('not.exist');
      cy.get('[data-testid="selin-card"]').should('not.exist');
      cy.choose(secim);
    });
    cy.get('[data-testid="ending-good"]').should('be.visible');
  });

  it('veri toplama modu kapalıyken hiçbir oturum verisi gönderilmez (KVKK)', () => {
    cy.intercept('/api/oturum*').as('oturum');
    cy.startGame();
    ['A', 'B', 'A'].forEach((secim) => cy.choose(secim));
    cy.get('[data-testid="ending-good"]').should('be.visible');
    cy.get('[data-testid="veri-modu"]').should('not.exist');
    cy.get('@oturum.all').should('have.length', 0);
  });
});
