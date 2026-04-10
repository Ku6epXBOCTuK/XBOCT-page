# Design System Specification: Light-Phase Glassmorphism

## 1. Overview & Creative North Star: "The Ethereal Curator"
This design system is built on the philosophy of **"The Ethereal Curator."** It rejects the heavy, boxed-in nature of traditional web interfaces in favor of a breathable, airy, and high-fidelity editorial experience. The goal is to make the UI feel less like a software interface and more like a curated gallery where content floats within a luminous, pressurized environment.

**The Creative North Star** focuses on three pillars:
*   **Luminous Depth:** Utilizing light-mode glassmorphism to create a sense of physical space.
*   **Intentional Asymmetry:** Breaking the "bootstrap" grid by using negative space as a functional element.
*   **The "Invisible" Container:** Defining boundaries through light refraction and tonal shifts rather than lines.

---

## 2. Colors & Surface Architecture

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Boundaries must be defined through **Background Color Shifts** or **Tonal Layering**. Use `surface` as your base canvas and `surface-container-low` for large structural sections. 

### Surface Hierarchy & Nesting
Instead of a flat layout, treat the UI as a stack of fine, semi-transparent sheets. 
*   **Base Layer:** `surface` (#f5f6f7)
*   **Structural Sections:** `surface-container-low` (#eff1f2)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff)
*   **Elevated Overlays:** `surface-bright` (#f5f6f7) with 80% opacity and a 20px backdrop-blur.

### The "Glass & Gradient" Rule
To inject "soul" into the interface, the **Primary Accent** (`primary`: #00618f) should rarely be used as a flat block. Instead, use a subtle linear gradient:
*   **Signature CTA:** Gradient from `primary` (#00618f) to `primary_container` (#00affe) at a 135-degree angle.
*   **Vibrancy:** Use `tertiary_container` (#b2a5ff) as a soft glow background behind high-priority glass elements to create a sophisticated prismatic effect.

---

## 3. Typography: Editorial Authority
We use **Inter** not just for legibility, but as a structural tool. The system relies on a high-contrast scale to create an editorial feel.

*   **Display (lg/md):** Reserved for "Hero Moments." Use `on-surface` with -0.02em letter spacing. These should often be center-aligned or intentionally offset to the far left to create asymmetrical tension.
*   **Headline (sm/md):** Use `primary` for headlines to guide the eye quickly to new sections.
*   **Body (lg):** The workhorse. Maintain a generous line-height (1.6) to ensure the "Airy" aesthetic remains intact.
*   **Label (sm/md):** Always in `on-surface-variant`. Use these for metadata, ensuring they never compete with headlines.

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Depth is achieved by stacking. Place a `surface-container-lowest` card (Pure White) on top of a `surface-container-low` section (Soft Grey). The 0.5rem (ROUND_EIGHT) corner radius ensures the "object" feels friendly yet precise.

### Ambient Shadows
When an element must float (e.g., a dropdown or modal), use an **Ambient Shadow**:
*   **Color:** `on-surface` at 6% opacity.
*   **Blur:** 40px to 60px.
*   **Spread:** -5px.
*   **Note:** Shadows should feel like a soft hum, not a dark silhouette.

### The "Ghost Border" Fallback
If contrast is legally required for accessibility, use the `outline-variant` (#abadae) at **15% opacity**. This creates a "suggestion" of a border that disappears into the glass effect.

---

## 5. Components

### Buttons
*   **Primary:** Gradient (Primary to Primary-Container). No border. White text (`on-primary`).
*   **Secondary:** `secondary-container` background with `on-secondary-container` text.
*   **Glass Variant (Tertiary):** Background of `surface-container-lowest` at 40% opacity + `backdrop-blur` (12px).

### Input Fields
*   **Style:** Minimalist. No bottom line or full box. Use a `surface-container-highest` background with a subtle `outline-variant` (10% opacity) "Ghost Border." 
*   **State:** On focus, the background transitions to `surface-container-lowest` with a 2px `primary` outer glow.

### Cards & Lists
*   **The Divider Ban:** Do not use line dividers between list items. Use **8px or 16px vertical white space** or a subtle hover state shift to `surface-container-high`.
*   **Glass Cards:** For featured content, use a `surface-container-lowest` card with 60% opacity, a 16px backdrop blur, and a 1px "Ghost Border" at 10% opacity.

### Navigation (The Floating Dock)
Instead of a fixed top bar, use a floating navigation dock.
*   **Background:** `surface-container-lowest` at 70% opacity.
*   **Blur:** 24px.
*   **Shadow:** Ambient Shadow (4% opacity).

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `primary-fixed-dim` for small icons to keep them vibrant but legible.
*   **Do** use asymmetrical margins (e.g., 10% left margin, 20% right margin) for editorial layouts.
*   **Do** nest containers to create hierarchy (Surface > Container-Low > Container-Lowest).

### Don't:
*   **Don't** use 100% black (#000000) for text. Always use `on-surface` (#2c2f30) to maintain the soft, premium feel.
*   **Don't** use "Drop Shadows" on flat buttons.
*   **Don't** use dividers. If the content feels cluttered, increase the `spacing-scale` rather than adding a line.
*   **Don't** use more than one glassmorphic element in the same visual cluster; it creates "blur fatigue." Pick one hero element to be "glass" and let the others be "matte" (`surface-container`).

---

## 7. Tokens Reference

| Role | Token Value | Usage |
| :--- | :--- | :--- |
| **Canvas** | `surface` (#f5f6f7) | The base background of the application. |
| **Structural Split** | `surface-container-low` (#eff1f2) | For sidebars or secondary content areas. |
| **The "Sheet"** | `surface-container-lowest` (#ffffff) | Main content cards and interactive surfaces. |
| **Call to Action** | `primary` (#00618f) | Primary buttons and high-level headers. |
| **Accent Glow** | `tertiary-container` (#b2a5ff) | Background highlights and soft semantic grouping. |
| **Boundary** | `outline-variant` (15% Opacity) | Only for "Ghost Borders" where required. |
| **Radius** | `0.5rem` (8px) | Applied to all interactive containers. |