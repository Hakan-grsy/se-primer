import { defineConfig } from 'cypress';

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
  },
  // Demo videosu için kayıt açık
  video: true,
  videoCompression: false,
});
