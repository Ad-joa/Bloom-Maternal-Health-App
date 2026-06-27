# 01 - Principles

The Bloom Design System is rooted in the belief that the most successful and enduring designs are based on a deep understanding of how people think, feel, and interact with the world. For maternal health, this philosophy is not just a guideline; it is a mandate.

## Core Philosophy

Our design system is built upon four foundational pillars, directly inspired by Apple's Human Interface Guidelines but tailored for the unique, deeply personal journey of maternal health.

### 1. Empathy & Reassurance
Maternal health journeys are filled with profound emotions—from joy to anxiety. Our design must feel calming, supportive, and inherently trustworthy.
- **Do:** Use soft, reassuring color palettes and rounded, friendly typography.
- **Don't:** Use harsh, high-contrast alerts unless absolutely necessary for medical emergencies.
- **Example:** A symptom checker should gently ask for information rather than demanding it like a clinical form.

### 2. Clarity & Focus
Expecting mothers may be fatigued, overwhelmed, or seeking urgent guidance. Information must be highly legible, scannable, and clearly prioritized.
- **Do:** Embrace negative space (whitespace) to let content breathe.
- **Don't:** Clutter screens with multiple competing primary actions.
- **Example:** The daily advisory should feature one primary focal point, avoiding distractions.

### 3. Inclusivity & Accessibility
Bloom must be usable by everyone, regardless of their technical proficiency, physical state, or environment.
- **Do:** Support Dynamic Type so text can scale up for readability. Ensure a minimum touch target of `44x44pt` for all interactive elements.
- **Don't:** Rely on color alone to convey critical health information.
- **Example:** Error states must include an icon, a clear text description, and a semantic color change.

### 4. Delight & Celebration
Pregnancy is marked by milestones. The UI should subtly celebrate these moments to make the journey feel special.
- **Do:** Include micro-animations for completing tasks or entering a new trimester.
- **Don't:** Overwhelm the user with excessive animations that distract from core tasks.

## Accessibility Mandates
- **Contrast:** Text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text).
- **Touch Targets:** All tap targets must be at least `44x44pt` with an `8pt` gap between targets.
- **Screen Readers:** All components must have meaningful `accessibilityLabel`, `accessibilityHint`, and `accessibilityRole` properties.
- **Motion:** Respect the user's OS-level "Reduce Motion" settings.
