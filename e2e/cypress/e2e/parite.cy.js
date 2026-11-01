/// <reference types="cypress" />

// Diferansiyel test (parite): aynı model.onnx, iki farklı sistemde aynı sonucu vermeli.
//   Oracle: Python + onnxruntime  → tests/parite.json (python tests/parite.py --uret)
//   Test edilen: tarayıcı + onnxruntime-web, oyunun kendi arayüzü üzerinden
// Oyuncu gerçekten oynanarak ilgili karar ekranına gidilir; böylece uygulamanın
// girdi kodlaması (seviye metni → sayı, karar no → karar_2/karar_3) da test edilir.

const SEVIYE_SLUG = {
  'Yeni başladım': 'yeni-basladim',
  'Biraz deneyimim var': 'biraz-deneyimim-var',
  Deneyimliyim: 'deneyimliyim',
};

describe('Parite: Python (oracle) ile tarayıcı aynı olasılığı veriyor', () => {
  let parite;

  before(() => {
    cy.readFile('../tests/parite.json').then((json) => {
      parite = json;
    });
  });

  it('tarayıcı, Python ile aynı model.onnx dosyasını indiriyor (SHA-256)', () => {
    cy.request({ url: '/model/model.onnx', encoding: 'base64' }).then((res) => {
      cy.task('sha256Base64', res.body).should('eq', parite.model_sha256);
    });
  });

  it('5 referans durumun hepsinde fark < tolerans ve Selin kararı aynı', () => {
    parite.durumlar.forEach((d) => {
      cy.log(`${d.ad}: ${d.seviye}, Karar ${d.karar_no}`);
      cy.startGame(SEVIYE_SLUG[d.seviye]);
      for (let k = 1; k < d.karar_no; k += 1) cy.choose('A');
      cy.contains(`Karar ${d.karar_no}`).should('exist');

      cy.get('[data-cy="p"]')
        .invoke('text')
        .then((metin) => {
          const p = parseFloat(metin);
          const fark = Math.abs(p - d.p_yanlis);
          cy.log(`tarayıcı=${p.toFixed(8)} python=${d.p_yanlis.toFixed(8)} fark=${fark.toExponential(1)}`);
          expect(fark, `${d.ad} |tarayıcı - python|`).to.be.lessThan(parite.tolerans);
        });

      cy.get('[data-testid="selin-card"]').should(d.mudahale ? 'be.visible' : 'not.exist');
    });
  });
});
