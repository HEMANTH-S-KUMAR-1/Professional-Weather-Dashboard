/**
 * Performance monitoring utility for measuring and optimizing application performance.
 */
export const performanceMonitor = {
  /**
   * Marks the start of a performance measurement
   * @param {string} name - The name of the performance mark
   */
  mark: (name: string) => {
    if (window.performance && window.performance.mark) {
      window.performance.mark(`${name}-start`);
    }
  },

  /**
   * Ends a performance measurement and logs the result
   * @param {string} name - The name of the performance mark to end
   * @param {boolean} log - Whether to log the result to the console
   * @returns {number} The duration in milliseconds
   */
  measure: (name: string, log: boolean = true): number => {
    if (window.performance && window.performance.mark && window.performance.measure) {
      try {
        window.performance.mark(`${name}-end`);
        window.performance.measure(name, `${name}-start`, `${name}-end`);
        
        const entries = window.performance.getEntriesByName(name);
        if (entries.length > 0) {
          const duration = entries[0].duration;
          
          if (log) {
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
          }
          
          return duration;
        }
      } catch (e) {
        console.error('Performance measurement error:', e);
      }
    }
    return 0;
  },

  /**
   * Records a page load performance metrics
   */
  recordPageLoadMetrics: () => {
    if (window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
          
          console.log('📊 Performance Metrics:');
          console.log(`⏱️ Page Load: ${pageLoadTime}ms`);
          console.log(`⏱️ DOM Ready: ${domReadyTime}ms`);
          
          // Optional: send metrics to analytics service
          const gtag = (window as unknown as { gtag?: (command: string, eventName: string, parameters: Record<string, number>) => void }).gtag;
          if (gtag) {
            gtag('event', 'performance', {
              'page_load_time': pageLoadTime,
              'dom_ready_time': domReadyTime
            });
          }
        }, 0);
      });
    }
  },

  /**
   * Long task detection for identifying UI jank
   */
  detectLongTasks: () => {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn(`⚠️ Long task detected: ${entry.duration}ms`, entry);
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        return observer;
      } catch (e) {
        console.error('Long task detection error:', e);
      }
    }
    return null;
  }
};
