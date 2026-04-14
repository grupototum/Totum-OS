/**
 * Accessibility Utilities & WCAG AA Guidelines
 * Helps ensure components meet accessibility standards
 */

/**
 * Generate unique aria-label for elements without visible labels
 * WCAG 2.1 Level A: 1.1.1 Non-text Content
 */
export function generateAriaLabel(element: string, context?: string): string {
  const label = context ? `${element}: ${context}` : element;
  return label.toLowerCase();
}

/**
 * Check color contrast ratio meets WCAG AA standards
 * WCAG 2.1 Level AA: 1.4.3 Contrast (Minimum)
 * Requires 4.5:1 for normal text, 3:1 for large text
 */
export function checkContrastRatio(foreground: string, background: string): {
  ratio: number;
  passes: boolean;
  normalText: boolean;
  largeText: boolean;
} {
  const fgLuma = getLuminance(foreground);
  const bgLuma = getLuminance(background);

  const lighter = Math.max(fgLuma, bgLuma);
  const darker = Math.min(fgLuma, bgLuma);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passes: ratio >= 4.5,
    normalText: ratio >= 4.5,
    largeText: ratio >= 3, // 18pt+ or bold 14pt+
  };
}

/**
 * Calculate relative luminance for contrast checking
 * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(color: string): number {
  // Parse hex color
  const hex = color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  // Apply gamma correction
  const [rs, gs, bs] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * ARIA roles that should be applied to interactive elements
 * WCAG 2.1 Level A: 1.3.1 Info and Relationships
 */
export const INTERACTIVE_ROLES = {
  button: 'button',
  link: 'link',
  tab: 'tab',
  tablist: 'tablist',
  tabpanel: 'tabpanel',
  dialog: 'dialog',
  alert: 'alert',
  navigation: 'navigation',
  main: 'main',
  contentinfo: 'contentinfo',
  complementary: 'complementary',
  region: 'region',
} as const;

/**
 * Keyboard navigation patterns for common components
 * WCAG 2.1 Level A: 2.1.1 Keyboard
 */
export const KEYBOARD_PATTERNS = {
  // Navigate with arrow keys, select with Enter or Space
  menu: ['ArrowUp', 'ArrowDown', 'Enter', ' '],
  // Navigate tabs with arrow keys
  tabs: ['ArrowLeft', 'ArrowRight', 'Home', 'End'],
  // Close with Escape
  dialog: ['Escape'],
  // Standard form focus
  form: ['Tab', 'Shift+Tab'],
} as const;

/**
 * Best practices for focus management
 * WCAG 2.1 Level AA: 2.4.3 Focus Order & 2.4.7 Focus Visible
 */
export const FOCUS_MANAGEMENT = {
  // Focus trap pattern for modals
  trapFocus: (e: KeyboardEvent, firstEl: HTMLElement, lastEl: HTMLElement) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  },

  // Restore focus after closing modal
  restoreFocus: (previousElement: HTMLElement) => {
    previousElement.focus();
  },
} as const;

/**
 * Helper to create accessible buttons
 * Should NOT be used if <button> element is available
 */
export function makeAccessibleButton(element: HTMLElement) {
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '0');

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      element.click();
    }
  });
}

/**
 * Accessible form label patterns
 * WCAG 2.1 Level A: 3.3.2 Labels or Instructions
 */
export function createAccessibleFormField(
  fieldId: string,
  label: string,
  required?: boolean
) {
  return {
    htmlFor: fieldId,
    text: required ? `${label} (required)` : label,
    ariaRequired: required,
  };
}

/**
 * Error message accessibility
 * WCAG 2.1 Level AA: 3.3.4 Error Prevention (Minimum)
 */
export function createAccessibleError(fieldId: string, error: string) {
  return {
    id: `${fieldId}-error`,
    role: 'alert',
    ariaLive: 'polite',
    text: error,
  };
}
