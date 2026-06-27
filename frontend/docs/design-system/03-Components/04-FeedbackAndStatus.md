# Components: Feedback & Status

Components that communicate system state, progress, and important contextual information.

## 22. Progress Bar

A horizontal bar indicating the completion status of a task or a timeline (e.g., Trimester progression).

### Specs
- **Track:** Subtle background color (`Surface Variant`).
- **Fill:** Primary or Success color indicating progress.
- **Height:** Usually `4px` or `8px` thick with rounded ends.

---

## 23. Circular Spinner / Loader

An indeterminate loading indicator used when the duration of a process is unknown.

### Specs
- **Usage:** Inside buttons during network requests, or centered on screen during initial data load.
- **Color:** Primary color.

---

## 24. Skeleton Loader

A placeholder layout that mimics the structure of the content being loaded, reducing perceived wait times.

### Specs
- **Animation:** A subtle, slow horizontal shimmer or pulse effect.
- **Color:** Gray (`Surface Variant`).
- **Shapes:** Rectangles for text, circles for avatars.

---

## 25. Badge / Notification Dot

A small visual indicator for new or unread items.

### Specs
- **Dot:** A simple red (`Danger`) circle (`8px` diameter) placed on the top-trailing edge of an icon (e.g., Bell icon).
- **Count Badge:** A slightly larger pill shape containing a number (e.g., "3"). Uses `Caption 2` typography.

---

## 26. Tag / Chip

Compact elements that represent an attribute, selection, or category. Perfect for logging multiple symptoms.

### Specs
- **Shape:** Rounded rectangle (`8px` or `16px` radius).
- **States:** 
  - *Unselected:* Gray background, dark text.
  - *Selected:* Primary 100 background, Primary 700 text.
- **Interaction:** Can include a trailing "X" icon to allow users to remove the tag.

---

## 27. Toast / Snackbar

Brief, auto-expiring messages that appear at the bottom or top of the screen without interrupting the user experience.

### Usage
- "Symptom logged successfully."
- "Reminders updated."
- **Specs:** Dark background, light text. Appears for 3-5 seconds.

---

## 28. Banner / Inline Alert

A prominent message displayed inline with content, requiring user attention but not blocking the app.

### Usage
- "You have a doctor's appointment tomorrow."
- **Variants:** 
  - *Info:* Blue background/icon.
  - *Warning:* Orange background/icon.
  - *Error:* Red background/icon.

---

## 29. Empty State View

A dedicated view shown when a list or section has no content (e.g., "No symptoms logged today").

### Anatomy
- **Illustration:** A friendly, non-threatening graphic.
- **Title:** Clear statement of the state (e.g., "All clear!").
- **Subtitle:** Helpful guidance on what to do next.
- **Call to Action (Optional):** Button to create the first item (e.g., "Log a Symptom").
