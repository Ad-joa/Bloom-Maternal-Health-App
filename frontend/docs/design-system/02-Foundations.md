# 02 - Foundations

The Foundations define the atomic elements of the Bloom Design System. They are the building blocks that ensure visual consistency, accessibility, and a premium aesthetic across the application.

## 1. Color System

Our color system uses a base hue of `#D47285` (Rose) tailored into a comprehensive palette. It supports both Light and Dark modes.

### Primary Colors
Used for primary actions, branding, and active states.
- **Primary 500 (Base):** `#D47285` - The core brand color.
- **Primary 100 (Light):** `#F7E3E7` - Used for subtle backgrounds and highlighted states.
- **Primary 700 (Dark):** `#A34A5C` - Used for pressed states and high-contrast text.

### Neutral Colors
Used for text, backgrounds, borders, and shadows.
- **Surface (Background):** `#FFFFFF` (Light) / `#121212` (Dark)
- **Surface Variant:** `#F5F5F5` (Light) / `#1E1E1E` (Dark)
- **Text High Emphasis:** `#1A1A1A` (Light) / `#F5F5F5` (Dark)
- **Text Medium Emphasis:** `#666666` (Light) / `#A3A3A3` (Dark)
- **Border:** `#E5E5E5` (Light) / `#333333` (Dark)

### Semantic Colors
Used to convey meaning, particularly important in a health app.
- **Success (Green):** `#34C759` - Used for milestones, positive feedback.
- **Warning (Yellow/Orange):** `#FF9500` - Used for cautionary advice.
- **Danger (Red):** `#FF3B30` - Used for critical health warnings or destructive actions.
- **Info (Blue):** `#007AFF` - Used for neutral, informative updates.

---

## 2. Typography

We utilize a 9-level scale inspired by iOS typography, optimized for readability. We assume the system font (`SF Pro` on iOS, `Roboto` on Android) or a modern sans-serif like `Inter` for web.

| Level | Weight | Size (pt/px) | Line Height (pt/px) | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Large Title** | Bold | 34 | 41 | Top-level screen headers |
| **Title 1** | Bold | 28 | 34 | Primary section headers |
| **Title 2** | Semibold | 22 | 28 | Secondary section headers |
| **Title 3** | Semibold | 20 | 25 | Modal titles, large card headers |
| **Headline** | Semibold | 17 | 22 | Important text, default button text |
| **Body** | Regular | 17 | 22 | Standard paragraph text |
| **Callout** | Regular | 16 | 21 | Pull quotes, highlighted text |
| **Subhead** | Regular | 15 | 20 | Secondary lists, subtitles |
| **Footnote** | Regular | 13 | 18 | Small text, input descriptions |
| **Caption 1** | Regular | 12 | 16 | Very small text, tab bar labels |
| **Caption 2** | Medium | 11 | 13 | Badges, micro-copy |

*(Note: All fonts must dynamically scale with OS accessibility settings)*

---

## 3. Spacing & Layout

### 8-Point Grid System
We use an `8pt` base unit for sizing and spacing. This ensures a consistent rhythm across the UI.
- `spacing-1`: `4px` (Half step, for tight clusters)
- `spacing-2`: `8px`
- `spacing-3`: `12px`
- `spacing-4`: `16px` (Standard padding/margin)
- `spacing-5`: `24px`
- `spacing-6`: `32px` (Large section spacing)
- `spacing-7`: `48px`
- `spacing-8`: `64px`

### 12-Column Responsive Grid
While mobile apps largely rely on layout margins, a 12-column grid structure applies for responsive scaling (especially if the app runs on tablets/web).
- **Mobile (Base):** 4 Columns. `16px` margin, `16px` gutter.
- **Tablet (md):** 8 Columns. `32px` margin, `24px` gutter.
- **Desktop (lg):** 12 Columns. Auto margins (max-width `1200px`), `24px` gutter.

### Corner Radii (Border Radius)
Rounded corners evoke friendliness and approachability, vital for the Bloom aesthetic.
- **None:** `0px`
- **Small:** `8px` (Tags, Badges, small inputs)
- **Medium:** `12px` (Buttons, larger inputs, small cards)
- **Large:** `16px` (Standard Cards, Dialogs)
- **Extra Large:** `24px` (Bottom Sheets)
- **Pill/Round:** `999px` (FABs, Circular Avatars)
