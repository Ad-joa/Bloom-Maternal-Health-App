# Components: Layout & Structure

Components used to group, divide, and structure content on the screen.

## 15. Card

A container for grouping related information and actions (e.g., a daily health tip, a logged symptom).

### Variants
- **Elevated:** White background with a subtle drop shadow (`elevation: 2` or `shadowOpacity: 0.1`). Best for scrollable lists.
- **Outlined:** Transparent background with a `1px` gray border. Best for dense layouts.
- **Filled:** Solid subtle background (e.g., `Primary 100` or `Surface Variant`) with no border or shadow.

### Anatomy
- **Header:** Title and optional Avatar/Icon.
- **Media (Optional):** Image or illustration.
- **Body:** Supporting text.
- **Actions:** Buttons at the bottom.

---

## 16. List Item

Used to display rows of information, such as settings menus or a list of previous appointments.

### Anatomy
- **Leading Icon/Avatar (Optional):** Visual identifier.
- **Title:** Primary text (Body style).
- **Subtitle (Optional):** Secondary text (Subhead or Footnote style).
- **Trailing Element:** Chevron (indicating navigation), a Switch, or a Badge.

---

## 17. Accordion / Collapsible

A vertically stacked list of headers that reveal or hide associated content. Useful for FAQs or grouping extensive health advisory text.

### States
- **Collapsed:** Shows Header and downward-facing chevron.
- **Expanded:** Shows Header, upward-facing chevron, and Body content.

---

## 18. Divider / Separator

A thin (`1px` or `0.5px`) line that groups content in lists and layouts.
- **Color:** `#E5E5E5` (Light mode) / `#333333` (Dark mode).
- **Variants:** Full width, or inset (matching the text margin, skipping the leading icon).

---

## 19. Modal / Dialog

A highly disruptive overlay that requires user interaction before proceeding.

### Usage
- Confirming destructive actions (e.g., "Delete Log").
- Displaying critical health alerts (e.g., "Seek immediate medical attention").

### Anatomy
- **Scrim/Overlay:** Darkened background (`rgba(0,0,0,0.5)`) to block interaction with the underlying app.
- **Container:** Rounded rectangle (`16px` radius).
- **Title:** Bold text explaining the purpose.
- **Message:** Detailed explanation.
- **Actions:** Horizontal or vertical list of Buttons. (Destructive action must use the Danger color).

---

## 20. Bottom Sheet

A surface anchored to the bottom of the screen containing supplementary content. It is less disruptive than a Modal as the user can often swipe it away.

### Usage
- Selecting an item from a long list (e.g., choosing a country).
- Showing detailed info for a selected calendar date.
- **Specs:** Large corner radii (`24px`) on top corners only. Includes a drag handle (pill shape) at the top center.

---

## 21. Avatar / Profile Picture

A circular representation of the user or a healthcare professional.

### Specs
- **Shape:** Circle (`border-radius: 999px`).
- **Fallback:** If no image is provided, display the user's initials over a `Primary 100` background.
- **Sizes:** Small (`32px`), Medium (`48px`), Large (`80px`).
