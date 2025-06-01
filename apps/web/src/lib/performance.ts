/**
 * Performance monitoring utilities
 */

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private measurements: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start timing a specific operation
   */
  startTiming(name: string): void {
    if (typeof window !== "undefined" && window.performance) {
      this.measurements.set(name, performance.now());
    }
  }

  /**
   * End timing and log the result
   */
  endTiming(name: string): number | null {
    if (typeof window !== "undefined" && window.performance) {
      const startTime = this.measurements.get(name);
      if (startTime) {
        const duration = performance.now() - startTime;
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        this.measurements.delete(name);
        return duration;
      }
    }
    return null;
  }

  /**
   * Measure React component render time
   */
  measureRender<T extends (...args: unknown[]) => unknown>(
    componentName: string,
    renderFunction: T
  ): T {
    return ((...args: Parameters<T>) => {
      this.startTiming(`${componentName} render`);
      const result = renderFunction(...args);
      this.endTiming(`${componentName} render`);
      return result;
    }) as T;
  }

  /**
   * Monitor memory usage (development only)
   */
  logMemoryUsage(): void {
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined" &&
      "memory" in performance
    ) {
      const memory = (performance as any).memory;
      console.log("[Memory]", {
        used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      });
    }
  }
}

/**
 * React hook for measuring component performance
 */
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();

  return {
    startTiming: (operation: string) =>
      monitor.startTiming(`${componentName}:${operation}`),
    endTiming: (operation: string) =>
      monitor.endTiming(`${componentName}:${operation}`),
    measureRender: <T extends (...args: unknown[]) => unknown>(fn: T) =>
      monitor.measureRender(componentName, fn),
  };
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
