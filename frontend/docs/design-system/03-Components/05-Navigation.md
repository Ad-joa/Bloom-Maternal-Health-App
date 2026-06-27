# Components: Navigation

Components that allow users to move between different screens and sections of the app.

## 30. Navigation Bar (Top Header)

Located at the top of the screen, providing context and top-level actions.

### Anatomy
- **Left Action:** Usually a Back button (chevron) or a Close button (X).
- **Title:** The name of the current screen (Headline style). If following large title patterns, this transitions from a Large Title into the nav bar upon scroll.
- **Right Action (Optional):** Contextual action (e.g., "Save", "Edit", or an Icon).

### Behavior
- On iOS, the background can have a subtle blur (translucent material) when content scrolls underneath it.

---

## 31. Tab Bar (Bottom Navigation)

The primary method for switching between top-level destinations in the app.

### Anatomy
- **Icons:** A set of 3-5 icons representing main sections (e.g., Home, Learn, Log, Profile).
- **Labels (Optional but recommended):** Caption 1 text below the icon for clarity.
- **Selected State:** Icon and text take the Primary color. Non-selected items are gray.

### Accessibility
- Provide a minimum hit area of `44x44pt` per tab.

---

## 32. Stepper / Wizard

Guides users through a multi-step process, such as onboarding or setting up their due date profile.

### Anatomy
- **Step Indicators:** Dots, numbers, or a continuous segmented progress bar at the top of the view.
- **Content Area:** The form or info for the current step.
- **Controls:** "Next" and "Back" buttons, usually pinned to the bottom of the screen.

### Usage
- Ensure users can save progress if the stepper is longer than 3 steps.
