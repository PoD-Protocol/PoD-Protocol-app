/**
 * Performance optimization utilities
 */

// Performance API interfaces
interface PerformanceEntryWithProcessing extends PerformanceEntry {
  processingStart?: number;
}

interface PerformanceEntryWithLayoutShift extends PerformanceEntry {
  hadRecentInput?: boolean;
  value?: number;
}

interface PerformanceResourceTiming extends PerformanceEntry {
  transferSize?: number;
}

interface WindowWithGtag extends Window {
  gtag?: (event: string, action: string, params: Record<string, unknown>) => void;
}

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Core Web Vitals observer
  const observePerformance = () => {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // Track LCP - should be under 2.5s
      if (lastEntry.startTime > 0) {
        console.log('LCP:', lastEntry.startTime);
        // Send to analytics if available
        if (typeof (window as WindowWithGtag).gtag !== 'undefined') {
          (window as WindowWithGtag).gtag!('event', 'web_vital', {
            name: 'LCP',
            value: Math.round(lastEntry.startTime),
            event_category: 'performance',
          });
        }
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const fidEntry = entry as PerformanceEntryWithProcessing;
        // Track FID - should be under 100ms
        console.log('FID:', (fidEntry.processingStart || 0) - entry.startTime);
        if (typeof (window as WindowWithGtag).gtag !== 'undefined') {
          (window as WindowWithGtag).gtag!('event', 'web_vital', {
            name: 'FID',
            value: Math.round((fidEntry.processingStart || 0) - entry.startTime),
            event_category: 'performance',
          });
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const clsEntry = entry as PerformanceEntryWithLayoutShift;
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value || 0;
        }
      });
      
      // Track CLS - should be under 0.1
      console.log('CLS:', clsValue);
      if (typeof (window as WindowWithGtag).gtag !== 'undefined') {
        (window as WindowWithGtag).gtag!('event', 'web_vital', {
          name: 'CLS',
          value: clsValue,
          event_category: 'performance',
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  };

  // Start observing after page load
  if (document.readyState === 'complete') {
    observePerformance();
  } else {
    window.addEventListener('load', observePerformance);
  }
};

// Resource loading optimization
export const optimizeResourceLoading = () => {
  if (typeof window === 'undefined') return;

  // Preload critical resources
  const preloadCriticalResources = () => {
    const criticalResources = [
      { href: '/api/health', as: 'fetch' },
    ];

    criticalResources.forEach(({ href, as }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    });
  };

  // Prefetch next page resources
  const prefetchNextPages = () => {
    const prefetchPages = [
      '/dashboard',
      '/channels',
      '/agents',
      '/settings',
    ];

    prefetchPages.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  };

  // DNS prefetch for external resources
  const dnsPrefetch = () => {
    const externalDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'cdn.jsdelivr.net',
    ];

    externalDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  };

  preloadCriticalResources();
  
  // Defer non-critical optimizations
  requestIdleCallback(() => {
    prefetchNextPages();
    dnsPrefetch();
  });
};

// Memory optimization
export const optimizeMemory = () => {
  if (typeof window === 'undefined') return;

  // Clean up unused resources
  const cleanupResources = () => {
    // Clear unused image cache
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes('images') && cacheName.includes('old')) {
            caches.delete(cacheName);
          }
        });
      });
    }

    // Clear old localStorage items
    const storage = window.localStorage;
    const oldKeys = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.includes('temp_') || key?.includes('cache_')) {
        const item = storage.getItem(key);
        try {
          const parsed = JSON.parse(item || '{}');
          const expiry = parsed.expiry;
          if (expiry && Date.now() > expiry) {
            oldKeys.push(key);
          }
        } catch {
          // Invalid JSON, remove it
          oldKeys.push(key);
        }
      }
    }
    
    oldKeys.forEach(key => storage.removeItem(key));
  };

  // Run cleanup on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      cleanupResources();
    }
  });

  // Run cleanup periodically
  setInterval(cleanupResources, 5 * 60 * 1000); // Every 5 minutes
};

// Bundle analysis utilities
export const bundleAnalysis = {
  // Track bundle sizes
  trackBundleSize: () => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        if (entry.name.includes('chunk') || entry.name.includes('bundle')) {
          console.log(`Bundle: ${entry.name}, Size: ${resourceEntry.transferSize || 0} bytes`);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  },

  // Monitor unused CSS
  trackUnusedCSS: () => {
    if (typeof window === 'undefined') return;

    const styleSheets = Array.from(document.styleSheets);
    const usedRules = new Set();

    styleSheets.forEach((sheet) => {
      try {
        const rules = Array.from(sheet.cssRules || []);
        rules.forEach((rule) => {
          if (rule instanceof CSSStyleRule) {
            try {
              if (document.querySelector(rule.selectorText)) {
                usedRules.add(rule.selectorText);
              }
            } catch {
              // Invalid selector, skip
            }
          }
        });
      } catch {
        // Cross-origin stylesheet, skip
      }
    });

    console.log(`Used CSS rules: ${usedRules.size}`);
  },
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return null;

  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Performance monitoring
export const performanceMonitor = {
  start: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-start`);
    }
  },

  end: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      
      // Clean up marks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
    }
  },
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  if (typeof window === 'undefined') return;

  // Run on next tick to avoid blocking initial render
  setTimeout(() => {
    trackWebVitals();
    optimizeResourceLoading();
    optimizeMemory();
    bundleAnalysis.trackBundleSize();
  }, 0);

  // Run CSS analysis after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      bundleAnalysis.trackUnusedCSS();
    }, 1000);
  });
};

const PerformanceExport = {
  trackWebVitals,
  optimizeResourceLoading,
  optimizeMemory,
  bundleAnalysis,
  createIntersectionObserver,
  performanceMonitor,
  initializePerformanceOptimizations,
};

export default PerformanceExport;