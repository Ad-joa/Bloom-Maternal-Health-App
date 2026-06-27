# Components: Actions

This section covers interactive components that trigger an action or event.

## 1. Button

The primary means for users to take action.

### Anatomy
- **Container:** The background shape holding the content.
- **Label:** The text indicating the action.
- **Icon (Optional):** Leading or trailing visual cue.

### States
- **Default:** Standard presentation.
- **Pressed (Active):** Visual feedback upon touch (typically 80% opacity or darkened color).
- **Disabled:** Dimmed appearance (opacity 40%), non-interactive.
- **Loading:** Label is replaced by a Circular Spinner.

### Variants
- **Primary:** Solid background (`Primary 500`). Used for the main action on a screen.
- **Secondary:** Outlined border (`Primary 500`), transparent background. Used for alternative actions.
- **Tertiary:** Text only. Used for low-priority actions (e.g., "Cancel").

### Accessibility
- `accessibilityRole="button"`
- Minimum tap target: `44x44pt`.
- Contrast ratio of text on primary background must exceed 4.5:1.

---

## 2. IconButton

A button represented entirely by an icon, used when space is constrained or the action is universally understood.

### Usage
- Header actions (e.g., Back, Settings, Close).
- Inline list actions (e.g., Delete row).

### Specs
- **Size:** `44x44pt` container, `24x24pt` icon inside.
- **States:** Same as Button.

---

## 3. Floating Action Button (FAB)

A prominent, floating button indicating the primary action of an entire view (e.g., "Log Symptom").

### Specs
- **Shape:** Circular (`border-radius: 999px`).
- **Elevation:** High shadow to float above content.
- **Placement:** Bottom trailing corner (with `16px` margin from edges and Safe Area).

---

## 4. Typography (Interactive Text Styles)

When text itself acts as a button (e.g., inline links in terms of service).

### Specs
- **Color:** `Primary 500` or `Info` (Blue).
- **Decoration:** Underlined if the interaction isn't inherently obvious from context.

---

## 5. Action Sheet

A native-feeling modal that slides up from the bottom, presenting a set of two or more choices.

### Usage
- To present options related to a specific object or context.
- Always include a explicit "Cancel" option at the bottom.

### Anatomy
- **Title (Optional):** Contextual heading.
- **Options List:** Stacked list of actions.
- **Cancel Button:** Separated stack at the bottom.
