# Components: Inputs & Controls

Components for capturing user data and selections.

## 6. Text Input

Allows users to enter and edit text.

### Anatomy
- **Label:** Small text above the field (Footnote style).
- **Container:** The bordered or filled area holding the text.
- **Placeholder:** Hint text inside the container.
- **Leading/Trailing Icon (Optional):** E.g., a search glass or a clear button.
- **Helper/Error Text:** Small text below the field.

### States
- **Default:** Gray border (`#E5E5E5`).
- **Focused:** Primary color border (`Primary 500`), slightly thicker.
- **Error:** Danger color border (`#FF3B30`), with error message below.
- **Disabled:** Dimmed background, uneditable.

---

## 7. Secure Input

A specialized Text Input for sensitive data (passwords, PINs).
- Includes a trailing "eye" icon button to toggle text visibility.

---

## 8. Text Area

A multi-line text input for longer form content, such as logging symptom details or notes.
- **Specs:** Fixed height or auto-expanding. Requires minimum height of `80px`.

---

## 9. Checkbox

Allows users to select multiple options from a set.

### Specs
- **Size:** `24x24pt` container.
- **Selected State:** Filled with Primary color, displays a checkmark.
- **Unselected State:** Empty with an outline border.

---

## 10. Radio Button

Allows users to select exactly one option from a set.

### Specs
- **Shape:** Circular.
- **Selected State:** Primary colored outer ring with a solid inner circle.
- **Unselected State:** Empty outer ring.

---

## 11. Switch / Toggle

Used to quickly turn a setting on or off. Immediate effect.

### Specs
- **On State:** Track becomes Primary color (or Success Green). Handle shifts right.
- **Off State:** Track is Gray. Handle shifts left.

---

## 12. Segmented Control

A linear set of two or more segments, each of which functions as a mutually exclusive button.
- **Usage:** Switching between views (e.g., "Daily" vs "Weekly" view).
- **States:** Selected segment gets a solid background (often white on a light gray track).

---

## 13. Slider

Allows users to make selections from a range of values (e.g., Pain scale from 1-10).

### Anatomy
- **Track:** Represents the range.
- **Thumb:** The draggable handle.
- **Fill:** Color applied to the track segment indicating the current value.

---

## 14. Calendar / Date Picker

For selecting dates (e.g., Due Date, Appointment Date).
- Utilize native iOS/Android picker components where possible for familiarity and accessibility.
- **Custom View:** If custom, ensure `44x44pt` tap targets for individual days.
