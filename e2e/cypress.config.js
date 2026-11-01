import { defineConfig } from 'cypress';
import { createHash } from 'node:crypto';

// Not: Proje TypeScript 7 kullanıyor; Cypress'in TS desteği bununla uyumsuz
// olduğu için test dosyaları düz JavaScript (.js) olarak yazıldı.
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    // Telefon ekranı (iPhone 12/13/14)
    viewportWidth: 390,
    viewportHeight: 844,
    // Vite ilk açılışta sayfayı derlerken 8 sn'yi aşabiliyor (ilk koşuda görüldü)
    defaultCommandTimeout: 15000,
    setupNodeEvents(on) {
      on('task', {
        // Parite testi: tarayıcının indirdiği model.onnx'in parmak izi
        sha256Base64(base64) {
          return createHash('sha256').update(Buffer.from(base64, 'base64')).digest('hex');
        },
      });
    },
  },
  // Testler çalışırken demo videosu (cypress/videos) silinmesin
  trashAssetsBeforeRuns: false,
  // Demo videosu için kayıt açık
  video: true,
  videoCompression: false,
});
