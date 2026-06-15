import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SiteMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('motion-ready');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-kicker, .hero-title, .hero-copy, .hero-actions, .hero-panel',
        { y: 24, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.09,
        }
      );

      gsap.to('.hero-orb', {
        y: -22,
        x: 18,
        rotate: 8,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.fromTo(
        '.hero-shape',
        { rotate: -16, scale: 0.7, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.8)', delay: 0.25 }
      );

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 84%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        const items = group.querySelectorAll('[data-stagger-item]');
        gsap.fromTo(
          items,
          { y: 24, opacity: 0, rotate: -1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.055,
            scrollTrigger: {
              trigger: group,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
        gsap.to(card, {
          y: -4,
          duration: 0.2,
          paused: true,
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-line]').forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: 'left center' },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      document.documentElement.classList.remove('motion-ready');
    };
  }, []);

  return null;
}
