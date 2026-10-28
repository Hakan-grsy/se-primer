# Stitch Prompt'ları

**Nasıl kullanılır:**
1. [stitch.withgoogle.com](https://stitch.withgoogle.com) → **Mobile** modunu seç.
2. Önce **Prompt 0**'ı yapıştır, ardından **Prompt 1**'i aynı mesaja ekleyip ilk ekranı üret.
3. Diğer ekranlar için **aynı projede** Prompt 2 ve Prompt 3'ü sırayla gönder (stil tutarlı kalsın diye yeni proje açma).
4. Beğenmediğin yerleri sohbetle düzelt (ör. *"Make the option buttons larger"*).
5. Her ekranın görüntüsünü `design/` klasörüne kaydet: `01-giris.png`, `02-sahne.png`, `02b-sahne-sonuc.png`, `03-son.png`.
6. Stitch'te dışa aktarma menüsünden **DESIGN.md** (veya tasarım sistemi / tema) çıktısı varsa indirip repo köküne koy.

> Prompt'lar İngilizce, çünkü Stitch İngilizce talimatı daha iyi anlıyor. **Ekrandaki tüm yazılar Türkçe** olacak.

---

## Prompt 0 · Genel stil (her prompt'un başına ekle)

```
App: "SE Primer" — an interactive, choose-your-path story that teaches software engineering. Mobile web app, portrait, 390x844.
All on-screen text must be in TURKISH, exactly as given in quotes.

Visual style: "a book you play". Dark navy background (#0F1B33), slightly lighter navy cards (#16264A) with soft rounded corners (16px) and thin 1px borders (#2A3B63).
Accent: warm amber/orange (#F5A23A) for primary buttons and highlights.
Status colors: success green (#3CCB7F), danger red (#F05454).
Typography: bold geometric sans-serif headings (e.g. Inter / Plus Jakarta Sans), comfortable 16px body text, high contrast, readable outdoors on a phone.
Subtle line-art illustrations in a blueprint style (hospital, lab tubes, server, open book). Calm, serious tone — this is a hospital crisis, not a cartoon.
Large touch targets (min 48px), single column, generous spacing.
```

---

## Prompt 1 · Giriş ekranı

```
Screen 1: Onboarding / start screen.

Top: small open-book line-art illustration, then title "SE Primer" and subtitle "Yazılım Mühendisliği, Oynanan Bir Kitap".
Short intro text: "Bir hastane yazılımında kriz var. Kararları sen vereceksin. Önce seni tanıyalım."

Three questions, each as a label + a group of selectable chip/cards (single choice, the selected one has an amber border and a check icon):

1. "Seviyen ne?"
   - "Yeni başladım"
   - "Biraz deneyimim var"
   - "Deneyimliyim"
   Under the group, small helper text: "Deneyimliler her karar için 60 saniye süreyle oynar."

2. "Hangi roldesin?"
   - "Backend geliştirici"
   - "Test (QA) mühendisi"
   - "Takım lideri"

3. "Ne öğrenmek istiyorsun?"
   - "Hata ayıklama"
   - "Test ve kalite"
   - "Veri güvenliği ve KVKK"

Bottom: full-width amber primary button "Başla", disabled (greyed) until all three questions are answered. Show the screen in the state where all three are selected and the button is active.
```

---

## Prompt 2 · Sahne (karar) ekranı

```
Screen 2: Decision scene screen. Same style as Screen 1.

Top bar: left a clock badge "07:45" with a small red pulsing dot, center a progress indicator "Karar 1 / 3" (three dots, first filled amber), right a small circular countdown timer "0:42".

Scene card (lighter navy card) with a small line-art illustration of a lab results screen with a red warning icon, then a heading "Kriz: Yanlış hastaya giden sonuç" and story text:
"Dün gece Laboratuvar Bilgi Sistemi'ne yeni sürüm yüklendi. Dr. Aksoy arıyor: 'Hastamın ekranında başka birinin kan sonuçları var!' Sabah 300 hasta sonuç bekliyor. Nöbetçi sensin."

Question: "Sorunun kaynağını nasıl bulursun?"

Two large option buttons stacked vertically (outlined cards, with letter badges):
- "A" — "Son sürümün değişikliklerini ve hata loglarını incele"
- "B" — "Sunucuyu yeniden başlat"

Below: a hint card with a lightbulb icon and amber left border, title "İpucu", text: "Sorun tam olarak ne zaman başladı? O saatte sistemde ne değişmişti?"

Bottom: a collapsed AI tutor chat bar: small avatar icon (an open book with a lantern), label "Tutor'a sor", a text input placeholder "Takıldığın yeri yaz…" and a send icon.
```

### Prompt 2b · Sahne ekranı — seçim sonrası durumu

```
Create a variant of Screen 2 showing the state AFTER the player chose option A.

Option A card now has a green border and a check icon, option B is dimmed. The countdown timer is hidden.
A result panel slides up from the bottom (bottom sheet, lighter navy, rounded top corners) containing:
- Green label "✓ İyi karar"
- Heading "Ne oldu?" with text: "20 dakikada sorgudaki hatalı eşleşmeyi buldun: sonuçlar protokol numarası yerine sıra numarasıyla bağlanıyordu."
- Heading "Neden oldu?" with text: "Sorun yeni sürümden hemen sonra başladı. Değişikliğe bakmak, kök nedene giden en kısa yoldur."
- Full-width amber button "Devam".
```

---

## Prompt 3 · Son ekranı

```
Screen 3: Ending screen. Same style.

Top: a large illustration of a calm hospital lab at morning light with a green check, badge "Son A · İyi Son", clock "09:40".
Heading: "Sistem ayakta, veri güvende"
Text: "Hata kaynağı bulundu, 12 kayıt düzeltildi, ihlal zamanında bildirildi. Dr. Aksoy teşekkür ediyor."

Section "Kararların" — a list of three rows, each with a status icon:
- ✓ green "Karar 1 · Hata ayıklama — Değişiklikleri ve logları inceledin"
- ✓ green "Karar 2 · Veri bütünlüğü — Etkilenen 12 kaydı buldun"
- ✓ green "Karar 3 · KVKK — Veri sorumlusuna bildirdin"

Section "Öğrendiklerin" (card with amber left border), 3 short bullets:
- "Belirtiyi değil, kök nedeni düzelt."
- "Tek şikâyet, sorunun görünen kısmıdır; etkinin tamamını ölç."
- "Sağlık verisi özel nitelikli veridir; ihlal 72 saat içinde bildirilir."

Bottom: amber primary button "Tekrar oyna" and a secondary text button "Diğer sonu keşfet".
```

### Prompt 3b · Son ekranı — kötü son (isteğe bağlı)

```
Create a variant of Screen 3 for the BAD ending.
Badge "Son B · Kötü Son" in red, illustration with a red warning tone, clock "Bir hafta sonra".
Heading: "Sistem ayakta ama KVKK ihlali var"
Text: "İki hafta sonra bir hasta şikâyetçi oldu, Kurul inceleme başlattı."
In "Kararların", show Karar 3 with a red ✗ "KVKK — Sessizce düzelttin".
Keep the same "Öğrendiklerin" section and buttons.
```
