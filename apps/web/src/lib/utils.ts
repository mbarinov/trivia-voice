/**
 * Formats current time for display
 */
export function formatCurrentTime(): string {
  return new Date().toLocaleTimeString();
}

/**
 * Creates columns for matrix rain based on screen width
 */
export function calculateMatrixColumns(
  width: number,
  columnWidth: number
): number {
  return Math.floor(width / columnWidth);
}

/**
 * Checks if code is running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Safely scrolls element to bottom
 */
export function scrollToBottom(element: HTMLElement | null): void {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
}

/**
 * Creates a delay promise for animations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamps a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Combines class names conditionally
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
