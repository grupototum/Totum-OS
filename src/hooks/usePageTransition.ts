/**
 * Hook para animações de transição de página com Framer Motion
 * Usado em containers principais de páginas
 */
export function usePageTransition() {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };
}
