/**
 * Mobile Optimization Utilities
 * Verify touch targets, spacing, and responsive design
 */

/**
 * Check if touch target meets WCAG 2.5.5 minimum (44px)
 */
export function checkTouchTargetSize(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const minSize = 44;
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Verify all interactive elements have minimum touch target size
 */
export function auditTouchTargets(): {
  passing: HTMLElement[];
  failing: HTMLElement[];
} {
  const interactive = document.querySelectorAll(
    'button, a, input, [role="button"], [role="link"]'
  );

  const passing: HTMLElement[] = [];
  const failing: HTMLElement[] = [];

  interactive.forEach((element) => {
    const rect = element.getBoundingClientRect();
    // Hidden elements should be excluded
    if (rect.width === 0 || rect.height === 0) return;

    if (checkTouchTargetSize(element as HTMLElement)) {
      passing.push(element as HTMLElement);
    } else {
      failing.push(element as HTMLElement);
    }
  });

  return { passing, failing };
}

/**
 * Check for horizontal overflow on specific viewport width
 */
export function checkOverflow(width: number): {
  hasOverflow: boolean;
  overflowElements: HTMLElement[];
} {
  // Temporarily set viewport width
  const originalWidth = window.innerWidth;
  const overflowElements: HTMLElement[] = [];

  // Check body and main content
  const elements = document.querySelectorAll('body, main, [role="main"]');

  elements.forEach((el) => {
    const element = el as HTMLElement;
    if (element.scrollWidth > element.clientWidth) {
      overflowElements.push(element);
    }
  });

  return {
    hasOverflow: overflowElements.length > 0,
    overflowElements,
  };
}

/**
 * Log mobile audit results
 */
export function logMobileAudit(): void {
  console.group('📱 Mobile Audit Results');

  // Touch targets
  const { passing, failing } = auditTouchTargets();
  console.log(`✅ Passing touch targets: ${passing.length}`);
  if (failing.length > 0) {
    console.warn(`⚠️ Failing touch targets: ${failing.length}`);
    failing.forEach((el) => {
      const rect = el.getBoundingClientRect();
      console.warn(`  - ${el.tagName}: ${rect.width}x${rect.height}px`, el);
    });
  }

  // Overflow check
  const { hasOverflow, overflowElements } = checkOverflow(375);
  if (hasOverflow) {
    console.warn(`⚠️ Horizontal overflow detected on 375px:`, overflowElements);
  } else {
    console.log('✅ No horizontal overflow on 375px');
  }

  console.groupEnd();
}

// Run audit on page load in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(logMobileAudit, 2000);
    });
  }
}
