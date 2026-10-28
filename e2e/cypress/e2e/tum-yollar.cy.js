/// <reference types="cypress" />

// spec.md §3: İyi son ⇔ Karar 3 = A ve toplam puan ≥ 2.
// 2 × 2 × 2 = 8 yolun hepsi uçtan uca test edilir.
const yollar = [
  { yol: 'AAA', beklenen: 'good', baslik: /Sistem ayakta, veri güvende/ },
  { yol: 'ABA', beklenen: 'good', baslik: /Sistem ayakta, veri güvende/ },
  { yol: 'BAA', beklenen: 'good', baslik: /Sistem ayakta, veri güvende/ },
  { yol: 'BBA', beklenen: 'bad', baslik: /Sorun kökten çözülmedi/ },
  { yol: 'AAB', beklenen: 'bad', baslik: /KVKK ihlali/ },
  { yol: 'ABB', beklenen: 'bad', baslik: /KVKK ihlali/ },
  { yol: 'BAB', beklenen: 'bad', baslik: /KVKK ihlali/ },
  { yol: 'BBB', beklenen: 'bad', baslik: /KVKK ihlali/ },
];

describe('Tüm yollar (8 yol, 2 son)', () => {
  yollar.forEach(({ yol, beklenen, baslik }) => {
    it(`${yol} → ${beklenen === 'good' ? 'İyi son' : 'Kötü son'}`, () => {
      cy.startGame();

      [...yol].forEach((secim, i) => {
        cy.get('[data-testid="decision-title"]').should('be.visible');
        cy.contains(`Karar ${i + 1}`).should('exist');
        cy.choose(secim);
      });

      cy.get(`[data-testid="ending-${beklenen}"]`).should('be.visible').invoke('text').should('match', baslik);

      // Puan: doğru (A) seçim sayısı
      const puan = [...yol].filter((s) => s === 'A').length;
      cy.contains(new RegExp(`${puan}\\s*/\\s*3`)).should('exist');

      // Tekrar oyna → giriş ekranına döner ve durum sıfırlanır
      cy.get('[data-testid="restart-button"]').first().click();
      cy.get('[data-testid="start-button"]').should('be.disabled');
    });
  });
});
