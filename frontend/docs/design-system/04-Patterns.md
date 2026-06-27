# 04 - Patterns

Patterns combine multiple components to solve common user flows and scenarios. Following these patterns ensures the Bloom app feels cohesive and predictable.

## 1. Form & Data Entry

Maternal health apps require significant data input (symptoms, dates, weight).
- **Vertical Stacking:** Always stack labels above inputs. Do not use left-aligned labels on mobile to conserve horizontal space.
- **Keyboard Handling:** Ensure the currently focused input is always visible above the software keyboard. Use a "Done" button on number pads to allow dismissal.
- **Validation:** Validate on `blur` (when the user leaves the field) rather than on `change` to avoid prematurely showing error states while the user is still typing.

## 2. Onboarding Flow

The first impression of Bloom.
- **Value Proposition:** Use a 3-step Stepper to explain *why* the user needs the app before asking for data.
- **Gentle Profiling:** When asking for sensitive data (like expected due date or prior conditions), explain *why* we need it (e.g., "We use this to tailor your weekly health tips.").
- **Skip Options:** Allow users to skip non-essential setup steps and complete them later in their Profile.

## 3. Empty States & First Use

Do not show blank screens.
- When a user first opens the "Symptom Log" and it is empty, display an **Empty State View** featuring a calming illustration and a clear "Log your first symptom" CTA.

## 4. Destructive Actions

When an action results in data loss.
- Never use a single tap for a destructive action.
- Always trigger an **Action Sheet** or **Modal Dialog** asking for confirmation. 
- Highlight the destructive button in Danger Red.

## 5. Loading States

- **Initial Load:** Use a full-screen **Circular Spinner** or **Skeleton Loader** when fetching data for a new screen.
- **Submitting Data:** Change the submission button's label to a spinner. Disable the button to prevent duplicate submissions.
