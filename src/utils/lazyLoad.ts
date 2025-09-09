// Lazy loading utility for images and other resources
export const lazyLoad = {
  // Initialize intersection observer
  init: () => {
    const lazyImages = document.querySelectorAll('[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement;
            const src = lazyImage.getAttribute('data-src');
            
            if (src) {
              lazyImage.src = src;
              lazyImage.removeAttribute('data-src');
              imageObserver.unobserve(lazyImage);
            }
          }
        });
      }, {
        rootMargin: '100px 0px'
      });

      lazyImages.forEach(image => {
        imageObserver.observe(image);
      });
    } else {
      // Fallback for browsers without intersection observer
      let lazyLoadThrottleTimeout: ReturnType<typeof setTimeout> | null = null;
      
      const lazyLoad = () => {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }

        lazyLoadThrottleTimeout = setTimeout(() => {
          const scrollTop = window.scrollY;
          
          lazyImages.forEach((img: Element) => {
            const lazyImage = img as HTMLImageElement;
            if (lazyImage.offsetTop < window.innerHeight + scrollTop) {
              const src = lazyImage.getAttribute('data-src');
              
              if (src) {
                lazyImage.src = src;
                lazyImage.removeAttribute('data-src');
              }
            }
          });
          
          if (lazyImages.length === 0) {
            document.removeEventListener('scroll', lazyLoad);
            window.removeEventListener('resize', lazyLoad);
            window.removeEventListener('orientationchange', lazyLoad);
          }
        }, 20);
      };

      document.addEventListener('scroll', lazyLoad);
      if (typeof window !== 'undefined') {
        (window as Window).addEventListener('resize', lazyLoad);
        (window as Window).addEventListener('orientationchange', lazyLoad);
        (window as Window).addEventListener('load', lazyLoad);
      }
    }
  },
  
  // Load an individual image
  loadImage: (element: HTMLImageElement) => {
    const src = element.getAttribute('data-src');
    if (src) {
      element.src = src;
      element.removeAttribute('data-src');
    }
  }
};
