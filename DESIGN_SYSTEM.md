# 🎨 UI/UX Design System Guide

## 📐 Design Principles

- **Dark Modern Theme** - Professional dark UI
- **Minimalist** - Clean, uncluttered interface
- **Accessible** - Good contrast ratios
- **Responsive** - Works on all devices
- **Consistent** - Unified design language

---

## 🎨 Color Palette

```
Primary Colors:
  Blue:          #3b82f6 (Primary actions)
  Dark Blue:     #2563eb (Hover state)
  
Background:
  Darkest:       #0f172a (Main background)
  Dark:          #1e293b (Secondary background)
  
Borders/Elements:
  Border:        #334155 (Borders, dividers)
  Hover:         #475569 (Hover background)
  
Text:
  Primary:       #f1f5f9 (Main text)
  Secondary:     #cbd5e1 (Secondary text)
  Muted:         #94a3b8 (Muted text, icons)
  
Status:
  Success:       #10b981 (Online, success)
  Danger:        #ef4444 (Delete, errors)
  Warning:       #f59e0b (Warnings)
```

---

## 📐 Spacing System

```
px-2 = 0.5rem = 8px
px-3 = 0.75rem = 12px
px-4 = 1rem = 16px

p-2 = 8px
p-3 = 12px
p-4 = 16px

gap-1 = 4px
gap-2 = 8px
gap-3 = 12px
gap-4 = 16px
```

---

## 🔤 Typography

```
Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

Sizes:
  Body:        0.95rem (15px)
  Small:       0.85rem (13px)
  XSmall:      0.75rem (12px)
  Title:       1.25rem (20px)
```

---

## 🎯 Component Sizes

```
Button Height:     44px (touch-friendly)
Avatar:            48px (chat header)
Message Input:     44px (with padding)
Icon Size:         20-24px
Scrollbar Width:   8px
Border Radius:     0.5rem (8px) standard
```

---

## ✨ Animations

### Slide In (Messages)
```css
animation: slideIn 0.3s ease-out;
transform: translateY(10px) → translateY(0);
opacity: 0 → 1;
```

### Slide Up (Actions)
```css
animation: slideUp 0.2s ease-out;
transform: translateY(10px) → translateY(0);
```

### Slide Down (Reply Preview)
```css
animation: slideDown 0.2s ease-out;
transform: translateY(-10px) → translateY(0);
```

### Fade In (Modal)
```css
animation: fadeIn 0.2s ease-out;
opacity: 0 → 1;
```

### Typing Dots
```css
animation: typing 1.4s infinite;
Delayed for each dot: 0s, 0.2s, 0.4s;
transform: translateY(0) → translateY(-8px);
```

### Pulse (Recording)
```css
animation: pulse 1s infinite;
opacity: 1 ↔ 0.5;
```

### Spin (Loading)
```css
animation: spin 0.8s linear infinite;
transform: rotate(0deg) → rotate(360deg);
```

---

## 🖱️ Interactive States

### Buttons
```css
Default:       color: var(--text-muted);
Hover:         background: var(--border-color);
                color: var(--text-primary);
Active:        color: var(--primary-color);
Disabled:      opacity: 0.5;
               cursor: not-allowed;
```

### Links
```css
Default:       color: var(--primary-color);
Hover:         color: var(--primary-dark);
               text-decoration: underline;
```

### Input Fields
```css
Default:       border: 1px solid var(--border-color);
               background: var(--background-dark);
Focus:         border-color: var(--primary-color);
               box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
Filled:        color: var(--text-primary);
```

---

## 📱 Responsive Breakpoints

```
Mobile:        0px - 640px    (full-width layouts)
Tablet:        641px - 1024px (two-column layouts)
Desktop:       1025px+        (three-column layouts)
```

### Media Query Examples
```css
/* Mobile First */
.sidebar-item-info {
  display: none;
}

/* Show on desktop */
@media (min-width: 1024px) {
  .sidebar-item-info {
    display: block;
  }
}

/* Hide on mobile */
@media (max-width: 768px) {
  .large-element {
    display: none;
  }
}
```

---

## 🎨 Component Styles

### Message Bubble (Sent)
```
Background:     Linear gradient #3b82f6 → #2563eb
Color:          White (#ffffff)
Border Radius:  1rem 0.75rem 0.75rem 0.75rem (rounded corner)
Max Width:      70% of container
Padding:        0.75rem 1rem (12px 16px)
```

### Message Bubble (Received)
```
Background:     #334155 (slate-600)
Color:          #e2e8f0 (slate-200)
Border Radius:  0.75rem 1rem 0.75rem 0.75rem
Max Width:      70% of container
Padding:        0.75rem 1rem
```

### Sidebar Item (Normal)
```
Background:     transparent
Color:          #cbd5e1 (slate-300)
Padding:        0.75rem
Hover:          background: #334155
                color: #f1f5f9
Transition:     all 0.2s
```

### Sidebar Item (Active)
```
Background:     #475569 (slate-700)
Color:          #f1f5f9 (slate-100)
Border Left:    3px solid #3b82f6
Padding:        0.75rem
```

### Badge/Chip
```
Background:     var(--primary-color)
Color:          white
Padding:        0.25rem 0.75rem (4px 12px)
Border Radius:  1rem (pill shape)
Font Size:      0.75rem
Font Weight:    600
```

---

## 🎯 Layout Patterns

### Chat Container Layout
```
┌─────────────────────────────────────┐
│          Chat Header                │ (80px)
├─────────────────────────────────────┤
│                                     │
│         Messages Area               │ (flex: 1)
│         (auto-scroll)               │
│                                     │
├─────────────────────────────────────┤
│      Message Input Area             │ (120px)
└─────────────────────────────────────┘
```

### Sidebar Layout
```
┌──────────────────┐
│  Sidebar Header  │ (80px)
├──────────────────┤
│  Groups Section  │
│  ┌────────────┐  │
│  │ Group Item │  │
│  └────────────┘  │
├──────────────────┤
│  Contacts Header │
├──────────────────┤
│  Contacts List   │
│  ┌────────────┐  │
│  │   Avatar   │  │
│  │   Name     │  │
│  │  Status    │  │
│  └────────────┘  │
└──────────────────┘
```

---

## 🎬 Transition Effects

### Smooth Transitions
```css
transition: all 0.2s ease; /* Default */
transition: background 0.2s; /* Specific property */
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Custom */
```

### Duration Guidelines
```
Hover Effects:     0.2s
Slide Animations:  0.3s
Modal Open:        0.2s
Page Transitions:  0.3-0.5s
Loading Spinners:  0.8s (repeating)
```

---

## 🎨 Dark Mode Implementation

### Base CSS Variables
```css
:root {
  --primary-color: #3b82f6;
  --background-dark: #0f172a;
  --background-secondary: #1e293b;
  --border-color: #334155;
  --text-primary: #f1f5f9;
  --text-muted: #94a3b8;
}
```

### Usage
```css
.component {
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}
```

---

## 📏 Elevation Levels

### Shadow System
```css
/* Subtle */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

/* Standard */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Prominent */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

/* Maximum */
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
```

---

## ✅ Accessibility

### Color Contrast
```
Text on Dark:     #f1f5f9 on #0f172a (19:1) ✓ AAA
Muted Text:       #94a3b8 on #1e293b (7.5:1) ✓ AA
Primary Button:   White on #3b82f6 (5.2:1) ✓ AA
```

### Touch Targets
```
Minimum Size:     44x44px (mobile)
Icon Padding:     0.5rem on all sides
Button Height:    44px
Link Padding:     0.5rem
```

### Focus States
```css
button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

---

## 🎯 Common Patterns

### Button Group
```html
<div className="flex gap-2">
  <button className="px-4 py-2 bg-primary">Action</button>
  <button className="px-4 py-2 bg-secondary">Cancel</button>
</div>
```

### Message with Actions
```
┌──────────────────────────┐
│  [Reply] [Edit] [React]  │ (hover)
│                          │
│  This is a message       │ (bubble)
│  10:30 AM, Edited        │ (time + status)
└──────────────────────────┘
```

### Input with Icons
```
┌─────────────────────────────────┐
│ 🔍 Search... [X]                │
└─────────────────────────────────┘
```

### Avatar with Status
```
┌─────┐
│     │  ● (green dot = online)
│ IMG │
└─────┘
```

---

## 🎨 CSS Variables Reference

Use these in any component:
```css
.my-component {
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 1rem;
}

.my-button {
  background: var(--primary-color);
  color: white;
  transition: background 0.2s;
}

.my-button:hover {
  background: var(--primary-dark);
}
```

---

**Design System Complete! 🎉**

Use these guidelines to maintain consistency across the entire application.
