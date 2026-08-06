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

/**
 * Cinematic Hexagonal Gallery Scroll Logic
 * Pinned scrolling, hexagonal movement path, overlapping timeline, and particle sync.
 */
export function initCinematicGalleryScroll(
  containerElement: HTMLElement,
  imageElements: HTMLElement[],
  particleElements: HTMLElement[]
) {
  registerGsapPlugins();

  // 1. Pinned Image Container
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerElement,
      start: "top top",
      end: `+=${imageElements.length * 150}%`,
      pin: true,
      scrub: 1.2,
    }
  });

  imageElements.forEach((img, index) => {
    // 2. Scroll Timeline (Overlapping Transitions)
    if (index > 0) {
      tl.to(imageElements[index - 1], {
        opacity: 0,
        scale: 1.3,
        duration: 1.5,
        ease: "power2.inOut"
      }, `segment${index}+=0.6`);
    }

    gsap.set(img, { opacity: index === 0 ? 1 : 0, scale: 0.8, x: 0, y: 0 });

    // 3. Hexagonal Movement Path via GSAP Core Keyframes
    tl.to(img, {
      keyframes: {
        "0%": { x: 0, y: 0, scale: 0.8, rotation: 0, opacity: index === 0 ? 1 : 0 },
        "15%": { opacity: 1 },
        "25%": { x: 30, y: -20, scale: 0.9, rotation: 2 },
        "50%": { x: 60, y: 0, scale: 1, rotation: 0 },
        "75%": { x: 30, y: 20, scale: 1.1, rotation: -2 },
        "100%": { x: 0, y: 0, scale: 1.2, rotation: 0 }
      },
      duration: 4,
      ease: "sine.inOut"
    }, `segment${index}`);

    // 4. Particle Synchronization & Parallax
    if (particleElements && particleElements.length > 0) {
      tl.to(particleElements, {
        x: () => `+=${(Math.random() - 0.5) * 120}`,
        y: () => `+=${(Math.random() - 0.5) * 120}`,
        rotation: () => `+=${(Math.random() - 0.5) * 30}`,
        opacity: () => Math.random() * 0.5 + 0.3,
        duration: 4,
        ease: "power1.inOut",
        stagger: {
          amount: 1,
          from: "random"
        }
      }, `segment${index}`);
    }
  });

  return tl;
}

export { gsap, ScrollTrigger };