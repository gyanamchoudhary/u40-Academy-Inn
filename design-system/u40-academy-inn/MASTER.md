# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** U40 Academy Inn
**Category:** Residential Science Coaching & Boys’ Hostel

---

## Global Rules

### Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Primary navy | `#071a2d` | Hero, Campus Life, dark sections |
| Primary blue | `#2046d8` | Links, CTAs, section accents |
| Accent lime | `#d9f66f` | Highlights, stats, active states |
| Background cream | `#f7f6f2` | Light section backgrounds |
| Background warm | `#f7f4ed` | Page wrapper, food section |
| Card white | `#ffffff` | Cards, form backgrounds |
| Text primary | `#111318` | Headings, body on light |
| Text secondary | `#60646c` | Descriptions, captions |
| Border | `rgba(17,19,24,0.15)` | Dividers, card borders |
| Muted | `#eef1ff` | Result highlight card |

### Typography

- **Heading Font:** Manrope (400–800)
- **Body / Mono Font:** Roboto Mono (400–600)
- **Mood:** disciplined, academic, editorial, modern
- **Google Fonts:** `https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Roboto+Mono:wght@400;500;600&display=swap`

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.25rem` (4px) | Tight gaps |
| `--space-sm` | `0.5rem` (8px) | Icon gaps |
| `--space-md` | `1rem` (16px) | Standard padding |
| `--space-lg` | `1.5rem` (24px) | Section inner gaps |
| `--space-xl` | `2rem` (32px) | Large gaps |
| `--space-2xl` | `3rem` (48px) | Section margins |
| `--space-3xl` | `4rem` (64px) | Hero padding |

### Radius

- Default radius: `0.25rem` (`4px`)
- Use `rounded-md` for buttons, inputs, cards.
- Avoid large radii (`rounded-2xl`, `rounded-full`) to maintain the editorial/brutalist feel.

---

## Component Specs

### Buttons

```css
.btn-primary {
  background: #2046d8;
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  font-weight: 700;
  transition: background 200ms ease;
}
.btn-primary:hover { background: #1737ae; }

.btn-accent {
  background: #d9f66f;
  color: #111318;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  font-weight: 700;
  transition: background 200ms ease;
}
.btn-accent:hover { background: #c7ea4e; }
```

### Cards

```css
.card {
  background: white;
  border: 1px solid rgba(17, 19, 24, 0.15);
  padding: 1.5rem;
}
```

### Inputs

```css
.input {
  height: 3rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: white;
  font-size: 1rem;
}
.input:focus { border-color: #2046d8; outline: none; }
```

---

## Style Guidelines

**Style:** Swiss Editorial / Brutalist-lite

**Keywords:** 12-column grid, rational spacing, high contrast, typographic hierarchy, restrained color, clear hierarchy

**Page Pattern:** Single-page scroll with anchored sections.

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — use Lucide SVG icons
- ❌ Missing `cursor:pointer` on clickable elements
- ❌ Large radii that break the editorial tone (`rounded-2xl`, `rounded-full` buttons)
- ❌ Low contrast text (maintain 4.5:1 minimum)
- ❌ Instant state changes — always use transitions (150–300ms)
- ❌ Invisible focus states
- ❌ Hard-coded `!important` CSS overrides

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use SVG/Lucide instead)
- [ ] All icons from a consistent icon set (Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150–300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Images served as WebP/AVIF with fallbacks and `srcset`
- [ ] Form labels explicitly associated with controls via `htmlFor`/`id`
- [ ] Privacy & Terms pages linked from footer
