# Design Brief

## Purpose
Professional expense tracking for non-technical field sales staff in Western India. Mobile-first, card-based receipt gallery with daily grouping, PDF report generation, and seamless sharing (WhatsApp/Email).

## Tone & Aesthetic
Utilitarian elegance—professional but warm. Clean, uncluttered layout optimized for one-handed mobile use. Teal/blue conveys trust; emerald green signals growth and balance. Receipt cards feel tactile, not flat. Typography supports English and Devanagari equally.

## Color Palette

| Token              | Light OKLCH         | Dark OKLCH          | Purpose                          |
| :----------------- | :------------------ | :------------------ | :------------------------------- |
| Primary            | 0.5 0.17 195 (teal) | 0.62 0.16 195       | Trust, core actions, navigation  |
| Secondary          | 0.6 0.14 155 (green)| 0.65 0.13 155       | Balance, growth, category badges |
| Accent             | 0.65 0.18 50 (warm) | 0.72 0.18 50        | CTA urgency, highlights          |
| Neutral (bg)       | 0.98              | 0.12                | Background surfaces              |
| Neutral (fg)       | 0.12              | 0.96                | Text, high contrast              |
| Muted              | 0.92               | 0.25                | Disabled, secondary text         |
| Destructive        | 0.55 0.24 25       | 0.62 0.24 25        | Delete, warnings                 |

## Typography
- **Display**: Space Grotesk (bold, geometric, modern—headlines, category labels)
- **Body**: Inter (clean, highly legible in English & Hindi/Marathi—body copy, descriptions)
- **Mono**: JetBrains Mono (amounts, timestamps, technical precision)

## Shape & Elevation
- **Border radius**: 12px default (lg), 10px md, 8px sm for softer cards
- **Shadows**: Subtle depth via `shadow-sm` (default), `shadow-md` on hover for receipt cards
- **Spacing density**: Tight in galleries (12px gutters), generous in forms (16px)

## Structural Zones

| Zone              | Light Background    | Dark Background    | Treatment                                          |
| :---------------- | :------------------ | :------------------ | :------------------------------------------------- |
| Header/Top nav    | bg-card border-b    | bg-card border-b    | Elevated card with logo/title, optional premium tag |
| Main content area | bg-background       | bg-background       | Daily headers (bg-muted/30), receipt cards below   |
| Receipt cards     | bg-card shadow-sm   | bg-card shadow-sm   | Border-border, hover:shadow-md, rounded-lg         |
| Bottom nav        | bg-card border-t    | bg-card border-t    | Fixed, 4 items (Home/Gallery/Reports/Settings)    |
| Upsell banner     | gradient teal/green | gradient teal/green | 60-day free β banner, watermark reminder          |
| Category badges   | primary/secondary   | primary/secondary   | Pill-shaped, text-foreground, snug padding         |

## Component Patterns
- **Receipt cards**: Date + thumbnail + category badge + amount. Swipe-to-rearrange within daily group.
- **Daily headers**: "April 19" + count ("3 cabs, 1 lunch") + subtotal (right-aligned).
- **Bottom navigation**: Icon-only tabs, active = primary color, inactive = muted-foreground.
- **CTA buttons**: Teal primary bg, warm accent hover state. "Upload Receipt" + camera/gallery icons.
- **Category chips**: Secondary bg with primary text, compact sizing for forms.
- **PDF summary page**: Cover section (user name, optional company, month), category breakdown table, grand total.
- **Onboarding**: Full-screen illustrations, step indicators (1–3 steps), skip button.

## Motion & Interaction
- Smooth `transition-all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` on hover/active state changes.
- Receipt cards lift on hover (shadow-sm → shadow-md).
- Daily headers collapse/expand on tap (accordion pattern).
- Bottom nav active indicator slides smoothly.
- No loading spinners—use skeleton cards or fade-in on data load.

## Dark Mode Strategy
Same palette, darker `--background` (0.12) and `--card` (0.16). Primary + secondary hues shift slightly for better luminosity. Text inverts to light (0.96). Borders darken (0.22). Preserves warmth: no harsh pure black.

## Responsive Breakpoints
- **Mobile first** (320px–480px): Single column, full-width cards, icon-only nav.
- **Tablet** (768px+): Two-column gallery grid, optional sidebar nav.
- **Desktop** (1024px+): Three-column grid, expanded navigation (optional—MVP is mobile-only).

## Constraints & Guardrails
- **No default Tailwind blues**—use OKLCH palette exclusively via CSS variables.
- **No arbitrary color classes** (e.g., `bg-[#123]`). Always use semantic tokens.
- **Typography pairs**: Display + Body only; no arbitrary font mixing.
- **One spacing scale**: Use 12/16/24/32px multiples; no arbitrary gaps.
- **Regional language support**: Inter font handles both Latin and Devanagari. Test with Hindi/Marathi labels.
- **Watermark**: Free tier only; white text overlay at 40% opacity on PDF exports.
- **Mobile optimization**: 48px+ touch targets, one-handed thumb reach (bottom half of screen).

## Signature Detail
Receipt cards cast subtle shadows and subtly lift on hover—tactile feedback that reinforces the "physical receipt" metaphor. Daily headers use a muted background color (not full card elevation) to create visual separation without overwhelming the gallery. Premium banner occupies top 5% of screen, easy to dismiss but persistent enough to encourage upgrades.

## Accessibility & Localization
- **WCAG AA minimum contrast**: 4.5:1 text-on-background, 3:1 interactive elements.
- **Icon + label**: All bottom nav items have both icon and label (mobile clarity).
- **Touch targets**: 48×48px minimum for receipt cards and buttons.
- **Keyboard navigation**: Tab through cards, arrow keys to navigate gallery, Enter to open receipt detail.
- **Devanagari support**: Inter + system fallbacks for Hindi/Marathi text. Test with real samples.

