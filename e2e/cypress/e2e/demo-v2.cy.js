/// <reference types="cypress" />

// v2 demo videosu (60–90 sn). Canlı sitede iki oyuncu aynı sahnelerden geçer.
// Ekrandaki risk değerleri modelden o an okunur (data-cy="p"); elle yazılmaz.
//   npm --prefix e2e run test:demo2
//   → e2e/cypress/videos/demo-v2.cy.js.mp4

const OKUMA = 7000; // açıklama bandını okuma süresi (ms)

function bant(metin, renk = '#F5A23A') {
  cy.document().then((doc) => {
    let el = doc.getElementById('demo-bant');
    if (!el) {
      el = doc.createElement('div');
      el.id = 'demo-bant';
      Object.assign(el.style, {
        position: 'fixed',
        left: '8px',
        right: '8px',
        bottom: '8px',
        zIndex: '9999',
        padding: '10px 12px',
        borderRadius: '12px',
        background: 'rgba(8, 14, 28, 0.94)',
        color: '#F1F5FF',
        font: '600 14px/1.4 system-ui, sans-serif',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        whiteSpace: 'pre-line',
      });
      doc.body.appendChild(el);
    }
    el.style.border = `2px solid ${renk}`;
    el.textContent = metin;
  });
}

function bantKaldir() {
  cy.document().then((doc) => doc.getElementById('demo-bant')?.remove());
}

function oyuncuBaslat(no, seviye, seviyeAdi) {
  cy.visit('/');
  bant(`Oyuncu ${no}: seviye "${seviyeAdi}"`);
  cy.wait(1500);
  cy.get(`[data-testid="level-${seviye}"]`).click();
  cy.wait(500);
  cy.get('[data-testid="role-backend-gelistirici"]').click();
  cy.wait(500);
  cy.get('[data-testid="goal-test-ve-kalite"]').click();
  cy.wait(800);
  cy.get('[data-testid="start-button"]').click();
  bantKaldir();
  cy.wait(2000);
  cy.get('[data-testid="kriz-start-button"]').click();
}

// Bu karar ekranında modelin riskini okur ve açıklama bandına yazar
function kararAnlat(no, karar) {
  cy.contains(`Karar ${karar}`).should('exist');
  cy.get('[data-cy="p"]')
    .invoke('text')
    .then((metin) => {
      const p = parseFloat(metin);
      const selin = p >= 0.5;
      cy.get('[data-testid="selin-card"]').should(selin ? 'be.visible' : 'not.exist');
      bant(
        `Oyuncu ${no} · Karar ${karar}\n` +
          `Model: yanlış karar riski = ${p.toFixed(3)} ${selin ? '≥' : '<'} 0.50\n` +
          (selin ? '→ Kıdemli meslektaş Selin arıyor' : '→ Müdahale yok, hikâye v1 gibi'),
        selin ? '#5CC8B0' : '#F5A23A',
      );
      cy.wrap(p).as(`p_${no}_${karar}`);
    });
  cy.wait(OKUMA);
}

function devam() {
  bantKaldir();
  cy.get('[data-testid="option-a"]').click();
  cy.wait(1800);
  cy.get('[data-testid="continue-button"]').click();
}

describe('SE Primer v2 demo', () => {
  it('iki oyuncu, aynı sahneler, model kararları', () => {
    cy.visit('/');
    bant(
      'SE Primer v2 · Yanlış karar riski modeli\n' +
        'Model tarayıcıda çalışır (onnxruntime-web), Hugging Face v2.0 commit\'inden indirilir.\n' +
        'Risk ≥ 0.50 ise oyunda Selin arar.',
    );
    cy.wait(7000);

    // Oyuncu 1
    oyuncuBaslat(1, 'yeni-basladim', 'Yeni başladım');
    kararAnlat(1, 1);
    devam();
    kararAnlat(1, 2);
    cy.wait(1500);

    // Oyuncu 2: aynı sahneler
    oyuncuBaslat(2, 'deneyimliyim', 'Deneyimliyim');
    kararAnlat(2, 1);
    devam();
    kararAnlat(2, 2);

    // Kapanış: dürüst özet, değerler bu koşudan
    cy.get('@p_1_2').then((p1) => {
      cy.get('@p_2_2').then((p2) => {
        bant(
          `Aynı sahne (Karar 2): Oyuncu 1 → ${p1.toFixed(3)}, Oyuncu 2 → ${p2.toFixed(3)}.\n` +
            'Model iki oyuncuya farklı risk hesaplıyor, ama ikisi de eşiğin üstünde: kart kararı aynı.\n' +
            'Sınır: Bu sürümde model oyuncudan çok kararın zorluğuna tepki veriyor (spec.md §9.6).',
          '#F05454',
        );
      });
    });
    cy.wait(11000);
  });
});
