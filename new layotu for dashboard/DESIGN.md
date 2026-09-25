---
name: Material Technical Learning
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1c'
  on-surface-variant: '#424654'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#737785'
  outline-variant: '#c3c6d6'
  surface-tint: '#0856cf'
  primary: '#0041a2'
  on-primary: '#ffffff'
  primary-container: '#0b57d0'
  on-primary-container: '#ced9ff'
  inverse-primary: '#b2c5ff'
  secondary: '#00639b'
  on-secondary: '#ffffff'
  secondary-container: '#7ec1ff'
  on-secondary-container: '#004f7d'
  tertiary: '#005320'
  on-tertiary: '#ffffff'
  tertiary-container: '#096e2f'
  on-tertiary-container: '#93ee9f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a1'
  secondary-fixed: '#cee5ff'
  secondary-fixed-dim: '#96cbff'
  on-secondary-fixed: '#001d33'
  on-secondary-fixed-variant: '#004a76'
  tertiary-fixed: '#9cf7a7'
  tertiary-fixed-dim: '#81da8d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#fcf9f8'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Roboto Flex
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  display-md:
    fontFamily: Roboto Flex
    fontSize: 45px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: 0px
  headline-lg:
    fontFamily: Roboto Flex
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0px
  headline-lg-mobile:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0px
  headline-md:
    fontFamily: Roboto Flex
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
    letterSpacing: 0px
  headline-sm:
    fontFamily: Roboto Flex
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0px
  title-lg:
    fontFamily: Roboto Flex
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0px
  title-md:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.15px
  title-sm:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  body-lg:
    fontFamily: Roboto Flex
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  body-sm:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.4px
  label-lg:
    fontFamily: Roboto Flex
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Roboto Flex
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Roboto Flex
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an advanced technical education environment built on Material Design 3 principles. Tailored for graduate students, cloud engineers, and technical researchers, it balances intellectual rigor with Google's welcoming clarity. 

The aesthetic is characterized by tonal surface nesting, generous whitespace, disciplined layout structures, and refined micro-interactions. Surfaces do not rely on harsh skeletal boundaries; instead, subtle tonal shifts define hierarchy, paired with pill-shaped interactive anchors and rounded container forms. The interface remains calm and focused during deep technical tasks such as cloud architecture configuration, distributed systems analysis, and interactive code sandboxes.

## Colors

The color palette reflects modern Material Design 3 tonal architecture, centered on iconic Google primaries recalibrated for prolonged technical focus.

### Surface Tiers & Neutral Scales
- **Surface Canvas (Background):** `#f8fafd` — High-clarity, cool neutral base for the primary canvas.
- **Surface Container Lowest:** `#ffffff` — Reserved for code editors, elevated data tables, and high-focus content modules.
- **Surface Container Low:** `#f0f4f9` — Standard neutral card background for content modules and course units.
- **Surface Container (Default):** `#e9eef6` — Sub-panels, docked side navigations, and search fields.
- **Surface Container High:** `#dde3ea` — Hovered containers, inactive tab groups, and secondary card containers.
- **Surface Container Highest:** `#d3dbdc` — Subtle dividers, structural wells, and tertiary groupings.
- **On-Surface (Primary Text):** `#1f1f1f` — High-contrast text meeting strict AAA readability standards.
- **On-Surface Variant (Secondary Text):** `#444746` — Structural labels, metadata, and non-active icons.
- **Outline:** `#747775` — Strong component borders, active input boundaries.
- **Outline Variant:** `#c4c7c5` — Subtle dividers and card separation lines.

### Functional & Semantic Accents
- **Primary Accent (`#0b57d0`):** Core action driver, prominent state indication, active tabs, and primary action buttons.
- **Primary Container (`#d3e3fd`):** Fill for active navigation rail items, selected chips, and contextual highlights; text paired with `#041e49`.
- **Success / Tertiary (`#137333`):** Lab completed, build passing, active terminal status. Container: `#c4eed0` paired with `#072711`.
- **Warning (`#b06000`):** Quota limits, cloud resource consumption warnings, deprecation notes. Container: `#ffe088` paired with `#2a1700`.
- **Error / Destructive (`#b3261e`):** Failed code tests, disconnected clusters, validation errors. Container: `#f9dedc` paired with `#410e0b`.

## Typography

The typographic hierarchy utilizes `Roboto Flex` across headlines, titles, body, and labels. Its variable mechanical neutrality delivers the clear, accessible structure expected in Material 3 learning platforms.

- **Headlines & Titles:** Set with open tracking and balanced optical weights (400 for structural scale, 500 for focal hierarchy). Headlines remain uncrowded, pairing with ample whitespace to let academic modules breathe.
- **Body:** Standard text runs at 16px (`body-lg`) and 14px (`body-md`), optimized for scanning long-form documentation, system architecture explainers, and multi-paragraph exercise prompts.
- **Labels:** Rendered in medium weights (500) to maintain crisp legibility on pills, button tags, category badges, and tabs.

## Layout & Spacing

The layout is built on an adaptive 8pt baseline rhythm, using fluid grid dynamics anchored by persistent navigational structures.

### Grid & Layout Structure
- **Desktop (1200px+):** 12-column fluid layout with an 80px collapsed or 256px expanded Material navigation rail. Inner margins set to `2rem` (`margin`), column gutters at `1.5rem` (`gutter`).
- **Tablet (600px - 1199px):** 8-column responsive grid with a collapsed 80px navigation rail. Outer margins adapt to `1.5rem`, gutters to `1rem` (`gutter-sm`).
- **Mobile (<600px):** 4-column single-stream grid with bottom bar navigation. Canvas margins compress to `1rem` (`margin-sm`), gutters to `1rem`.

### Internal Spacing Application
- `space-xs` (4px): Micro-gaps between status dots and text labels, inline badge icons.
- `space-sm` (8px): Icon-to-text spacing in buttons and chips, vertical item gap in list items.
- `space-md` (16px): Internal padding for interactive cards, text field insets, segmented button padding.
- `space-lg` (24px): Primary padding for curriculum cards, lab console panels, dialogue containers.
- `space-xl` (32px): Vertical distance separating curriculum modules, milestone section headers, and data visualization grids.

## Elevation & Depth

This design system uses Material 3 tonal elevation: depth is communicated primarily through stacked surface container colors, supplemented by soft, tinted ambient shadows for floating or transient elements.

### Tonal Elevation Levels
- **Level 0 (Flat):** Surface Canvas (`#f8fafd`). Used for main page background. No shadow.
- **Level 1 (Subtle Stack):** Surface Container Low (`#f0f4f9`). Default for static cards, module panels, code walkthrough steps. No shadow or borderless outline variant (`#c4c7c5` at 50% opacity).
- **Level 2 (Interactive Floating):** Surface Container (`#e9eef6`) + shadow: `0 1px 3px 1px rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.12)`. Applied to hovered cards, elevated buttons, and dock drawers.
- **Level 3 (Overlays & Dialogs):** Surface Container High (`#dde3ea`) + shadow: `0 4px 8px 3px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.12)`. Applied to menus, dropdown pickers, floating action bars, and modal dialogs.

### State Layers
State changes use tinted semi-transparent overlays on top of base container colors:
- **Hover:** 8% opacity tint of the element's foreground color.
- **Focus:** 10% opacity tint + 2px offset outline.
- **Pressed:** 12% opacity tint.
- **Dragged:** 16% opacity tint with Level 3 elevation.

## Shapes

The shape hierarchy follows Material 3 geometric scales, balancing rounded structural panels with organic pill-shaped touchpoints:

- **Full Pill (`9999px`):** Buttons, search bars, filter chips, category tags, avatar status pills, and active indicator pills inside navigation rails.
- **Large Panels & Cards (`rounded-2xl` / 16px - 24px):** Course modules, sandbox terminals, video frames, and dashboard metrics.
- **Medium Inputs (`rounded-lg` / 8px - 12px):** Form text fields, code snippets, dropdown menus, and popovers.
- **Small Badges (`rounded-md` / 4px - 6px):** Keyboard shortcut tags, inline compiler version chips, and technical diff markers.

## Components

### Buttons
- **Filled Button:** Height 40px, full pill shape (`rounded-full`), background `#0b57d0`, text `#ffffff` (`label-lg`). Hover displays 8% white state layer.
- **Tonal Button (Filled Tonal):** Background `#d3e3fd`, text `#041e49`. Used for secondary actions (e.g., "Reset Code Sandbox", "View Documentation").
- **Outlined Button:** Border 1px solid `#747775`, transparent fill, text `#0b57d0`. Hover triggers `#0b57d0` at 8% fill.
- **Icon Button:** 40x40px touch target, 24px icon. Unfilled or filled tonal for toolbars.

### Search Pill Bar (Workspace Pattern)
- Unified search bar centered in the top app bar: 48px height, full pill shape (`rounded-full`), background `#e9eef6`, no border in default state.
- Focus switches surface to `#ffffff` with Level 2 elevation and 1px `#0b57d0` boundary. Leading 20px search icon, trailing clear and keyboard hint (`Ctrl+K`) chips.

### Chips & Filter Tabs
- **Filter Chips:** 32px height, full pill radius, 1px solid `#c4c7c5` border. Selected state swaps to filled container `#d3e3fd`, text `#041e49`, leading checkmark icon.
- **Assist & Suggestion Chips:** 32px height, tonal surface container (`#f0f4f9`), no border, paired with leading icon.

### Form Inputs
- **Outlined Text Field:** 56px height, 8px border radius, resting border 1px `#747775`. On focus, border becomes 2px `#0b57d0` with floating label transitioning into the top outline cut.
- Container padding is `16px` horizontally. Helper text in `body-sm` sits 4px below the boundary.

### Selection Controls
- **Checkboxes:** 18x18px box with 2px rounded corners. Inactive has 2px stroke of `#747775`; checked has `#0b57d0` solid fill with white checkmark.
- **Radio Buttons:** 20px outer circle, 2px border `#747775`. Selected displays `#0b57d0` border with a 10px inner solid circle dot.
- **Switch:** 32px height by 52px width pill track. Active track `#0b57d0` with white circular thumb (24px) sliding right.

### Cards & Learning Containers
- **Elevated Card:** Built on `#ffffff` over `#f8fafd` background, 16px to 24px corner radius, padding `space-lg` (24px), Level 1 tonal container with smooth Level 2 elevation on pointer hover.
- **Outlined Technical Card:** Used for code samples and lab steps. Background `#f0f4f9`, border 1px solid `#e1e3e1`, zero shadow.

### Domain-Specific Components
- **Code Terminal Module:** Dark-mode inverted slate block inside technical cards (`#1e1f20`), rounded-xl (12px), monospace font, copy-to-clipboard pill button pinned to top-right.
- **Skill Progress Indicator:** 8px track height, fully rounded pill ends. Track fill `#e9eef6`, active fill `#0b57d0`. Accompanied by percentage label in `label-sm`.
- **Top App Bar with Identity Ring:** 64px height, background `#f8fafd`. Features brand identity mark, center search pill, right-side utility icons (documentation, notifications), and Google user avatar with active multi-color account ring.