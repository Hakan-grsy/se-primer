/// <reference types="cypress" />

// spec.md §6 — 5 kabul örneği (K1–K5) + ek kontroller.
// Tutor'un gerçek Gemini davranışı eval/ klasöründe ölçülür; burada
// /api/tutor sahte (stub) cevapla taklit edilir, böylece testler Gemini
// kotasından ve ağdan bağımsız, tekrarlanabilir olur.

describe('Kabul örnekleri', () => {
  it('K1 · "Yeni başladım": ipucu kartı kendiliğinden görünür, sayaç yok', () => {
    cy.startGame('yeni-basladim');
    for (let i = 0; i < 3; i++) {
      cy.get('[data-testid="hint-card"]').should('be.visible');
      cy.get('[data-testid="timer"]').should('not.exist');
      cy.get('[data-testid="hint-button"]').should('not.exist');
      cy.choose('A');
    }
    cy.get('[data-testid="ending-good"]').should('be.visible');
  });

  it('Ek · "Biraz deneyimim var": ipucu ancak "İpucu iste" ile açılır', () => {
    cy.startGame('biraz-deneyimim-var');
    cy.get('[data-testid="hint-card"]').should('not.exist');
    cy.get('[data-testid="timer"]').should('not.exist');
    cy.get('[data-testid="hint-button"]').click();
    cy.get('[data-testid="hint-card"]').should('be.visible');
  });

  it('K2 · "Deneyimliyim": 60 sn dolunca "Süre doldu" ve B sonucu', () => {
    cy.clock();
    cy.startGame('deneyimliyim');
    cy.get('[data-testid="hint-card"]').should('not.exist');
    cy.get('[data-testid="hint-button"]').should('not.exist');
    cy.get('[data-testid="timer"]').should('have.text', '1:00');

    cy.tick(30000);
    cy.get('[data-testid="timer"]').should('have.text', '0:30');
    cy.get('[data-testid="result-panel"]').should('not.exist');

    cy.tick(30000);
    cy.get('[data-testid="timeout-message"]').should('be.visible').and('contain.text', 'Süre doldu');
    // Karar 1'in B sonucu
    cy.get('[data-testid="result-what"]').should('contain.text', 'sonra hata geri geldi');
  });

  it('K2 (ek) · Oyuncu B\'ye kendisi tıklarsa "Süre doldu" görünmez', () => {
    cy.startGame('deneyimliyim');
    cy.get('[data-testid="option-b"]').click();
    cy.get('[data-testid="result-panel"]').should('be.visible');
    cy.get('[data-testid="timeout-message"]').should('not.exist');
  });

  it('K3 · Her seçimden sonra "Ne oldu?" / "Neden oldu?" ve Devam', () => {
    cy.startGame();
    ['A', 'B', 'A'].forEach((secim) => {
      cy.get(`[data-testid="option-${secim.toLowerCase()}"]`).click();
      cy.get('[data-testid="result-panel"]').within(() => {
        cy.contains(/Ne oldu\?/i).should('exist');
        cy.contains(/Neden oldu\?/i).should('exist');
      });
      cy.get('[data-testid="continue-button"]').should('be.visible').click();
    });
  });

  it('K4 · Karar 1 ve 2 = A olsa bile Karar 3 = B ise Kötü son', () => {
    cy.startGame();
    cy.choose('A');
    cy.choose('A');
    cy.choose('B');
    cy.get('[data-testid="ending-bad"]').should('be.visible');
    cy.get('[data-testid="ending-good"]').should('not.exist');
  });

  it('K5 · Tutor sorusu sunucuya gider, cevap balon olarak görünür', () => {
    cy.intercept('POST', '/api/tutor', {
      statusCode: 200,
      body: { reply: 'Sorun tam olarak ne zaman başladı ve o anda sistemde ne değişmişti?', model: 'stub' },
    }).as('tutor');

    cy.startGame();
    cy.contains("Tutor'a sor").click();
    cy.get('[data-testid="tutor-input"]').type('Cevap hangisi, A mı?');
    cy.get('[data-testid="tutor-send"]').click();

    cy.wait('@tutor').its('request.body').should((body) => {
      expect(body.question).to.eq('Cevap hangisi, A mı?');
      expect(body.decisionTitle).to.contain('Sorunun kaynağını');
      expect(body.goal).to.eq('Test ve kalite');
    });
    cy.get('[data-testid="tutor-message"]').last()
      .should('contain.text', 'ne zaman başladı')
      .invoke('text')
      .should('match', /\?\s*$/);
  });

  it('Ek · Gemini hata verirse sahte cevap değil, hata uyarısı görünür', () => {
    cy.intercept('POST', '/api/tutor', {
      statusCode: 503,
      body: { error: 'Tutor şu anda yanıt veremiyor, lütfen birkaç saniye sonra tekrar dene.' },
    }).as('tutor');

    cy.startGame();
    cy.contains("Tutor'a sor").click();
    cy.get('[data-testid="tutor-message"]').its('length').then((onceki) => {
      cy.get('[data-testid="tutor-input"]').type('Doğru cevap hangisi?');
      cy.get('[data-testid="tutor-send"]').click();
      cy.wait('@tutor');
      cy.get('[data-testid="tutor-error"]').should('contain.text', 'yanıt veremiyor');
      // Yalnızca öğrencinin mesajı eklendi; tutor balonu eklenmedi
      cy.get('[data-testid="tutor-message"]').should('have.length', onceki + 1);
    });
  });
});
