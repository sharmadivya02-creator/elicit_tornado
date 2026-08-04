'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

/**
 * Registers GSAP plugins exactly once, even if called from multiple
 * client components during hydration.
 */
export function registerGsapPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Staggered clip-path reveal for a group of heading words/lines.
 * Pass an array of refs/elements (e.g. split spans) to animate in sequence.
 */
export function revealTextStagger(targets: Element[] | NodeListOf<Element>) {
  registerGsapPlugins();

  return gsap.fromTo(
    targets,
    {
      clipPath: 'inset(0 0 100% 0)',
      yPercent: 100,
      opacity: 0,
    },
    {
      clipPath: 'inset(0 0 0% 0)',
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.08,
    }
  );
}

export { gsap, ScrollTrigger };