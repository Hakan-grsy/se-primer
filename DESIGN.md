---
name: Crisis Engine
colors:
  surface: '#06132a'
  surface-dim: '#06132a'
  surface-bright: '#2e3952'
  surface-container-lowest: '#020d25'
  surface-container-low: '#0f1b33'
  surface-container: '#131f37'
  surface-container-high: '#1e2a42'
  surface-container-highest: '#29344e'
  on-surface: '#d8e2ff'
  on-surface-variant: '#d8c3b0'
  inverse-surface: '#d8e2ff'
  inverse-on-surface: '#253049'
  outline: '#a08d7c'
  outline-variant: '#534436'
  surface-tint: '#ffb868'
  primary: '#ffc486'
  on-primary: '#482900'
  primary-container: '#f5a23a'
  on-primary-container: '#663c00'
  inverse-primary: '#885200'
  secondary: '#b5c6f6'
  on-secondary: '#1e2f56'
  secondary-container: '#374871'
  on-secondary-container: '#a7b8e7'
  tertiary: '#5fe999'
  on-tertiary: '#00391d'
  tertiary-container: '#3dcc80'
  on-tertiary-container: '#00512d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffddbb'
  primary-fixed-dim: '#ffb868'
  on-primary-fixed: '#2b1700'
  on-primary-fixed-variant: '#673d00'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b5c6f6'
  on-secondary-fixed: '#051a40'
  on-secondary-fixed-variant: '#35466e'
  tertiary-fixed: '#73fcab'
  tertiary-fixed-dim: '#54df91'
  on-tertiary-fixed: '#00210f'
  on-tertiary-fixed-variant: '#00522d'
  background: '#06132a'
  on-background: '#d8e2ff'
  surface-variant: '#29344e'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system powers a high-stakes, narrative-driven educational simulation described as "a book you play." The experience places software engineers into the critical seat of a hospital infrastructure crisis, balancing clinical gravity with real-world technical decision trees.

### Aesthetic Foundation
- **Tone & Mood:** Calm, analytical, high-stakes, and authoritative. It strips away gamified frivolity in favor of a clinical operations deck crossed with an architectural tech folio.
- **Design Movement:** Technical Editorial Minimal with Blueprint Accents. Interfaces combine rich long-form reading density with schematic diagrams, fine hairline technical divisions, and decisive tactile choice nodes.
- **Audience Emotion:** Measured pressure and intellectual accountability. The user must feel the weight of every deployment, schema change, and failover decision through precise, dependable feedback loops.

## Colors

The palette establishes an nocturnal operational center environment. Contrast ratios strictly exceed WCAG AA standards (and target AAA on narrative text) to maintain reading comfort during extended scenario breakdowns.

### Functional Roles
- **Primary (`#F5A23A`):** Tactical amber accent. Reserved strictly for primary callouts, critical decision pathways, key focal highlights, and selected states.
- **Secondary (`#2A3B63`):** Technical stroke and architectural boundary tone. Used for 1px hairline card borders, structural blueprint grids, and inactive state dividers.
- **Neutral Canvas (`#0F1B33`):** Substrate navy backdrop. Minimizes eye fatigue while creating infinite depth behind interactive elements.
- **Surface Layer (`#16264A`):** The primary card and reading vessel backdrop. Elevates narrative chapters and choice modules cleanly off the canvas.
- **Success (`#3CCB7F`):** Diagnostic green for stable telemetry, successful deployments, and resilient architectural outcomes.
- **Critical Danger (`#F05454`):** Emergency telemetry red indicating packet loss, patient monitoring system failures, and lethal edge-case crashes.

## Typography

The typographic hierarchy balances structural presence with effortless readability for long-form situational narrative text.

- **Headlines (Plus Jakarta Sans):** Geometric, solid, and modern. Conveys urgency without distress. Use tight tracking (`-0.01em`) on `headline-xl` and `headline-lg` to create editorial authority.
- **Narrative & Prose (Inter):** Highly legible, neutral workhorse. Set at 16px with an expansive 26px line height (`1.625`) to preserve comfortable visual scanning and comprehension under tension.
- **Technical & Metric Readouts:** Use tabular numerals and uppercase tracking (`+0.05em`) for runtime stats, incident timestamps, and decision timers.

## Layout & Spacing

Optimized primarily for vertical mobile portrait flow (`360px` to `428px` viewport range) with graceful scale-up across larger tablets.

### Layout Principles
- **Grid Architecture:** Single-column fluid reading stack on mobile portrait with strict `1rem` outer horizontal margins. Wide viewports center the container to a maximum reading width of `680px` to prevent fatigue.
- **Touch Geometry:** All actionable choice triggers, tabs, and interactive branch paths require a minimum interactive touch boundary of 48px vertically.
- **Rhythm:** Spacing follows a consistent 4px/8px incremental base. Use `space-md` (16px) for interior card padding, and `space-xl` (32px) to space narrative beats from decision panels.

## Elevation & Depth

Visual hierarchy uses architectural tonal shifts and structural outlines rather than heavy skeuomorphic drop shadows. Depth informs operational urgency.

### Surface Tiers
- **Base Level (Canvas):** `#0F1B33` serves as the bedrock, receding into the background.
- **Level 1 (Card & Narrative Sheets):** `#16264A` background bounded by a sharp `1px solid #2A3B63` border. Provides immediate structural distinction without glare.
- **Level 2 (Active Decisions & Drawers):** `#1C305C` background with subtle ambient elevation: `0 8px 24px rgba(5, 10, 20, 0.45)`.
- **Level 3 (Focused Modal / Incident Flash):** `#16264A` with an active amber hairline perimeter: `1px solid rgba(245, 162, 58, 0.6)` and an amber glow: `0 0 16px rgba(245, 162, 58, 0.12)`.

## Shapes

The interface balances soft ergonomics with technical precision.

- **Primary Containers & Reading Cards:** Utilize `1rem` (16px) corner rounding to soften the narrative delivery while preserving neat alignment with line-art diagrams.
- **Interactive Action Buttons & Selectors:** Employ `0.5rem` (8px) corners for crisp, deliberate button profiles.
- **Telemetry Chips & Badges:** Utilize `0.5rem` (8px) rounding to maintain a unified blueprint aesthetic instead of overly playful circular capsules.

## Components

### 1. Decision & Choice Cards
- **Styling:** Surface `#16264A`, border `1px solid #2A3B63`, border-radius `16px`, padding `16px`.
- **Interactive States:** On press/hover, border transitions to `1px solid #F5A23A` with an inset indicator or left border pip (3px width) in `#F5A23A`. Minimum height is 56px to guarantee effortless thumb contact.
- **Typography:** Action titles in `label-lg`, sub-consequences or trade-off specs in `body-sm` (`#94A3B8`).

### 2. Buttons
- **Primary Action (Commit Decision):** Background `#F5A23A`, label `#0F1B33` (Plus Jakarta Sans Bold), 48px height, 8px radius. Active state provides high tactile feedback via micro-scale reduction (`0.98`).
- **Secondary (Inspect Blueprint / View Logs):** Transparent background, `1px solid #2A3B63`, label `#F5A23A`.
- **Destructive Fail-Safe:** Transparent background, `1px solid #F05454`, label `#F05454`.

### 3. Narrative Text Vessel
- **Styling:** Uncontained or wrapped in a seamless flat container. Inter regular 16px text with `#E2E8F0` color. Paragraph breaks spaced with `space-md` (16px).
- **Incident Callouts:** Blockquote styling accented by a 2px left border in `#F5A23A` and a faint backdrop tint `rgba(245, 162, 58, 0.05)`.

### 4. Technical Line-Art Blueprints & Architecture Schematics
- **Styling:** Vector diagram containers framed in `1px solid #2A3B63` on `#121E3B`.
- **Line Hierarchy:** Primary architectural nodes drawn in 1.5px `#94A3B8`; active data pipelines rendered in `#F5A23A` dashed strokes; disrupted nodes indicated with `#F05454` status rings.

### 5. Telemetry & Vital Status Badges
- **Styling:** Padding `4px 10px`, radius `6px`, uppercase `label-md`.
- **Normal Status:** Background `rgba(60, 203, 127, 0.1)`, text `#3CCB7F`, border `1px solid rgba(60, 203, 127, 0.3)`.
- **Critical Status:** Background `rgba(240, 84, 84, 0.1)`, text `#F05454`, border `1px solid rgba(240, 84, 84, 0.3)`.

---

## Ekranlar (Türkçe not)

> Yukarıdaki tasarım sistemi Google Stitch tarafından üretildi ("Crisis Engine"). Ekranlar ve HTML kodları `design/` klasöründe.

| Ekran | Görsel | HTML | spec.md karşılığı |
|---|---|---|---|
| 1 · Giriş (seviye, rol, hedef) | [01-giris.png](design/01-giris.png) | [html](design/html/01-giris.html) | §4 Kişiselleştirme |
| 2 · Karar sahnesi | [02-sahne.png](design/02-sahne.png) | [html](design/html/02-sahne.html) | §3 Karar 1–3, §5 Tutor |
| 2b · Seçim sonrası (Ne oldu? / Neden oldu?) | [02b-sahne-sonuc.png](design/02b-sahne-sonuc.png) | [html](design/html/02b-sahne-sonuc.html) | Kabul örneği K3 |
| 3 · İyi son | [03-son-iyi.png](design/03-son-iyi.png) | [html](design/html/03-son-iyi.html) | §3 Son A |
| 3b · Kötü son | [03b-son-kotu.png](design/03b-son-kotu.png) | [html](design/html/03b-son-kotu.html) | §3 Son B |

Stitch'e verilen prompt'lar: [design/stitch-prompts.md](design/stitch-prompts.md).

### Uygulamaya geçerken kararlar
- **Seçeneklerin altındaki açıklama satırları kaldırılacak.** Stitch karar ekranında seçeneklere küçük alt açıklamalar ekledi (ör. B: *"geçici hafıza izlerini silebilir"*). Bunlar doğru cevabı ele veriyor ve tutor'un "cevabı söyleme" kuralıyla çelişiyor.
- **Sayaç yalnızca "Deneyimliyim" seviyesinde, ipucu kartı yalnızca "Yeni başladım" seviyesinde** gösterilir. Ekran 2 ikisini birlikte, tüm durumları göstermek için çiziyor.
- Tasarımdaki hasta kimlikleri (`Hst #4819` vb.) uydurmadır; gerçek hasta verisi kullanılmaz.