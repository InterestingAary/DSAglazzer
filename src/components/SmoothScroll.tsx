import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";

export default function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.6, smoothWheel: true, syncTouch: false });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    (window as unknown as Record<string, unknown>).__lenis = lenis;
    let lastApplied = window.scrollY;
    lenis.on("scroll", (e: { scroll: number }) => { lastApplied = e.scroll; });
    const onNativeScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastApplied) > 1.5) { lastApplied = y; lenis.scrollTo(y, { immediate: true }); }
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    const onLockChange = () => {
      if (document.body.style.overflow === "hidden") lenis.stop(); else lenis.start();
    };
    const mo = new MutationObserver(onLockChange);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    onLockChange();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onNativeScroll);
      mo.disconnect();
      if ((window as unknown as Record<string, unknown>).__lenis === lenis) delete (window as unknown as Record<string, unknown>).__lenis;
      lenis.destroy();
    };
  }, [reduce]);
  return null;
}