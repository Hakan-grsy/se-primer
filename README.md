# SE Primer — Yanlış Hastaya Giden Tahlil Sonucu

YZM301 ödevi. Oyuncunun seviyesine, rolüne ve hedefine uyum sağlayan, telefonda oynanan etkileşimli bir yazılım mühendisliği hikâyesi.

## Linkler
- **Uygulama (AI Studio):** https://ai.studio/apps/af5726e6-29ac-45ee-b4fb-c9c934d50b2c
- **GitHub repo:** https://github.com/Hakan-grsy/se-primer
- **Demo video (55 sn, Cypress koşusu):** https://youtu.be/mHVhM-neVoo
  (dosya: [e2e/cypress/videos/demo.cy.js.mp4](e2e/cypress/videos/demo.cy.js.mp4))

## Repo yapısı
| Dosya / klasör | İçerik |
|---|---|
| [spec.md](spec.md) | Problem, kapsam dışı, 5 kabul örneği, akış şeması |
| [DESIGN.md](DESIGN.md) | Stitch tasarım sistemi ("Crisis Engine") + ekran listesi |
| [design/](design/) | Stitch ekranları (PNG + HTML) ve kullanılan prompt'lar |
| [ai-studio/](ai-studio/) | AI Studio'ya verilen prompt ve manuel test notları |
| [app/](app/) | Uygulamanın kaynak kodu (AI Studio'dan dışa aktarıldı) |
| [e2e/](e2e/) | Cypress E2E testleri: 8 yolun tamamı, 5 kabul örneği, demo videosu |
| [eval/](eval/) | Tutor değerlendirmesi: 20 mesaj, elle etiketler, **[rapor](eval/rapor.md)** (tam sızıntı 0/20, kısmi 4/20) |

## Yerelde çalıştırma ve testler
```bash
# 1. terminal — uygulama
cd app
npm install
npm run dev          # http://localhost:3000 (tutor için .env içinde GEMINI_API_KEY gerekir)

# 2. terminal — testler
cd e2e
npm install
npm run test:e2e     # 8 yol + kabul örnekleri (16 test)
npm run test:demo    # 55 sn demo videosu → e2e/cypress/videos/demo.cy.js.mp4
```
- Testler `/api/tutor`'u sahte cevapla taklit eder; Gemini anahtarı olmadan da çalışır.
- Testler `app/` yerine ayrı `e2e/` klasöründe, çünkü Cypress 14'ün TypeScript desteği projedeki TypeScript 7 ile uyumsuz.
- Son koşu: **16/16 geçti** ([e2e/son-kosu.txt](e2e/son-kosu.txt)).

## Ürün kararı: Yapmadığımız 3 özellik
1. **Kullanıcı hesabı ve ilerleme kaydı:** 5–10 dakikalık tek oturumluk bir deneyimde kayıt olmak, oyuncuyu oyuna başlamadan kaybettirir.
2. **Puan tablosu:** Rekabet, oyuncuyu neden-sonuç ilişkisini anlamak yerine doğru seçeneği ezberlemeye iter.
3. **Gerçek hastane sistemiyle entegrasyon:** Gerçek hasta verisi kullanmak KVKK riski yaratır ve öğrenme hedefine hiçbir şey katmaz.

_(Taslak. Teslimden önce gözden geçirilecek.)_
