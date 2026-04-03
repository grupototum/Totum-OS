/**
 * TOTUM REVEAL HOOK
 * Hook para animações de reveal no scroll
 * 
 * Usa IntersectionObserver para detectar quando elementos entram na viewport
 * e adiciona a classe 'active' para disparar as animações
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook para animação de reveal em scroll
 * @param options - Opções de configuração
 * @returns ref e estado de ativação
 * 
 * @example
 * const { ref, isActive } = useReveal({ threshold: 0.15 });
 * return (
 *   <div ref={ref} className={cn("reveal", isActive && "active")}>
 *     Content
 *   </div>
 * );
 */
export function useReveal(options: UseRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true);
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsActive(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isActive };
}

/**
 * Hook para animar múltiplos elementos com stagger
 * @param count - Número de elementos
 * @param baseDelay - Delay base em ms
 * @returns Array de refs e estados
 */
export function useRevealGroup(count: number, baseDelay: number = 100) {
  const [activeItems, setActiveItems] = useState<boolean[]>(new Array(count).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setActiveItems((prev) => {
                  const next = [...prev];
                  next[index] = true;
                  return next;
                });
              }, index * baseDelay);
              observer.unobserve(element);
            }
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [count, baseDelay]);

  const setRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    refs.current[index] = el;
  }, []);

  return { setRef, activeItems };
}

/**
 * Hook para animação de texto reveal (masked)
 * @returns ref e estado
 */
export function useTextReveal(options: UseRevealOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px' } = options;
  const ref = useRef<HTMLHeadingElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsActive(true);
            observer.unobserve(element);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return { ref, isActive };
}

/**
 * Hook para parallax
 * @param speed - Velocidade do parallax (0.05 = lento, 0.2 = rápido)
 * @returns ref e valor de transform
 */
export function useParallax(speed: number = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrolled = window.scrollY;
      setOffset(scrolled * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset };
}

/**
 * Hook para inicializar animações no load
 * @param delay - Delay em ms
 * @returns estado de loaded
 */
export function useNavLoad(delay: number = 100) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return loaded;
}
