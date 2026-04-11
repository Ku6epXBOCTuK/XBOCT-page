# Ethereal Silk Design System

### 1. Overview & Creative North Star
**Creative North Star: The Neon Nocturne**
Ethereal Silk is a high-density, editorial design system built for power users who value aesthetic precision. It rejects the "bulky" nature of modern web design in favor of a compressed, data-rich interface that feels like a custom command center. The system is defined by its deep ink-blue background, vibrant cyan highlights, and a sophisticated layering strategy that uses transparency and blur instead of traditional borders to create structure.

### 2. Colors
The palette is rooted in a dark, atmospheric core (#1a1c22) with high-fidelity cyan and azure accents.

- **The "No-Line" Rule:** Sectioning is achieved through background shifts (e.g., transitioning from `surface` to `surface-container-high`) or 8% white borders on glass panels. Never use 1px solid high-contrast borders for layout division.
- **Surface Hierarchy & Nesting:** Depth is created by nesting layers. A `surface` background contains `surface-container` panels, which may house `surface-container-highest` input fields.
- **The "Glass & Gradient" Rule:** Use `backdrop-filter: blur(12px)` with 70% opacity for primary containers. This allows the subtle background "silk" texture and ambient radial glows (Primary/5% and Secondary/5%) to bleed through, creating a sense of physical layering.
- **Signature Textures:** Incorporate subtle mix-blend-overlay textures on the base background to prevent "flat" digital voids.

### 3. Typography
The system uses **Inter** exclusively to maintain a technical, clean-room aesthetic. The rhythm is intentionally compact.

- **Display/Large Titles:** 1.125rem (18px) Bold. Used for the primary brand and major page headers.
- **Section Headers:** 0.75rem (12px) Bold, Uppercase with `tracking-wider`. This provides a clear structural anchor without taking up vertical real estate.
- **Body Text:** 0.875rem (14px). The workhorse size for all content, providing high readability at a compact scale.
- **Metadata/Labels:** 10px Bold, Uppercase. Used for supplementary info, versioning, and auxiliary stats.

### 4. Elevation & Depth
Elevation is not about "height" but about **Visual Clarity and Light**.

- **The Layering Principle:** Stack `surface-container` tiers to indicate importance. The "Glass Panel" effect is the highest level of interaction, visually floating above the base "silk" background.
- **Ambient Shadows:** Use a dual-shadow approach for floating elements: `0 4px 6px -1px rgba(0, 0, 0, 0.2)` combined with `0 2px 4px -1px rgba(0, 0, 0, 0.1)`. This creates a soft, grounded feel.
- **Glassmorphism:** Search bars and tooltips should use a "Ghost" background (`rgba(35, 38, 44, 0.4)`) with backdrop blur to maintain context of the underlying UI.

### 5. Components
- **Buttons (Primary):** Pill-shaped or small-radius (4px) blocks with high-contrast text (`on-primary`). 
- **Compact FAB:** A 40px circular button using the `primary` seed color, reserved for the single most important global action.
- **Bookmark Links:** Highly dense list items (py-1 px-1.5) that use `hover:bg-white/5` for a subtle, sophisticated interaction state.
- **Input Fields:** "Glass-search" style; borderless, using a darkened container color and active-state focus rings (`ring-primary/40`).
- **Cards:** Defined as "Glass Panels" with a 12px blur and a 1px `white/0.08` border.

### 6. Do's and Don'ts
- **Do** use `truncate` on text within small containers to maintain the rigid grid.
- **Do** use color-coded icons (Primary for headers, Secondary for list items) to aid scanability.
- **Don't** use standard "Material" roundedness (e.g., 8px-16px). Stick to 4px for components and 8px for containers to keep the technical feel.
- **Don't** increase the font size for more "breathing room." The Ethereal Silk system is intended to be dense and information-forward.
- **Do** use gradients sparingly, reserved for profile borders and specific "Focus" widget highlights.