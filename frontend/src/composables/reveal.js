/**
 * Directive `v-reveal` : anime l'apparition d'un élément lorsqu'il entre
 * dans le viewport (fondu + glissement). Utilise IntersectionObserver
 * (natif, performant, aucune dépendance).
 *
 * Usage :
 *   <div v-reveal>…</div>
 *   <div v-reveal="{ delay: 120 }">…</div>   // décalage pour effet d'escalier
 */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const reveal = {
  mounted(el, binding) {
    el.setAttribute("data-reveal", "");
    if (binding.modifiers?.scale) el.setAttribute("data-reveal-scale", "");

    if (binding.value?.delay) {
      el.style.transitionDelay = `${binding.value.delay}ms`;
    }

    // Accessibilité : si l'utilisateur préfère moins d'animations, on affiche
    // l'élément immédiatement.
    if (prefersReducedMotion()) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    el._revealObserver = observer;
  },
  unmounted(el) {
    el._revealObserver?.disconnect();
  },
};
