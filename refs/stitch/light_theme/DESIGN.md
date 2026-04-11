# Ethereal Glass Design System

## 1. Overview & Creative North Star
**Creative North Star: The Atmospheric Curator**

Ethereal Glass is a design system built for high-density information environments that need to feel light, expansive, and sophisticated. It rejects the heavy, modular "block" aesthetic of traditional dashboards in favor of a layered, translucent interface. By leveraging glassmorphism and multi-layered radial gradients, the system creates an environment where content appears to float in a semi-opaque space. 

The core philosophy is "Clarity through Depth." We break the grid not with chaos, but with subtle overlaps, varying levels of blur, and high-contrast typographic anchors that provide a rhythmic hierarchy.

## 2. Colors
The palette is rooted in cold, atmospheric blues and greys (`#e2ebf1`, `#005a7b`), creating a clinical yet inviting workspace.

- **The "No-Line" Rule:** Sectioning is strictly prohibited from using 1px solid high-contrast borders. Instead, boundaries must be defined by:
    - Background shifts (e.g., transitioning from `background` to `surface-container`).
    - Subtle 10% opacity black separators.
    - Inset white highlights (1px white at 50% opacity) on top edges to simulate glass thickness.
- **Surface Hierarchy:** Use `surface-container-lowest` for the main canvas cards and `surface-bright` for floating interactive search bars.
- **Glass & Gradient Rule:** Interactive panels must use `backdrop-filter: blur(24px)` with a semi-transparent base (`rgba(237, 243, 247, 0.85)`). Hero sections should utilize "Mesh Gradients" — multiple overlapping radial gradients — to provide tonal depth without structural clutter.

## 3. Typography
The system uses **Inter** across all levels, relying on weight and tracking rather than font switching to create hierarchy.

- **Display & Large Titles:** `1.125rem` (18px) Bold. Used for the primary "Curator's Hub" and Brand identification.
- **Body Standard:** `0.875rem` (14px). This is the workhorse size for all navigation and primary links.
- **Label & Utility:** `10px` (approx 0.625rem). Used for metadata, uppercase category headers, and weather stats.
- **Rhythm:** Category headers utilize `tracking-wider` (letter spacing) and uppercase styling to distinguish themselves from actionable links at the same point size.

## 4. Elevation & Depth
Elevation is expressed through light refraction and soft, atmospheric shadows rather than "distance" from the page.

- **Ambient Shadows:** 
    - *Default State:* `0 4px 6px -1px rgba(0, 0, 0, 0.05)`.
    - *Hover State:* `0 10px 15px -3px rgba(0, 0, 0, 0.08)`.
- **The Stacking Principle:** Depth is achieved by nesting `surface-container` tiers. A glass panel (Level 1) can contain secondary list items that highlight with a `black/5` background on hover (Level 2).
- **Glassmorphism:** All floating components must implement `backdrop-filter: blur(24px) saturate(180%)` to maintain legibility over the complex mesh gradient background.
- **Internal Reflection:** Use a 1px inset top-border (`rgba(255, 255, 255, 0.5)`) on all cards to create a "beveled glass" effect.

## 5. Components
- **Glass Panels:** Rounded at `0.5rem`. Used for grouping related bookmarks or tools. Includes a 1px border at `primary/15` opacity.
- **Bookmark Links:** Interactive rows with an `0.2s` cubic-bezier transition. Use 18px icons but 12px text to maintain a "Compact Professional" density.
- **Glass Search:** A `blur(12px)` variant of the glass panel, specifically for inputs, featuring a 1px ring focus state in `primary/40`.
- **Primary FAB:** A high-contrast circular button (`#005a7b`) with a `shadow-lg` and `hover:scale-110` animation for the primary action.
- **Integrated Widgets:** Use `md:col-span-2` for horizontal emphasis, creating an asymmetrical rhythm in the grid.

## 6. Do's and Don'ts
- **Do:** Use semantic icons (Material Symbols) at a reduced size (18px) to match the fine-print aesthetic.
- **Do:** Use `selection:bg-primary/30` to ensure even the text selection feels branded and ethereal.
- **Don't:** Use solid, opaque colors for large cards; it breaks the atmospheric depth of the mesh background.
- **Don't:** Use sharp 90-degree corners. Even in a "Professional" setting, the `0.5rem` radius is necessary to soften the glass edges.
- **Do:** Ensure text contrast. With semi-transparent backgrounds, use `on-surface` (`#191c1e`) for maximum readability.