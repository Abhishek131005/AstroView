import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for Intersection Observer
 * Useful for lazy loading images and infinite scroll
 * @param {object} options - IntersectionObserver options
 * @returns {object} { ref, isIntersecting, entry }
 */
function useIntersectionObserver(options = {}) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !element || frozen.current) {
      return;
    }

    const observerCallback = ([entry]) => {
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);

      if (entry.isIntersecting && freezeOnceVisible) {
        frozen.current = true;
      }
    };

    const observerOptions = {
      threshold,
      root,
      rootMargin,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
}

export { useIntersectionObserver };
