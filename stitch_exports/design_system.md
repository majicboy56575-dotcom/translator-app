---
name: Linguistic Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
---

## Brand & Style
The design system is engineered for a high-utility mobile translation experience where speed and clarity are paramount. The brand personality is **Professional, Efficient, and Accessible**, positioning the app as a reliable tool for both travelers and professionals. 

The visual style follows a **Modern Corporate** aesthetic with a lean toward **Minimalism**. By utilizing generous whitespace and a restricted color palette, the interface recedes to let the content—the translated text—take center stage. Depth is achieved through subtle tonal layering rather than complex shadows, ensuring the UI feels lightweight and fast-paced.

## Colors
This design system utilizes a high-contrast functional palette. 
- **Direct Blue (#3B82F6)** serves as the primary action color, used for CTA buttons, active states, and focus indicators.
- **Slate Grays** are tiered to provide hierarchy: `#0F172A` for headlines, `#475569` for body text, and `#64748B` for secondary metadata or disabled states.
- **Soft Off-Whites** define the environment. The background uses `#F8FAFC` to reduce eye strain compared to pure white, while interactive surfaces use pure `#FFFFFF` to create a clear "raised" distinction.
- **Success Green (#10B981)** is reserved for "Copied to Clipboard" confirmations or successful voice input detection.

## Typography
**Inter** is the sole typeface for the design system. It is chosen for its exceptional legibility at small sizes and its neutral, systematic tone. 

- **Translation Text:** Use `body-lg` or `headline-sm` for the primary translation input and output areas to ensure comfortable reading.
- **Hierarchy:** Use font weight rather than color to distinguish between primary and secondary information where possible.
- **Readability:** For long-form translations, maintain a line height of at least 1.5x the font size to prevent text crowding.

## Layout & Spacing
The design system employs a **Fluid Grid** model designed specifically for mobile-first constraints. 

- **Safe Margins:** A 20px horizontal margin is maintained on all screens to prevent content from touching the edges of the device.
- **Spacing Scale:** A 4px baseline grid ensures consistent vertical rhythm. Components are typically separated by `md` (16px) or `lg` (24px) units.
- **Touch Targets:** All interactive elements (buttons, language switchers) must maintain a minimum height of 48px to ensure accessibility for all users.

## Elevation & Depth
Depth in this design system is communicated through **Tonal Layers** and extremely soft shadows. 

- **Level 0 (Background):** `#F8FAFC` - The base canvas.
- **Level 1 (Cards/Surfaces):** `#FFFFFF` - Used for input areas and translation result containers. These use a very subtle shadow (0px 2px 4px rgba(15, 23, 42, 0.05)) to separate them from the background.
- **Level 2 (Modals/Popovers):** `#FFFFFF` - These use a more pronounced, diffused shadow (0px 10px 15px rgba(15, 23, 42, 0.1)) to indicate they are temporary overlays.
- **Active State:** Elements like buttons do not use depth for interaction; instead, they use color shifts (darkening by 10% on tap).

## Shapes
The shape language is defined by **Medium Roundedness**. 
- Base components (buttons, input fields) use a radius of **12px**.
- Container elements (translation cards) use a radius of **16px**.
- Small decorative elements (chips, labels) use a radius of **8px**.

This approach balances the professional nature of the app with a friendly, approachable tactile feel. Hard 90-degree corners are strictly avoided.

## Components
- **Buttons:** Primary buttons are solid `#3B82F6` with white text. Secondary buttons use a light slate ghost-style border or a soft gray background.
- **Input Fields:** Use large, clear text areas with no visible borders, instead relying on the white surface background and subtle internal padding (16px) to define the area.
- **Language Chips:** Rounded pills used for selecting "From" and "To" languages. They should feature a small downward chevron to indicate interactivity.
- **Lists:** Clean, borderless list items with 1px slate-100 dividers. Use `body-md` for primary list text.
- **Translation Cards:** The centerpiece of the UI. Use a white surface with 16px corner radius. The input (source language) and output (target language) should be clearly separated by a thin horizontal rule or distinct tonal backgrounds.
- **Floating Action Button (FAB):** For voice translation, use a circular button with the primary color and a high-contrast microphone icon.