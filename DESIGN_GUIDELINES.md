# StyleK Design Guidelines

## Brand Identity

**Brand Name:** StyleK  
**Tagline:** "Platform untuk menghubungkan brand dengan creator"  
**Mission:** Bringing brands and creators together for seamless collaborations

---

## Color Palette

*Inspired by soft pastel aesthetics with warm, inviting tones*

### Primary Colors
- **Primary Blue (Soft):** `#8BB3E8` (rgb(139, 179, 232)) - Light sky blue
  - Used for: Primary CTAs, links, active states, product accents
  - Foreground: White (`#ffffff`) or dark text for contrast
- **Primary Purple (Soft):** `#B8A9D9` (rgb(184, 169, 217)) - Light lavender
  - Used for: Secondary accents, speech bubbles, decorative elements
  - Complements: Works beautifully with soft blue

### Accent Colors
- **Soft Pink:** `#F5C2D1` (rgb(245, 194, 209)) - Light rose pink
  - Used for: Social media icons, highlights, warm accents
- **Peach/Beige:** `#F5E6D3` (rgb(245, 230, 211)) - Warm peach beige
  - Used for: Backgrounds, warm base tones
- **Darker Peach:** `#E8D4C1` (rgb(232, 212, 193)) - Richer peach
  - Used for: Background variations, depth

### Semantic Colors
- **Success:** `#A8D5BA` (Soft mint green) - Success states, confirmations
- **Warning:** `#F5D5A3` (Soft amber) - Warnings, pending states
- **Destructive:** `#F5A3A3` (Soft coral red) - Errors, destructive actions

### Neutral Colors
- **Background:** Warm white/cream `#FEFBF7` (rgb(254, 251, 247)) or pure white `#FFFFFF`
- **Foreground:** Soft dark `#4A4A4A` (rgb(74, 74, 74)) - Readable but not harsh
- **Muted Background:** `#F5F0EB` (rgb(245, 240, 235)) - Warm light beige
- **Muted Foreground:** `#8B8B8B` (rgb(139, 139, 139)) - Soft gray
- **Border:** `#E8E0D8` (rgb(232, 224, 216)) - Warm light beige border

### Gradient Options (For Landing Page)
- **Primary Gradient:** Soft Blue to Soft Purple (`#8BB3E8` → `#B8A9D9`)
- **Hero Gradient:** Warm peach to soft pink (`#F5E6D3` → `#F5C2D1`)
- **CTA Gradient:** Soft blue-purple (`#8BB3E8` → `#B8A9D9`)
- **Background Gradient:** Subtle warm tones (`#FEFBF7` → `#F5E6D3`)

### Color Usage Guidelines
- **Maintain Softness:** All colors should feel gentle and inviting
- **Warm Base:** Use peach/beige tones for backgrounds to create warmth
- **Pastel Accents:** Use soft blues, purples, and pinks for interactive elements
- **Contrast:** Ensure text remains readable (minimum 4.5:1 ratio) even with softer colors
- **Harmony:** Colors should work together harmoniously, creating a cohesive, friendly aesthetic

---

## Typography

### Font Family
- **Primary:** Inter, system-ui, -apple-system, sans-serif
- **Monospace:** Geist Mono (for code)

### Font Sizes
- **Hero Title:** 4rem - 5rem (64px - 80px) - Bold, Extra Bold
- **Section Title:** 2.5rem - 3rem (40px - 48px) - Bold
- **Subsection Title:** 1.875rem - 2rem (30px - 32px) - Semibold
- **Body Large:** 1.125rem (18px) - Regular
- **Body:** 1rem (16px) - Regular
- **Body Small:** 0.875rem (14px) - Regular
- **Caption:** 0.75rem (12px) - Regular

### Font Weights
- **Light:** 300
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700
- **Extra Bold:** 800

### Line Heights
- **Tight:** 1.2 (for headings)
- **Normal:** 1.5 (for body text)
- **Relaxed:** 1.75 (for large paragraphs)

---

## Spacing & Layout

### Container Widths
- **Full Width:** 100vw
- **Container:** max-width 1280px (7xl)
- **Content Padding:** 1rem (mobile) → 2rem (tablet) → 3rem (desktop)

### Spacing Scale (Tailwind)
- **xs:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)
- **2xl:** 3rem (48px)
- **3xl:** 4rem (64px)
- **4xl:** 6rem (96px)

### Section Spacing
- **Section Padding (Vertical):** 4rem - 6rem (mobile) → 6rem - 8rem (desktop)
- **Element Gap:** 1.5rem - 2rem

---

## Border Radius

- **Small:** 0.25rem (4px) - Small elements, badges
- **Medium:** 0.375rem (6px) - Buttons, inputs
- **Large:** 0.5rem (8px) - Cards, containers
- **XL:** 0.75rem (12px) - Large cards, hero sections
- **2XL:** 1rem (16px) - Special containers

---

## Shadows

- **sm:** `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **default:** `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **md:** `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **lg:** `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **xl:** `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`

---

## Components

### Buttons

#### Primary Button
- **Background:** Soft blue-purple gradient (`#8BB3E8` → `#B8A9D9`) or solid soft blue
- **Text:** White or soft dark (`#4A4A4A`) for contrast
- **Padding:** `h-10 px-4 py-2` (default) or `h-12 px-6` (large)
- **Border Radius:** `rounded-lg` (0.5rem) or `rounded-xl` (0.75rem) for softer feel
- **Hover:** Slightly darker shade or increased saturation
- **Shadow:** Soft, subtle shadow for depth

#### Secondary Button
- **Background:** Transparent or warm white
- **Border:** 1px solid soft blue (`#8BB3E8`) or soft purple (`#B8A9D9`)
- **Text:** Soft blue or soft purple
- **Hover:** Light background tint (`#F5F0EB`)

#### Ghost Button
- **Background:** Transparent
- **Text:** Soft foreground color
- **Hover:** Warm muted background (`#F5F0EB`)

### Cards
- **Background:** Warm white (`#FEFBF7`) or pure white with warm tint
- **Border:** 1px solid warm border (`#E8E0D8`)
- **Border Radius:** `rounded-xl` (0.75rem) or `rounded-2xl` (1rem) for softer appearance
- **Shadow:** Soft, warm shadow (`shadow-sm` with warm tone)
- **Padding:** `p-6`
- **Hover:** Subtle lift with warmer shadow

---

## Landing Page Structure

### Hero Section
- **Height:** Full viewport height (100vh) or min-height 600px
- **Layout:** Split layout (text left, images right) or centered
- **Background:** Warm peach-beige gradient (`#FEFBF7` → `#F5E6D3`) or soft pastel gradient
- **CTA Buttons:** Soft blue-purple gradient button + Secondary outline button with soft colors
- **Tone:** Warm, inviting, friendly aesthetic matching the illustration style

### Features Section
- **Layout:** Grid (1 col mobile → 2-3 col desktop)
- **Card Style:** Clean, minimal with icons
- **Spacing:** Consistent gaps between cards

### How It Works Section
- **Layout:** Horizontal steps or vertical timeline
- **Visual:** Icons or illustrations
- **Numbering:** Clear step indicators

### CTA Section
- **Background:** Primary color or gradient
- **Text:** White
- **Buttons:** Contrasting style (outline if on colored background)

---

## Responsive Breakpoints

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md, lg)
- **Desktop:** > 1024px (xl, 2xl)

### Mobile-First Approach
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)

---

## Animation & Transitions

### Transitions
- **Default Duration:** 150ms - 300ms
- **Easing:** `ease-in-out` or `ease-out`
- **Properties:** Colors, opacity, transform

### Hover Effects
- **Buttons:** Slight scale (1.02) or color change
- **Cards:** Lift effect (shadow increase, slight translate)
- **Links:** Underline animation

### Scroll Animations
- **Fade In:** On scroll into viewport
- **Slide Up:** Subtle upward motion
- **Stagger:** Sequential animation for lists

---

## Accessibility

### Color Contrast
- **Text on Background:** Minimum 4.5:1 ratio
- **Large Text:** Minimum 3:1 ratio
- **Interactive Elements:** Clear focus states

### Focus States
- **Outline:** 2px solid primary color
- **Offset:** 2px from element
- **Visible:** Always visible, never remove

### Keyboard Navigation
- **Tab Order:** Logical flow
- **Skip Links:** For main content
- **ARIA Labels:** For icon-only buttons

---

## Image Guidelines

### Hero Images
- **Aspect Ratio:** 16:9 or 4:3
- **Format:** WebP or optimized JPG/PNG
- **Size:** Optimized for web (< 500KB)
- **Style:** Rounded corners (0.75rem - 1rem)

### Avatar/Profile Images
- **Size:** 40px - 80px (circular)
- **Border:** Optional subtle border

---

## Content Guidelines

### Headlines
- **Tone:** Clear, benefit-focused
- **Length:** Short and punchy (3-8 words)
- **Style:** Sentence case or Title Case

### Body Text
- **Tone:** Friendly, professional
- **Length:** 2-3 sentences per paragraph
- **Style:** Clear, concise

### CTAs
- **Text:** Action-oriented verbs
- **Examples:** "Get Started", "Join as Creator", "Join as Brand"
- **Clarity:** Clear about what happens next

---

## Dark Mode (Future)

When implementing dark mode:
- **Background:** Dark slate (`rgb(15, 23, 42)`)
- **Foreground:** Light gray/white
- **Borders:** Subtle dark borders
- **Maintain:** Same contrast ratios

---

## Implementation Notes

- Use Tailwind CSS utility classes
- Follow existing component patterns (shadcn/ui)
- Maintain consistency with app design
- Test on multiple devices and browsers
- Optimize for performance (lazy load images, code splitting)

